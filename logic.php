<?php
    /*Server side validation*/
    if (isset($_GET["tot-words"]) && isset($_GET["tot-numbers"]) && isset($_GET["tot-sp-chars"]) && isset($_GET["use-separator"]) && isset($_GET["word-case"])){
        if(trim($_GET["tot-words"] == '')) {
    	    $error = "ERROR: Please provide the total number of words to be used for the password.";
    	    return;
    	} else if(!ctype_digit($_GET["tot-words"])) {
    		$error = "ERROR: Total number of words must be in numeric.";
    		return;
     	} else if((int)$_GET["tot-words"] < 2 || (int)$_GET["tot-words"] > 6) {
    		$error = "ERROR: Total number of words must be between 2 to 6.";
    		return;
        } else if(trim($_GET["tot-numbers"] == '')) {
    	    $error = "ERROR: Please provide the total number to be used.";
    	    return;
    	} else if(!ctype_digit($_GET["tot-numbers"])) {
    		$error = "ERROR: Total numbers to be used must be in numeric.";
    		return;
     	} else if((int)$_GET["tot-numbers"] < 1 || (int)$_GET["tot-numbers"] > 4) {
    		$error = "ERROR: Total numbers to be used must be between 1 to 4.";
    		return;
        } else if(trim($_GET["tot-sp-chars"] == '')) {
    	    $error = "ERROR: Please provide the total special characters to be used.";
    	    return;
    	} else if(!ctype_digit($_GET["tot-sp-chars"])) {
    		$error = "ERROR: Total special characters to be used must be in numeric.";
    		return;
     	} else if((int)$_GET["tot-sp-chars"] < 1 || (int)$_GET["tot-sp-chars"] > 4) {
    		$error = "ERROR: Total special characters to be used must be between 1 to 4.";
    		return;
        } else if(($_GET["use-separator"] != "!") &&
                ($_GET["use-separator"] != "@") &&
                ($_GET["use-separator"] != "#") &&
                ($_GET["use-separator"] != "$") &&
                ($_GET["use-separator"] != "%") &&
                ($_GET["use-separator"] != "^") &&
                ($_GET["use-separator"] != "&") &&
                ($_GET["use-separator"] != "*") &&
                ($_GET["use-separator"] != "-") &&
                ($_GET["use-separator"] != "space") &&
                ($_GET["use-separator"] != "none")) {
        	$error = "ERROR: Separator character must be from: -,!, @, #, $, %, ^, & or *.";
        	return;
        } else if((strtolower($_GET["word-case"]) <> "camel") &&
                    (strtolower($_GET["word-case"]) != "upper") &&
                    (strtolower($_GET["word-case"]) != "lower")) {
    		$error = "ERROR: Word case must be Upper, Lower or Camel.";
    		return;
        } else {
            $error = "";
        }
    }

    #Initialize a varibale with words' file folder address
    $wordFile = 'data/words.json';

    /*
        First check if the words file exist.
        If the words file does not exist grab words from Paul's website, create a new file
        and save the words there in JSON format
    */
    if (!file_exists($wordFile)) {

        #Intialization
        define("PAULS_SITE_MAX_PAGE", 30); //Define a constant on how many pages Paul's site has
        $urls = [];
        $allWords = [];

        #Create an array with all page urls
        for($i = 0; $i < PAULS_SITE_MAX_PAGE; $i++){
            if($i % 2 == 0){
                $urls[] = "http://www.paulnoll.com/Books/Clear-English/words-". sprintf('%02d', $i + 1) . "-" . sprintf('%02d', $i + 2) . "-hundred.html";
            }
        }

        $pattern = '~<li>(.*?)</li>~s'; //Declare the pattern. All words are in between a html <li></li> tag

        #Loop through all the pages and dump all the words to pwWords array
        foreach($urls as $url) {
            $wordPage = file_get_contents($url);
            preg_match_all ($pattern, $wordPage, $allWords);
            foreach($allWords[0] as $word){
                $pwWords[] = $word;
            }
        }

        #Now create a JSON string from the words retrieved
        $jsonString = "{";
        $i = 0;
        foreach($pwWords as $pwWord){
            $pwWord = trim(str_replace("<\li>","",str_replace("<li>","",$pwWord)));
            $pwWord = str_replace(" ","",$pwWord);
            $jsonString = $jsonString . '"' . $i . '":' . '"' . $pwWord . '",';//echo $pwWord;
            $i++;
        }
        $jsonString = $jsonString . "}";
        #echo $jsonString; //Check the output - for debugging

        #Save the JSON string in the "words.json" file in the "data" folder
        file_put_contents($wordFile, $jsonString);

        /*ALternate way opening and saving the data in a new file*/
        /*-------------------------------------------------------*/
        //$myfile = fopen($wordFile, "w") or die("Unable to open file!");
        //fwrite($myfile, $jsonString);
        //fclose($myfile);
    }

    /*
        Now read the query string and create the password by retrieving
        words from the locally saved file
    */
    #Pull the words from the local file into an array
    if (file_exists($wordFile)) { //Double checking if the file exists
        $jsondata = file_get_contents($wordFile);
        $allWords = json_decode($jsondata,true);
    }

    #Randomly select the no of words user have asked for and save them into useWords[] array
    #Before saving them into an array, also convert them to the case users asked for
    $useWords = [];
    $i = 1;
    if (isset($_GET["tot-words"])){
        while($i <= $_GET["tot-words"]){
            $index = rand(0,count($allWords)-1); //Randomly select a key
            if(!in_array(trim($allWords[$index]),$useWords)){ //Make sure that the word is not already picked
                if($_GET["word-case"] == "upper") {
                    $useWords[] = strtoupper(trim($allWords[$index]));
                } else if($_GET["word-case"] == "lower") {
                    $useWords[] = strtolower(trim($allWords[$index]));
                } else if($_GET["word-case"] =="camel") {
                    $useWords[] = ucwords(trim($allWords[$index]));
                } else {
                    $useWords[] = trim($allWords[$index]);
                }
                $i++;
            }
        }
    }
    #Pick the numbers to be added
    $n = -1;
    $useNumbers = "";
    $j = 1;
    if (isset($_GET["tot-numbers"])){
        while($j <= $_GET["tot-numbers"]){
            $n = rand(0,9); //Randomly select a key
            if(strpos($useNumbers, (string)$n) === false){ //Make sure that the digit is not repeated
                $useNumbers = $useNumbers . $n;
                $j++;
            }
        }
    }
    #Pick the special characters to be added
    const SPECIAL_CHARS = ["!", "@","#","$","%","^","&","*"];
    $useSpecialChars = "";
    $k = 1;
    if (isset($_GET["tot-sp-chars"])){
        while($k <= $_GET["tot-sp-chars"]){
            $index = rand(0,count(SPECIAL_CHARS)-1); //Randomly select an index
            $c = SPECIAL_CHARS[$index]; //Find the spceial character with that index
            if(strpos($useSpecialChars, $c) === false){ //Make sure that the special character is not repeated
                $useSpecialChars = $useSpecialChars . $c;
                $k++;
            }
        }
    }

    #Find the separator to be used
    if (isset($_GET["use-separator"])){
        if($_GET["use-separator"] == "space"){
            $separator = " ";
        } else if($_GET["use-separator"] == "none"){
            $separator = "";
        } else {
            $separator = $_GET["use-separator"];
        }
    }

    #Build the password
    #Concatenate the words with selected separator
    $suggestedPassword = "";
    foreach($useWords as $key => $useWord){
        if($key < (count($useWords) - 1)){
            $suggestedPassword = $suggestedPassword . $useWord . $separator;
        } else { //Don't add the sperator after the last word
            $suggestedPassword = $suggestedPassword . $useWord;
        }
    }

    #Add the numbers and special characters at the end
    $suggestedPassword = $suggestedPassword . $useSpecialChars . $useNumbers;
