const messageDisplay = document.querySelector(".message-container");
const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");

let wordle;
const getWordle = () => {
  fetch("http://localhost:8000/word")
    .then((response) => response.json())
    .then((json) => {
      wordle = json.toUpperCase();
    })
    .catch((err) => console.log(err));
};
getWordle(); //calling function to get the word when the game starts

const guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

let currentRow = 0;
let currentTile = 0;
let isGameOver = false;

guessRows.forEach((guessRow, guessRowIndex) => {
  const rowElement = document.createElement("div");
  rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
  guessRow.forEach((guess, guessIndex) => {
    const tileElement = document.createElement("div");
    tileElement.setAttribute(
      "id",
      "guessRow-" + guessRowIndex + "-tile-" + guessIndex
    );
    tileElement.classList.add("tile");
    rowElement.append(tileElement);
  });
  tileDisplay.append(rowElement);
});

const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENTER",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "DELETE",
];

keys.forEach((key) => {
  const buttonElement = document.createElement("button");
  buttonElement.textContent = key;
  buttonElement.setAttribute("id", key);
  buttonElement.addEventListener("click", () => handleClick(key));
  keyboard.append(buttonElement);
});

const handleClick = (key) => {
  if (!isGameOver) {
    //   console.log("clicked", key);
    if (key === "DELETE") {
      // console.log("delete letter");
      deleteLetter();
      // console.log("guessRows", guessRows);
      return;
    }
    if (key === "ENTER") {
      // console.log("check row");
      checkRow();
      // console.log("guessRows", guessRows);
      return;
    }
    addLetter(key);
    //   console.log("guessRows", guessRows);
  }
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute("data", letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    //deletes only if there's a letter in the guessRow & deletes only from current guessRow
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

const checkRow = () => {
  const guess = guessRows[currentRow].join("");

  if (currentTile > 4) {
    //if there are 5 letters word in the guessRow

    fetch(`http://localhost:8000/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);
        if (json == "Entry word not found") {
          //   showMessage("NOT A DICTIONARY WORD!");
          shakeEntry();
          return;
        } else {
          // console.log("guess is " + guess, "wordle is " + wordle);
          flipTile();
          if (wordle === guess) {
            // showMessage("CONGRATULATIONS!");
            const jsConfetti = new JSConfetti();

            jsConfetti.addConfetti({
              emojis: ["💯", "🎉", "✨", "🎈", "🥳"],
              emojiSize: 80,
              confettiNumber: 100,
            });
            isGameOver = true;
            return; //does not allow any further entry
          } else {
            if (currentRow >= 5) {
              //no more chances left out of 6
              isGameOver = true;
              //   showMessage("GAME OVER!");
              showMessage(wordle);
              return;
            }
            if (currentRow < 5) {
              //chances are left out of 6
              currentRow++;
              currentTile = 0;
            }
          }
        }
      })
      .catch((err) => console.log(err));
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  //   setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

const addColorToKey = (letter, color) => {
  const key = document.getElementById(letter);
  key.classList.add(color);
};

const shakeEntry = () => {
  const rowEntry = document.querySelector("#guessRow-" + currentRow);
  rowEntry.classList.add("shakeanimation");
};

const flipTile = () => {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({
      letter: tile.getAttribute("data"),
      color: "grey-overlay",
    });
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter)) {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
    }, 500 * index);
  });
};
