const modPow = require('./modPow.js');

/**
 * Performs the Miller-Rabin primality test on a BigInt number.
 *
 * @param {bigint} numberToTest - The BigInt number to test for primality.
 * @returns {boolean} - Returns true if the number is likely prime, false if it's composite.
 *
 * @example
 * millerRabin(222334565193649n); // Returns true if prime, false if composite.
 */

function millerRabin(numberToTest) {
    let n = BigInt(numberToTest);

    if (n < 2n) return false;

    let d = n - 1n;
    let times_necessary_to_divide = 0n;

    while (d % 2n === 0n || times_necessary_to_divide === 0n) {
        d /= 2n;
        times_necessary_to_divide += 1n;
    }

    let s = times_necessary_to_divide
    let witnesses = [2n, 3n, 5n, 7n, 11n, 13n]

    let isComposite = false;

    for (witness of witnesses) {

        let x = BigInt(modPow(witness, d, n))


        if (x == 1n || x == (n - 1n) % n) {
            // nothing, it passed the test
        } else {

            let backupTestPassed = false;

        
            for (let r = 0n; r < s - 1n; r++) {
                x = (x ** 2n) % n;

                if (x === (n - 1n)) {
                    backupTestPassed = true;
                    break;
                }

            }

            if (backupTestPassed == false) {
                isComposite = true;
                break;
            }

        }

        if (isComposite == true) {
            break;
        }

    }

    return !isComposite;
}

module.exports = millerRabin;
