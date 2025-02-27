import {
    generation,
    encrypt,
    decrypt
} from './dope-web.bundle.js';

function string_to_int(str) {
    let hex = "";
    for (let i = 0; i < str.length; i++) {
        hex += str.charCodeAt(i).toString(16).padStart(2, '0');
    }
    return BigInt("0x" + hex);
}

function int_to_string(bigInt) {
    let hex = bigInt.toString(16);
    if (hex.length % 2 !== 0) hex = '0' + hex;
    let str = "";
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str;
}

function generate(bitRange = 1024n) {
    console.log(`Generating DOPE keys: ${bitRange} bits primes`);
    let dope_json = generation(bitRange);
    console.log(`Generated DOPE keys! Creating DOPE certificates...`);

    const publicKey = {
        N: dope_json.N + "",
        e: dope_json.e + ""
    };
    const privateKey = {
        N: dope_json.N + "",
        e: dope_json.e + "",
        p: dope_json.p + "",
        q: dope_json.q + "",
        d: dope_json.d + "",
    };

    const encodeBase64 = (str) => btoa(str);

    let publicCert = `
-----BEGIN PUBLIC DOPE CERTIFICATE-----
${encodeBase64(
`
DOPE Version: 1.0.0
Key Length: ${bitRange}
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
DOPE Version: 1.0.0
Key Length: ${bitRange}
Encryption Method: DOPE
Creation Timestamp: ${new Date().toUTCString()}
`.trim()
)}

${encodeBase64(JSON.stringify(privateKey))}
-----END PRIVATE DOPE CERTIFICATE-----
`.trim();

    document.getElementById("publicCertificate").value = publicCert;
    document.getElementById("privateCertificate").value = privateCert;

    parseCertificate(privateCert)
}

window.generate = generate

function parseCertificate(certificateStr) {

    function processString(cert) {
        let newcert = cert.split("\n")
        newcert = newcert[3]
        newcert = atob(newcert)
        newcert = JSON.parse(newcert)
        console.log(newcert)
        return newcert
    }

    if (certificateStr.includes("-----BEGIN PRIVATE DOPE CERTIFICATE-----")) {
        return processString(certificateStr)
    } else if (certificateStr.includes("-----BEGIN PUBLIC DOPE CERTIFICATE-----")) {
        return processString(certificateStr)
    } else {
        return new Error()
    }
}

function dope_encrypt() {
    const publicCert = document.getElementById("publicCertificate").value;
    const inputString = document.getElementById("stringinput").value;

    if (!publicCert || !inputString) {
        alert("You need to provide a public certificate and input string");
        return;
    }

    try {
        const publicKey = parseCertificate(publicCert);
        console.log(publicKey)
        if (!publicKey || !publicKey.N || !publicKey.e) {
            alert("Bad public certificate.");
            return;
        }

        const message = string_to_int(inputString);
        const encrypted = encrypt(message, BigInt(publicKey.e), BigInt(publicKey.N));

        document.getElementById("result").innerText = encrypted.toString();
    } catch (error) {
        alert("FAILED")
    }
}

function dope_decrypt() {
    const privateCert = document.getElementById("privateCertificate").value;
    const encryptedString = document.getElementById("result").innerText.replace("Encrypted: ", "");

    if (!privateCert || !encryptedString) {
        alert("You neeed to provide a private certificate and an encrypted string");
        return;
    }

    try {
        const privateKey = parseCertificate(privateCert);
        if (!privateKey || !privateKey.N || !privateKey.d || !privateKey.p || !privateKey.q) {
            alert("Bad private certificate.");
            return;
        }

        const decrypted = decrypt(BigInt(encryptedString), BigInt(privateKey.d), BigInt(privateKey.p), BigInt(privateKey.q));
        document.getElementById("result").innerText = int_to_string(decrypted);
    } catch (error) {
        alert("ERROR");
    }
}

window.dope_encrypt = dope_encrypt
window.dope_decrypt = dope_decrypt