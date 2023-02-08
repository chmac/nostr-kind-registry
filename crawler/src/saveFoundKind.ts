import { WORKER_URL } from "../../shared/constants.ts";
import { KindMeta, NostrEvent } from "../../shared/types.ts";

export const saveFoundKind = async ({
  event,
  relayUrl,
}: {
  event: NostrEvent;
  relayUrl: string;
}) => {
  const { kind } = event;
  const foundNewKind: KindMeta = {
    kind,
    seen: true,
    firstSeenTimestamp: Math.floor(Date.now() / 1e3),
    seenOnRelays: [relayUrl],
  };
  console.log("#p1tYsu Found a new kind! 🚀🚀🚀");
  console.log(foundNewKind);
  console.log(event);
  try {
    const putResult = await fetch(`${WORKER_URL}/${kind}`, {
      method: "put",
      body: JSON.stringify(foundNewKind),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "1234",
      },
    });
    const putResultBody = await putResult.json();
    if (putResult.status !== 201 || putResultBody.success !== true) {
      const message = "#Uedt1e Failed to save found kind";
      console.error(message);
      console.error(putResultBody);
      console.error(putResult);
      throw new Error(message);
    }
  } catch (error) {
    console.error("#HDufs6 Failed to PUT new kind", error);
  }
};
