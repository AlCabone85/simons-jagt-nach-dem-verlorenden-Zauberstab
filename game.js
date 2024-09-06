document.addEventListener("DOMContentLoaded", function () {
    const player = document.getElementById("player");
    const gameArea = document.getElementById("gameArea");
    const scoreDisplay = document.getElementById("score");
    const gameOverMessage = document.getElementById("gameOver");
    const backgroundMusic = document.getElementById("backgroundMusic");
    const pointSound = document.getElementById("pointSound");
    const restartButton = document.getElementById("restart");

    let score = 0;
    let playerX = 0;
    let playerY = 0;
    let speed = 20; // Startgeschwindigkeit
    let direction = "right";
    let gameInterval;

    // Hintergrundmusik abspielen
    backgroundMusic.volume = 0.2;
    backgroundMusic.play();

    // Spielerbewegung basierend auf der Richtung
    function movePlayer() {
        switch (direction) {
            case "up":
                playerY -= speed;
                break;
            case "down":
                playerY += speed;
                break;
            case "left":
                playerX -= speed;
                break;
            case "right":
                playerX += speed;
                break;
        }

        // Überprüfen, ob der Spieler die Spielfeldgrenzen berührt
        if (playerX < 0 || playerX > gameArea.clientWidth - player.clientWidth ||
            playerY < 0 || playerY > gameArea.clientHeight - player.clientHeight) {
            gameOver();
        } else {
            updatePlayerPosition();
            checkCollisions();
        }
    }

    // Spielerposition aktualisieren
    function updatePlayerPosition() {
        player.style.left = playerX + "px";
        player.style.top = playerY + "px";
    }

    // Kollisionserkennung
    function checkCollisions() {
        const points = document.querySelectorAll(".point");
        points.forEach(function (point) {
            const pointRect = point.getBoundingClientRect();
            const playerRect = player.getBoundingClientRect();

            if (!(playerRect.right < pointRect.left || 
                  playerRect.left > pointRect.right || 
                  playerRect.bottom < pointRect.top || 
                  playerRect.top > pointRect.bottom)) {
                // Punkt wurde eingesammelt
                point.remove();
                score++;
                scoreDisplay.textContent = score;
                createPoint(); // Ein neuer Punkt wird generiert

                // Punktesound abspielen
                pointSound.play();

                // Geschwindigkeit erhöhen
                speed *= 1.1;
            }
        });
    }

    // Spiel beenden
    function gameOver() {
        clearInterval(gameInterval);
        gameOverMessage.style.display = "block";
        backgroundMusic.pause();
    }

    // Punkte generieren
    function createPoint() {
        const point = document.createElement("img");
        point.src = "punkt-bild.png";
        point.classList.add("point");
        point.style.left = Math.random() * (gameArea.clientWidth - 90) + "px";
        point.style.top = Math.random() * (gameArea.clientHeight - 90) + "px";
        gameArea.appendChild(point);
    }

    // Spieler automatisch bewegen
    function startGame() {
        gameInterval = setInterval(movePlayer, 100);
        backgroundMusic.play();
        createPoint();
    }

    // Spiel neu starten
    function resetGame() {
        clearInterval(gameInterval);
        score = 0;
        speed = 20;
        playerX = 0;
        playerY = 0;
        direction = "right";
        scoreDisplay.textContent = score;
        gameOverMessage.style.display = "none";
        gameArea.innerHTML = ''; // Entfernt alle Punkte
        gameArea.appendChild(player);
        gameArea.appendChild(gameOverMessage);
        startGame();
    }

    // Klick auf den Restart-Button
    restartButton.addEventListener("click", resetGame);

    // Bewegung ändern durch Pfeiltasten
    document.addEventListener("keydown", function (event) {
        switch (event.key) {
            case "ArrowUp":
                if (direction !== "down") direction = "up";
                break;
            case "ArrowDown":
                if (direction !== "up") direction = "down";
                break;
            case "ArrowLeft":
                if (direction !== "right") direction = "left";
                break;
            case "ArrowRight":
                if (direction !== "left") direction = "right";
                break;
        }
    });

    // Virtuelle Pfeiltasten (Touchscreen)
    document.getElementById("up").addEventListener("click", function () {
        if (direction !== "down") direction = "up";
    });
    document.getElementById("down").addEventListener("click", function () {
        if (direction !== "up") direction = "down";
    });
    document.getElementById("left").addEventListener("click", function () {
        if (direction !== "right") direction = "left";
    });
    document.getElementById("right").addEventListener("click", function () {
        if (direction !== "left") direction = "right";
    });

    // Start des Spiels
    startGame();
});