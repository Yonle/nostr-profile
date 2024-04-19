"use strict";
const { relays, pubkey, max_posts } = require("./config");
const NostrTools = require("nostr-tools");
const ws = require("ws");
const pool = new NostrTools.SimplePool();

const rawpubkey = pubkey.startsWith("npub") ? NostrTools.nip19.decode(pubkey).data : pubkey
const npub = NostrTools.nip19.npubEncode(rawpubkey);

const stringparse = require("./stringparse.js");

NostrTools.useWebSocketImplementation(ws);

let feed = [];
let profile = null;

// profile
pool.subscribeMany(relays, [{
  authors: [rawpubkey],
  kinds: [0]
}], {
  onevent: event => {
    if (!NostrTools.verifyEvent(event)) return;
    profile = JSON.parse(event.content);
    console.log("Got profile:", profile);
  },
  oneose: _ => null
});

// notes
pool.subscribeMany(relays, [{
  authors: [rawpubkey],
  kinds: [1],
  limit: max_posts || 100,
}], {
  onevent: event => {
    if (!NostrTools.verifyEvent(event)) return;
    if (feed.length >= (max_posts || 100)) feed.pop();

    feed.unshift({
      content: stringparse(event.content),
      date: (new Date(event.created_at * 1000)).toLocaleString("ia"),
      noteId: NostrTools.nip19.noteEncode(event.id),
      rawDate: event.created_at
    });

    feed = feed.sort((a, b) => b.rawDate - a.rawDate);

    console.log("Got note:", event.content);
  },
  oneose: _ => null
});


function getProfile() {
  return profile;
}

function getNotes() {
  return feed;
}

console.log("Configured Relays:", relays);
console.log("Pubkey:", pubkey);

module.exports = { getNotes, getProfile, npub, rawpubkey }
