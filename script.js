const scrambleOptions = ["F", "B", "U", "D", "R", "L"];
const scrambleAddonOptions = ["2", "'", ""];
let spacePressed = false;
let stopwatchInitiated = false;
let stopwatchRunning = false;
let stopwatchID = 0;
function init() {
    display(generateScamble().join(" "));
    setUserControls();
}
init();

function getScores() {

}

function ScrambleScore(scramble) {
    this.scramble = scramble;
    this.time = 0;
    this.status = "In Progress";
}

function randomIntInRange(min = 0, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateScamble() {
    const length = randomIntInRange(19, 21);
    const scramble = [];
    for (let i = 0; i < length; i++) {
        let side = scrambleOptions[randomIntInRange(0, scrambleOptions.length - 1)];
        let addon = scrambleAddonOptions[randomIntInRange(0, scrambleAddonOptions.length - 1)];
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

function setUserControls() {

    window.addEventListener("keydown", async (event) => {
        console.log(spacePressed);
        if (event.key === " " && !spacePressed) {
            spacePressed = true;
            document.getElementById("seconds").innerText = "00";
            document.getElementById("hudredthSecond").innerText = "00";
            await startStopwatch();
        } else if (event.key === " " && stopwatchInitiated && stopwatchRunning) {
            clearInterval(stopwatchID);
            stopwatchRunning = false;
            stopwatchInitiated = false;
        }
    });
    window.addEventListener("keyup", (event) => {
        console.log(stopwatchInitiated, stopwatchRunning);
        if (event.key === " " && !stopwatchInitiated) {
            spacePressed = false;
        } else if (event.key === " " && stopwatchInitiated && !stopwatchRunning) {
            time.style.color = "";
            runStopwatch();
        }
    });

}
function startStopwatch() {
    return new Promise((resolve, reject) => {
        let time = document.getElementById("time");
        time.style.color = "red";
        let id = setTimeout(() => {
            time.style.color = "green";
            stopwatchInitiated = true;
            console.log(stopwatchInitiated);
            resolve();
        }, 1000);

        window.addEventListener("keyup", (event) => {
            if (event.key === " " && !stopwatchInitiated) {
                clearTimeout(id);
                time.style.color = "";
            }
        });
    });
}

function runStopwatch() {
    console.log("object");
    let secondElement = document.getElementById("seconds");
    let hundredthSecondElement = document.getElementById("hudredthSecond");
    let seconds = 0;
    let hundredthSecond = 0;
    stopwatchRunning = true;
    stopwatchID = setInterval(() => {
        hundredthSecondElement.innerText = `${hundredthSecond}`.padStart(2, "0");
        secondElement.innerText = `${seconds}`.padStart(2, "0");
        hundredthSecond++;
        if (hundredthSecond === 100) {
            seconds++;
            hundredthSecond = 0;
        }
    }, 10);
}