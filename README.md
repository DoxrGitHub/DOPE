# DOPE
Doxr Open Protocol Encryption (DOPE) home. This repository contains a library and CLI usage version of DOPE.

## Context

This is an asymmetric encryption method that I made from "scratch." Fundamentally, it is RSA but with my own methods on implementation details. I spent multiple days looking into the math behind RSA, but obviously, the bare math necessary isn't enough to create something that "works." This made me look into MANY more mathy things, and I ended up with something I decided to call DOPE.

I started this for fun and to get a better grip for cryptography. Before I started on the Javascript/programming side of DOPE, I decided to make sure I knew everything first. You can see all of my notes and stuff in `dope.pdf`, where I go over the stuff that I decided to add.

Since I made this, it obviously isn't interoperable with classic RSA tools, because the private key contains different information, and a custom file format is created. Information on that is on this README.

## Try it out

You can try it out at the [GitHub Page](https://doxrgithub.github.io/DOPE/web/) for this. It is a web demo where you can supply or generate certificates in the DOPE format, and encrypt/decrypt messages using them.

https://doxrgithub.github.io/DOPE/web/

There's also a `dope-cli.js` file that you can build with `esbuild` and use, but I didn't really work on it since realistically nobody would ever need it on their system.

## Usage

For whatever reason, if you want to use this DOPE library, you can build DOPE- it has zero dependencies so you can use it with Node.js or the web*

You will need esbuild, run `npm install esbuild -g` to install it.

Build command (ejs):

`npm run build`

Build for web:

`npm run web-build`

You'll see the output file in `dist/dope-web.bundle.js`


Build command (cjs):

`npm run cjs-build`

You'll find the output at `dist/dope-cjs.bundle.js`

To import on the web, try something like this:

```js
import {
    generation,
    encrypt,
    decrypt
} from './dope-web.bundle.js';
```

### Methods

Note: for parameters they must ALL be in BigInt format!

`generation(bitRange)`

Generates a DOPE key and returns it in JSON format, you can specify a bit range for the primes. The JSON returned will have all of the values needed to craft the DOPE certificates.

`encrypt(message, e, N)`

This method encrypts a numeric message using the e exponent and public N value. Returns the encrypted string

`decrypt(encrypted, d, p, q)`

This method DECRYPTS a numeric string, you must supply the encrypted message, the d exponent, and the p and q values.

## DOPE Certificates

They are in this format:

```txt
-----BEGIN PRIVATE/PUBLIC DOPE CERTIFICATE-----
DOPE Version: 1.0.0
Key Length: 9999
Encryption Method: DOPE
Creation Timestamp: UTC_STRING

{N: 0, e: 0, d: 0, p: 0, q: 0}
-----END PRIVATE/PUBLIC DOPE CERTIFICATE-----
```

Both the metadata and DOPE keys are Base64 encoded. You can read keys by looking at the line with the base64 encoded, and use them with the DOPE library.

## Credits

- Doxr
- [This site in particular](https://www.cs.sjsu.edu/~stamp/CS265/SecurityEngineering/chapter5_SE/RSAmath.html) as it was my first source and explained RSA encryption through the bare minimum required to create keys and encrypt data, this helped with understanding RSA a lot at first
