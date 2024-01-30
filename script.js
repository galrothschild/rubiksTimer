const scrambleOptions = ["F", "B", "U", "D", "R", "L"];
const scrambleAddonOptions = ["2", "'", ""];
let spacePressed = false;
let stopwatchInitiated = false;
let stopwatchRunning = false;
let stopwatchID = 0;
let stopwatchTimeoutID = 0;
let currentScramble = 1;
let scoreArray = [];
// Things the game needs to do on first load
function init() {
    getScoresFromLocalStorage();
    let generatedScramble = generateScramble().join(" ");
    display(generatedScramble);
    setUserControls();
}
init();

function getScoresFromLocalStorage() {
    if (localStorage.getItem("rubiks-scores") !== null) {
        let scores = JSON.parse(localStorage.getItem("rubiks-scores"));
        if (scores[rubiks - scores.length - 1]["status"] === "In Progress") {
            scores.pop();
        }
        scoreArray = scores;
    }
    updateScoreToLocalStorage();
}

function updateScoreToLocalStorage() {
    localStorage.setItem("rubiks-scores", JSON.stringify(scoreArray));
    displayAO5AO12();
}
function ScrambleScore(scramble) {
    this.scramble = scramble;
    this.time = 0;
    this.status = "In Progress";
}

function randomIntInRange(min = 0, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateScramble() {
    const length = randomIntInRange(19, 21);
    const scramble = [];
    for (let i = 0; i < length; i++) {
        let side = scrambleOptions[randomIntInRange(0, scrambleOptions.length - 1)];
        let addon = scrambleAddonOptions[randomIntInRange(0, scrambleAddonOptions.length - 1)];
        if ((i !== 0 && scramble[i - 1].slice(0, 1) === side) || (i > 1 && scramble[i - 2].slice(0, 1) === side)) {
            i--;
        } else {
            scramble.push(side + addon);
        }

    }
    scoreArray.push(new ScrambleScore(scramble.join(" ")));
    showScores();
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
    header.innerHTML = "";
    header.appendChild(scrambleElement);
    header.appendChild(scrambleAlgorithm);
}

function displayAO5AO12() {
    const ao5 = document.getElementById("ao5");
    const ao12 = document.getElementById("ao12");
    const filteredScores = scoreArray.filter(score => score.status === "OK");
    if (filteredScores.length >= 5) {
        let lastFiveScores = filteredScores.slice(Math.max(filteredScores.length - 5, 0));
        ao5.innerText = (lastFiveScores.reduce((acc, curr) => acc + curr.time, 0) / 5).toFixed(2).replace(".", ":");
    } else {
        ao5.innerText = "N/A";
    }
    if (filteredScores.length >= 12) {
        let lastFiveScores = filteredScores.slice(Math.max(filteredScores.length - 12, 0));
        ao12.innerText = (lastFiveScores.reduce((acc, curr) => acc + curr.time, 0) / 12).toFixed(2).replace(".", ":");
    } else {
        ao12.innerText = "N/A";
    }
}

function showScores() {
    solvesTable = document.getElementById("solvesTable");
    solvesTable.innerHTML = "";
    scoreArray.forEach((score, index) => {
        if (score.status !== "In Progress") {
            const row = document.createElement("tr");
            row.innerHTML = `
        <td>${index + 1}</td>
        <td>${score.status !== "DNF" ? score.time.toFixed(2) : "--"}</td>
        <td>${score.status}</td>
        `;
            row.addEventListener("click", event => {
                let solveID = +event.target.parentElement.children[0].innerText;
                const modalStatus = document.getElementById("modal-status");
                document.getElementById("modal-solveID").innerText = `Solve #${solveID}`;
                document.getElementById("modal-scramble").innerText = `${scoreArray[solveID - 1]["scramble"]}`;
                if (scoreArray[solveID - 1]["status"] !== "DNF") {
                    document.getElementById("modal-time").innerText = `${scoreArray[solveID - 1]["time"].toFixed(2)}`;
                } else {
                    document.getElementById("modal-time").innerText = "--";
                }
                modalStatus.value = scoreArray[solveID - 1]["status"];
                modalStatus.setAttribute("data-id", solveID);
                document.getElementById("modal-delete").setAttribute("data-id", solveID);
                document.getElementById("score-modal").classList.add("show");
                document.getElementById("overlay").classList.add("show");
            });
            solvesTable.insertBefore(row, solvesTable.firstChild);
        }
    });
}

function setUserControls() {

    document.getElementById("modal-delete").addEventListener("click", (event) => {
        let solveID = +event.target.attributes["data-id"].value;
        scoreArray.splice(solveID - 1, 1);
        updateScoreToLocalStorage();
        showScores();
        document.getElementById("overlay").classList.remove("show");
        document.getElementById("score-modal").classList.remove("show");
    });
    document.getElementById("modal-status").addEventListener("change", (event) => {
        let solveID = event.target.attributes["data-id"].value;
        let status = event.target.value;
        console.log(status);
        let currentStatus = scoreArray[solveID - 1]["status"];
        if (currentStatus === "+2") {
            scoreArray[solveID - 1]["time"] -= 2;
        }
        else if (status === "+2") {
            scoreArray[solveID - 1]["time"] += 2;
        }
        scoreArray[solveID - 1]["status"] = status;
        if (scoreArray[solveID - 1]["status"] !== "DNF") {
            document.getElementById("modal-time").innerText = `${scoreArray[solveID - 1]["time"].toFixed(2)}`;
        } else {
            document.getElementById("modal-time").innerText = "--";
        }
        updateScoreToLocalStorage();
        showScores();
    });
    document.getElementById("overlay").addEventListener("click", () => {
        document.getElementById("overlay").classList.remove("show");
        document.getElementById("score-modal").classList.remove("show");
    });
    document.getElementById("modal-close").addEventListener("click", () => {
        document.getElementById("overlay").classList.remove("show");
        document.getElementById("score-modal").classList.remove("show");
    });

    window.addEventListener("keydown", async (event) => {
        if (event.key === " " && !spacePressed) {
            spacePressed = true;
            document.getElementById("seconds").innerText = "00";
            document.getElementById("hundredthSecond").innerText = "00";
            await startStopwatch();
        } else if (event.key === " " && stopwatchInitiated && stopwatchRunning) {
            clearInterval(stopwatchID);

            let time = +document.getElementById("seconds").innerText + +document.getElementById("hundredthSecond").innerText / 100;
            scoreArray[scoreArray.length - 1]["time"] = time;
            scoreArray[scoreArray.length - 1]["status"] = "OK";
            updateScoreToLocalStorage();
            let generatedScramble = generateScramble().join(" ");

            display(generatedScramble);
            stopwatchRunning = false;
            stopwatchInitiated = false;
        }
    });
    window.addEventListener("keyup", (event) => {
        if (event.key === " " && !stopwatchInitiated) {
            spacePressed = false;
            clearTimeout(stopwatchTimeoutID);
            time.style.color = "";
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
        stopwatchTimeoutID = setTimeout(() => {
            time.style.color = "green";
            stopwatchInitiated = true;
            resolve();
        }, 1000);
    });
}

function runStopwatch() {
    let secondElement = document.getElementById("seconds");
    let hundredthSecondElement = document.getElementById("hundredthSecond");
    let seconds = 0;
    let hundredthSeconds = 0;
    stopwatchRunning = true;
    stopwatchID = setInterval(() => {
        hundredthSecondElement.innerText = `${hundredthSeconds}`.padStart(2, "0");
        secondElement.innerText = `${seconds}`.padStart(2, "0");
        hundredthSeconds++;
        if (hundredthSeconds === 100) {
            seconds++;
            hundredthSeconds = 0;
        }
    }, 10);
}