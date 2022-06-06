// This is some real bad code. Good luck to whoever gets this lol.
const request = async () => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const dogData = await response.json();
  const data = new Map();
  data.set('img', 'test')

  // do some error handling if dogData.status is not "success"
  if (dogData.status == "success") {
    const breedFullRe = /breeds\/(.*)\//;
    const breedMainRe = /breeds\/(\w*)-?.*\//;
    const breedFull = dogData.message.match(breedFullRe)[1].toLowerCase();
    const breedMain = dogData.message.match(breedMainRe)[1].toLowerCase();
    data.set('breedFull', breedFull);
    data.set('breedMain', breedMain);
    data.set('dogImage', dogData.message)
    // document.getElementById("dogImage").src=data.message;
    // document.getElementById("answer").textContent=breedMain;

    return data;
  }
};

const allBreeds = async () => {
  const response = await fetch("https://dog.ceo/api/breeds/list/all");
  const data = await response.json();
  // do some error handling if data.status is not "success"
  if (data.status == "success") {
    document.getElementById("all-breeds").innerHTML=JSON.stringify(data, null, 4);
  }
};

// function to perform a get request
function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

// get list of all breeds
function getAllBreeds()
{
    let json = httpGet('https://dog.ceo/api/breeds/list/all');
    let result = JSON.parse(json);
    let breeds = result.message
    // let breedLabels = [];
    let breedLabels = {};
  
    // loops through them, adds to breedLabels array
    for (const [breed, subBreeds] of Object.entries(breeds)) {
        breedLabels[breed] = breed.charAt(0).toUpperCase() + breed.slice(1);
 
        // if sub breeds exist
        if (subBreeds.length > 0 ) {
            subBreeds.forEach(function(subBreed){
              breedLabels[breed + '-' + subBreed] = subBreed.charAt(0).toUpperCase() + subBreed.slice(1) + ' ' + breed.charAt(0).toUpperCase() + breed.slice(1);
            });
        }
    }
  
    return breedLabels;
}

// gets a list of all breeds
var breeds = getAllBreeds();


// document.getElementById("all-breeds").innerHTML=Object.values(breeds).toString();


window.addEventListener("load", (event) => {
  // log.textContent = log.textContent + "load\n";
  async function simulate() {
    const data = await request();
    document.getElementById("answer").textContent=data.get('breedMain');
    document.getElementById("dogImage").src=data.get('dogImage');
    // let answers = Array(data.get('breedMain').length).fill(" ");
    // console.log(answers)

    const game = document.getElementById("game");
    const answer = data.get('breedMain');
    game.answer = answer;
    game.numGuesses = 0;

    generateEmptyTiles(game, data.get('breedMain').length)

    // Check
    const check = document.getElementById("check");
    check.addEventListener("click", (event) => {
      const guess = document.getElementById("guess").value.toLowerCase();
      checkBreed(event, game, guess)
    });
  }
  simulate();
});

function generateEmptyTiles(gameArea, ansLength) {
  const numRows = 6;
  gameHTML = ""
  for (let i = 0; i < numRows; i++) {
    gameHTML += generateTileRow(i, " ".repeat(ansLength))
  }
  gameArea.innerHTML = gameHTML
}

function generateTileRow(index, word) {
  row = '<div id="game-row-' + index + '">'
  for (let char of word) {
    row += generateUserTile(char)
  }
  row += '</div>'
  return row
}


// Add event listener on keydown
document.addEventListener('keydown', (event) => {
  var name = event.key;
  var code = event.code;
  // Alert the key name and key code on keydown
  console.log(`Key pressed ${name} \r\n Key code value: ${code}`);
  keyPress(name, code);
}, false);

function keyPress(key, code) {
  const guess = document.getElementById("guess");
  const game = document.getElementById("game");

  if (code == "Enter") {
    // try submitting guess
    res = checkBreed("", game, guess.value);
    if (res) {guess.value = ""};
  } else if (code == "Backspace" ) {
    guess.value = guess.value.trim()
    guess.value = guess.value.slice(0, -1)
  } else if (/^\w$/.test(key)) {
    guess.value = guess.value.trim()
    guess.value += key.toUpperCase()
  }
  // pad string
  guess.value = guess.value.padEnd(game.answer.length, " ");
  // modify doc
  // get row
  const rowNum = 'game-row-' + game.numGuesses;
  const row = document.getElementById(rowNum);
  // replace row
  row.innerHTML = generateTileRow(game.numGuesses, guess.value);
}

function checkBreed(event, game, guess) {
  answer = game.answer.toLowerCase();
  guess = guess.toLowerCase();
  if (guess.length != answer.length) {
    document.getElementById("status").value = "Not enough letters!";
    return false
  }
  const rowNum = 'game-row-' + game.numGuesses;
  const row = document.getElementById(rowNum)
  let newRow = ""
  for (let i in guess) {
    tile = generateTile(i, guess, answer);
    newRow += tile;
  }
  row.innerHTML = newRow;
  game.numGuesses += 1;
  document.getElementById("status").value = (guess == answer) ? "Success!": "Fail!";
  return true
}

function generateTile(index, guess, answer) {
  if (answer[index] == guess[index]) {
    return '<div class="correct tile">' + guess[index].toUpperCase() + '</div>';
  } else if (answer.includes(guess[index])) {
    return '<div class="incorrect-location tile">' + guess[index].toUpperCase() + '</div>';
  } else {
    return '<div class="incorrect tile">' + guess[index].toUpperCase() + '</div>';
  }
}

function generateUserTile(letter) {
  return '<div class="unknown tile">' + letter.toUpperCase() + '</div>';
}

document.getElementById("clear").addEventListener("click", (event) => {
  const game = document.getElementById("game").innerHTML="";
  const guess = document.getElementById("guess");
  guess.value = "";
});
