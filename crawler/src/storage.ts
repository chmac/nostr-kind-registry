import { KindMeta, Relay } from "../../shared/types.ts";
import { fs, log, Mutex, path, run, uuid } from "../deps.ts";
import {
  DefaultOptionsWithLogger,
  GlobalOptions,
  LoggerOption,
} from "./options.ts";

type Options = GlobalOptions & LoggerOption;

const FALLBACK_DATE = new Date(16e11).toISOString();

const getFileNameFromKind = (kind: number): string => {
  return `kind${kind.toString()}.json`;
};

const getKindFromFileName = (filename: string): number => {
  const matches = filename.match(/kind([0-9]+)\.json/);
  if (matches === null) {
    throw new Error("#op6gkv Invalid file name");
  }
  const [, kindString] = matches;
  const kind = parseInt(kindString);
  return kind;
};

const getKindFromFileNameOrUndefined = (
  filename: string
): number | undefined => {
  try {
    return getKindFromFileName(filename);
  } catch {
    return;
  }
};

const getRelaysPath = (options: Options): string => {
  return path.join(options.dataPath, `/relays/`);
};

const getRelayPath = (options: Options, id: string): string => {
  const relaysPath = getRelaysPath(options);
  return path.join(relaysPath, `${id}.json`);
};

const getKindsPath = (options: Options): string => {
  return path.join(options.dataPath, `/kinds/`);
};

const getKindsListPath = (options: Options): string => {
  const kindsPath = getKindsPath(options);
  return path.join(kindsPath, "kindsList.txt");
};

const getKindPath = (options: Options, kind: number): string => {
  const kindsDir = getKindsPath(options);
  const filename = getFileNameFromKind(kind);
  return path.join(kindsDir, filename);
};

const getType = async (path: string) => {
  try {
    const stat = await Deno.lstat(path);
    if (stat.isDirectory) {
      return "directory";
    } else if (stat.isSymlink) {
      return "symlink";
    } else if (stat.isFile) {
      return "file";
    }
    return "unknown";
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      return "non-existent";
    }
    throw error;
  }
};

const assertDataRepoExistsAndCloneIfNot = async (options: Options) => {
  const verbose = options.logger.level <= log.LogLevels.DEBUG;
  const runOpts = {
    cwd: options.dataPath,
    verbose,
  };
  await fs.ensureDir(options.dataPath);
  const gitPath = path.join(options.dataPath, ".git");
  const gitPathType = await getType(gitPath);
  if (gitPathType === "directory") {
    return;
  } else if (gitPathType === "non-existent") {
    await run(["git", "clone", options.dataRepoUrl, "."], runOpts);
    await run("git config --local author.name NKR", runOpts);
    await run("git config --local author.email nkr@dev.null", runOpts);
    const kindsPath = getKindsPath(options);
    await fs.ensureDir(kindsPath);
    const relaysPath = getRelaysPath(options);
    await fs.ensureDir(relaysPath);
    return;
  }

  throw new Error("#uRdgmK dataDir is not git repo");
};

const doesRepoHaveChangesLock = new Mutex();
const doesRepoHaveChanges = async (options: Options) => {
  const lockId = await doesRepoHaveChangesLock.acquire();
  const repoPath = options.dataPath;
  const verbose = options.logger.level <= log.LogLevels.DEBUG;
  const status = await run("git status --short", { cwd: repoPath, verbose });
  doesRepoHaveChangesLock.release(lockId);
  return status.length !== 0;
};

const gitPullLock = new Mutex();
const gitPull = async (
  options: Options,
  ifLastPulledMoreThanSecondsAgo = 300
) => {
  const lockId = await gitPullLock.acquire();
  const release = () => gitPullLock.release(lockId);
  await assertDataRepoExistsAndCloneIfNot(options);
  const verbose = options.logger.level <= log.LogLevels.DEBUG;
  const runOpts = { cwd: options.dataPath, verbose };
  try {
    const stat = await Deno.stat(
      path.join(options.dataPath, "/.git/FETCH_HEAD")
    );
    const pullNow = ifLastPulledMoreThanSecondsAgo === 0;
    if (
      !pullNow &&
      stat.mtime !== null &&
      stat.mtime.getTime() > Date.now() - ifLastPulledMoreThanSecondsAgo * 1e3
    ) {
      release();
      return;
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      release();
      throw error;
    }
  }

  await run("git pull", runOpts);
  release();
};

const gitAddCommitAndPushLock = new Mutex();
const gitAddCommitAndPush = async (options: Options, message: string) => {
  // TODO - Decide if we really want `gitPull()` here
  const lockId = await gitAddCommitAndPushLock.acquire();
  const release = () => gitAddCommitAndPushLock.release(lockId);
  await gitPull(options, 0);
  const verbose = options.logger.level <= log.LogLevels.DEBUG;
  const runOpts = { cwd: options.dataPath, verbose };
  const hasChanges = await doesRepoHaveChanges(options);
  if (!hasChanges) {
    // There are no changed files, so there's nothing else to do
    options.logger.warning(
      "#lh688b gitCommitAndPush called without repo changes"
    );
    release();
    return;
  }
  await run("git add .", runOpts);
  await run(["git", "commit", "-m", message], {
    ...runOpts,
    env: {
      GIT_COMMITTER_NAME: "NKR",
      GIT_COMMITTER_EMAIL: "nkr@dev.null",
    },
  });
  await run("git push", runOpts);
  release();
};

