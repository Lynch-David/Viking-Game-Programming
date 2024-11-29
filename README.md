# Final Project

-   [ ] Read the [project requirements](https://vikramsinghmtl.github.io/420-5P6-Game-Programming/project/requirements).
-   [ ] Replace the sample proposal below with the one for your game idea.
-   [ ] Get the proposal greenlit by Vik.
-   [ ] Place any assets in `assets/` and remember to update `src/config.json`.
-   [ ] Decide on a height and width inside `src/globals.js`. The height and width will most likely be determined based on the size of the assets you find.
-   [ ] Start building the individual components of your game, constantly referring to the proposal you wrote to keep yourself on track.
-   [ ] Good luck, you got this!

---

# Sample Proposal - Pokémon the Trading Card Game

> [!note]
> This was taken from a project I did in university so the scope is **much** larger than what I'm expecting from you in terms of number of features!

## ✒️ Description

In this platformer game, the player assumes the role of a Viking who's goal is to climb to the top of a structure to reach his lost booze. The map is a vertical scroller meaning that the Viking can only load the next level by getting high enough, these 'levels' are more so stages taht work together as one big map that continuously climbs upwards. There is no lose condition only the win condition of reaching the top of the structure, however beware, as falling will lead you to be heavily punished and fall down multiple stages at times. Take your time, or else you'll learn true frustration...

## 🕹️ Gameplay

Players will begin by being loaded into a new world trapped within two never ending walls on either side with their only way to get out is to go from platform to platform reaching as high as possible. There are only five keys that can be used to control your character in this game. A/LEFT ARROW will point your character to the left, D/RIGHT ARROW will point your character to the right and finally SPACE will cause your character to jump. All of these put together allows you to jump in two directions while being able to walk around slightly. The vertical and horizontal distance you can cover solely depends on how long your jump was charged for. Meaning the longer you hold SPACE the further you can reach. The mechanic that adds a challenge to this game is the fact that you must get a feel for how long you have held your jump for as there is no indication for this.

The Viking will only land on flat platforms, if hit a slanted structure prepare for a long fall. Furthermore, another key mechanic of the game is to be able to bounce off of walls, by doing so you can change your velocity midair, you'll need to use this at certain points throughout the levels. After reaching the top of your structure, that's it, you've won!

This is a recreation of the game *Jump King*, it is a single player game that is played with direction keys and SPACE for jumping.

## 📃 Requirements

> [!note]
> This was a web project so that's why you'll see requirements about logging in and uploading data which for you is irrelevant. Focus more on the requirements describing actions taken for gameplay.

### Core Gameplay
1. The user shall press the SPACE key to make the Viking jump.
2. The user shall hold the SPACE key to charge the jump for greater distance.
3. The user shall press A/LEFT ARROW to make the Viking face left.
4. The user shall press D/RIGHT ARROW to make the Viking face right.
5. The system shall calculate the vertical and horizontal distance based on the duration the SPACE key is held.

### Navigation and Progression
6. The system shall load the next stage when the Viking reaches a specific height.
7. The system shall allow the Viking to fall to previous stages when they miss a platform.
8. The system shall display a starting screen for the user to begin the game.
9. The system shall display a victory screen when the user reaches the top of the structure.

### Obstacles
10. The system shall introduce icy platforms that reduce the Viking's friction and make stopping difficult.
11. The system shall introduce sticky platforms that slow down the Viking's movement.
12. The system shall introduce slime platforms that make the Viking bounce upon landing.
13. The system shall introduce sloped platforms that cause the Viking to slide.
14. The system shall introduce birds that the Viking can collide with.
15. The system shall introduce wind mechanics that push the Viking horizontally mid-jump.

### Environmental Interactions
16. The system shall render walls on both sides of the screen to trap the Viking within the game area.
17. The user should collide with tiles/platform from the side.
18. The user should stop falling when landing on a tile/platform (except slope and slime)

### UI/UX
19. The system shall include a pause screen that the user can access during gameplay.
20. The system shall display the Viking's height as a progress indicator on the side of the screen.
21. The system shall include a button to return to the main menu from the pause screen.
22. The system shall play a celebratory sound effect upon reaching the victory screen.

### Persistance
23. The system shall track the highest point reached by the Viking as a user record.
24. The system shall track the players last idle state position values to save.
25. The system shall load the players previous idle state and highscore upon opening the game.


### 🤖 State Diagram

> [!note]
> Remember that you'll need diagrams for not only game states but entity states as well.

![State Diagram](./assets/images/StateDiagram.png)

### 🗺️ Class Diagram

![Class Diagram](./assets/images/ClassDiagram.png)

### 🧵 Wireframes

> [!note]
> Your wireframes don't have to be super polished. They can even be black/white and hand drawn. I'm just looking for a rough idea about what you're visualizing.

![Main Menu](./assets/images/Main-Menu.png)

![image](https://github.com/user-attachments/assets/804ebcfb-fa0c-4b04-8828-76d2579cd13b)


-   _Let's Play_ will navigate to the main game.
-   _Upload Cards_ will navigation to the forms for uploading and parsing the data files for the game.
-   _Change Log_ will navigate the user to a page with a list of features/changes that have been implemented throughout the development of the game.

![Game Board](./assets/images/Game-Board.png)

We want to keep the GUI as simple and clear as possible by having cards with relevant images to act as a way for the user to intuitively navigate the game. We want to implement a layout that would look like as if one were playing a match of the Pokémon Trading Card Game with physical cards in real life. Clicking on any of the cards will reveal that card's details to the player.

### 🎨 Assets

We used [app.diagrams.net](https://app.diagrams.net/) to create the wireframes. Wireframes are the equivalent to the skeleton of a web app since they are used to describe the functionality of the product and the users experience.

We plan on following trends already found in other trading card video games, such as Pokémon Trading Card Game Online, Hearthstone, Magic the Gathering Arena, and Gwent.

The GUI will be kept simple and playful, as to make sure the game is easy to understand what each component does and is, as well as light hearted to keep to the Pokémon theme.

#### 🖼️ Images

-   Most images will be used from the well known community driven wikipedia site, [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Main_Page).
-   Especially their [Trading Card Game section](<https://bulbapedia.bulbagarden.net/wiki/Full_Art_card_(TCG)>).

#### ✏️ Fonts

For fonts, a simple sans-serif like Roboto will look quite nice. It's a font that is legible, light on storage size, and fun to keep with the theme we're going for. We also used a more cartoonish Pokemon font for the title screen.

-   [Alagard](https://www.dafont.com/alagard.font)
-   [Roboto](https://fonts.google.com/specimen/Roboto)

#### 🔊 Sounds

All sounds were taken from [freesound.org](https://freesound.org) for the actions pertaining to cards.

-   [Jump King Soundtrack](https://www.youtube.com/playlist?list=PLutiWwcCdAw0AJd5osbs6L4y0TOontBMl)
-   [Shuffle cards](https://freesound.org/people/VKProduktion/sounds/217502/)
-   [Flip card](https://freesound.org/people/Splashdust/sounds/84322/)

### 📚 References

-   [Pokemon Rulebook](http://assets.pokemon.com/assets/cms2/pdf/trading-card-game/rulebook/xy8-rulebook-en.pdf)
