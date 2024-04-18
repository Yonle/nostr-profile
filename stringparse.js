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

module.exports = function (t) {
  return t.split("\n").map(link).join("\n");
}

function link(t) {
  return t.split(" ").map(line => {
    if (!line.startsWith("http")) return sanitize(line);
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

    return sanitize(line);
  }).join(" ");
}

function sanitize(line) {
  return String(line).replace(_MATCH_HTML, encode_char);
}
