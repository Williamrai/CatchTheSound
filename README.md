# CatchTheSound

Catch The Sound is a light and memory game. The game starts with a combination of light and sound, and adds up a sequence after each turn. 
The purpose of this game is to make players remeber and take action quickly. 

- After the player starts the game
- A sequence is played
- On each turn player gets 5 sec to hit the sequence played by the computer
- To win the Game player needs to hit all the sequence presented at each turn

## Game Walkthrough

![Application Walkthrough](catch_sound.gif)
---
![](catch_sound2.gif)
---
![](catch_sound3.gif)

## Site
https://catch-my-sound.glitch.me


If you used any outside resources to help complete your submission (websites, books, people, etc) list them here.
## Resources Used
- Stack Overflow 
- https://css-tricks.com/

## Challenges
The challenge for this submission was the bugs you would get while working on the main logic of the game. When I was writing the script for the main logic of this game, some of the functions were not working as expected. For example, the sound of the game was not working and to make it work I had to add this code
```javascript=
var contextClass = (window.AudioContext || 
    window.webkitAudioContext || 
    window.mozAudioContext || 
    window.oAudioContext || 
    window.msAudioContext);
```

What was a challenge you encountered in creating this submission (be specific)? How did you overcome it? (recommended 200 - 400 words)
What questions about web development do you have after completing your submission? (recommended 100 - 300 words)
If you had a few more hours to work on this project, what would you spend them doing (for example: refactoring certain functions, adding additional features, etc). Be specific. (recommended 100 - 300 words)
