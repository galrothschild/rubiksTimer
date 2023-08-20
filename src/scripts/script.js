const scrambleOptions = ["F", "B", "U", "D", "R", "L"];
const scrambleOptionsAddons = ["2", "'", ""];

function randomIntInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateScamble() {
    const length = randomIntInRange(19, 21);
    const scramble = [];
    for (let i = 0; i < length; i++) {
        let side = scrambleOptions[randomIntInRange(0, 5)];
        let addon = scrambleOptionsAddons[randomIntInRange(0, 2)];
        if (i !== 0 && scramble[i - 1].slice(0, 1) === side) {
            i--;
        } else {
            scramble.push(side + addon);
        }

    }
    return scramble;
}

let scramble = generateScamble();
console.log(scramble.join(" "));

function reverseScramble(scramble) {

}