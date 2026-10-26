import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      welcome: "Welcome",
      home: "Home",
      contact: "Contact Us"
    }
  },

  es: {
    translation: {
      welcome: "Bienvenido",
      home: "Inicio",
      contact: "Contáctanos"
    }
  },

  or: {
    translation: {
      welcome: "ସ୍ୱାଗତ",
      home: "ମୁଖ୍ୟ ପୃଷ୍ଠା",
      contact: "ଯୋଗାଯୋଗ କରନ୍ତୁ"
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "en",
  fallbackLng: "en",

  interpolation: {
    escapeValue: false
  }
});

export default i18n;