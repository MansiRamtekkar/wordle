const PORT = process.env.PORT || 8000;
const axios = require("axios");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

app.get("/word", (req, res) => {
  const options = {
    method: "GET",
    url: process.env.RAPID_API_WORD_URL,
    params: { count: "5", wordLength: "5" },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "random-words5.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.json(response.data[0]);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/check", (req, res) => {
  //   console.log(req); //whole request gets logged
  const word = req.query.word;

  const options = {
    method: "GET",
    url: process.env.RAPID_API_DICTIONARY_URL,
    params: { entry: word },
    headers: {
      "X-RapidAPI-Key": process.env.RAPID_API_KEY,
      "X-RapidAPI-Host": "twinword-word-graph-dictionary.p.rapidapi.com",
    },
  };

  axios
    .request(options)
    .then((response) => {
      console.log(response.data);
      res.json(response.data.result_msg); //to get the msg of the word exists in dictionary
    })
    .catch((error) => {
      console.error(error);
    });
});

app.listen(PORT, () => console.log("Server running on port " + PORT));
