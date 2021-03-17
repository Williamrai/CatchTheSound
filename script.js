//Global Variables
//var pattern = [5,2, 2, 4, 3, 1, 2, 2, 4, 5, 6];  //keeps track of the pattern the button presses
var pattern = [];  //keeps track of the pattern the button presses
var progress = 0  //player current status
var gamePlaying = false //tracks whether the game is currently active
var guessCounter = 0; //keeps track of where user is in the clue sequence
var resume = false; //resume the audioContext
var mistakes = 2; //tracks the mistake made by the user
var life = document.getElementById("life") //for updating the life element
var time = document.getElementById("time") //clock timer for players
var timer = 5;
var timerVar;

//varibales for sound
var tonePlaying = false //tracks whether tone is playing or not
var volume = 0.5       //must be between 0.0 and 1.0

var clueHoldTime = 800;//how long to hold each clue's light/sound
const cluePauseTime = 33; //how long to pause in between clues
const nextClueWaitTime = 900; //how long to wait before starting playback of the clue sequence

var audioFiles = ["","Electronic-Tom-3","Electronic-Kick-2","Electro-Tom","Bass-Drum-3","Clap-1","Claves"]
const ext = ".wav";
const dir ="/assets/"
var audio = new Audio();
//end of variables


//StartGame()
function startGame(){
  progress = 0;
  gamePlaying = true;
  generatePattern();
  
  if(!resume){
    context.resume().then(() => {
        console.log('Playback resumed successfully');
      });
      resume = true;
  }
  
  //swap the Start and End Buttons
  document.getElementById("startBtn").classList.add("hidden");
  document.getElementById("endBtn").classList.remove("hidden");
  showChance();
  playClueSequence();

}//end StartGame()


//generate random pattern
function generatePattern(){
  let size = 10;
  let max = 6;
  for(let i=0;i<size;i++){
    pattern[i] = Math.ceil(Math.random() * max);
  }
}//end generatePattern()

//show the chance prompt
function showChance(){
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("chance_prompt").classList.remove("hidden");
  life.textContent = mistakes;
  time.innerHTML = timer;

}//end showChance()

//stopGame()
function stopGame(){
  gamePlaying = false;
  
  //swap the Start and End Buttons
  document.getElementById("startBtn").classList.remove("hidden");
  document.getElementById("endBtn").classList.add("hidden");
  
  //resets all variables
  clueHoldTime = 1000;
  mistakes = 2;
  clearTimer();
  hideChance();

}//end StartGame()

//hide the chance
function hideChance(){
  document.getElementById("welcome").classList.remove("hidden");
  document.getElementById("chance_prompt").classList.add("hidden");

}//end hideChance()


// Sound Synthesis Functions
//is called from playSingleClue
function playTone(btn,len){ 
  playAudio(btn);
  tonePlaying = true
  setTimeout(function(){
    stopTone()
  },len)

}//end of playTone

//when player pressed the box
//plays the sound
function startTone(btn){
    if(!resume){
        context.resume().then(() => {
            console.log('Playback resumed successfully');
          });
    }
    playAudio(btn);
   
}//end startTone()

//stops sound when mouse is released
function stopTone(){
    g.gain.setTargetAtTime(0,context.currentTime + 0.05,0.025)
    tonePlaying = false

}//end stopTone()

//gets the sounds from the assets
//and connects it to audio object
//and plays the sound
function playAudio(btn){
  audio.src = dir+audioFiles[btn]+ext;
  console.log("btn: ",btn);
  audio.loop = false;
  audio.play();

}//end playAudio()

//end of Sound Synthesis functons


/* sequence of play*/
function playSingleClue(btn){
  if(gamePlaying){
    lightButton(btn);
    playTone(btn,clueHoldTime);
    setTimeout(clearButton,clueHoldTime,btn);
  }

}//end playSingleClue()

//when start button pressed
//takes random pattern and play in a sequence
//after sequnece ends a timer runs and 
//players needs to catch the sound within that time
function playClueSequence(){
  guessCounter = 0;
  const holdTime = 800;
  let delay = nextClueWaitTime; //set delay to initial wait time
  for(let i=0;i<=progress;i++){ // for each clue that is revealed so far
    setTimeout(playSingleClue,delay,pattern[i]) // set a timeout to play that clue
    delay += clueHoldTime 
    delay += cluePauseTime;
  }
  setTimeout(startIntervalForTimer,delay);
  console.log(clueHoldTime)
  clueHoldTime = clueHoldTime - Math.floor(holdTime / (pattern.length)); //speeds up the sequence
}
/* end sequence of play*/


//starts the interval for the clock timer
function startIntervalForTimer(){
  timerVar = setInterval(startTimer, 1000);  //sets the setInterval to timerVar
  //timerVar will be used later to clear interval

}//end  startIntervalForTimer()


//starts the countdown of the clock timer
function startTimer(){
  timer--;
  time.innerHTML = timer;
  if(timer == 0){
    loseGame();
  }
}//end startTimer()


/*win lose */
function loseGame(){
  if(timer == 0){
    setTimeout(function(){alert("Times up. Game Over. You lost.");},50);
  }else{
    setTimeout(function(){alert("Game Over. You lost.");},50);
  }
  stopGame();
  
}// end loseGame()


function winGame(){
  stopGame();
  alert("You won. Congratulations!")

}//end winGme()

/*end of win lose functions*/


/*Guesses Handlings*/
function guess(btn){
   console.log("user guessed: " + btn);
  if(!gamePlaying){
    return;
  }
  
  //handling guesses
  if(btn == pattern[guessCounter]){
    if(guessCounter == progress){
      if(progress == (pattern.length)-1){
        winGame();
      }else{
        clearTimer();
        time.innerHTML = timer;
        progress++;
        playClueSequence()
      }
    }else{
      guessCounter++;
    }
  }else{
    mistakes--;
    life.innerHTML = mistakes;
    if(mistakes == 0){
      loseGame()
    }
    
  }

}//end guess()

/*end Guesses Handling*/

/* light and clear button*/
function lightButton(btn){
  document.getElementById("button"+btn).classList.add("lit")
}

function clearButton(btn){
  document.getElementById("button"+btn).classList.remove("lit")
}

/*end of light and clear button */

//clears the timer
function clearTimer(){
  timer = 5;
  clearInterval(timerVar);

}//end clearTimer()


//Page Initialization
// Init Sound Synthesizer
var contextClass = (window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext);

if (contextClass) {
  // Web Audio API is available.
  var context = new contextClass();
  var o = context.createOscillator()
  var g = context.createGain()
  g.connect(context.destination)
  g.gain.setValueAtTime(0,context.currentTime)
  o.connect(g)
  o.start(0)
  
} else {
  // Web Audio API is not available. Ask the user to use a supported browser.
  console.log("Web Audio API is not available. ")
}



