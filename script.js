// // Basic blueprint
// fecth(url)
//   .then(response.something) // Define response type (JSON, Headers, Status codes)
//   .then(data); // get the response type

// Practical example
const re = /breeds\/(.*)\//;

const request = async () => {
  const response = await fetch("https://dog.ceo/api/breeds/image/random");
  const data = await response.json();
  console.log(data);
  // do some error handling if data.status is not "success"
  if (data.status == "success") {
    console.log(data.message);
    const breed = data.message.match(re);
    console.log(breed[1]);
    document.getElementById("dogImage").src=data.message;

    // document.getElementById("guess").value = "Fifth Avenue, New York City"; 
    document.getElementById("check").addEventListener("click", checkBreed);
    
    function checkBreed() {
      if (document.getElementById("guess").value == breed[1]) {
        document.getElementById("status").value = "Success!";
      } else {
        document.getElementById("status").value = "Fail!";
      }
      return true
    }
    // function myFunction() {
    //   document.getElementById("demo").innerHTML = "YOU CLICKED ME!";
    // }
  }
};

request();

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
