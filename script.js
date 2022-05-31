// // Basic blueprint
// fecth(url)
//   .then(response.something) // Define response type (JSON, Headers, Status codes)
//   .then(data); // get the response type

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
    console.log(breedMain);
    data.set('breedFull', breedFull);
    data.set('breedMain', breedMain);
    data.set('dogImage', dogData.message)
    // document.getElementById("dogImage").src=data.message;
    // document.getElementById("answer").textContent=breedMain;

    return data;
  }
};

// request();

const allBreeds = async () => {
  const response = await fetch("https://dog.ceo/api/breeds/list/all");
  const data = await response.json();
  console.log(data);
  // do some error handling if data.status is not "success"
  if (data.status == "success") {
    // console.log(data.message);
    document.getElementById("all-breeds").innerHTML=JSON.stringify(data, null, 4);
  }
};

// allBreeds();

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
// var breeds = getAllBreeds();

// console.log(breeds);
// console.log(String(breeds))
// console.log(breeds.length)
// console.log(typeof(breeds))
// console.log(Object.values(breeds))
// console.log(JSON.stringify(breeds));

// document.getElementById("all-breeds").innerHTML=Object.values(breeds).toString();

const log = document.querySelector(".event-log-contents");
const reload = document.querySelector("#reload");

reload.addEventListener("click", () => {
  log.textContent = "";
  window.setTimeout(() => {
    window.location.reload(true);
  }, 200);
});

window.addEventListener("load", (event) => {
  log.textContent = log.textContent + "load\n";
  async function simulate() {
    const data = await request();
    console.log(data.get('img'))
    document.getElementById("answer").textContent=data.get('breedMain');
    document.getElementById("dogImage").src=data.get('dogImage');
    let answers = Array(data.get('breedMain').length).fill(" ");
    console.log(answers)

    const game = document.getElementById("game");
    const answer = data.get('breedMain');
    game.answer = answer;
    game.numGuesses = 0;
    // console.log(game.answer)

    generateEmptyTiles(game, data.get('breedMain').length)

    // Check
    const check = document.getElementById("check");
    console.log(game);
    check.addEventListener("click", (event) => {
      const guess = document.getElementById("guess").value.toLowerCase();
      console.log("guess " + guess)
      console.log("answer " + answer)
      checkBreed(event, game, answer, guess)
    });
  }
  simulate();
});

function generateEmptyTiles(gameArea, ansLength) {
  const numRows = 6;
  gameHTML = ""
  console.log(ansLength)
  console.log("a".repeat(ansLength))
  for (let i = 0; i < numRows; i++) {
    gameHTML += generateTileRow(i, " ".repeat(ansLength))
  }
  console.log(gameHTML)
  gameArea.innerHTML = gameHTML
}

function generateTileRow(index, word) {
  row = '<div id="game-row-' + index + '">'
  for (let char of word) {
    row += generateUserTile(char)
    console.log(char)
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
  if (code == "Enter") {
    // try submitting guess
    console.log(guess.value)
    const game = document.getElementById("game");
    res = checkBreed("", game, guess.value);
    if (res) {guess.value = ""};
  } else if (code == "Backspace") {
    guess.value = guess.value.slice(0, -1)
  } else {
    guess.value += key.toUpperCase()
    // value.toLowerCase();
  }
}

function checkBreed(event, game, guess) {
  answer = game.answer.toLowerCase();
  guess = guess.toLowerCase();
  if (guess.length != answer.length) {
    document.getElementById("status").value = "Not enough letters!";
    return false
  }
  for (let i in guess) {
    tile = generateTile(i, guess, answer);
    game.innerHTML += tile;
  }
  game.innerHTML += '<div></div>'  // new row
  if (guess == answer) {
    document.getElementById("status").value = "Success!";
  } else {
    document.getElementById("status").value = "Fail!";
  }
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
