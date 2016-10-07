angular.module('neuvoo.dictionary', [])

.factory('Dictionary', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  //var dictionary = [{id:"en", }]

  var dictionary = {
    "en": {
      "id":"en",
      "chooseCountry":"CHOOSE A COUNTRY",
      "chooseLanguaje":"CHOOSE A LANGUAGE",
      "results":"results found.",
      "saveSearch":"SEARCH",
      "preference":"Preference",
      "changeCountry":"Change country",
      "changeLanguage":"Change language",
      "notifications":"Notifications",
      "privacyAndTerm":"Privacy and term",
      "aboutNeuvoo":"About neuvoo",
      "job": "Keywords, company...",
      "location": "Location"
    },
    "de": {
      "id":"de",
      "chooseCountry":"WÄHLEN SIE EIN LAND",
      "chooseLanguaje":"SPRACHE AUSWÄHLEN",
      "results":"ergebnisse",
      "saveSearch":"SUCHE SPEICHERN",
      "preference":"Vorliebe",
      "changeCountry":"Land ändern",
      "changeLanguage":"Sprache ändern",
      "notifications":"Benachrichtigungen",
      "privacyAndTerm":"Datenschutz und Amtszeit",
      "aboutNeuvoo":"Über neuvoo",
      "job": "Stichwort, Unternehmen...",
      "location": "Ort"
    },
    "fr": {
      "id":"fr",
      "chooseCountry":"CHOISISSEZ UN PAYS",
      "chooseLanguaje":"CHOISISSEZ UNE LANGUE",
      "results":"résultats",
      "saveSearch":"SAUVEGARDER LA RECHERCHE",
      "preference":"Préférence",
      "changeCountry":"Changer de pays",
      "changeLanguage":"Changer de langue",
      "notifications":"Notifications",
      "privacyAndTerm":"Confidentialité et durée",
      "aboutNeuvoo":"À propos de Neuvoo",
      "job": "Mots-clés, entreprise...",
      "location": "Lieu"
    },
    "pt": {
      "id":"pt",
      "chooseCountry":"ESCOLHA UM PAÍS",
      "chooseLanguaje":"ESCOLHA UM IDIOMA",
      "results":"resultados",
      "saveSearch":"GUARDAR PESQUISA",
      "preference":"Preferência",
      "changeCountry":"Alterar país",
      "changeLanguage":"Mudar língua",
      "notifications":"Notificações",
      "privacyAndTerm":"Privacidade e prazo",
      "aboutNeuvoo":"Sobre neuvoo",
      "job": "Palavra-chave, companhia...",
      "location": "Localização"
    },
    "es": {
      "id":"es",
      "chooseCountry":"ESCOGE UN PAIS",
      "chooseLanguaje":"ESCOGE UN IDIOMA",
      "results":"resultados",
      "saveSearch":"GUARDAR BÚSQUEDA",
      "preference":"Preferencia",
      "changeCountry":"Cambiar pais",
      "changeLanguage":"Cambiar idioma",
      "notifications":"Notificaciones",
      "privacyAndTerm":"Privacy and term",
      "aboutNeuvoo":"About neuvoo",
      "job": "Palabras clave, Empresa...",
      "location": "Localidad"
    },
    "it": {
      "id":"it",
      "chooseCountry":"SCEGLI UN PAESE",
      "chooseLanguaje":"SCEGLIERE UNA LINGUA",
      "results":"risultati",
      "saveSearch":"SALVA RICERCA",
      "preference":"Preferenza",
      "changeCountry":"Change country",
      "changeLanguage":"Cambia Paese",
      "notifications":"Notifiche",
      "privacyAndTerm":"Privacy e termine",
      "aboutNeuvoo":"Chi neuvoo",
      "job": "Parole chiavi, società...",
      "location": "Località"
    },
    "nl":  {
      "id":"nl",
      "chooseCountry":"KIES EEN LAND",
      "chooseLanguaje":"KIES EEN TAAL",
      "results":"resultaten",
      "saveSearch":"BEWAAR ZOEKOPDRACHT",
      "preference":"Voorkeur",
      "changeCountry":"Wijzig land",
      "changeLanguage":"Wijzig taal",
      "notifications":"Bekendmakingen",
      "privacyAndTerm":"Privacy en termijn",
      "aboutNeuvoo":"Over neuvoo",
      "job": "Trefwoorden, bedrijf...",
      "location": "Locatie"
    }
   

  };//de,fr, pt, es, it, nl

  return {
    currentDictionary: function(){
      // console.log("LS lang: "+window.localStorage['currentLanguage']);
      var lang = dictionary[window.localStorage['currentLanguage']];
      // console.log(lang);
      if(lang) return lang;
      else return dictionary['en'];
    }
  };
});