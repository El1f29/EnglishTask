const mainMenu =
    document.getElementById("mainMenu");

const libraryScreen =
    document.getElementById("libraryScreen");

const gameScreen =
    document.getElementById("gameScreen");

const resultScreen =
    document.getElementById("resultScreen");


const playButton =
    document.getElementById("playButton");

const libraryButton =
    document.getElementById("libraryButton");

const recordsButton =
    document.getElementById("recordsButton");


const backFromLibrary =
    document.getElementById("backFromLibrary");

const backToMenu =
    document.getElementById("backToMenu");


const textCards =
    document.getElementById("textCards");


const bookTitle =
    document.getElementById("bookTitle");

const bookAuthor =
    document.getElementById("bookAuthor");

const difficulty =
    document.getElementById("difficulty");


const textDisplay =
    document.getElementById("textDisplay");

const typingInput =
    document.getElementById("typingInput");


const startButton =
    document.getElementById("startButton");

const resetButton =
    document.getElementById("resetButton");


const wpmElement =
    document.getElementById("wpm");

const accuracyElement =
    document.getElementById("accuracy");

const comboElement =
    document.getElementById("combo");

const timerElement =
    document.getElementById("timer");


const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");


const finalWpm =
    document.getElementById("finalWpm");

const finalAccuracy =
    document.getElementById("finalAccuracy");

const finalTime =
    document.getElementById("finalTime");


const playAgain =
    document.getElementById("playAgain");

const resultMenu =
    document.getElementById("resultMenu");



/* ================================= */
/* VARIABLES */
/* ================================= */

let selectedText = null;

let gameStarted = false;

let startTime = null;

let timerInterval = null;

let currentIndex = 0;

let correctCharacters = 0;

let incorrectCharacters = 0;

let combo = 0;



/* ================================= */
/* CAMBIAR PANTALLA */
/* ================================= */

function showScreen(screen) {

    document
        .querySelectorAll(".screen")
        .forEach(element => {

            element.classList.remove(
                "active"
            );

        });


    screen.classList.add("active");

}



/* ================================= */
/* MENÚ */
/* ================================= */

playButton.addEventListener(
    "click",
    () => {

        showScreen(libraryScreen);

    }
);


libraryButton.addEventListener(
    "click",
    () => {

        showScreen(libraryScreen);

    }
);


recordsButton.addEventListener(
    "click",
    () => {

        alert(
            "Records will be available soon."
        );

    }
);



/* ================================= */
/* VOLVER */
/* ================================= */

backFromLibrary.addEventListener(
    "click",
    () => {

        showScreen(mainMenu);

    }
);


backToMenu.addEventListener(
    "click",
    () => {

        stopGame();

        showScreen(mainMenu);

    }
);


resultMenu.addEventListener(
    "click",
    () => {

        showScreen(mainMenu);

    }
);


playAgain.addEventListener(
    "click",
    () => {

        showScreen(gameScreen);

        resetGame();

    }
);



/* ================================= */
/* CREAR BIBLIOTECA */
/* ================================= */

function loadLibrary() {

    textCards.innerHTML = "";


    literaryTexts.forEach(
        (book, index) => {

            const card =
                document.createElement("div");


            card.classList.add(
                "text-card"
            );


            card.innerHTML = `

                <div class="card-number">

                    0${index + 1}

                </div>


                <h3>

                    ${book.title}

                </h3>


                <p class="card-author">

                    ${book.author}

                </p>


                <p class="card-difficulty">

                    ${book.difficulty.toUpperCase()}

                    • LITERARY TEXT

                </p>

            `;


            card.addEventListener(
                "click",
                () => {

                    selectText(index);

                }
            );


            textCards.appendChild(card);

        }
    );

}



/* ================================= */
/* SELECCIONAR TEXTO */
/* ================================= */

function selectText(index) {

    selectedText =
        literaryTexts[index];


    bookTitle.textContent =
        selectedText.title;


    bookAuthor.textContent =
        selectedText.author;


    difficulty.textContent =
        selectedText.difficulty.toUpperCase();


    resetGame();


    showScreen(gameScreen);

}



/* ================================= */
/* CREAR TEXTO */
/* ================================= */

function createTextDisplay() {

    textDisplay.innerHTML = "";


    selectedText.text
        .split("")
        .forEach(
            (character, index) => {

                const span =
                    document.createElement("span");


                span.classList.add("char");


                span.dataset.index =
                    index;


                span.textContent =
                    character;


                textDisplay.appendChild(
                    span
                );

            }
        );


    updateCurrentCharacter();

}



/* ================================= */
/* LETRA ACTUAL */
/* ================================= */

function updateCurrentCharacter() {

    document
        .querySelectorAll(".char")
        .forEach(char => {

            char.classList.remove(
                "current"
            );

        });


    const currentChar =
        document.querySelector(
            `.char[data-index="${currentIndex}"]`
        );


    if (currentChar) {

        currentChar.classList.add(
            "current"
        );

    }

}



/* ================================= */
/* INICIAR */
/* ================================= */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    if (!selectedText) {

        return;

    }


    if (gameStarted) {

        return;

    }


    gameStarted = true;


    startTime = Date.now();


    startTimer();


    typingInput.focus();


    startButton.textContent =
        "TYPING...";


    if (typeof pavlov !== "undefined") {

        pavlov.emit(
            "gameStarted",
            {
                text:
                    selectedText.title
            }
        );

    }

}



/* ================================= */
/* INPUT */
/* ================================= */

