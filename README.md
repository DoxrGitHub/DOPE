# DOPE
Doxr Open Protocol Encryption (DOPE) home. This repository contains a library and CLI usage version of DOPE.

## Context

This is an assymetric encryption method that I made from "scratch." Fundamentally, it is RSA but with my own twist on implementation details. I spent multiple days looking into the math behind RSA, but obviously, the bare math necessary isn't enough to create something that "works." This made me look into MANY more mathy things, and I ended up with something I decided to call DOPE.

I started this for fun and to get a better grip for cryptography. Before I started on the Javascript/programming side of DOPE, I decided to make sure I knew everything first. You can see all of my notes and stuff in dope.pdf, where I go over the stuff that I decided to add.

Since I made this, it obviously isn't interoperable with classic RSA tools, because the private key contains different information, and a custom file format is created. Information on that is on this README.

## Usage

