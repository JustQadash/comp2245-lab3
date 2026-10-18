
const fruits = [
    { name: "apple", symbol: "🍎 " },
    { name: "banana", symbol: "🍌 " },
    { name: "cherry", symbol: "🍒 " },
    { name: "coconut", symbol: "🥥 " },
    { name: "grapes", symbol: "🍇 " },
    { name: "mango", symbol: "🥭 " },
    { name: "pineapple", symbol: "🍍 " },
    { name: "watermelon", symbol: "🍉 " },
];

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let deck = [];
let turnedCards = [];
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;

const board = document.querySelector("#board");
const movesCounter = document.querySelector("#moves");
const newGameButton = document.querySelector("#new-game");

function updateMoves() {
    if (movesCounter) {
        movesCounter.textContent = moves;
    }
}

function buildBoard() {
    deck = shuffle([...fruits, ...fruits]);
    turnedCards = [];
    lockBoard = false;
    matchedPairs = 0;
    moves = 0;

    updateMoves();
    board.replaceChildren();

    deck.forEach((fruit, i) => {
        const card = document.createElement("button");

        card.type = "button";
        card.classList.add("card");
        card.setAttribute("aria-label", `Card ${i + 1}, face down`);
        card.dataset.index = i;

        board.appendChild(card);
    });
}

board.addEventListener("click", (event) => {
    const card = event.target.closest(".card");

    if (!card || lockBoard || turnedCards.includes(card)) {
        return;
    }

    if (card.classList.contains("matched")) {
        return;
    }

    const index = Number(card.dataset.index);
    const fruit = deck[index];

    card.textContent = fruit.symbol;
    card.classList.add("flipped");
    card.setAttribute("aria-label", `${fruit.name}, face up`);

    turnedCards.push(card);

    if (turnedCards.length === 2) {
        moves++;
        updateMoves();
        checkMatch();
    }
});

function checkMatch() {
    const firstCard = turnedCards[0];
    const secondCard = turnedCards[1];

    const firstFruit = deck[Number(firstCard.dataset.index)];
    const secondFruit = deck[Number(secondCard.dataset.index)];

    if (firstFruit.name === secondFruit.name) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        firstCard.disabled = true;
        secondCard.disabled = true;

        matchedPairs++;
        turnedCards = [];

        if (matchedPairs === fruits.length) {
            setTimeout(() => {
                alert(`Congratulations! You won in ${moves} moves!`);
            }, 300);
        }
    } else {
        lockBoard = true;

        setTimeout(() => {
            firstCard.textContent = "";
            secondCard.textContent = "";

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            firstCard.setAttribute(
                "aria-label",
                `Card ${Number(firstCard.dataset.index) + 1}, face down`
            );

            secondCard.setAttribute(
                "aria-label",
                `Card ${Number(secondCard.dataset.index) + 1}, face down`
            );

            turnedCards = [];
            lockBoard = false;
        }, 1000);
    }
}

if (newGameButton) {
    newGameButton.addEventListener("click", buildBoard);
}

buildBoard();
