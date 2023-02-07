// Relays taken from https://github.com/fiatjaf/nostr-relay-registry/blob/master/relays.js
export const relays = [
  "wss://nostr.p2sh.co",
  "wss://nostr.lnprivate.network",
  "wss://nostr.bongbong.com",
  "wss://nostr-pub.wellorder.net",
  "wss://nostr.cercatrova.me",
  "wss://nostr.massmux.com",
  "wss://relayer.fiatjaf.com",
  "wss://nostr.rocks",
  "wss://rsslay.fiatjaf.com",
  "wss://freedom-relay.herokuapp.com/ws",
  "wss://nostr-relay.freeberty.net",
  "wss://nostr.bitcoiner.social",
  "wss://nostr.nodeofsven.com",
  "wss://nostr-relay.wlvs.space",
  "wss://nostr.onsats.org",
  "wss://nostr-relay.untethr.me",
  "wss://nostr.semisol.dev",
  "wss://nostr-pub.semisol.dev",
  "wss://nostr-verified.wellorder.net",
  "wss://nostr.drss.io",
  "wss://nostr.unknown.place",
  "wss://relay.damus.io",
  "wss://nostr.openchain.fr",
  "wss://nostr.delo.software",
  "wss://relay.nostr.info",
  "wss://relay.minds.com/nostr/v1/ws",
  "wss://nostr.zaprite.io",
  "wss://nostr.oxtr.dev",
  "wss://nostr.ono.re",
  "wss://relay.grunch.dev",
  "wss://relay.cynsar.foundation",
  "wss://nostr.sandwich.farm",
  "wss://relay.nostr.ch",
  "wss://nostr.fmt.wiz.biz",
  "wss://nostr.einundzwanzig.space",
  "wss://nostr-relay.nonce.academy",
  "wss://nostr.nymsrelay.com",
  "wss://nostr.slothy.win",
  "wss://relay.stoner.com",
  "wss://nostr.mado.io",
  "wss://nostr.yael.at",
  "wss://jiggytom.ddns.net",
  "wss://nostr.mom",
  "wss://nostr.walletofsatoshi.com",
  "wss://nostr-relay.digitalmob.ro",
  "wss://nostr-2.zebedee.cloud",
  "wss://nostr.zebedee.cloud",
  "wss://nostr.f44.dev",
  "wss://nostr.orangepill.dev",
  "wss://nostr.coollamer.com",
  "wss://nostr-relay.alekberg.net",
  "wss://nostr.developer.li",
  "wss://relay.nostr.ro",
  "wss://nostr.chaker.net",
  "wss://relay.nostr.nu",
  "wss://relay.taxi",
  "wss://knostr.neutrine.com",
  "wss://no-str.org",
  "wss://relay.cryptocculture.com",
  "wss://nostr.blockchaincaffe.it",
  "wss://relay.nostrich.de",
  "wss://relay.nostr.scot",
  "wss://relay.nosphr.com",
  "wss://relay.nostr-latam.link",
  "wss://nostr.coinsamba.com.br",
  "wss://deconomy-netser.ddns.net:2121",
  "wss://relay.nostr.wf",
  "wss://middling.myddns.me:8080",
];

const randomItem = <T>(input: T[]): T =>
  input[Math.floor(Math.random() * input.length)];

const randomItems = <T>(input: T[], count: number): T[] =>
  Array.from({ length: count }).map(() => randomItem(input));

// deno-lint-ignore require-await
export const getRelays = async (count: number) => {
  return randomItems(relays, count);
};