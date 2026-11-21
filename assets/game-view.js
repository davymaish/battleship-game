var view = {
  displayMessage: function(msg) {
    document.getElementById("messageArea").innerHTML = msg;
  },

  displayHit: function(location) {
    document.getElementById(location).setAttribute("class", "hit");
  },

  displayMiss: function(location) {
    document.getElementById(location).setAttribute("class", "miss");
  },

  resetBoard: function() {
    for (var row = 0; row < model.boardSize; row++) {
      for (var column = 0; column < model.boardSize; column++) {
        document.getElementById(row + "" + column).removeAttribute("class");
      }
    }

    this.displayMessage("Choose a coordinate to fire.");
    var counterArea = document.getElementById("counterArea");
    counterArea.classList.remove("absolute");
    counterArea.innerHTML = "<p>You have " + gameConfig.timeLimitSeconds + " seconds to sink at least " + gameConfig.minimumShipsToWin + " battleships.</p><p>Each battleship takes " + gameConfig.shipLength + " grid boxes.</p><p>Enter coordinates from A0 to " + gameConfig.coordinateAlphabet.charAt(gameConfig.boardSize - 1) + (gameConfig.boardSize - 1) + ".</p>";
  },

  displayEndScene: function(signMessage, textMessage) {
    document.getElementById("fireButton").setAttribute("disabled", true);
    var endScene = document.getElementById("endscene");
    endScene.getElementsByClassName("winning-sign")[0].innerHTML = signMessage;
    endScene.getElementsByClassName("winning-text")[0].innerHTML = textMessage;
    endScene.classList.add("show");
  }
};
