
//Everything is wrapped in this self invoking function to prevent un-wanted global exposure of any variable
//Though it may look redundant in this particular case since all variables are declared within init() function
//anyway, nonetheless it is used as a best practice.

//While developing the solution I followed convention over configuration and defined a particular
//folder structure and use that info to write my code

/************************************************************************************************************
Highlights from MDN documentation which I kept in mind while working through this app:
- Negative values don't currently play the media backwards
- Most browsers stop playing audio outside playbackRate bounds of 0.5 and 4, leaving the video playing silently.
- It's therefore recommended for most applications that you limit the range to between 0.5 and 4.
- IE9+ will switch to the default playback rate when an ended event is fired.
**************************************************************************************************************/

(function(){ //Wrapper self invoking anonymus function

    window.onload = init; //Call init after window is loaded

    function init(){

        "use strict";

        /*Conventions followed and constants defined for this app*/
        /*-------------------------------------------------------*/
        var MEDIA_DATA_FOLDER = "data/"; //This is where all media data are kept in JSON format - one summary file and one file for each media
        var MEDIA_SOURCE_FOLDER = "videos/"; //This is where all actual media files are saved
        var MEDIA_POSTER_FOLDER = "images/poster/"; //This is where all media poster images are saved in jpg format
        var VIDEO_LIST_FILE = "video-list.json"; //Holds summary information for all video medias inside the "data"" folder
        var SMALL_VIDEO_SIZE = 460;
        var MEDIUM_VIDEO_SIZE = 640;
        var LARGE_VIDEO_SIZE = 800;
        var VOL_SLIDER_WIDTH = 100
        var DEFAULT_START_VOLUME_LEVEL = .5;
        //var AUDIO_LIST_FILE = "audio-list.json"; //This is kept for any audio medias which is not implemented
        /*------------------------------------------------------*/


        //HTML DOM Element Placeholders for Custom Media Controls
        //Declare and retrieve all html DOM elements using U.findElem() utility function defined in js/utility.js
        /*******************************************************************************************************/
        var spnSubtitle = U.findElem("spn-subtitle");
        var mediaPlayerCol = U.findElem("media-player-col");
        var playList = U.findElem("play-list");
        var chkLoop = U.findElem("chk-loop");
        var chkPlayAll = U.findElem("chk-play-all");
        var btnPlayPause = U.findElem("btn-play-pause");
        var btnMuteUnmute = U.findElem("btn-mute-unmute");
        var btnStop = U.findElem("btn-stop");
        var btnReplay = U.findElem("btn-replay");
        var btnFullscreen = U.findElem("btn-fullscreen");
        var spnBuffer = U.findElem("spn-buffer");
        var spnTimePlayed = U.findElem("spn-time-played");
        var tdTimePlayed = U.findElem("td-time-played");
        var rngSlider = U.findElem("rng-slider");
        var vidSizeSmall = U.findElem("vid-size-small");
        var vidSizeMedium = U.findElem("vid-size-medium");
        var vidSizeLarge = U.findElem("vid-size-large");
        var vidSizeFullscreen = U.findElem("vid-size-fullscreen");
        var volSlider = U.findElem("vol-slider");
        var vidSpeedSlower = U.findElem("vid-speed-slower");
        var vidSpeedSlow = U.findElem("vid-speed-slow");
        var vidSpeedNormal = U.findElem("vid-speed-normal");
        var vidSpeedFast = U.findElem("vid-speed-fast");
        var vidSpeedFaster = U.findElem("vid-speed-faster");
        /*******************************************************************************************************/


        //Declare other variables within the scope of init() function that should be accssible to other functions within
        /***************************************************************************************************************/
        var mediaListFile;
        var mediaList;
        var totDataFiles;
        var nextMediaIndex;
        var playedMediaIndexes;
        var mediaInfoFile;
        var mediaDetail;
        var mediaFile;
        var mediaType;
        var mediaPoster;
        var mediaTitle;
        var mediaPlayerSource;
        var mediaNotSupportedWarningMsg;
        var mediaPlayer;
        var volSliderNumVal;
        var initialVideoSize;
        var startVolumeLevel;
        var initializationDataObj;
        var retrievedInitializationDataObj;
        /***************************************************************************************************************/


        //Initialize some variables
        /**********************************************************/
        mediaListFile = MEDIA_DATA_FOLDER + VIDEO_LIST_FILE; //This is video-list.json file and it's location
        playedMediaIndexes = [];
        //vidSizeMedium.checked = true; //Initial video size is set to medium which is 640
        initialVideoSize = MEDIUM_VIDEO_SIZE;
        startVolumeLevel = .5;

        //Retreive any initialization data from the local storage and update the playerIntializationData object
        retrievedInitializationDataObj = retrievePlayerInitializationData();

        if(!retrievedInitializationDataObj){
            //If no previous setup available from the local storage, set them to default and also update the loca storage for the next time
            initialVideoSize = MEDIUM_VIDEO_SIZE;
            startVolumeLevel = DEFAULT_START_VOLUME_LEVEL;

            //Call savePlayerInitializationData() function to save this data to the local storage
            savePlayerInitializationData(initialVideoSize, startVolumeLevel);
         } else { //Update them with retrieved value from the local storage
            initialVideoSize = retrievedInitializationDataObj.size;
            startVolumeLevel = retrievedInitializationDataObj.volume;
         }

        //Set the video size check box according to the initial video size
        switch(initialVideoSize){
            case SMALL_VIDEO_SIZE:
                vidSizeSmall.checked = true;
                break;
            case MEDIUM_VIDEO_SIZE:
                vidSizeMedium.checked = true;
                break;
            case LARGE_VIDEO_SIZE:
                vidSizeLarge.checked = true;
                break;
        }
        /**********************************************************/


        //Call the createMediaPlayer() function to create the media player and set it up with initial media to play
        createMediaPlayer();


        //Create the media player and set it with intial media to play
        /*************************************************************/
        function createMediaPlayer(){

            //First retrieve the neccasy media information
            getMediaInfo();

            //Create necessaru DOM elements, set their attributes and contents
            mediaPlayerSource = document.createElement("SOURCE"); //Create media player source element
            mediaPlayerSource.setAttribute("src",mediaFile);
            mediaPlayerSource.setAttribute("type",mediaType);
            mediaNotSupportedWarningMsg = document.createTextNode("Sorry media is not supported in your browser!"); //Create browser does not support media functionality warning message
            mediaPlayer = document.createElement("VIDEO"); //Create the video player media element
            mediaPlayer.setAttribute("Width", initialVideoSize); //Set initial video size
            mediaPlayer.setAttribute("poster",mediaPoster);
            mediaPlayer.controls = false; //Disable default controls
            mediaPlayer.appendChild(mediaPlayerSource); //Add source
            mediaPlayer.appendChild(mediaNotSupportedWarningMsg); //Add media not supported warning message
            mediaPlayerCol.appendChild(mediaPlayer); //Add media player to the space holder html table column
            spnSubtitle.innerHTML = mediaTitle; //Put the media title in the table row kep for subtitle
            rngSlider.style.width = (initialVideoSize - 15) +"px";
            vidSpeedNormal.checked = true; //Initial playback rate is set to normal i.e. 1
            //Call the create play list function to create the play list from the data retrieve from video-list.json file
            createPlayList();

        } //End of createMediaPlayer() function
        /*************************************************************/


        //Retrieve media information from the summary "video-list.json" data file saved in "data" folder using AJAX.
        /***************************************************************************************************/
        function getMediaInfo(){
            //Call the loadMediaList() function to load intial media information passing the media list
            //file mediaListFile = "data/video-list.json""
            mediaList = loadMediaList(mediaListFile); //Get the medial list data object using AJAX

            totDataFiles = mediaList.dataFiles.length; //Count total media data files available

            //Retrieve a random index within range to setup the first media file to play
            nextMediaIndex = U.generatePositiveRandomInt(0, totDataFiles - 1);
            playedMediaIndexes.push(nextMediaIndex); //Save it into an array

            mediaInfoFile = MEDIA_DATA_FOLDER + mediaList.dataFiles[nextMediaIndex].fileName;
            mediaDetail = loadMediaInfo(mediaInfoFile);
            //var mediaFile = MEDIA_SOURCE_FOLDER + mediaDetail.sourceFile;
            mediaFile = MEDIA_SOURCE_FOLDER + mediaList.dataFiles[nextMediaIndex].fileName.substring(0,19)+".mp4";
            mediaType = mediaDetail.type+"/"+ mediaDetail.format;
            //var mediaPoster = MEDIA_POSTER_FOLDER + mediaDetail.poster;
            mediaPoster = MEDIA_POSTER_FOLDER + mediaList.dataFiles[nextMediaIndex].fileName.substring(0,19)+".jpg";
            mediaTitle = mediaList.dataFiles[nextMediaIndex].title; //mediaDetail.title;
        } //End of getMediaInfo()
        /***************************************************************************************************/


        //Create a media play list
        //Create necessary DOM elements, and set their attributes and contents with necessary event listeners
        /****************************************************************************************************/
        function createPlayList(){
            //Loop through media list object and add the information to an HTML ordered list element
            for(var i = 0; i < mediaList.dataFiles.length; i++){
                var txtNode = document.createTextNode(mediaList.dataFiles[i].title
                            + "..." +mediaList.dataFiles[i].duration);
                var li = document.createElement("LI");
                var fileId = mediaList.dataFiles[i].fileName.substring(0,19);

                li.appendChild(txtNode);
                li.setAttribute("id",fileId);
                li.style.color = "#33C3F0";
                li.setAttribute("title","Click to play.");
                li.addEventListener("click",function(){playMedia(this.id, this.innerHTML)}, false);
                li.addEventListener("dblclick",function(){playMedia(this.id, this.innerHTML)}, false);
                li.addEventListener("mouseover",function(){
                    this.style.cursor ="pointer";
                    //this.style.border="3px solid #EE7600";
                    this.style.color = "#000000";
                    this.style.background="#EE7600"
                }, false);
                li.addEventListener("mouseout",function(){
                    this.style.cursor ="";
                    //this.style.border="";
                    this.style.color = "#33C3F0";
                    this.style.background="";
                }, false);
                playList.appendChild(li);
            }
        } //End of createPlayList() function
        /****************************************************************************************************/


        //Play media function is called when a list is clicked or double clicked to play
        //the particular media matching the passed index
        /******************************************************************************/
        function playMedia(fileId, title){
            var mediaPosterFile = MEDIA_POSTER_FOLDER + fileId + ".jpg";
            var mediaSourceFile = MEDIA_SOURCE_FOLDER + fileId + ".mp4";
            var mediaTitle = title.substring(0,title.indexOf(".") + 1); //Get the title by discarding the time portion of the list text.
            spnSubtitle.innerHTML = mediaTitle;
            mediaPlayerSource.setAttribute("src",mediaSourceFile);
            mediaPlayer.setAttribute("poster",mediaPosterFile);
            mediaPlayer.load();
            mediaPlayer.play();
            btnPlayPause.setAttribute("src","images/pause-cyan.png");
        }  //End of playMedia() function
        /******************************************************************************/

        //Add an event listener for current play ends
        //and call whenPlayEnds() function to take next steps
        mediaPlayer.addEventListener("ended", whenPlayEnds, false);

        //whenPlayEnds() function decides what to do when current play ends.
        /******************************************************************/
        function whenPlayEnds(){
            if(playedMediaIndexes.length == totDataFiles){
                stopPlaying();
                playedMediaIndexes = [];
                playedMediaIndexes.push(nextMediaIndex);
                return;
            } //If all media files are played at least once stop the player.

            if(!chkPlayAll.checked){
                stopPlaying();
                return;
            } //If "Play All"" check box is uncheked stop the player after playing the currently loadaed media once

            nextMediaIndex = U.generatePositiveRandomInt(0, totDataFiles - 1);
            while(playedMediaIndexes.indexOf(nextMediaIndex) >= 0 && totDataFiles != 1) {
                nextMediaIndex = U.generatePositiveRandomInt(0, totDataFiles - 1);
            } //Do not pick the media that's already played in the current cycle

            playedMediaIndexes.push(nextMediaIndex);
            var fileId = mediaList.dataFiles[nextMediaIndex].fileName.substring(0,19);
            var title = mediaList.dataFiles[nextMediaIndex].title;

            playMedia(fileId, title); //Call play media passing the medai file ID and title
        } //End of whenPlayEnds function
        /******************************************************************/


        //Some common event listeners when medai player first start to play or when playing ends.
        /***************************************************************************************/
        //When the media player starts to play.
        mediaPlayer.addEventListener("playing", function(){btnPlayPause.setAttribute("src","images/pause-cyan.png");
            btnPlayPause.setAttribute("title","Pause");
        });

        //When media player ends playing
        mediaPlayer.addEventListener("ended", function(){btnPlayPause.setAttribute("src","images/play-cyan.png");
            btnPlayPause.setAttribute("title","Play");
        });
        /***************************************************************************************/


        //Add event listener to all medai controls in the following section
        /*----------------------------------------------------------------*/

        //Play-Pause button
        //------------------
        //On Click
        btnPlayPause.addEventListener("click", function(){
            if(!mediaPlayer.paused){
                mediaPlayer.pause();
                btnPlayPause.setAttribute("src","images/play-cyan.png");
            } else{
                mediaPlayer.play();
                btnPlayPause.setAttribute("src","images/pause-cyan.png");
            }
            btnStop.disabled = false;
            btnReplay.disabled = false;
        }, false);
        //On Mouseover
        btnPlayPause.addEventListener("mouseover", function(){btnPlayPause.style.cursor="pointer"; btnPlayPause.style.border="3px solid #EE7600";
             if(!mediaPlayer.paused){
                btnPlayPause.setAttribute("title","Pause");
            } else{
                btnPlayPause.setAttribute("title","Play");
            }
        }, false);
        //On Mouseout
        btnPlayPause.addEventListener("mouseout", function(){btnPlayPause.style.cursor="";
            btnPlayPause.style.border="3px solid #ffffff";}, false);


        //Mute-Unmute Button
        //------------------
        //On Click
        btnMuteUnmute.addEventListener("click", function(){
            if(mediaPlayer.muted == true){
                mediaPlayer.muted = false;
                btnMuteUnmute.setAttribute("src","images/mute-cyan.png");
            }else{
                mediaPlayer.muted = true;
                btnMuteUnmute.setAttribute("src","images/full_volume-cyan.png");
            }
        }, false);
        //On Mouseover
        btnMuteUnmute.addEventListener("mouseover", function(){btnMuteUnmute.style.cursor="pointer"; btnMuteUnmute.style.border="3px solid #EE7600";
                            if(mediaPlayer.muted == true){
                                btnMuteUnmute.setAttribute("title","Unmute");
                            }else{
                                btnMuteUnmute.setAttribute("title","Mute");
                            }}, false);
        //On Mouseout
        btnMuteUnmute.addEventListener("mouseout", function(){btnMuteUnmute.style.cursor=""; btnMuteUnmute.style.border="3px solid #ffffff";}, false);

        //Stop Button
        //-----------
        //On Click
        btnStop.addEventListener("click", stopPlaying, false);
        function stopPlaying() {
            btnPlayPause.setAttribute("src","images/play-cyan.png");
            btnPlayPause.setAttribute("title","Play");
            mediaPlayer.load();
        }
        //On Mouseover
        btnStop.addEventListener("mouseover", function(){btnStop.style.cursor="pointer"; btnStop.style.border="3px solid #EE7600"; btnStop.setAttribute("title","Stop");}, false);
        //On Mouseout
        btnStop.addEventListener("mouseout", function(){btnStop.style.cursor=""; btnStop.style.border="3px solid #ffffff";}, false);

        //Replay Button
        //-------------
        //On Click
        btnReplay.addEventListener("click", function(){
            mediaPlayer.currentTime = 0.1;
            btnReplay.disabled = true;
        }, false);
        //On Mouseover
        btnReplay.addEventListener("mouseover", function(){btnReplay.style.cursor="pointer"; btnReplay.style.border="3px solid #EE7600"; btnReplay.setAttribute("title","Reverse");}, false);
        //On Mouseout
        btnReplay.addEventListener("mouseout", function(){btnReplay.style.cursor=""; btnReplay.style.border="3px solid #ffffff";}, false);

        //Fullscreen Button
        //------------------
        //On Click
        btnFullscreen.addEventListener("click", setFullscreen, false);
        //On Mouseover
        btnFullscreen.addEventListener("mouseover", function(){btnFullscreen.style.cursor="pointer";
            btnFullscreen.style.border="3px solid #EE7600"; btnFullscreen.setAttribute("title","Fullscreen");
        }, false);
        //On Mouseout
        btnFullscreen.addEventListener("mouseout", function(){btnFullscreen.style.cursor="";
            btnFullscreen.style.border="3px solid #ffffff";
        }, false);


        //Set the media player to fullscreen
        //Fullscreen functionality is not fully stnadardized yet. Different browse works differently.
        //-------------------------------------------------------------------------------------------
        function setFullscreen(){
            if (mediaPlayer.requestFullscreen) {
                mediaPlayer.requestFullscreen(); //Default/Others
            } else if (mediaPlayer.msRequestFullscreen) {
                mediaPlayer.msRequestFullscreen(); //Internet Explorer
            } else if (mediaPlayer.mozRequestFullScreen) {
                mediaPlayer.mozRequestFullScreen(); //Firefox
            } else if (mediaPlayer.webkitRequestFullscreen) {
                mediaPlayer.webkitRequestFullscreen(); //Chrome
            }
         }

        //Loop Button
        //-----------
        //On Click
        chkLoop.addEventListener("click", function(){
                    if(chkLoop.checked){
                        mediaPlayer.loop = true;
                    } else{
                        mediaPlayer.loop = false;
                    }
         }, false);

        //Function to display buffering information
        //Since sample veideo files are loaded from the local file system no buffering happens
        //------------------------------------------------------------------------------------
        mediaPlayer.addEventListener("progress", showBufferingProgress, false);
        function showBufferingProgress(){
             if (mediaPlayer.buffered.length - 1 >= 0){ //First check if any buffered range is available
                //If a buffer range is available show info for the last range. Usually there is one range
                //and the index for that range should be zero(0)
                spnBuffer.innerHTML = "Download Status: " + mediaPlayer.buffered.end(mediaPlayer.buffered.length - 1) + "/" + mediaPlayer.duration;
             } else {
                spnBuffer.innerHTML = "Download Status: Information not available!";
             }
         } //End of showBufferingProgress() function


         //Range Slider for Video Seek
         //-----------------------------------------------------------------------------------------
         tdTimePlayed.setAttribute("align","right");
         tdTimePlayed.style.color = "#33C3F0";
         spnTimePlayed.style.paddingRight = "5px";
         //Time update event listener
         mediaPlayer.addEventListener("timeupdate", updatePlayTime)
         //Function to update play time when timeupdate event fires
         function updatePlayTime() {
             rngSlider.value = (100 / mediaPlayer.duration) * mediaPlayer.currentTime;
             spnTimePlayed.innerHTML = U.formatTime(mediaPlayer.currentTime.toFixed(0)) + "/" + U.formatTime(mediaPlayer.duration.toFixed(0));
         } //End of function updatePlayTime()
         //Change event listener for range input
         rngSlider.addEventListener("change", setPlayPosition)
         // Function to set play position when range input element's change event is fired based on user's dragging the play position mark
         function setPlayPosition(){
             mediaPlayer.currentTime = (rngSlider.value / 100) * mediaPlayer.duration;
         } //End of setPlayPosition() function
         rngSlider.addEventListener("mouseover", function(){rngSlider.style.cursor="pointer"; rngSlider.style.border="3px solid #EE7600";
            rngSlider.setAttribute("title","Seek Video");
         }, false);
         rngSlider.addEventListener("mouseout", function(){rngSlider.style.cursor=""; rngSlider.style.border="3px solid #33C3F0";}, false);
         //--------------------------------------------------------------------------------------------

         //Video Size checkboxes click event listeners
         vidSizeSmall.addEventListener("click", function(){setVideoSize(SMALL_VIDEO_SIZE);}, false);
         vidSizeMedium.addEventListener("click", function(){setVideoSize(MEDIUM_VIDEO_SIZE);}, false);
         vidSizeLarge.addEventListener("click", function(){setVideoSize(LARGE_VIDEO_SIZE);}, false);
         //Function to set the video size based on user input
         //--------------------------------------------------
         function setVideoSize(vidSize){
             mediaPlayer.setAttribute("Width",vidSize);
             rngSlider.style.width = (vidSize - 15) +"px";

             //Update local storage to remember user choice for the next time
             initialVideoSize = vidSize;
             savePlayerInitializationData(initialVideoSize, startVolumeLevel);
         } //End of vidSize function()


         //Volume Control Slider
         //---------------------
         volSlider.style.width = VOL_SLIDER_WIDTH + "px";
         //Initialization
         volSliderNumVal = startVolumeLevel * VOL_SLIDER_WIDTH;
         volSlider.value = volSliderNumVal;
         mediaPlayer.volume = startVolumeLevel;
         //Add change event listener to volume slider range input element
         volSlider.addEventListener("change", setVolume)
         //Set volume when volume slider's range input element's change event fires based on user's dragging the handle
         function setVolume(){
             mediaPlayer.volume = (volSlider.value / VOL_SLIDER_WIDTH); //1/100th will represent .01

             //Set the new user preference to the local storage
             startVolumeLevel = (volSlider.value/VOL_SLIDER_WIDTH).toFixed(2);
             savePlayerInitializationData(initialVideoSize, startVolumeLevel);
         } //End of function setVolume()

         volSlider.addEventListener("mouseover", function(){volSlider.style.cursor="pointer"; volSlider.style.border="3px solid #EE7600"; volSlider.setAttribute("title","Control Volume");}, false);
         volSlider.addEventListener("mouseout", function(){volSlider.style.cursor=""; volSlider.style.border="3px solid #33C3F0";}, false);


         //Video Speed checkboxes and their click event listeners
         //------------------------------------------------------
         vidSpeedSlower.addEventListener("click", function(){setVideoSpeed(.5);}, false);
         vidSpeedSlow.addEventListener("click", function(){setVideoSpeed(.75);}, false);
         vidSpeedNormal.addEventListener("click", function(){setVideoSpeed(1);}, false);
         vidSpeedFast.addEventListener("click", function(){setVideoSpeed(2);}, false);
         vidSpeedFaster.addEventListener("click", function(){setVideoSpeed(4);}, false);
         //Function to cahnge playback rate based on users' input
         function setVideoSpeed(pbrate){
              mediaPlayer.playbackRate = pbrate;
         } //End of vidSize function()

         //End of all event listeners
         /*----------------------------------------------------------------*/


        //loadMediaList from JSON data using AJAX
        //This is to retrieve available medai list from the video-list.json file saved in the "data" folder
        /*************************************************************************************************/
        function loadMediaList(mediaListFile) {
	        var xhttp = new XMLHttpRequest();

            //Asynchronus call code commented out
            /*xhttp.addEventListener("readystatechange", loadInfo, false)
	        function loadInfo() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    var mediaListStr = xhttp.responseText;
			        var mediaListObj = JSON.parse(mediaListStr);
			        return mediaListObj;
		        }//End of IF
            }; //End of onreadystatechange anonymus function
            xhttp.open("GET", videoInfoFile, true);*/ //Asynchronus call ends

            //Synchronus call is used since app needs to wait for this info anyway
            xhttp.open("GET", mediaListFile, false);
            xhttp.send();
            var mediaListStr = xhttp.responseText;
			var mediaListObj = JSON.parse(mediaListStr);
			return mediaListObj;
		 } //End of loadMediaList() function
         /*************************************************************************************************/


         //Load Media Detail Info from JSON data using AJAX
         //This is to load detail media info from the individual media file saved in the "data" folder
         /*************************************************************************************************/
         function loadMediaInfo(mediaInfoFile) {
	        var xhttp = new XMLHttpRequest();

            //Asynchronus call commented out since app needs to wait for this info
            /*xhttp.addEventListener("readystatechange", loadInfo, false)
	        function loadInfo() {
                if (xhttp.readyState == 4 && xhttp.status == 200) {
                    var videoInfoStr = xhttp.responseText;
                    var videoInfoObj = JSON.parse(videoInfoStr);
                    console.log(videoInfoObj.sourceFile);
                    return videoInfoObj;
		        }//End of IF
            }; //End of onreadystatechange anonymus function
            xhttp.open("GET", videoInfoFile, true);*/ //Asynchronus call ends

            //Synchronus call starts
            xhttp.open("GET", mediaInfoFile, false);
            xhttp.send();
            var mediaInfoStr = xhttp.responseText;
			var mediaInfoObj = JSON.parse(mediaInfoStr);
			//console.log(videoInfoObj.sourceFile);
			return mediaInfoObj;
		 } //End of loadMediaInfo() function
         /*************************************************************************************************/

        //Saving and retriving intial player setup data from the local storage
        /*********************************************************************/
        //Function to create new player initialization object
        function playerIntializationData(videoSize, mediaVolume) {
            this.size = videoSize;
            this.volume = mediaVolume;
	    } //End of playerIntialization() function


        //This function saves data to the local storage
        function savePlayerInitializationData(initialVideoSize, startVolumeLevel){
            initializationDataObj = new playerIntializationData(initialVideoSize, startVolumeLevel);
            var stringifiedInitializationDataObj = JSON.stringify(initializationDataObj);
            if(typeof(Storage) !== "undefined") { //Check if the browser supports local storage
			    localStorage.setItem("playerInitializationData", stringifiedInitializationDataObj);
		    } else {
			    console.log("Error log: browser does not support local storage!");
 		    }
        } //End of savePlayerInitializationData() function

        //Function to check and set if there is any existing player initialization data in the local storage
        function retrievePlayerInitializationData() {
            var parsedInitializationData;
            var initializationDataObj;
            if(typeof(Storage) !== "undefined") { //Check if the browser supports local storage
                //if(localStorage.playerInitializationData) {
				if(localStorage.playerInitializationData){
                    parsedInitializationData = JSON.parse(localStorage.playerInitializationData);
                    initializationDataObj = new playerIntializationData(parsedInitializationData.size, parsedInitializationData.volume);
                    return initializationDataObj;
                } //End of inner IF
            } else {
				console.log("Error log: Web local storage is not supported in this browser!");
			}//End of outer IF
        } //End of retrievePlayerInitializationData function
        /**********************************************************************/
    } //End of init() function

})(); //End of wrapping anonymus function