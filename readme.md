## JS Battleship Game

This is a simple Battleship game implemented in HTML5, CSS, and JavaScript. The game allows a player to find ships by guessing their locations on the map. Ships are randomly placed on the map when a new game starts.

![Gameplay Screenshot](screenshots/gameplay.png)
_The game in action, with ships placed and gameplay in progress._

## Features

- Responsive design compatible with different screen sizes
- Interactive map grid for ship placement and guessing
- Real-time feedback on hits and misses
- A 60-second time limit with a real-time countdown
- New-game control for starting a fresh board without reloading the page
- Active game sessions are restored after a page refresh
- New game clears the saved session
- Live shot, hit, miss, and accuracy statistics
- Easy, normal, and hard difficulty presets
- Completed-game history with a persisted best score
- Manual JSON session export and import
- Keyboard-accessible board navigation with semantic grid markup
- Classic, ocean, and high-contrast visual themes
- Optional audio feedback with a mute control
- Visible hit and miss shot history with undo synchronization
- Mobile-friendly board and controls for narrow screens
- Installable offline web app support
- Current-session and historical performance analytics

## Installation

1. Clone the repository: `git clone https://github.com/davymaish/battleship-game.git`
2. Open the `index.html` file in your preferred web browser.

## How to Play

1. Open the game in your web browser.
2. Choose a difficulty level before starting.
3. You have 60 seconds to sink at least two battleships on Normal difficulty.
4. Each battleship occupies three grid boxes.
5. Enter coordinates using a letter followed by a number, from `A0` to `G6`.
6. Hit all three boxes occupied by a ship to sink it.
7. Select **New game** at any time to reset the board and timer.
8. Use **Export session** to download a backup or **Import session** to restore a JSON backup.
9. Use the arrow keys to move focus across the board cells.
10. Choose a theme to customize the interface or improve contrast.
11. Use **Mute sound** to disable audio feedback when needed.
12. Review the shot history panel to see every recorded hit, miss, and sunk ship.
13. On small screens, the board and controls resize to fit the viewport.
14. Install the game from a supported browser to use its cached offline shell.
15. Use the analytics panel to review games, wins, losses, remaining ships, and the win target.

## Development checks

Run the browser-independent regression suite with Node.js:

```bash
node tests/run-tests.js
```

## Contributing

Contributions are welcome! If you find any issues or have ideas for improvements, please open an issue or submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).

## Contact

For any inquiries or feedback, feel free to contact me via:

- Website: [davymaish.github.io](https://davymaish.github.io)
- Email: [davymaish6@gmail.com](mailto:davymaish6@gmail.com)
