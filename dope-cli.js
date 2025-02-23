import { generation, encrypt, decrypt } from "./dope.js";
import fs from "fs";
import os from "os";
import path from "path";
import { program } from "commander";
import { fileURLToPath } from "url";
import { Buffer } from "buffer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VERSION = "1.0.0";

program.version(VERSION);

program
  .command("keygen-save")
  .description("Generate a new DOPE certificate pair and save it to ~/.dope/")
  .option("-b, --bits <number>", "Specify the key bit size", parseInt, 1024)
  .action((cmd) => {
    generate_system_certs(cmd.bits);
  });

program.parse(process.argv);

function generate_system_certs(bits = 1024) {
  console.log(`Generating DOPE keys: ${bits} bits primes`);
  let dope_json = generation(bits);
  console.log(`Generated DOPE keys! Creating DOPE certificates...`);

  const publicKey = { N: dope_json.N + "", e: dope_json.e + "" };
  const privateKey = {
    N: dope_json.N + "",
    e: dope_json.e + "",
    p: dope_json.p + "",
    q: dope_json.q + "",
    d: dope_json.d + "",
  };

  const encodeBase64 = (str) => Buffer.from(str).toString("base64");

  let publicCert = `
-----BEGIN PUBLIC DOPE CERTIFICATE-----
${encodeBase64(
    `
DOPE Version: ${VERSION}
Key Length: ${bits}
Encryption Method: DOPE
Creation Timestamp: ${new Date().toUTCString()}
`.trim()
  )}

${encodeBase64(JSON.stringify(publicKey))}
-----END PUBLIC DOPE CERTIFICATE-----
`.trim();

  let privateCert = `
-----BEGIN PRIVATE DOPE CERTIFICATE-----
${encodeBase64(
    `
DOPE Version: ${VERSION}
Key Length: ${bits}
Encryption Method: DOPE
Creation Timestamp: ${new Date().toUTCString()}
`.trim()
  )}

${encodeBase64(JSON.stringify(privateKey))}
-----END PRIVATE DOPE CERTIFICATE-----
`.trim();

  console.log("Writing certificates to ~/.dope/");

  const dopeDir = path.join(os.homedir(), ".dope");

  if (!fs.existsSync(dopeDir)) {
    fs.mkdirSync(dopeDir, { recursive: true });
  }

  fs.writeFileSync(path.join(dopeDir, "public.dope"), publicCert, {
    encoding: "utf-8",
    mode: 0o644,
  });
  fs.writeFileSync(path.join(dopeDir, "private.dope"), privateCert, {
    encoding: "utf-8",
    mode: 0o600,
  });

  console.log("Certificates successfully saved!");
}