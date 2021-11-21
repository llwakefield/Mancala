// +++++++++++++++++++++++++++++++++++ state +++++++++++++++++++++++++++++++++++

// Set up the starting board
const initialBoard = [
  4, 4, 4, 4, 4, 4, 0, /* player 1 */ 4, 4, 4, 4, 4, 4, 0 /* player 2 */
]
// Declare the current board, which will be updated during the game
let board = [];
// Introduce a game state object, which will be updated throughout the game
const gameState = {
  board: board,
  currentPlayer: 0,
  p1Name: "",
  p2Name: ""
};
// Set up the game. Make the current board equal to the initial board. Set the current player to 0, which is player 1
function initialState(){
  board = [...initialBoard];
  gameState.currentPlayer = 0; // switch to 1 when the player swaps
}
// Enclose the entire set up within one function. Set up the board, collect the player names, display the player names, set the active CSS class to indicate whose turn it is and which pits are active.
function buildInitialState() {
  initialState();
  let p1NamePrompt = prompt("What's your name, Player 1?")
  switch(p1NamePrompt){
    default:
      text = alert(`Best of luck, ${p1NamePrompt}!`);
      gameState.p1Name = p1NamePrompt;
  }
  let p2NamePrompt = prompt("How may I call you, Player 2?")
  switch(p2NamePrompt){
    default:
      text = alert(`Best of luck, ${p2NamePrompt}!`);
      gameState.p2Name = p2NamePrompt;
  }
  $(".p1Name").text(gameState.p1Name)
  $(".p2Name").text(gameState.p2Name)

  setActiveClass();
  setActivePits();
}

// +++++++++++++++++++++++++++++++++++ render +++++++++++++++++++++++++++++++++++

// Set up a render function to be used to set up the game and after each turn.
function renderState() {
  // Append the number of seed images, which matches the value in that pit and the corresponding array index
  for(let i in board){
    let currPit = Number(board[i]);
    let pitId = Number(i);
    // Add a number of seed images equal to the value of the current pit. Use a while loop to append an image, counting down until the current pit value equals zero.
    while(currPit > 0){
      $(`#${pitId}`).append("<img src = seed.svg>")
      currPit--
    }
  // Update each player's score
  $(".p1Score").text(board[6]);
  $(".p2Score").text(board[13]);
  }
}
// Once the page loads, set up our game
$(document).ready(function() {
  buildInitialState();
  renderState();
})
// Function to set the "active" CSS class according to whose turn it is 
function setActiveClass(){
  if(gameState.currentPlayer === 0){
    $(".p1pits").addClass("active");
    $(".p1Name").addClass("active");
  } else {
    $(".p2pits").addClass("active");
    $(".p2Name").addClass("active");
  }
}
// Function to toggle the "active" CSS class for when you change turns
function toggleActiveClass(){
    $(".p1pits").toggleClass("active");
    $(".p1Name").toggleClass("active");
    $(".p2pits").toggleClass("active");
    $(".p2Name").toggleClass("active");
}


// +++++++++++++++++++++++++++++++++++ listeners +++++++++++++++++++++++++++++++++++

// Global variables needed for listener functions
let lastPit;
let nextPit;
// Create the engine for the game. When the board is clicked, move the seeds around the board, apply special rules, remove seed images before rendering to display the turn's results,
// determine if the game has ended, and change turns if necessary
function onBoardClick() {
  let clickedId = Number($(this).attr("id"))
  let clickedPitVal = board[clickedId];

  // Set value of the next pit, ensuring that we loop around the board
  whereToGo(clickedId);

  // Update board and loop around board as we distribute seeds
  whereToDropSeeds(clickedPitVal);
  
  // Test to see if your last seed landed in an empty pit on your side of the board. If so, capture your opponent's seeds in the opposite space, and move theirs and yours to your mancala.
  captureOppSeeds()

  // Empty the clicked pit since you moved its seeds around the board
  board[clickedId] = 0;

  // Remove all seed images before rendering and reloading board
  $("img").remove()

  // Determine if the game has ended. If not, do we need to change turns? If we change turns, let's set the active pits and classes.
  // After testing for end of game, render new state
  isItOver(lastPit);
}

// +++++++++++++++++++++++++++++++++++ helper functions for listeners +++++++++++++++++++++++++++++++++++


// What is the index value of the next pit that we're moving to? Pass in the ID of the clicked pit, which will correspond to its index value in the board array.
function whereToGo(clickedSpot){
  // Once you get to the end of the array, go back to 0.
  if ((clickedSpot + 1) <= (board.length - 1)){
    nextPit = clickedSpot + 1
  } else{
    nextPit = 0
  }
}

