const board = document.getElementById("game-board");
const message = document.getElementById("message");
const resetButton = document.getElementById("resetButton");
const timerElement = document.getElementById("timer");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("highScore");

const cards = [
    '🍎', '🍎', '🍌', '🍌', '🍓', '🍓', '🍉', '🍉', '🍍', '🍍',
    '🍒', '🍒', '🍑', '🍑', '🍊', '🍊'
];

let flippedCards = [];
let matchedCards = [];
let isGameOver = false;
let timerInterval;
let elapsedTime = 0;
let score = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : Infinity;
let timerStarted = false; // Flag to track if the timer has started

// Shuffle the cards
function shuffleCards() {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Create the game board
function createBoard() {
    const shuffledCards = shuffleCards();
    board.innerHTML = '';
    shuffledCards.forEach((card, index) => {
        const cardElement = document.createElement("div");
        cardElement.classList.add("card");
        cardElement.setAttribute("data-id", index);
        cardElement.addEventListener("click", () => flipCard(cardElement, card));
        board.appendChild(cardElement);
    });
}

// Start the timer when the first card is flipped
function startTimer() {
    if (!timerStarted) {
        timerStarted = true;
        elapsedTime = 0;
        timerInterval = setInterval(() => {
            elapsedTime++;
            timerElement.textContent = `Time: ${elapsedTime}s`;
        }, 1000);
    }
}

// Flip the card when clicked
function flipCard(cardElement, card) {
    if (flippedCards.length === 2 || cardElement.classList.contains("flipped") || isGameOver) return;
    
    cardElement.textContent = card;
    cardElement.classList.add("flipped");
    flippedCards.push(cardElement);
    
    // Start the timer when the first card is flipped
    if (flippedCards.length === 1) {
        startTimer();
    }

    if (flippedCards.length === 2) {
        checkMatch();
    }
}

// Check if the flipped cards match
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;
    
    if (firstCard.textContent === secondCard.textContent) {
        firstCard.classList.add("matched");
        secondCard.classList.add("matched");
        matchedCards.push(firstCard, secondCard);
        score++;

        if (matchedCards.length === cards.length) {
            clearInterval(timerInterval); // Stop the timer when all cards are matched
            message.textContent = `You win! All pairs matched in ${elapsedTime} seconds!`;
            isGameOver = true;
            updateHighScore();
        }
    } else {
        setTimeout(() => {
            firstCard.textContent = '';
            secondCard.textContent = '';
            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");
        }, 1000);
    }
    flippedCards = [];
}

// Update high score if the current time is better
function updateHighScore() {
    if (elapsedTime < highScore) {
        highScore = elapsedTime;
        localStorage.setItem('highScore', highScore);
    }
    highScoreElement.textContent = `High Score: ${highScore}s`;
}

// Reset the game when the reset button is clicked
resetButton.addEventListener("click", () => {
    matchedCards = [];
    flippedCards = [];
    isGameOver = false;
    score = 0;
    message.textContent = "Match the pairs!";
    scoreElement.textContent = `Score: ${score}`;
    timerElement.textContent = "Time: 0s";
    timerStarted = false; // Reset the timer start flag
    createBoard();
    startTimer();
});

createBoard();
scoreElement.textContent = `Score: ${score}`;
highScoreElement.textContent = `High Score: ${highScore}s`;
