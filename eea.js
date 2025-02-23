/**
 * Computes the GCD of two numbers through the Extended Euclidean Algorithm and returns their x and y values where this is the equation:
 * 
 *      ax + by = gcd(a, b)
 * 
 * 
 * @param {bigint} gcdA - First number
 * @param {bigint} gcdB - Second number
 * @returns {{ gcd: bigint, x: bigint, y: bigint }} 
 *          An object containing:
 *          - `gcd`: The greatest common divisor of `gcdA` and `gcdB`
 *          - `x`: The coefficient such that `gcdA * x + gcdB * y = gcd`
 *          - `y`: The coefficient such that `gcdA * x + gcdB * y = gcd`
 * 
 * @example
 * const result = eea(99n, 55n);
 * console.log(result); 
 * // Output: { gcd: 11n, x: -1n, y: 2n }
 */

function eea(gcdA, gcdB) {
    // first, perform the eea

    /*
    a = b * c + d

    a is the product/bigger number, b is the base, c goes into the base, it is the NEW REMAINDER and d is the remainder used for the next this
    
    keep repeating until zero 
    */

    /* EEA:

    ax + by = gcd(a, b)

    */

    let currentA = null;
    let currentB = null;

    let GCD = 0n;
    let swapped = false;

    if (gcdA > gcdB) { // make the bigger number a
        currentA = gcdA;
        currentB = gcdB;
    } else {
        currentA = gcdB;
        currentB = gcdA;
        swapped = true;
    }

    let x0 = 1n, x1 = 0n, y0 = 0n, y1 = 1n;

    while (currentB !== 0n) {
        let q = currentA / currentB;
        let remainder = currentA % currentB;

        currentA = currentB;
        currentB = remainder;

        [x0, x1] = [x1, x0 - q * x1];
        [y0, y1] = [y1, y0 - q * y1];
    }

    GCD = currentA;

    if (swapped) {
        return { gcd: GCD, x: y0, y: x0 }
    } else {
        return { gcd: GCD, x: x0, y: y0 }
    }
}

module.exports = eea;