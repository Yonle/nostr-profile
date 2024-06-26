# nostr-profile
Simple webpage to show your personal nostr profile alongside with it's posts.

It also supports serving as a server with NIP-05 compatible address, Allowing to use as NIP-05 address.

## Installation
```
git clone https://github.com/Yonle/nostr-profile
cd nostr-profile
mv config.js.example config.js
npm i
```

You will need to configure `config.js` before running the server.

Once it's all set, Start the server by:
```
node index.js
```

You could test by visiting `http://localhost:3000`. Once finished, Serve it with reverse proxy.

### Using as NIP-05 address
If nostr-profile server is served in `nostr.example.com` (example) domain, You could use the address as your NIP-05 in your profile.

```
_@nostr.example.com
```

You could replace `_` to anything as you wish.
```
whatever@nostr.example.com
anon@nostr.example.com
bob@nostr.example.com
mike@nostr.example.com

and more
```

NIP-05 is served at path `/.well-known/nostr.json`. It could not be changed through `urlprefix` as per [spec](https://github.com/nostr-protocol/nips/blob/master/05.md). So ensure that your reverse proxy is also configured to forward the same path as for the NIP-05.

## License
Copyright 2024 Yonle <yonle@lecturify.net>

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