// Where should the seeds go? Pass in the value (i.e., how many seeds) of the clicked pit. Add one to the next pit, determine what the next pit should be, repeat loop until no seeds are left.
function whereToDropSeeds(clickedSpot){
  for(let i = clickedSpot; i > 0; i--){
    board[nextPit]++
  // Don't put the seeds in the other player's mancala, and keep looping around the board
    if((gameState.currentPlayer === 0 && nextPit === 12) || (nextPit === (board.length - 1))){
      nextPit = 0;
    } else if(gameState.currentPlayer === 1 && nextPit === 5){
      nextPit += 2
    } else {
      nextPit++;
    }
  }
}

// Test to see if your last seed landed in an empty pit on your side of the board. If so, move that seed and any of your opponent's from the opposite pit into your mancala.
function captureOppSeeds(){
  let oppositePitIndex;
  if (nextPit === 0){
    lastPit = 13;
  } else {
    lastPit = nextPit - 1;
  }
  if(board[lastPit] === 1 && gameState.currentPlayer === 0 && lastPit < 6){
    oppositePitIndex = $(".p2pits div").eq(lastPit).attr("id");
    board[6] += board[oppositePitIndex] + board[lastPit];
    board[oppositePitIndex] = 0;
    board[lastPit] = 0;
  } else if(board[lastPit] === 1 && gameState.currentPlayer === 1 && lastPit > 6 && lastPit < 13){
    oppositePitIndex = $(`#${lastPit}`).index();
    board[13] += board[oppositePitIndex] + board[lastPit];
    board[oppositePitIndex] = 0;
    board[lastPit] = 0;
  };
}

// Should we end the game? Test to see if the sum of either row of pits equals 0. If yes, initiate the end-of-game sequence. If not, determine whose turn it will be and render the new state.
function isItOver(lastPit){
  let p1PitTotal = 0;
  let p2PitTotal = 0;
// Add up P1 and P2 pits to see if they're empty
  for(let i = 0; i < 6; i++){
    p1PitTotal += board[i];
  } for(let i = 7; i < 13; i++){
    p2PitTotal += board[i];
  } if(p1PitTotal === 0 || p2PitTotal === 0){
    gameOver(p1PitTotal, p2PitTotal);
    renderState();
    whoWon(p1PitTotal, p2PitTotal);
    resetGame();
  } else {
    whoseTurn(lastPit);
    renderState();
  }
}

// Whose turn is it now? Did the current player's last seed land in their own mancala, allowing them to go again?
function whoseTurn(){
  let mancala1Index = 6;
  let mancala2Index = 13;
  if((lastPit === mancala1Index) && (gameState.currentPlayer === 0)){
    gameState.currentPlayer = 0;
  } else if ((lastPit === mancala2Index) && (gameState.currentPlayer === 1)) {
    gameState.currentPlayer = 1;
  } else {
    changeTurns();
    setActivePits();
  }
}

// Changes the current player and active class
function changeTurns(){
  if(gameState.currentPlayer === 0){
    gameState.currentPlayer = 1;
  } else {
    gameState.currentPlayer = 0;
  }
  toggleActiveClass();
}



// To end the game
function gameOver(p1PitSum, p2PitSum){
  // Total up each player's seeds and put them in their mancala
  board[6] += p1PitSum;
  board[13] += p2PitSum;
  // Since the seeds have been moved to the mancalas, zero out the pits
  for(i = 0; i < 6; i++){
    board[i] = 0;
  } for(i = 7; i < 13; i++){
    board[i] = 0;
  }
}

// Determine who won and reset 
function whoWon(p1PitSum, p2PitSum){
  let p1Score = p1PitSum + board[6];
  let p2Score = p2PitSum + board[13];
  if (p1Score > p2Score){
    alert(`${gameState.p1Name} wins!`)
  } else if(p2Score > p1Score){
    alert(`${gameState.p2Name} wins!`)
  } else if(p2Score === p1Score){
    alert("It's a tie!")
  }
}
// Reset game
function resetGame(){
  deactivateClasses();
  deactivatePits();
  buildInitialState();
  $("img").remove();
  renderState();
}

// Helper functions for activating and deactivating the pits
function p1PitsOn(){
  $('.p1pits').children().on('click', onBoardClick);
}
function p1PitsOff(){
  $('.p1pits').children().off();
}
function p2PitsOn(){
  $('.p2pits').children().on('click', onBoardClick);
}
function p2PitsOff(){
  $('.p2pits').children().off();
}

// Activate the pits according to whose turn it is
function setActivePits(){
  if(gameState.currentPlayer === 0){
    p1PitsOn();
    p2PitsOff();
  } else {
    p2PitsOn();
    p1PitsOff();
  }
}

// Deactive all pits for when you need to reset the game
function deactivatePits(){
  p1PitsOff();
  p2PitsOff();
}
// Deactive all classes for when you need to reset the game
function deactivateClasses(){
  $(".p1pits").removeClass("active");
  $(".p1Name").removeClass("active");
  $(".p2pits").removeClass("active");
  $(".p2Name").removeClass("active");
}