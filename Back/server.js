import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

// Création d'un objet de configuration avec la clé API en utilisant la variable d'environnement KEY_API
const configuration = new Configuration({
  apiKey: process.env.KEY_API,
});

// Création d'une instance de la classe OpenAIApi en utilisant l'objet de configuration précédemment créé
const openai = new OpenAIApi(configuration);

// Création de l'application Express
const app = express();

// Activation du middleware CORS (Cross-Origin Resource Sharing) pour autoriser les requêtes HTTP provenant d'autres domaines
app.use(cors());

// Activation du middleware express.json pour traiter les données en format JSON envoyées dans les requêtes HTTP
app.use(express.json());

// Configuration de la route '/' en répondant à une requête HTTP de type GET avec un objet JSON contenant le message "saluuuuttt"
app.get("/", async (req, res) => {
  res.status(200).send({
    message: "saluuuuttt",
  });
});

// Configuration de la route '/' en répondant à une requête HTTP de type POST en utilisant la méthode createCompletion de l'objet openai
app.post("/", async (req, res) => {
  try {
    // Récupération de la propriété 'prompt' dans le corps de la requête (req.body)
    const prompt = req.body.prompt;

   // Appel de la méthode createCompletion de l'objet openai en lui passant un objet de configuration avec plusieurs propriétés
const response = await openai.createCompletion({
    // Spécification du modèle à utiliser pour générer la réponse
    model: "text-davinci-003",
    // Spécification de la prompt (la chaîne de caractères à compléter) à partir de la variable prompt
    prompt: `${prompt}`,
    // Spécification de la température de génération de la réponse (un nombre compris entre 0 et 1 qui contrôle l'originalité de la réponse)
    temperature: 0,
    // Spécification du nombre maximum de tokens (mots) dans la réponse générée
    max_tokens: 3000,
    // Spécification du paramètre top_p qui contrôle la probabilité des tokens (mots) inclus dans la réponse générée
    top_p: 1,
    // Spécification du paramètre frequency_penalty qui contrôle l'importance de la fréquence des tokens (mots) dans la réponse générée
    frequency_penalty: 0.5,
    // Spécification du paramètre presence_penalty qui contrôle l'importance de la présence des tokens (mots) dans la réponse générée
    presence_penalty: 0,
  });

    res.status(200).send({
        bot: response.data.choices[0].text
    })
  } catch (err) {
    console.log(err);
    res.status(500).send({ err })
  }
});

app.listen(8080, () => console.log('le serveur est sur http://localhost:8080'));
