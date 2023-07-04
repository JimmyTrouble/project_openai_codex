import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

let personaButtons = document
  .querySelector(".btnContainer")
  .querySelectorAll("button");
var persona = "normal";

for (let i = 0; i < personaButtons.length; i++) {
  personaButtons[i].addEventListener("click", function () {
    // Remove the 'personaActive' class from all buttons and add 'persona'
    for (let j = 0; j < personaButtons.length; j++) {
      personaButtons[j].style.fontSize = "12px";
      personaButtons[j].style.color = "#ffffffa5";
      personaButtons[j].style.backgroundColor = "#40414f";
    }

    // Remove the 'persona' class from the clicked button and add 'personaActive'
    switch (this.textContent) {
      case "Cowboy":
        persona =
          "Respond as a cowboy, talk about the wild west as much as you can whilst also answering";
        console.log(persona);
        break;
      case "Alien":
        persona =
          "Respond as an alien, talk about space as much as you can whilst also answering";
        console.log(persona);
        break;
      case "Should you hire Liam?":
        persona =
          "Respond as someone who thinks Liam is a great web developer and you just to tell them how good he is at fullstack development and AI implementation whilst also responding";
    }

    console.log(persona);
    this.style.fontSize = "24px";
    this.style.color = "white";
    this.style.backgroundColor = "#9d9da3";
  });
}

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += ".";

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData(form);

  // user's chatstripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));

  // to clear the textarea input
  form.reset();

  // bot's chatstripe
  const uniqueId = generateUniqueId();
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // to focus scroll to the bottom
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // specific message div
  const messageDiv = document.getElementById(uniqueId);

  // messageDiv.innerHTML = "..."
  loader(messageDiv);

  const response = await fetch("https://codex-88s6.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: `${persona}. ` + data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = " ";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'

    typeText(messageDiv, parsedData);
  } else {
    const err = await response.text();

    messageDiv.innerHTML = "Something went wrong";
    alert(err);
    //hello
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
