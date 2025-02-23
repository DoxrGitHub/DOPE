export default function modPow(base, exponent, mod) {
    let result = 1n;
    base = base % mod;

    while (exponent > 0n) {
        if (exponent % 2n === 1n) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exponent /= 2n;
    }

    return result;
}