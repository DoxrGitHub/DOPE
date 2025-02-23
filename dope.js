const millerRabin = require('./miller-rabin.js');
const modPow = require('./modPow.js');
const eea = require('./eea.js');

/*
* Generates a DOPE key and returns it in JSON format
* @param {bigint} [bitRange=512n] - The bit length for the primes (main keys).
* @returns {{p: bigint, q: bigint, N: bigint, phiN: bigint, e: bigint, d: bigint}} The DOPE key components.
* @throws {Error} If a valid 'e' is not found.
*/
function generation(bitRange = 512n) {
    bitRange = BigInt(bitRange)
    const p = generatePrime(bitRange); 
    const q = generatePrime(bitRange); 
    // console.log(`Generated prime p: ${p}`);
    // console.log(`Generated prime q: ${q}`);
    const N = p * q
    let phiN = (p - 1n) * (q - 1n)
    // console.log(`N: ${N}`)
    // console.log(`φ(N): ${phiN}`)

    const encryptionEValues = [114689n, 41117n, 65537n]
    const e = getRandomItem(encryptionEValues)
    // console.log(`e: ${e}`)

    const d_eea = eea(e, phiN)

    if (d_eea.gcd !== 1n) {
        throw new Error("Invalid e selected: Not coprime with φ(N)");
    }    


    let d = d_eea.x

    if (d < 0) {
        d = d + phiN
    }

    // console.log(`d: ${d}`)
    
    //console.log("ENCRYPTED MESSAGE: " + encrypted)

    //let decrypted = CRTdecryption(encrypted, d, N);
    //console.log("DECRYPTED MESSAGE: " + decrypted);

    return {p: p, q: q, N: N, phiN: phiN, e: e, d: d}
}

function generatePrime(bitRange) {
    let prime = numberBitRange(BigInt(bitRange));
    while (!millerRabinProxy(prime)) {
        prime = numberBitRange(BigInt(bitRange));
    }
    return prime;
}

function numberBitRange(bitRange, odd = true) {
    if (bitRange < 1) throw new Error("Bit range must be at least 1");

    let num = 1n;

    for (let i = 1; i < bitRange; i++) {
        if (Math.random() > 0.5) {
            num |= (1n << BigInt(i));
        }
    }

    if (odd) {
        num |= 1n;
    }

    return num;
}

function getRandomItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

/**
 * Encrypts a message using DOPE encryption.
 * @param {bigint} message - The message to encrypt 
 * @param {bigint} e - e value (found in public/both certificates)
 * @param {bigint} N - The N (found in both certificates)
 * @returns {bigint} The encrypted message.
 */
function encrypt(message, e, N) {
    return modPow(BigInt(message), e, N); // c = m^e mod N
}

/**
 * Decrypts a DOPE encrypted message using private key values.
 * @param {bigint} encrypted - The encrypted message.
 * @param {bigint} d - d value (found in private certificate).
 * @param {bigint} p - p value (found in private certificate)
 * @param {bigint} q - q value (found in private certificate)
 * @returns {bigint} The decrypted message.
 */
function CRTdecrypt(encrypted, d, p, q) {
    let K = modPow(BigInt(encrypted), BigInt(d), BigInt(p))
    let L = modPow(BigInt(encrypted), BigInt(d), BigInt(q))
    
    let qRes = eea(q, p)
    J = qRes.x

    if (J < 0) {
        J += p;
    }
    let message = (L + q * ((K - L) * J % p)) % (p * q);
    if (message < 0) message += p * q;
    
    return message
}

// decapitated, inefficient
function decryption(C, d, N) {
    return modPow(C, d, N)
}

function generateSmallPrimes(limit) {
    let sieve = new Array(limit + 1).fill(true);
    sieve[0] = sieve[1] = false; // 0 and 1 are not prime

    for (let p = 2; p * p <= limit; p++) {
        if (sieve[p]) {
            for (let multiple = p * p; multiple <= limit; multiple += p) {
                sieve[multiple] = false;
            }
        }
    }

    return sieve.map((isPrime, num) => isPrime ? BigInt(num) : null).filter(p => p !== null);
}

function smallPrimeTest(num) {
    let primes = generateSmallPrimes(1000);
    for (prime of primes) {
        if (num % prime === 0n) return false;
    }
    return true
}

function millerRabinProxy(num) {
    if (!smallPrimeTest(num)) return false;
    return millerRabin(num);
}

module.exports = {
    generation,
    encrypt,
    decrypt: CRTdecrypt
};