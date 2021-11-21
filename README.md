# Mancala

## Overview

This was a solo project that I put together 1.5-2 months into my coding journey. The challenge was to build a classic game from the ground up using JavaScript, jQuery, HTML, and CSS. I chose mancala because it appeared to present some added complexity. The rules for advancing and distributing one's seeds, determining whose turn it is, and the circular nature of the board were among the greater challenges that I encountered.

In case you are new to mancala, you may want to familiarize yourself with the [rules of the game](https://www.thesprucecrafts.com/how-to-play-mancala-409424).

## Lessons Learned

### State
- This was one of my first projects that required more organized and intentional state management
- One goal was to create a game that could be played to completion and immediately restart without reloading the page. I had to find a way to create the initial state, track changes, render to reflect the current state, and then reset the game state once the game ended
- These lessons would pay dividends later on when I began working with React

### Scope
- In line with the concept of state, I learned to use global and local scope to my advantage as I updated values. I became more pursposeful with my definition and placement of variables, aiming to only make them as accessible as they needed to be

### Gameplay
- One of the biggest challenges that I faced early on was how to create the effect of a circular board and then render the seed images in a position that corresponded to that pit
- The solution that I came up with was to store the pit values (number of seeds) in an array and then assign an id value to a `<div>` which would match the index value in the array for that pit. Creating this link made it simpler to append the correct number of seed images to a pit during the rendering process
- As for the circular movement, I was able to check the index value of the last space occupied and then return to 0 once the end had been reached

### Documentation
- Since this was the most robust project that I had built at the time, I made an effort to organize my code into sections that might make it more logical to navigate
- In addition to the organization, I included comments throughout the code with the intention of making my decisions clearer to other developers
- One ancillary benefit was that this forced me to think through my code from an outsider's perspective, resulting in clearer code and a better overall understanding of my work

## Thoughts for the Future
- The first thing I would like to do is rewrite this as a React app so that I can take advantage of its built-in hooks for detecting and rendering changes in state
- I want to replace the alerts with modals and think more critically about the user experience. Specifically, I want to provide more visual and textual feedback to the user to explain the result of each move, especially when a user captures an opponent's seeds or when they land in their own pit, allowing them to go again
- I would also like to make the app more responive to a user's device to improve the mobile experience




