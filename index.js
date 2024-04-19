"use strict";
const { listen, port, urlprefix, fastcgi, relays } = require("./config");
const express = require("express");
const feed = require("./feed.js");
const app = express();

let nip05 = {
  names: {
    _: feed.rawpubkey
  },
  relays: {}
}

nip05.relays[feed.rawpubkey] = relays;

app.set("views", __dirname + "/local/views");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/.well-known/nostr.json", (req, res) => {
  res.header("Access-Control-Allow-Origin", "0");

  if (req.query.name) {
    let newNIP05 = {
      names: {},
      relays: nip05.relays
    }

    newNIP05.names[req.query.name] = feed.rawpubkey

    return res.json(newNIP05);
  }

  res.json(nip05);
});

app.get(urlprefix + "style.css", (req, res) => res.sendFile(__dirname + "/public/style.css"));
app.get(urlprefix, (req, res) => {
  const profile = feed.getProfile();
  const notes = feed.getNotes();

  if (!profile || !notes) return res.status(500).header("Content-Type", "text/plain").send(`Sorry. This page is not ready. Please try again later.\n\nAlternatively, Open the following npub via your nostr client:\n${feed.npub}`);

  res.render("feed.ejs", {
    profile, notes, npub: feed.npub
  });
});

if (fastcgi) {
  const fastcgi = require("node-fastcgi");
  fastcgi.createServer(app).listen(port, listen, _ => {
    console.log("FastCGI server is now listening on", listen, port);
  });
} else {
  app.listen(port, listen, _ => {
    console.log("HTTP server is now listening on", listen, port);
  });
}
