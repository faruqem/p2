
//Everything is wrapped in this self invoking function to prevent un-wanted global exposure of any variable
//Though it may look redundant in this particular case since all variables are declared within init() function
//anyway, nonetheless it is used as a best practice.

(function(){ //Wrapper self invoking anonymus function

    window.onload = init; //Call init after window is loaded

    function init(){

        "use strict";

        //Declare and retrieve all html DOM elements using U.findElem() utility function defined in js/utility.js
        /*******************************************************************************************************/
        var totWords = U.findElem("tot-words");
        var totSpChars = U.findElem("tot-sp-chars");
        var totNumbers = U.findElem("tot-numbers");
        var useSeparator = U.findElem("use-separator");
        var wordCase = U.findElem("word-case");
        var savePreference = U.findElem("save-preference");


        //Retrieve and set user preference
        retrieveAndSetPreference();

        /*savePreference.addEventListener("change", function(){
            if(savePreference.checked){
                localStorage.clear();
            } else {
                saveUserPreference();
            }
        });*/

        //Save user preference on change of values
        totWords.addEventListener("change", saveUserPreference);
        totSpChars.addEventListener("change", saveUserPreference);
        totNumbers.addEventListener("change", saveUserPreference);
        useSeparator.addEventListener("change", saveUserPreference);
        wordCase.addEventListener("change", saveUserPreference);
        savePreference.addEventListener("change", saveUserPreference);

        //Save user prefernce function
        function saveUserPreference(){
            if(savePreference.checked){
                if(typeof(Storage) !== "undefined") { //Check if the browser supports local storage
                    var userPreference = [totWords.value,totSpChars.value,totNumbers.value,useSeparator.value,wordCase.value,savePreference.value];
                    localStorage.setItem("guddi_ca_xkcd_user_preference", JSON.stringify(userPreference));
                } else {
                    console.log("Error log: Web local storage is not supported in this browser!");
                }//End of inner IF
            } else{
                localStorage.clear();
            } //End of outer IF
        } //End of saveUserPreference() function

        //Set and retrieve user preference function
        function retrieveAndSetPreference(){
            if(typeof(Storage) !== "undefined") { //Check if the browser supports local storage
                if(localStorage.guddi_ca_xkcd_user_preference){
                    var userPreferenceRetrieved = JSON.parse(localStorage.getItem("guddi_ca_xkcd_user_preference"));
                    totWords.value = userPreferenceRetrieved[0];
                    totSpChars.value = userPreferenceRetrieved[1];
                    totNumbers.value = userPreferenceRetrieved[2];
                    useSeparator.value = userPreferenceRetrieved[3];
                    wordCase.value = userPreferenceRetrieved[4];
                    savePreference.checked = userPreferenceRetrieved[5];
                } //End of inner IF
            } else {
                console.log("Error log: Web local storage is not supported in this browser!");
            }//End of outer IF
        } //End of saveUserPreference() function

    } //End of init() function
})(); //End of wrapping anonymus function
