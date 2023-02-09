import { KindMeta, Relay } from "../../shared/types.ts";
import { Options as BaseOptions } from "../types.ts";
import { fs, path, run, uuid } from "../deps.ts";

type Options = Pick<BaseOptions, "dataPath" | "dataRepoUrl" | "logger">;

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
  await fs.ensureDir(options.dataPath);
  const gitPath = path.join(options.dataPath, ".git");
  const gitPathType = await getType(gitPath);
  if (gitPathType === "directory") {
    return;
  } else if (gitPathType === "non-existent") {
    await run(["git", "clone", options.dataRepoUrl, "."], {
      cwd: options.dataPath,
    });
    const kindsPath = getKindsPath(options);
    await fs.ensureDir(kindsPath);
    const relaysPath = getRelaysPath(options);
    await fs.ensureDir(relaysPath);
    return;
  }
  throw new Error("#uRdgmK dataDir is not git repo");
};

const doesRepoHaveChanges = async (repoPath: string) => {
  const status = await run("git status --short", { cwd: repoPath });
  return status.length !== 0;
};

export const gitPull = async (
  options: Options,
  ifLastPulledMoreThanSecondsAgo = 300
) => {
  await assertDataRepoExistsAndCloneIfNot(options);
  const runOpts = { cwd: options.dataPath };
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
      return;
    }
  } catch (error) {
    if (!(error instanceof Deno.errors.NotFound)) {
      throw error;
    }
  }

  await run("git pull", runOpts);
};

const gitAddCommitAndPush = async (options: Options, message: string) => {
  // TODO - Decide if we really want `gitPull()` here
  await gitPull(options, 0);
  const runOpts = { cwd: options.dataPath };
  const hasChanges = await doesRepoHaveChanges(options.dataPath);
  if (!hasChanges) {
    // There are no changed files, so there's nothing else to do
    options.logger.warning(
      "#lh688b gitCommitAndPush called without repo changes"
    );
    return;
  }
  await run("git add .", runOpts);
  await run(["git", "commit", "-m", message], { ...runOpts });
  await run("git push", runOpts);
};

export const addKindToKindsList = async (
  options: Options,
  kind: KindMeta
): Promise<void> => {
  const kindsListPath = getKindsListPath(options);
  // TODO - Add time here so we can sort
  const dateString = kind.firstSeenDateString || FALLBACK_DATE;
  const kindString = `${kind.kind.toString()},${dateString}\n`;
  await Deno.writeTextFile(kindsListPath, kindString, { append: true });
};

export const writeKindMeta = async (
  options: Options,
  kind: KindMeta
): Promise<void> => {
  // TODO - Apply a zod schema here
  await gitPull(options, 0);
  const kindMetaPath = getKindPath(options, kind.kind);
  const fileContents = JSON.stringify(kind);
  const existingFileType = await getType(kindMetaPath);
  if (existingFileType !== "non-existent") {
    throw new Error("#Gxq5jx Cannot overwrite existing kind");
  }
  await addKindToKindsList(options, kind);
  await Deno.writeTextFile(kindMetaPath, fileContents);
  await gitAddCommitAndPush(options, `Creating kind ${kind.kind}`);
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

export const writeRelayUrl = async (options: Options, relayUrl: string) => {
  // TODO - Check to make sure this relay does not currently exist
  await gitPull(options);
  const relay: Relay = {
    id: uuid.v1.generate() as string,
    url: relayUrl,
  };
  const relayPath = getRelayPath(options, relay.id);
  const relayJson = JSON.stringify(relay);
  await Deno.writeTextFile(relayPath, relayJson);
  await gitAddCommitAndPush(options, `Adding relay ${relayUrl}`);
};