const addKindToKindsListLock = new Mutex();
export const addKindToKindsList = async (
  options: Options,
  kind: KindMeta
): Promise<void> => {
  const lockId = await addKindToKindsListLock.acquire();
  const release = () => addKindToKindsListLock.release(lockId);
  const kindsListPath = getKindsListPath(options);
  // TODO - Add time here so we can sort
  const dateString = kind.firstSeenDateString || FALLBACK_DATE;
  const kindString = `${kind.kind.toString()},${dateString}\n`;
  await Deno.writeTextFile(kindsListPath, kindString, { append: true });
  release();
};

const writeKindMetaLock = new Mutex();
export const writeKindMeta = async (
  options: Options,
  kind: KindMeta
): Promise<void> => {
  const lockId = await writeKindMetaLock.acquire();
  const release = () => writeKindMetaLock.release(lockId);
  // TODO - Apply a zod schema here
  await gitPull(options, 0);
  const kindMetaPath = getKindPath(options, kind.kind);
  const fileContents = JSON.stringify(kind);
  const existingFileType = await getType(kindMetaPath);
  if (existingFileType !== "non-existent") {
    release();
    throw new Error("#Gxq5jx Cannot overwrite existing kind");
  }
  await addKindToKindsList(options, kind);
  await Deno.writeTextFile(kindMetaPath, fileContents);
  await gitAddCommitAndPush(options, `Creating kind ${kind.kind}`);
  release();
};

export const getKindMeta = async (
  options: Options,
  kind: number
): Promise<KindMeta> => {
  const kindPath = await getKindPath(options, kind);
  const jsonString = await Deno.readTextFile(kindPath);
  const kindMeta = JSON.parse(jsonString) as KindMeta;
  // TODO - Apply a zod schema here
  return kindMeta;
};

export const getKinds = async (options: Options): Promise<number[]> => {
  await gitPull(options);
  const kindsDir = getKindsPath(options);
  const list = await Deno.readDir(kindsDir);
  const kinds: number[] = [];
  for await (const item of list) {
    if (item.isFile) {
      const kind = getKindFromFileNameOrUndefined(item.name);
      if (typeof kind === "undefined") {
        continue;
      }
      kinds.push(kind);
    }
  }
  return kinds;
};

export const getAllRelays = async (options: Options): Promise<Relay[]> => {
  await gitPull(options);
  const relaysPath = getRelaysPath(options);
  const list = await Deno.readDir(relaysPath);
  const relays: Relay[] = [];
  for await (const item of list) {
    if (!item.isFile || item.name.startsWith(".")) {
      continue;
    }
    const jsonString = await Deno.readTextFile(
      path.join(relaysPath, item.name)
    );
    const relay = JSON.parse(jsonString) as Relay;
    relays.push(relay);
  }
  return relays;
};

const addRelayUrlToRelaysListLock = new Mutex();
const addRelayUrlToRelaysList = async (options: Options, relayUrl: string) => {
  const lockId = await addRelayUrlToRelaysListLock.acquire();
  const release = () => addRelayUrlToRelaysListLock.release(lockId);
  const relaysPath = getRelaysPath(options);
  const relaysListPath = path.join(relaysPath, "/relaysList.txt");
  const relaysListString = await Deno.readTextFile(relaysListPath);
  const relaysListLines = relaysListString.trim().split("\n");
  const existingRelayLine = relaysListLines.find((line) => line === relayUrl);
  if (typeof existingRelayLine !== "undefined") {
    release();
    return;
  }
  await Deno.writeTextFile(relaysListPath, `${relayUrl}\n`, { append: true });
  release();
};

const writeRelayUrlLock = new Mutex();
export const writeRelayUrl = async (options: Options, relayUrl: string) => {
  const lockId = await writeRelayUrlLock.acquire();
  const release = () => writeRelayUrlLock.release(lockId);
  await gitPull(options);
  const relay: Relay = {
    id: uuid.v1.generate() as string,
    url: relayUrl,
  };

  const relays = await getAllRelays(options);
  const existingRelay = relays.find((relay) => relay.url === relayUrl);
  if (typeof existingRelay !== "undefined") {
    release();
    throw new Error("#OCbuNg Cannot add existing relay");
  }

  const relayPath = getRelayPath(options, relay.id);
  const relayJson = JSON.stringify(relay);
  await addRelayUrlToRelaysList(options, relayUrl);
  await Deno.writeTextFile(relayPath, relayJson);
  await gitAddCommitAndPush(options, `Adding relay ${relayUrl}`);
  release();
};