typingInput.addEventListener(
    "input",
    () => {

        if (!gameStarted) {

            return;

        }


        const typedText =
            typingInput.value;


        const originalText =
            selectedText.text;


        currentIndex =
            typedText.length;


        correctCharacters = 0;

        incorrectCharacters = 0;

        combo = 0;



        for (
            let i = 0;
            i < typedText.length;
            i++
        ) {

            const charElement =
                document.querySelector(
                    `.char[data-index="${i}"]`
                );


            if (!charElement) {

                continue;

            }


            charElement.classList.remove(
                "correct",
                "incorrect"
            );


            if (
                typedText[i] ===
                originalText[i]
            ) {

                charElement.classList.add(
                    "correct"
                );


                correctCharacters++;

            }

            else {

                charElement.classList.add(
                    "incorrect"
                );


                incorrectCharacters++;

            }

        }



        /* COMBO */

        if (
            typedText.length > 0 &&
            incorrectCharacters === 0
        ) {

            combo =
                correctCharacters;

        }


        comboElement.textContent =
            combo;



        /* PROGRESO */

        const progress =
            Math.min(
                (
                    typedText.length /
                    originalText.length
                ) * 100,
                100
            );


        progressBar.style.width =
            `${progress}%`;


        progressText.textContent =
            `${Math.round(progress)}%`;



        updateStats();

        updateCurrentCharacter();



        /* PAVLOV */

        if (
            typeof pavlov !==
            "undefined"
        ) {

            const lastCharacter =
                typedText[
                    typedText.length - 1
                ];


            if (
                lastCharacter ===
                originalText[
                    typedText.length - 1
                ]
            ) {

                pavlov.emit(
                    "correctCharacter",
                    {
                        character:
                            lastCharacter
                    }
                );

            }

            else {

                pavlov.emit(
                    "incorrectCharacter",
                    {
                        character:
                            lastCharacter
                    }
                );

            }

        }



        /* TERMINAR */

        if (
            typedText.length >=
            originalText.length
        ) {

            finishGame();

        }

    }
);



/* ================================= */
/* ESTADÍSTICAS */
/* ================================= */

function updateStats() {

    if (!startTime) {

        return;

    }


    const elapsed =
        (Date.now() - startTime) /
        1000;


    const minutes =
        elapsed / 60;


    const words =
        typingInput.value.length / 5;


    const wpm =
        minutes > 0
            ? Math.round(
                words / minutes
            )
            : 0;


    const total =
        correctCharacters +
        incorrectCharacters;


    const accuracy =
        total > 0
            ? Math.round(
                (
                    correctCharacters /
                    total
                ) * 100
            )
            : 100;


    wpmElement.textContent =
        wpm;


    accuracyElement.textContent =
        `${accuracy}%`;

}



/* ================================= */
/* TIMER */
/* ================================= */

function startTimer() {

    timerInterval =
        setInterval(
            () => {

                const elapsed =
                    Math.floor(
                        (
                            Date.now() -
                            startTime
                        ) / 1000
                    );


                timerElement.textContent =
                    formatTime(elapsed);


                updateStats();

            },
            1000
        );

}



function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const remaining =
        seconds % 60;


    return (

        String(minutes)
            .padStart(2, "0")

        +

        ":"

        +

        String(remaining)
            .padStart(2, "0")

    );

}



/* ================================= */
/* FINALIZAR */
/* ================================= */

function finishGame() {

    if (!gameStarted) {

        return;

    }


    gameStarted = false;


    clearInterval(
        timerInterval
    );


    const elapsed =
        Math.floor(
            (
                Date.now() -
                startTime
            ) / 1000
        );


    const minutes =
        elapsed / 60;


    const words =
        selectedText.text.length / 5;


    const wpm =
        minutes > 0
            ? Math.round(
                words / minutes
            )
            : 0;


    const total =
        correctCharacters +
        incorrectCharacters;


    const accuracy =
        total > 0
            ? Math.round(
                (
                    correctCharacters /
                    total
                ) * 100
            )
            : 100;


    finalWpm.textContent =
        wpm;


    finalAccuracy.textContent =
        `${accuracy}%`;


    finalTime.textContent =
        formatTime(elapsed);


    startButton.textContent =
        "START";


    if (
        typeof pavlov !==
        "undefined"
    ) {

        pavlov.emit(
            "gameFinished",
            {
                wpm: wpm,
                accuracy: accuracy
            }
        );

    }


    setTimeout(
        () => {

            showScreen(
                resultScreen
            );

        },
        600
    );

}



/* ================================= */
/* RESET */
/* ================================= */

resetButton.addEventListener(
    "click",
    resetGame
);


function resetGame() {

    clearInterval(
        timerInterval
    );


    gameStarted = false;

    startTime = null;

    currentIndex = 0;

    correctCharacters = 0;

    incorrectCharacters = 0;

    combo = 0;


    typingInput.value = "";


    wpmElement.textContent =
        "0";


    accuracyElement.textContent =
        "100%";


    comboElement.textContent =
        "0";


    timerElement.textContent =
        "00:00";


    progressBar.style.width =
        "0%";


    progressText.textContent =
        "0%";


    startButton.textContent =
        "START";


    if (selectedText) {

        createTextDisplay();

    }

}



/* ================================= */
/* ESC */
/* ================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            gameScreen.classList.contains(
                "active"
            )
        ) {

            stopGame();

            showScreen(mainMenu);

        }

    }
);



/* ================================= */
/* DETENER */
/* ================================= */

function stopGame() {

    clearInterval(
        timerInterval
    );

    gameStarted = false;

}



/* ================================= */
/* INICIAR */
/* ================================= */

loadLibrary();