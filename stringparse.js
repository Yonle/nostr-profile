"use strict";

const _ENCODE_HTML_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;'
};
const _MATCH_HTML = /[&<>'"]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}

function link(t, emojis) {
  return t.split(" ").map(line => {
    if (!line.startsWith("http")) return sanitize(line, emojis);
    const path = line.split("?")[0];

    // Videos
    for (const ex of ["mp4", "mov", "webm", "ogv"]) {
      if (path.endsWith("." + ex)) {
        return `<video class="attachment video" loading="lazy" controls src="${encodeURI(line)}"></video>`;
        break;
      }
    }

    // Audios
    for (const ex of ["mp3", "aac", "weba", "m4a", "flac", "wav", "ogg", "oga", "opus"]) {
      if (path.endsWith("." + ex)) {
        return `<audio class="attachment audio" loading="lazy" controls src="${encodeURI(line)}"></audio>`;
        break;
      }
    }

    // Images
    for (const ex of ["jpg", "jpeg", "png", "apng", "webp", "avif", "gif"]) {
      if (path.endsWith("." + ex)) {
        return `<a href="${encodeURI(line)}"><img class="attachment img" loading="lazy" src="${encodeURI(line)}" /></a>`
        break;
      }
    }

    return `<a href="${encodeURI(line)}">${line}</a>`;
  }).join(" ");
}


function add_emojis(str, name, emojis) {
  return emojis[name] ? `<img class="post_custom_emoji" src="${encodeURI(emojis[name])}" alt="${str}" title="${str}" />` : str;
}

function sanitize(line, emojis) {
  let sanitizedString = String(line).replace(_MATCH_HTML, encode_char);
  let custom_emojis = Object.fromEntries(emojis);

  return sanitizedString.replace(/:([^:]+):/g, (str, name) => add_emojis(str, name, custom_emojis));
}

module.exports = function (t, emojis) {
  return t.split("\n").map(_ => link(_, emojis)).join("\n");
}

module.exports.sanitize = sanitize;
