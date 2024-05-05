"use strict";

const _ENCODE_HTML_RULES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&#34;',
  "'": '&#39;',
  " ": "&nbsp;",
};
const _MATCH_HTML = /[&<>'" ]/g;

function encode_char(c) {
  return _ENCODE_HTML_RULES[c] || c;
}

function link(t, emojis) {
  return t.split(_ENCODE_HTML_RULES[" "]).map(line => {
    if (!line.startsWith("http")) return addEmojis(line, emojis);
    const path = line.split("?")[0];

    // Videos
    for (const ex of ["mp4", "mov", "webm", "ogv"]) {
      if (path.endsWith("." + ex)) {
        return `<video class="attachment video" loading="lazy" controls src="${line}"></video>`;
        break;
      }
    }

    // Audios
    for (const ex of ["mp3", "aac", "weba", "m4a", "flac", "wav", "ogg", "oga", "opus"]) {
      if (path.endsWith("." + ex)) {
        return `<audio class="attachment audio" loading="lazy" controls src="${line}"></audio>`;
        break;
      }
    }

    // Images
    for (const ex of ["jpg", "jpeg", "png", "apng", "webp", "avif", "gif"]) {
      if (path.endsWith("." + ex)) {
        return `<a href="${line}"><img class="attachment img" loading="lazy" src="${line}" /></a>`
        break;
      }
    }

    return `<a href="${line}" class="plaintext">${line}</a>`;
  }).join(" ");
}


function _add_emojis(str, name, emojis) {
  // 4
  return emojis[name] ? `<img class="post_custom_emoji" src="${encodeURI(emojis[name])}" alt="${str}" title="${str}" />` : str;
}

function _sanitize(line) {
  // 2
  return String(line).replace(_MATCH_HTML, encode_char);
}

function sanitize(line, emojis) {
  // 1
  let sanitizedString = _sanitize(line);
  return addEmojis(sanitizedString, emojis);
}

function addEmojis(line, emojis) {
  // 3
  let custom_emojis = Object.fromEntries(emojis);

  return line.replace(/:([^:]+):/g, (str, name) => _add_emojis(str, name, custom_emojis));
}

module.exports = function (t, emojis) {
  try {
    return _sanitize(t).split("\n").map(_ => link(_, emojis)).join("\n");
  } catch (e) {
    console.error(e);
  }
}

module.exports.sanitize = sanitize;
