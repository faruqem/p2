var U ={
        //Display a message in the console
        consoleMsg: function(msgToDisplay){
            "use strict";
            console.log(msgToDisplay);
        }, //End of consoleMsg

        //Alert a message
        alertMsg: function(msgToDisplay){
            "use strict";
            alert(msgToDisplay);
        }, //End of alertMsg. Direct alert will be faster.

        //Display message in a html output element
        elementOutput: function(elementId, message){
            var elem = document.getElementById(elementId);
            elem.innerHTML = message;
        }, //End of elementOutput function
        
        //Find a element id
        findElem: function(elementId){
            return document.getElementById(elementId);
        }, //End of find id
        
        //Pad a mumeric value with leading zero(s)
        padNumber: function(num, strLen){
            //Check if the desired length is supplied otherwise set it to two
            if (!strLen){
                strLen = 2;
            }
            
            //If num is not defined set it to zero
            if (!num){
                num = 0;
            }
            
            //Pad the number
            var strNum =  num + "";
            while(strNum.length < strLen){
                strNum = "0" + strNum;
            }
            return strNum;
        }, //End of padNumber
                
        //Display format for duration given in seconds in (h:m:s)
        formatTime: function(durationInSec){
            var secPart = 0;
            var minPart = 0;
            var hrPart = 0;

            if(durationInSec){
                secPart = durationInSec % 60;
            }

            if(durationInSec && durationInSec >= 60){
                minPart = Math.floor(durationInSec / 60);
            }

            if(minPart && minPart >= 60){
                    hrPart = Math.floor(minPart / 60);
                minPart = minPart % 60;
            }

            return (hrPart == 0 ? this.padNumber(minPart) + ":"+ this.padNumber(secPart) : this.padNumber(hrPart) + ":" + this.padNumber(minPart) + ":" +this.padNumber(secPart));
        }, //End of formatTime
        
        //Generate a random integer in a range
        
        generatePositiveRandomInt: function(minInt, maxInt) {
            var ranNum;          
            if(minInt == 0){
                ranNum = Math.floor((Math.random() * (maxInt + 1)));
            } else {
                ranNum = Math.floor((Math.random() * maxInt) + minInt);
                ranNum = (ranNum <= maxInt ? ranNum:maxInt); 
            }
            return ranNum;
        }
}; //End of U declaration