"use strict";
const { listen, port, urlprefix, fastcgi } = require("./config");
const express = require("express");
const fs = require("fs");
const feed = require("./feed.js");
const styleCSS = fs.readFileSync(__dirname + "/public/style.css", "utf8");

const app = express();

app.set("views", __dirname + "/local/views");
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get(urlprefix + "style.css", (req, res) => res.header("Content-Type", "text/css; charset=UTF-8").send(styleCSS));
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
