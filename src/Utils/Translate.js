import axios from "axios";

const googleAPIKey = "AIzaSyDCo6jnn2pbiXmRIpoDCgysJ7XWP38MJi4";

export const translate = (text, sourceLanguage, targetLanguage) => {
  const translations = [];
  const textArray = splitText(text);

  for (const textSplit of textArray) {
    translations.push(
      translate1000char(textSplit, sourceLanguage, targetLanguage)
    );
  }
  return axios
    .all(translations)
    .then(axios.spread((...results) => results.join('\n')));
};

const translate1000char = (textRecognized, sourceLanguage, targetLanguage) => {
  const params = {
    q: textRecognized,
    target: targetLanguage,
    source: sourceLanguage,
    key: googleAPIKey,
    format: "text"
  };
  const url =
    "https://cors-anywhere.herokuapp.com/https://translation.googleapis.com/language/translate/v2";
  return axios
    .post(url, null, {
      params
    })
    .then(res => res.data.data.translations[0].translatedText);
};

const splitText = str => {
  return str
    .replace(/(.|\n|\r\n){1,1000}(\n|\r\n|$)/g, "$&@")
    .slice(0, str.length - 1)
    .split(/\n+@/);
};
