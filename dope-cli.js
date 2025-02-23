const dope = require("./dope.js");
const fs = require("fs")
const os = require("os")
const path = require("path")
const { program } = require('commander');

const VERSION = '1.0.0'

program.version(VERSION);

program
  .command('keygen-save')
  .description('Generate a new DOPE certificate pair and save it to ~/.dope/')
  .option('-b, --bits <number>', 'Specify the key bit size', parseInt, 1024)
  .action((cmd) => {
    generate_system_certs(cmd.bits)
  });

program.parse(process.argv);

function generate_system_certs(bits = 1024) {

    console.log(`Generating DOPE keys: ${bits} bits primes`);
    let dope_json = dope.generation(bits)
    console.log(`Generated DOPE keys! Creating DOPE certificates...`);
    const public = {N: dope_json.N + '', e: dope_json.e + ""}
    const private = {N: dope_json.N + '', e: dope_json.e + "", p: dope_json.p + "", q: dope_json.q + "", d: dope_json.d + ""}
    let publicCert = `
 -----BEGIN PUBLIC DOPE CERTIFICATE-----
${btoa(`
DOPE Version: ${VERSION}
Key Length: ${bits}
Encryption Method: DOPE
Creation Timestamp: ${new Date().toUTCString()}
`.trim())}

${btoa(JSON.stringify(public))}
-----END PUBLIC DOPE CERTIFICATE-----
    `.trim()

    let privateCert = `
-----BEGIN PRIVATE DOPE CERTIFICATE-----
${btoa(`
DOPE Version: ${VERSION}
Key Length: ${bits}
Encryption Method: DOPE
Creation Timestamp: ${new Date().toUTCString()}
`.trim())}
   
${btoa(JSON.stringify(private))}
-----END PRIVATE DOPE CERTIFICATE-----
       `.trim()


        console.log("Writing certificates to ~/.dope/")

        const dopeDir = path.join(os.homedir(), '.dope');

        if (!fs.existsSync(dopeDir)) {
            fs.mkdirSync(dopeDir, { recursive: true });
        }

       fs.writeFileSync(path.join(dopeDir, 'public.dope'), publicCert, { encoding: "utf-8", mode: 0o644 });
       fs.writeFileSync(path.join(dopeDir, 'private.dope'), privateCert, { encoding: "utf-8", mode: 0o600 });       
}