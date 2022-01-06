//Gameboard module to store current gameboard data
const gameBoard = (() => {
    let gameState = ["", "", "", "", "", "", "", "", ""];   //Store current game state
    return {gameState};
})();

//Player factory function to create new players and store their details
const Player = () => {
    let playerMarker;   //Store player marker - X or O
    let playerName;     //Store player name
    return {playerMarker, playerName};
};

//Gamecontroller module to control the flow of the game
const gameController = (() => {
    //Variable and object declarations
    const player1 = Player();   //Create first player
    const player2 = Player();   //Create second player
    let gameActive = true;      //Variable to check if the game has ended
    let currentPlayer = player1;    //Store the current player details
    const winningConditions = [     //Possible winning conditions of the game
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    
    //Caching DOM
    const gameTitle = document.querySelector('.game--title');
    const statusDisplay = document.querySelector('.game--status');
    const singlePlayerInputForm = document.querySelector('#single-inputForm');
    const twoPlayerInputForm = document.querySelector('#twoPlayer-inputForm');
    const singlePlayerFormBtn = document.querySelector('#singlePlayerBtn');
    const twoPlayerFormBtn = document.querySelector('#twoPlayerBtn');
    const gameArea = document.querySelector('.game-container-main');
    const restartBtn = document.querySelector('.game--restart');
    const allCells = document.querySelectorAll('.cell');

    //Event binding
    singlePlayerFormBtn.addEventListener('click', displaySinglePlayerForm);
    twoPlayerFormBtn.addEventListener('click', displayTwoPlayerForm);
    document.querySelector('#addSinglePlayerNameBtn').addEventListener('click', addSinglePlayerName);
    document.querySelector('#addTwoPlayerNameBtn').addEventListener('click', addTwoPlayerName);
    allCells.forEach(cell => cell.addEventListener('click', handleCellClick));
    restartBtn.addEventListener('click', restartGame);

    //Helper functions for messages
    const currentPlayerTurn = () => `It's ${currentPlayer.playerName}'s turn`;    //Template literals 
    const winningMessage = () => `${currentPlayer.playerName} has won!`;
    const drawMessage = () => `Game ended in a draw!`;

    //Function to display single player name input form
    function displaySinglePlayerForm() {
        gameTitle.style.marginTop = '10px';
        gameArea.style.display = "none";
        restartBtn.style.display = "none";
        twoPlayerInputForm.style.display = "none";
        statusDisplay.innerHTML = "Please enter player details";
        singlePlayerInputForm.style.display = "block";
    }

    //Function to dispaly two player name input form
    function displayTwoPlayerForm() {
        gameTitle.style.marginTop = '10px';
        gameArea.style.display = "none";
        restartBtn.style.display = "none";
        singlePlayerInputForm.style.display = "none";
        statusDisplay.innerHTML = "Please enter player details";
        twoPlayerInputForm.style.display = "block";
    }

    //Function to add single player name
    function addSinglePlayerName() {
        var firstPlayerName = document.querySelector('#single-firstPlayerName').value; //Get value from input form
        if(firstPlayerName === '') {
            alert("Please enter the player name");
            return;
        }
        player1.playerMarker = "X";
        player1.playerName = firstPlayerName;

        player2.playerMarker = "O";
        player2.playerName = "Computer";

        document.querySelector('#single-firstPlayerName').value = "";
        singlePlayerInputForm.style.display = "none";
        startGame();
    }
    
    //Function to add two players name
    function addTwoPlayerName() {
        var firstPlayerName = document.querySelector('#twoPlayer-firstPlayerName').value;
        var secondPlayerName = document.querySelector('#twoPlayer-secondPlayerName').value;
        if(firstPlayerName === '' || secondPlayerName === '') {
            alert("Please enter both players name");
            return;
        }
        player1.playerMarker = "X";
        player1.playerName = firstPlayerName;

        player2.playerMarker = "O";
        player2.playerName = secondPlayerName;

        document.querySelector('#twoPlayer-firstPlayerName').value = "";
        document.querySelector('#twoPlayer-secondPlayerName').value = "";
        twoPlayerInputForm.style.display = "none";
        startGame();
    }

    //Function to start the game
    function startGame() {
        gameArea.style.display = "block";
        restartBtn.style.display = "block";
        statusDisplay.innerHTML = currentPlayerTurn();
        restartGame();
    }

    //Function to handle click event on the board by the player
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));
        if (gameBoard.gameState[clickedCellIndex] !== "" || !gameActive) {  //If game is not active or cell is already full don't do anything
            return;
        }

        updateGameboard(clickedCell, clickedCellIndex, currentPlayer);
        checkForWin(currentPlayer, statusDisplay);
    }

    //Function to make a random move by the computer
    function computerMove() {
        statusDisplay.innerHTML = currentPlayerTurn();
        let computerMoveMade = false;   //Vaiable to check if the valid move has been made by computer
        let clickedCellDataAttribute;
        let clickedCellComp;
        let clickedCellIndexComp;

        while (!computerMoveMade) {
            let computerMoveLocation = getRandomNumberBetween(0,8); //Get random number to make move
            if(gameBoard.gameState[computerMoveLocation] === "") {
                clickedCellIndexComp = computerMoveLocation;
                allCells.forEach(cell => {
                    clickedCellDataAttribute = parseInt(cell.getAttribute('data-cell-index'));
                    if(clickedCellDataAttribute == clickedCellIndexComp)
                        clickedCellComp = cell;
                });
                updateGameboard(clickedCellComp, clickedCellIndexComp, currentPlayer);
                computerMoveMade=true;
                checkForWin(currentPlayer, statusDisplay);
            } else {
                continue;
            }
        }
    }

    //Function to get a random number between two values
    function getRandomNumberBetween(min,max){
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    //Function to update the gameboard as per the move
    function updateGameboard(clickedCell, clickedCellIndex, currentPlayer) {
        gameBoard.gameState[clickedCellIndex] = currentPlayer.playerMarker;
        clickedCell.innerHTML = currentPlayer.playerMarker;
    }

    //Function to check if win or draw has occured
    function checkForWin() {
        let roundWon = false;
        for (let i = 0; i <= 7; i++) {
            //Get the current gameBoard state for the winning conditions and check if there are three in a row data for the winning conditions
            const winCondition = winningConditions[i];
            let a = gameBoard.gameState[winCondition[0]];
            let b = gameBoard.gameState[winCondition[1]];
            let c = gameBoard.gameState[winCondition[2]];
            if (a === '' || b === '' || c === '') {
                continue;
            }
            if (a === b && b === c) {
                roundWon = true;
                break
            }
        }

        if (roundWon) {
            statusDisplay.innerHTML = winningMessage();
            stopGame();
            return;
        }

        let roundDraw = !gameBoard.gameState.includes("");
        if (roundDraw) {
            statusDisplay.innerHTML = drawMessage();
            stopGame();
            return;
        }
        changePlayer();
    }

    //Function to stop the game
    function stopGame() {
        gameActive = false;
    }

    //Function to change player
    function changePlayer() {
        if(currentPlayer == player1)
            currentPlayer = player2;
        else if(currentPlayer == player2)
            currentPlayer = player1;
        statusDisplay.innerHTML = currentPlayerTurn();

        //If the player is a computer then make a computer move else exit function and wait for the user move
        if(currentPlayer.playerName == "Computer") {
            computerMove();
        }
    }

    //Function to restart the game
    function restartGame() {
        gameActive = true;
        currentPlayer = player1;
        gameBoard.gameState = ["", "", "", "", "", "", "", "", ""];
        statusDisplay.innerHTML = currentPlayerTurn();
        allCells.forEach(cell => cell.innerHTML = "");
    }   

    return {};
})(); 
