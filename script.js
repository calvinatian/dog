// // Basic blueprint
// fecth(url)
//   .then(response.something) // Define response type (JSON, Headers, Status codes)
//   .then(data); // get the response type



const request = async () => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();

  // do some error handling if data.status is not "success"
  if (data.status == "success") {
    const breedFullRe = /breeds\/(.*)\//;
    const breedMainRe = /breeds\/(\w*)-?.*\//;
    const breedFull = data.message.match(breedFullRe)[1].toLowerCase();
    const breedMain = data.message.match(breedMainRe)[1].toLowerCase();
    console.log(breedMain);
    document.getElementById("dogImage").src=data.message;

    document.getElementById("answer").textContent=breedMain;

    let answers = Array(breedMain.length).fill(" ")
    console.log(answers)

    let game = document.getElementById("game");
    let guessHTML = ""

    // Check
    document.getElementById("check").addEventListener("click", checkBreed);
    function checkBreed() {
      const guess = document.getElementById("guess").value.toLowerCase();
      if (guess.length != breedMain.length) {
        return false
      }
      for (let i in guess) {
        tile = generateTile(i, guess, breedMain);
        game.innerHTML += tile;
      }
      game.innerHTML += '<div></div>'
      if (guess == breedMain) {
        document.getElementById("status").value = "Success!";
      } else {
        document.getElementById("status").value = "Fail!";
      }
      return true
    }

    function generateTile(pos, guess, answer) {
      if (answer[pos] == guess[pos]) {
        return '<div class="correct tile">' + guess[pos].toUpperCase() + '</div>';
      } else if (answer.includes(guess[pos])) {
        return '<div class="incorrect-location tile">' + guess[pos].toUpperCase() + '</div>';
      } else {
        return '<div class="incorrect tile">' + guess[pos].toUpperCase() + '</div>';
      }
    }
  }
};

request();

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

document.getElementById("all-breeds").innerHTML=Object.values(breeds).toString();

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
});

document.addEventListener("readystatechange", (event) => {
  log.textContent = log.textContent + `readystate: ${document.readyState}\n`;
});

document.addEventListener("DOMContentLoaded", (event) => {
  log.textContent = log.textContent + `DOMContentLoaded\n`;
});
