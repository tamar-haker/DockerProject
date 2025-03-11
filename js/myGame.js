let rows, cols, mines;
let revealedCount = 0;
let numberOfFailures = 0;
let board;
const findUser = JSON.parse(localStorage.getItem('current user'));
const containerOfEnterMassage = document.getElementById('messages');
const enterMassage = document.createElement('p');
enterMassage.innerText = `ברוכ.ה הבא.ה: ${findUser.userName}`;
containerOfEnterMassage.appendChild(enterMassage);
const massageOfWins = document.createElement('p');
massageOfWins.innerText = `מספר הלוחות שפתרת: ${findUser.solvedBoards}`;
containerOfEnterMassage.appendChild(massageOfWins);
const exit = document.getElementById('exit')
exit.addEventListener('click', function (event) {
    localStorage.setItem("current user", null)
});

document.getElementById('newGame').addEventListener('click', function () {
    const LevelSelection = document.getElementById('LevelSelection');
    const LevelTeaching = document.getElementById('LevelTeaching');
    LevelSelection.style.display = "block";
    LevelTeaching.style.display = "block";
    revealedCount = 0;
    numberOfFailures = 0;
    massageOfWins.innerText = `מספר הלוחות שפתרת: ${findUser.solvedBoards}`;
    document.getElementById('LevelSelection').value = null;
});

document.getElementById('LevelSelection').addEventListener('change', function (event) {
    const notIframe = document.getElementById('iframe');
    notIframe.style.display = "none";
    const LevelSelection = document.getElementById('LevelSelection');
    const LevelTeaching = document.getElementById('LevelTeaching');
    LevelSelection.style.display = "none";
    LevelTeaching.style.display = "none";
    changeColor();
    const levelSelectionItem = parseInt(event.target.value);
    const myLevel = document.getElementById(levelSelectionItem.toString());
    rows = levelSelectionItem * 5 + 5;
    cols = levelSelectionItem * 5 + 5;
    mines = levelSelectionItem * 26 - 16;
    board = Array.from({ length: rows }, () => Array(cols).fill(0));
    for (let i = 0; i < mines; i++) {
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * cols);
        if (board[r][c] !== 'M') {
            board[r][c] = 'M';
            updateSurroundingCells(r, c, board);
        } else {
            i--;
        }
    }
    createBoard();
});

function changeColor() {
    const options = LevelSelection.options;
    for (let option of options) {
        const levelElement = document.getElementById(option.value);
        if (levelElement) {
            levelElement.style.backgroundColor = 'black';
        }
    }
    const levelSelectionItem = parseInt(event.target.value);
    const myLevel = document.getElementById(levelSelectionItem.toString());
    if (myLevel) {
        myLevel.style.backgroundColor = 'rgb(200, 7, 142)';
    }
}

function updateSurroundingCells(r, c, board) {
    for (let i = r - 1; i <= r + 1; i++) {
        for (let j = c - 1; j <= c + 1; j++) {
            if (i >= 0 && i < rows && j >= 0 && j < cols && board[i][j] !== 'M') {
                board[i][j]++;
            }
        }
    }
}

function createBoard() {
    const table = document.getElementById('board');
    table.innerHTML = '';
    for (let r = 0; r < rows; r++) {
        const row = table.insertRow();
        for (let c = 0; c < cols; c++) {
            const cell = row.insertCell();
            cell.addEventListener('click', () => revealCell(r, c, cell));
            cell.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                toggleFlag(cell);
            });
            cell.dataset.row = r;
            cell.dataset.col = c;
        }
    }
}

function revealCell(r, c, cell) {
    if (cell.classList.contains('revealed')) return;
    cell.classList.add('revealed');
    if (board[r][c] === 'M') {
        if (numberOfFailures === 0) {
            numberOfFailures++;
            board[r][c] = '💣';
        } else {
            board[r][c] = '💣';
            revealAllMines();
            onPlayerFail();
        }
    }
    cell.textContent = board[r][c] === 0 ? ' ' : board[r][c];
    revealedCount++;
    gameOver();
    if (board[r][c] === 0) {
        for (let i = r - 1; i <= r + 1; i++) {
            for (let j = c - 1; j <= c + 1; j++) {
                if (i >= 0 && i < rows && j >= 0 && j < cols) {
                    const neighborCell = document.querySelector(`td[data-row='${i}'][data-col='${j}']`);
                    if (neighborCell && !neighborCell.classList.contains('revealed')) {
                        revealCell(i, j, neighborCell);
                    }
                }
            }
        }
    }
}

function gameOver() {
    if ((!numberOfFailures && revealedCount === rows * cols - mines) || (revealedCount === rows * cols - mines + 1)) {
        findUser.solvedBoards++;
        massageOfWinsinnerText = `מספר הלוחות שפתרת: ${findUser.solvedBoards}`;
        localStorage.setItem("current user", JSON.stringify(findUser));
        localStorage.setItem(findUser.userEmail, JSON.stringify(findUser));
        explodeConfetti();
    }
}
function toggleFlag(cell) {
    if (!cell.classList.contains('revealed')) {
        if (cell.textContent === '🚩') {
            cell.textContent = '';
        } else {
            cell.textContent = '🚩';
        }
    }
}

function revealAllMines() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'M') {
                const cell = document.querySelector(`td[data-row='${r}'][data-col='${c}']`);
                cell.textContent = '💣';
                cell.classList.add('revealed');
            }
        }
    }
};

function explodeConfetti() {
    const main = document.querySelector("main");
    const rect = main.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;
    confetti({
        particleCount: 1500,
        spread: 360,
        startVelocity: 30,
        origin: { x: x, y: y },
        colors: ["#ff007f", "#ff6600", "#ffcc00", "#00ffcc", "#007fff"],
        gravity: 0.6,
        scalar: 1.5,
    });
}

function onPlayerFail() {
    document.body.style.transition = "background-color 0.3s";
    document.body.style.backgroundColor = "rgba(255, 0, 0, 0.5)";
    setTimeout(() => {
        document.body.style.backgroundColor = "";
    }, 500);
    document.body.style.animation = "shake 0.5s";
    setTimeout(() => {
        document.body.style.animation = "";
    }, 500);
    const failMessage = document.createElement('div');
    failMessage.innerHTML = "💔 אופס! הפסדת! 💔";
    failMessage.style.position = "fixed";
    failMessage.style.top = "50%";
    failMessage.style.left = "50%";
    failMessage.style.transform = "translate(-50%, -50%)";
    failMessage.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    failMessage.style.color = "white";
    failMessage.style.padding = "20px";
    failMessage.style.fontSize = "30px";
    failMessage.style.borderRadius = "15px";
    failMessage.style.boxShadow = "0 0 15px rgba(255, 0, 0, 0.8)";
    failMessage.style.animation = "pulse 1s infinite alternate";
    document.body.appendChild(failMessage);
    setTimeout(() => {
        failMessage.remove();
    }, 2000);
}