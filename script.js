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

function reverseScramble(scramble) {
    scramble.reverse();
    let reverse = scramble.map(item => {
        switch (item.slice(1, 2)) {
            case "":
                return item + "'";
            case "'":
                return item.slice(0, 1);
            case "2":
                return item;
        }
    });
    return reverse;
}
let scramble = generateScamble();
console.log(scramble.join(" "));
console.log(reverseScramble(scramble).join(" "));
function display(scramble) {
    let scrambleElement = document.createElement("scramble-display");
    let scrambleAlgorithm = document.createElement("p");
    scrambleAlgorithm.innerText = scramble;
    scrambleElement.setAttribute("scramble", scramble);
    scrambleElement.classList.add("visualizer");
    let header = document.getElementById("scrambleDisplay");
    header.appendChild(scrambleElement);
    header.appendChild(scrambleAlgorithm);
}
display(scramble.join(" "));
