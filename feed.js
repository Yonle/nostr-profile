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
let user_status = {
  text: "",
  at: null
};

let profile = {
  content: {},
  at: null
};

// profile
pool.subscribeMany(relays, [{
  authors: [rawpubkey],
  kinds: [0],
  limit: 1,
}], {
  onevent: event => {
    if (!NostrTools.verifyEvent(event)) return;
    if (event.created_at < profile.at) return;
    profile.at = event.created_at;
    profile.content = JSON.parse(event.content);

    for (const i in profile.content) {
      // sanitize the strings
      if (typeof(profile.content[i]) !== "string") continue;

      profile.content[i] = stringparse.sanitize(profile.content[i], getEmojis(event));
    }

    console.log("Got profile:", profile.content);
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
      content: stringparse(event.content, getEmojis(event)),
      date: (new Date(event.created_at * 1000)).toLocaleString("ia"),
      noteId: NostrTools.nip19.noteEncode(event.id),
      rawDate: event.created_at
    });

    feed = feed.sort((a, b) => b.rawDate - a.rawDate);

    console.log("Got note:", event.content);
  },
  oneose: _ => null
});

// status
pool.subscribeMany(relays, [{
  authors: [rawpubkey],
  kinds: [30315],
  limit: 1,
}], {
  onevent: event => {
    if (!NostrTools.verifyEvent(event)) return;
    if (!event.content) return;
    if (event.created_at < user_status.at) return;

    const tags = Object.fromEntries(event.tags);

    user_status.at = event.created_at;
    user_status.text = stringparse(event.content, getEmojis(event));
    if (tags.d == "music") user_status.text = "♫" + user_status.text;
    if (tags.r) user_status.text = `<a href="${encodeURI(tags.r)}">${user_status.text}</a>`;

    console.log("Got status:", user_status.text);
  },
  oneose: _ => null
});

function getProfile() {
  return profile.content;
}

function getNotes() {
  return feed;
}

function getStatus() {
  return user_status.text;
}

function getEmojis(event) {
  return event.tags.filter(i => i[0] === "emoji").map(i => i.slice(1));
}

console.log("Configured Relays:", relays);
console.log("Pubkey:", pubkey);

module.exports = { getNotes, getProfile, getStatus, npub, rawpubkey }
