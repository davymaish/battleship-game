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
- Difficulty, theme, and sound preferences persist across reloads
- Shareable completed-game result summaries
- Persistent achievement badges for milestone victories
- Personal leaderboard showing the five best victories
- Current and best consecutive win streak tracking
- Recent completed-game archive with outcome and accuracy details
- Deterministic daily challenge with a shared date-based fleet
- Daily challenge results labeled by UTC challenge date
- Daily challenge performance summary with attempts, wins, losses, and best guesses
- Current and best daily challenge win streak tracking across consecutive UTC dates
- Daily challenge leaderboard ranking the five best challenge victories
- Daily challenge calendar showing the ten most recent attempted UTC dates
- Daily challenge insights showing win rate, average guesses, and latest play date
- Daily challenge badges for first wins, three-day streaks, and precision victories
- Daily challenge share summaries with result, streak, and unlocked badge context
- Daily challenge result exports as portable JSON files
- Validated daily challenge result imports for reviewing shared JSON files
- Tamper-evident daily challenge exports with deterministic integrity checksums
- Historical daily challenge replay from any valid UTC calendar date
- Compact daily challenge codes for sharing and replaying deterministic dates
- Active challenge code display with clipboard and Web Share support
- Recent daily challenge code history with outcomes and UTC dates

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
16. Your selected difficulty, theme, and sound setting are remembered for the next visit.
17. Share a completed result with the Web Share API or copy it through the browser clipboard.
18. Unlock and review badges for your first win, high accuracy, fast victories, and hard-mode wins.
19. Review your personal leaderboard, ranked by guesses, accuracy, and difficulty.
20. Track your current winning streak and the best streak in your completed-game history.
21. Review the ten most recent completed games, including outcome, guesses, accuracy, and difficulty.
22. Start the daily challenge to play the same seeded fleet as other players on the UTC calendar date.
23. Review daily challenge attempts, wins, losses, and your best winning guess count in the challenge results panel.
24. Build a daily challenge streak by winning on consecutive UTC dates and review your current and best streaks.
25. Review the daily challenge leaderboard, ranked by guesses, accuracy, difficulty, and challenge date.
26. Review the daily challenge calendar to see recent wins and losses by UTC challenge date.
27. Review daily challenge insights for your win rate, average guesses, and latest challenge date.
28. Unlock daily challenge badges by earning your first win, building a three-day streak, and winning with high accuracy.
29. Share a daily challenge result with its date, outcome, streak, and unlocked challenge badges.
30. Export a completed daily challenge result as a JSON file for later reference or sharing.
31. Import a daily challenge result JSON file to validate and review its recorded outcome, streak, and badges.
32. Exported challenge results include an integrity checksum, and modified checksummed files are rejected on import.
33. Choose a valid UTC date to replay the deterministic daily challenge fleet from that day.
34. Paste a `DC-YYYYMMDD-XXXXXXXX` challenge code to replay the matching deterministic fleet.
35. Copy or share the active challenge code with the clipboard or Web Share API when supported.
36. Review the five most recent distinct daily challenge codes with their dates and outcomes.

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
