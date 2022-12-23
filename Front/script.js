import bot from "./assets/bot.svg"; // Importe l'image du bot
import user from "./assets/user.svg"; // Importe l'image de l'utilisateur

const form = document.querySelector("form"); // Sélectionne le formulaire
const chatContainer = document.querySelector("#chat_container"); // Sélectionne le conteneur de chat

let loadInterval; // Déclare une variable pour l'intervalle de chargement

// Fonction pour afficher un loader pendant le chargement
function loader(element) {
  element.textContent = ""; // Vide le contenu de l'élément

  loadInterval = setInterval(() => {
    // Définit l'intervalle de chargement
    element.textContent += "."; // Ajoute un point au contenu de l'élément

    if (element.textContent === "...") {
      // Si le contenu de l'élément est égal à '....'
      element.textContent = ""; // Alors on vide le contenu de l'élément
    }
  }, 300); // Toutes les 300ms
}

// Fonction pour faire écrire du texte à l'aide d'un effet de frappe
function typeText(element, text) {
  let index = 0; // Déclare une variable pour l'index du texte

  let interval = setInterval(() => {
    // Définit un intervalle pour l'effet de frappe
    if (index < text.length) {
      // Si l'index est inférieur à la longueur du texte
      element.innerHTML += text.charAt(index); // Alors on ajoute le caractère à l'élément
      index++; // On incrémente l'index
    } else {
      // Sinon
      clearInterval(interval); // On efface l'intervalle
    }
  }, 20); // Toutes les 20ms
}

// Fonction qui génère un identifiant unique en utilisant l'horodatage actuel et un nombre aléatoire
function generateUniqueId() {
  // Récupère l'horodatage actuel en millièmes de secondes
  const timestamp = Date.now();
  // Génère un nombre aléatoire entre 0 et 1
  const randomNumber = Math.random();
  // Convertit le nombre aléatoire en chaîne hexadécimale
  const hexadecimalString = randomNumber.toString(16);

  // Retourne l'identifiant unique en concaténant l'horodatage et la chaîne hexadécimale
  return `id-${timestamp}-${hexadecimalString}`;
}

// Fonction qui génère une balise HTML représentant un message dans une conversation
function chatStripe(isAi, value, uniqueId) {
  // Retourne la balise HTML générée en utilisant des template strings
  return `
    <div class="wrapper" ${isAi && "ai"}>
      <div class="chat">
        <div class="profile">
          <img
            src="${isAi ? bot : user}"
            alt="${isAi ? "bot" : "user"}"
          />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
      </div>
    </div>
  `;
}

// Fonction qui gère la soumission du formulaire
const handleSubmit = async (e) => {
  // Empêche le rechargement de la page
  e.preventDefault();

  // Crée un objet FormData à partir du formulaire
  const data = new FormData(form);

  // Ajoute le message de l'utilisateur à la page en utilisant la fonction chatStripe
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  // Réinitialise le formulaire
  form.reset();

  // Génère un identifiant unique
  const uniqueId = generateUniqueId();
  // Ajoute un message du bot à la page en utilisant la fonction chatStripe
  chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

  // Fait défiler la conversation jusqu'en bas
  chatContainer.scrollTop = chatContainer.scrollHeight;

  // Récupère le div qui contient le message du bot
  const messageDiv = document.getElementById(uniqueId);

  // Appelle la fonction loader sur le div du message du bot
  loader(messageDiv);

  const response = await fetch("http://localhost:8080/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });

  clearInterval(loadInterval);
  messageDiv.innerHTML = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
    console.log({parsedData})
  } else {
    const err = await response.text;

    messageDiv.innerHTML = "Il y'a une erreur";

    alert(err);
  }
};

// Ajoute un écouteur d'événement de soumission de formulaire
form.addEventListener("submit", handleSubmit);
// Ajoute un écouteur d'événement de relâchement de touche
form.addEventListener("keyup", (e) => {
  // Si la touche pressée est la touche Entrée
  if (e.keyCode === 13) {
    // Appelle la fonction handleSubmit avec l'événement en argument
    handleSubmit(e);
  }
});
