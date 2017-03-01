
(function (document) {
    'use strict';

    function Board (el) {
        var self = this;
        self.el = el;

        //Iterates game board of 12 rows by 15 columns that can be drawn to the 'board' div in dom.
        self.drawBoard = function () {

            for ( var i = 12; i > 0; i--){
                var rowEl = document.createElement('div');
                       rowEl.className = 'row';
                boardEl.appendChild(rowEl);

                for ( var j = 1; j < 16  ; j++) {
                    var columnEl = document.createElement('div');
                    columnEl.className = 'column boardSquare dropzone';
                    columnEl.dataset.x = j;
                    columnEl.dataset.y = i;
                    rowEl.appendChild(columnEl);
                }
            }
        }
    }

    function TileBag(el, tileSet) {
        var self = this;
        self.el = el;

        self.drawTileBag = function () {
            tileFactory.mixTiles(tileSet);
            var bagEl = document.createElement('div');
            bagEl.className = 'dropzone tileBagStyle bagDrop';

            var title = document.createElement('p');
            title.innerHTML = 'TileBag';
            title.id = 'bagTitle'
            bagEl.appendChild(title);

            var showTiles = document.createElement('div');
            showTiles.id = 'placeHolder';
            bagEl.appendChild(showTiles);
            self.el.appendChild(bagEl);
        }

        self.countTiles = function (tileSet) {
            var inBag = 0;
            tileSet.forEach(function (tile) {
                if (tile.inPlay === false) {
                    inBag += 1;
                }
            });

            var existing =document.getElementById('tileNum');

            if (existing !== null) {
                existing.remove();
            }

            var tileText = document.createElement('span');
            tileText.id = 'tileNum';
            tileText.innerHTML = 'In Bag:' + inBag;
            console.log(inBag);
            document.getElementById('placeHolder').appendChild(tileText);
        }
    }

    function Tile (data) {
        var self = this;
        self.id = (data && data.id) || null;
        self.shape = (data && data.shape) || '';
        self.color = (data && data.kolor) || '';
        self.inPlay = (data && data.inPlay) || false;
        self.onBoard = (data && data.onBoard) || false;
    }

    function TileData () {
        var self = this;
        var shape = ["square", "circle", "star", "diamond", "tri", "octo"];
        var kolor = ["red", "orange", "yellow", "purple", "green", "blue"];
        var tileDataArr = [];
        var num = 0;

        self.createData = function() {
            for (var i = 0; i < 3; i++ ){
                for (var j = 0; j < shape.length; j++ ) {
                    for (var k = 0; k < kolor.length; k++ ) {
                        num += 1;
                        tileDataArr.push ({
                            id: num,
                            shape: shape[j],
                            kolor: kolor[k],
                            inPlay: false,
                            onBoard: false
                        });
                    }
                }
            }
            return tileDataArr;
        }
    }

    //TileFactory binds each tileDataArr object to a Tile object
    //generates  complete set of Tile objects for game play
    function TileFactory (data, Tile) {
        var self = this;
        self.makeTiles = createTiles(data);

        function createTiles (data) {
            var gamePieces = [];
            data.forEach(function (item) {
                gamePieces.push(new Tile(item));
            });
            return gamePieces;
        }

        self.mixTiles = function (pieces) {
            var i;
            var j;
            var k;
            var temp;
            for (i = 0; i < 5; i++){
                for (j = 0; j < pieces.length; j++){
                    k = Math.floor(Math.random() * pieces.length);
                    temp = pieces[j];
                    pieces[j] = pieces[k];
                    pieces[k] = temp;
                }
            }
        }

        self.getPlayable = function (gamePieces) {
            var valid = gamePieces.filter(function(piece){
                    return piece.inPlay == false;
            });

            var selectTile = valid[0];
            selectTile.inPlay = true;

            var  trayTile = document.createElement('div');
            trayTile.className = 'tile'+' '+selectTile.color+' '+selectTile.shape;
            trayTile.id = selectTile.id;

            return trayTile;
        }
    }

    function PlayPanel (el, GameLogic, tileSet) {
        //is Player needed here??
        var self = this;
        self.el = el;

        var fourPlayer = ['One', 'Two', 'Three', 'Four'];
        var threePlayer = ['One', 'Two', 'Three'];
        var twoPlayer = ['One', 'Two' ];

        var tray = new Tray();
        var gameLogic = new GameLogic(Tray, tileSet);
        var startButtonNames = ['Two', 'Three', 'Four'];
        //var instructions = 'Instructions';
        var validate = 'Next Player';

        drawStartButtons(startButtonNames);

        drawValidateButton (validate);
        drawInstructionButton ();

        self.el.querySelector('#startButtonFour').addEventListener('click', function() {createPlayers(fourPlayer, Player)});
        self.el.querySelector('#startButtonThree').addEventListener('click', function() {createPlayers(threePlayer, Player)});
        self.el.querySelector('#startButtonTwo').addEventListener('click', function() {createPlayers(twoPlayer, Player)});
        self.el.querySelector('#validateButton').addEventListener('click', toggleFinishPlay);
        self.el.querySelector('#howTo').addEventListener('click', instructionModal);

        function drawStartButtons (buttons) {
            buttons.forEach (function (oneButton) {
                document.getElementById('playPanel').appendChild(startButtonElement(oneButton));
            });
        }

        function startButtonElement (oneButton) {
            var el = document.createElement('button');
            el.className = 'baseButton startButton panelButton';
            el.innerHTML =  oneButton + ' ' +'Player';
            el.id = 'startButton' + oneButton;
            el.disabled = false;
            return el;
        }

        function drawInstructionButton () {
            document.getElementById('playPanel').appendChild(instructionButtonElement());
        }


        function instructionButtonElement () {
            var el = document.createElement('button');
            el.className = 'baseButton panelButton';
            el.innerHTML = 'Instructions';
            el.id = 'howTo';
            return el;
        }

        function drawValidateButton (validate) {
            document.getElementById('playPanel').appendChild(validateButtonElement(validate));
        }

        function validateButtonElement (validate) {
            var el = document.createElement('button');
            el.className = 'baseButton panelButton validClass';
            el.innerHTML = validate;
            el.id = 'validateButton';
            el.disabled = true;
            return el;
        }

        function instructionModal () {
          console.log('INSTRUCTION');
            var el = document.getElementById("overlay");
            el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";
        }

        function createPlayers (gamePlayers, Player){
            console.log (gamePlayers);
            gamePlayers.forEach(function(gamePlayer) {
                var player = new Player(gamePlayer, Tray, tileSet);
                playerArr.push(player);
                console.log('PLAYER'+player);
                startPlayerOne(player);
            });
            ableDisButtons('startButton');
            ableDisButtons('validClass');

            console.log(playerArr);
        }

        function ableDisButtons (buttonName) {
            var disable = document.getElementsByClassName(buttonName);
            for (var i = 0; i < disable.length; i++) {
                if (disable[i].disabled === true) {
                    disable[i].disabled = false;
                }else {disable[i].disabled = true};
            }
        }

        //gameplay assigned to player1
        function startPlayerOne (player) {
            if (player.name === 'One') {
                var playerOne = document.getElementById('One');
                console.log('PLAYERONE: ',playerOne);
                playerOne.className += ' traygreen';
                var tiles = playerOne.querySelectorAll('.tile');
                console.log(tiles);
                for (var i = 0; i < tiles.length; i++) {
                    tiles[i].className += ' draggable inTray';
                }
                console.log('PlayerONE: ', playerArr[0]);
            }
        }

    }
//HERE CORRECT PLAYER this.el TO MATCH this.el for function Piece in board.js
    function Player (gamePlayer, Tray, tileSet) {
        var self = this;
        var tray = new Tray (tileSet);
        //this.el = createTray(gamePlayer);
        this.name = gamePlayer;
        this.score = 0;
        this.el = (function() {
            createTray(gamePlayer);
        }());
        this.inplay = false;
        console.log(this.name);
    }

    function Tray (tileSet) {
        self.createTray = function (gamePlayer) {
            document.getElementById('trays').appendChild(createTrayElement(gamePlayer));
            tileBag.countTiles(tileSet);
        }

        function createTrayElement (gamePlayer) {
            var el = document.createElement('div');
            el.className = 'tray traywhite';
            el.id = gamePlayer;

            var playerName = document.createElement('p');
            playerName.innerHTML = 'Player ' + gamePlayer;
            playerName.className = 'playerName';
            el.appendChild(playerName);

            var scoreBox = document.createElement('div');
            scoreBox.id = 'scoreBox-'+gamePlayer;
            scoreBox.className = 'scoreBox baseButton';
            el.appendChild(scoreBox);

            var scoreText = document.createElement('p');
            scoreText.className = 'scoreText';
            scoreText.innerHTML = 'Score';
            scoreBox.appendChild(scoreText);

            var scoreNum = document.createElement('p');
            scoreNum.id = 'scoreNum-' + gamePlayer;
            scoreNum.className = 'scoreNum';
            scoreNum.innerHTML = 0;
            scoreBox.appendChild(scoreNum);

            var tileWrapper =document.createElement('div');
            tileWrapper.className = 'tileWrapper';
            el.appendChild(tileWrapper);

            var spaces = [1,2,3,4,5,6];
                spaces.forEach (function (space) {
                    tileWrapper.appendChild(oneSpace(tileSet));
                });
            return el;
        }

        function oneSpace (tileSet) {
            var el = document.createElement('div');
            el.className = 'column traySquare dropzone';
            var selectTile = tileFactory.getPlayable(tileSet);
            el.appendChild(selectTile);
            return el;
        }

        //disables start buttons for duration of game
        // disableStartButtons();

        function updateScore (gamePlayer) {

            var existing =document.getElementById('scoreNum-' + gamePlayer);
            if (existing !== null) {
                existing.remove();
            }
            var scoreData = document.createElement('p');
            scoreData.id = 'scoreNum-' + gamePlayer;
            scoreData.className = 'scoreNum'
            scoreData.innerHTML = playerArr[0].score;
            document.getElementById('scoreBox-'+ gamePlayer).appendChild(scoreData);
        }

        function dealTiles (gamePlayer) {
            console.log('DEAALTILES!!!');
            var existing =document.getElementById(gamePlayer);
            var traySpots = existing.querySelectorAll('.traySquare');

            //var trayChild = playerArr[0].el.querySelectorAll('.traySquare');
            if( traySpots.length > 0){
               for (var i = 0; i < traySpots.length; i++) {
                    if (traySpots[i].children.length === 0) {
                        traySpots[i].appendChild(tileFactory.getPlayable(tileSet));
                    }
                }
            }
            tileBag.countTiles(tileSet);
        }

        self.rotatePlay = function (gamePlayer) {

            document.getElementById('validateButton').innerHTML = 'Next Player';

            //array of tray DOM Elements among which to rotate game
            //play between players
            var removeAll = document.querySelectorAll('.draggable, .inTray, .mainDangler, .sideDanglerRed, .traygreen, .play, .gap');

            for (var i = 0; i < removeAll.length; i++) {
                removeAll[i].classList.remove('draggable');
                removeAll[i].classList.remove('inTray');
                removeAll[i].classList.remove('mainDangler');
                removeAll[i].classList.remove('sideDanglerRed');
                removeAll[i].classList.remove('traygreen');
                removeAll[i].classList.remove('gap');
                removeAll[i].classList.remove('play');
            }

            //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
            var nextPlayer = playerArr[0];
            var nextPlayerName = playerArr[0].name.toString();

            updateScore(nextPlayerName);
            tileFactory.mixTiles(tileSet);
            dealTiles(nextPlayerName);

            playerArr.push(playerArr.shift());

            nextPlayer = playerArr[0];
            nextPlayerName = playerArr[0].name.toString();

            console.log('NextIsPlayer',nextPlayer.name);
            console.log(playerArr);
            var getTrays = document.getElementsByClassName('tray');
            var trayTiles = '';

            for (var i = 0; i < getTrays.length; i++) {
                if (getTrays[i].id === nextPlayerName) {
                    getTrays[i].className += ' traygreen';
                    trayTiles = getTrays[i].querySelectorAll('.tile');
                }
            }

            for (var i = 0; i < trayTiles.length; i++) {
                trayTiles[i].className += ' draggable inTray';
            }
        }
    }


////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////
//
//GAME LOGIC
//GAME MOVE VERIFICATION
//
////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////



    function GameLogic (Tray, tileSet) {

       /////////////////////////////////
       // OBJECT-WIDE VARS--DETERMINE RUN AND FIX COORDINATES
       ///////////////////////////////

        var tray = new Tray(tileSet);
        var toggle = true;
        var sorted = [];
        var xOrY = '';
        var yOrX = '';

        var dataX = [];
        var dataY = [];
        var xCoords = [];
        var yCoords = [];
        var played = '';
        var findGaps = false;
        var veryFirstMove = true;


        function errorAlerts (errorToken) {
            if( errorToken === 'playedLength') {
                alert('you must play at least one piece');
            }else if (errorToken === 'playAndTrade') {
                alert('You can not play tiles and trade in on the same turn. Please remove your tiles from the board then click to finish your turn.  ');
            }else if (errorToken === 'firstLength') {
                alert('you must play at least 3 pieces on the first move');
            }else if (errorToken === 'gotHole' ) {
                alert("Sorry thats not a valid move, its got a hole in it.  Try again.");
            }else if (errorToken === 'hasIntersect') {
                 alert('Sorry, your move doesnt intersect with the exisiting game. Try again');
            }else if (errorToken === 'badPlay') {
                 alert('Sorry, your moves not valid. All of the colors or all of the shapes have to match');
            }
        }


/////////////////////////////////
//
//VERIFY XY
//
////////////////////////////////

        self.toggleFinishPlay = function () {
            if (toggle === true) {
//              toggle = false;
                preverify();
            }else {
//              if (toggle = false)
                toggle = true;
                rotatePlay(playerArr[0].score);
            }

        }

        function preverify () {
            runNumber = 1;
            played = document.getElementsByClassName('play');
            var trayed = document.getElementsByClassName('inTray');
            var visibleTiles = played.length + trayed.length;
            var tileTradeVerify = visibleTiles > 5 ? true : false;
            //need to keep repeating this w/o progressing if still <1
            console.log('WEEERHEEER!!!');

            if (played.length < 1) {
                if (trayed.length < 6 && played.length === 0){
                    toggle = false;
                }else {
                    errorAlerts('playedLength');
                }

            }else if (veryFirstMove === true) {
                if (played.length < 3) {
                    errorAlerts('firstLength');
                }else if (tileTradeVerify === false) {
                        errorAlerts('playAndTrade');
                }else {
                    toggle = false;
                    verifyIsXorYrun();
                }

            }else {
                if (tileTradeVerify === false) {
                    errorAlerts('playAndTrade');
                }else {
                    toggle = false;
                    verifyIsXorYrun();
                }
            }
        }

        function verifyIsXorYrun () {
            var sorted = [];
            var dataX = [];
            var dataY = [];
            var xCoords = [];
            var yCoords = [];



            for (var i = 0; i < played.length; i++) {
                xCoords.push(parseInt(played[i].parentNode.dataset.x));
                yCoords.push(parseInt(played[i].parentNode.dataset.y));
            }

            console.log(xCoords);
            console.log(yCoords);

            var xOne = xCoords[0];
            var yOne = yCoords[0];

            //Tests for a constant value in x axis
            var testxCoords = xCoords.every(function(coord) {
              return coord === xOne;
            });

            //Tests for a constant value in y axis
            var testyCoords = yCoords.every(function(coord) {
              return coord === yOne;
            });

            console.log('xCoordsEvery' + testxCoords);
            console.log('yCoordsEvery' + testyCoords);

            //create array of constant x values and an array of constant y vals to match against
            //ascending/descending x or y values in danglers function below
            if (played.length < 2) {
                xOrY = 'y';
                yOrX = 'x';
                checkForIntersect(xOrY, yCoords ,yOrX , xCoords);
            }else if (testxCoords === true) {
                xOrY = 'x';
                yOrX = 'y';
               checkForIntersect(xOrY, xCoords ,yOrX , yCoords);
            }else if (testyCoords === true) {
                xOrY = 'y';
                yOrX = 'x';
                checkForIntersect(xOrY,yCoords ,yOrX , xCoords);
            }else {
                alert('invalid move');
            }
        }

//////////////////////////////////////
//SORT FIX GAPS
///////////////////////////////////////
        function checkForIntersect (xOrY, coordinatesFix, yOrX, coordinatesRun) {
            //NOTE: if intersect and dangler dont add anything to run  then throw invalid move

            //first time through b-a>1 unimportant, may flag correctly, may not
            //next time through, its sorted, so it can flag remaining gaps accurately
            findGaps = false;

            sorted = coordinatesRun.sort (function (a, b) {
                return a - b;
            });

            sorted.sort(function(a,b) {
                if ( b - a > 1) {
                   findGaps = true;
                }
            });

            console.log (sorted);

            if (findGaps === true) {
                //fillGaps function checks each non-played space in the run to see if it has child. If yes, add gapClass to child
                //if not throw the play as invalid
                fillGaps(xOrY, coordinatesFix, yOrX, sorted);
            }

            else if (findGaps === false) {
                console.log('GapsDone:OntoDanglers');
                console.log('CCCRRR: ',coordinatesRun);
                if (veryFirstMove === true) {
                    runNumber = 2;
                    isEndRunDone(xOrY, coordinatesFix, yOrX, coordinatesRun);
                }else {
                assignMainRunFrontDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);
                }
            }
        }


//////////////////////////////////////
//FILL GAPS IN RUN BETWEEN PIECES PLAYED
///////////////////////////////////////
        function fillGaps (xOrY, coordinatesFix, yOrX, coordinatesRun) {

            coordinatesRun.sort(function(a, b) {
                if (b - a > 1) {
                    var gapRunCoord = b - 1;
                    var gapFixCoord = coordinatesFix[0];
                    var gapTestCoord = document.querySelector('[data-' + xOrY + ' = "' + gapFixCoord + '"][data-' + yOrX + ' = "' +gapRunCoord + '"]');
                    if (gapTestCoord.hasChildNodes()){
                        gapTestCoord.firstChild.classList.add('gap');
                        coordinatesRun.push(gapRunCoord);
                        console.log(coordinatesRun);
                        console.log(coordinatesFix);
                        checkForIntersect(xOrY, coordinatesFix, yOrX, coordinatesRun);
                    }else {
                      errorAlerts('gotHole');
                    }
                }
            });
        }
/////////////////////////////////////////////////////////////////
// ASSIGN/CHECK DANGLER TILES ON FRONT AND END OF TILE RUN PLAYED
//////////////////////////////////////////////////////////////////
        //
        //GAME LOGIC OBJECT-WIDE VARS TO VERIFY TILES PLAYED
        //
        //////////////////////////////////////////////////////////////////
        var testDangler = '';
        var danglerFixCoord = '';
        var danglerRunCoord = '';
        var runNumber = 1;
        var temp= '';

        var sideDanglerCycles = 0;
        var isSwitchXY = 0;
        var zeroRun = '';
        var verifiedMainRun = false;
        var sideDanglerFlag = false;

        function assignMainRunFrontDangler(xOrY, coordinatesFix, yOrX, coordinatesRun){
            danglerFixCoord = coordinatesFix[0];
            danglerRunCoord = coordinatesRun[0] - 1;
            console.log('FRONT DANG!!!');
            console.log('DANGLER-RUN-COORD:' +danglerRunCoord);
            console.log('DANGLER-FIX-COORD:' +danglerFixCoord);
            checkForDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);
        }

        function assignMainRunEndDangler (xOrY, coordinatesFix, yOrX, coordinatesRun){
            danglerFixCoord = coordinatesFix[0];
            danglerRunCoord = 1 + coordinatesRun[coordinatesRun.length - 1];
            console.log('END DANG!!!');
            console.log('DANGLER-RUN-COORD:' +danglerRunCoord);
            console.log('DANGLER-FIX-COORD:' +danglerFixCoord);
            checkForDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);
        }
///////////////////////////////////////////////////////////////////////////////////
// ASSIGN/CHECK INTERSECTING DANGLER TILE RUNS THAT ARE EXTENDED BY  TILERUN PLAYED
////////////////////////////////////////////////////////////////////////////////////////////////
//each run consists of one or two 'side runs' extending from the sides of one of the tiles played

        function checkSideDanglers (xOrY, coordinatesFix, yOrX, coordinatesRun) {
            sideDanglerCycles += 1;
            coordinatesFix = [];
            coordinatesRun = [];
            console.log('CHECKSIDEDANGLERS');
            console.log('SideDanglerCycles: '+sideDanglerCycles);
            console.log(xOrY, yOrX);

            if (isSwitchXY === 0) {
                temp= xOrY;
                xOrY = yOrX;
                yOrX= temp;
            }

            console.log(xOrY, yOrX);
            isSwitchXY += 1;

            console.log('ATSET XOrY: '+xOrY);
            console.log(played);

            //if we started w a main run in constantY(coordFix), intersecting
            //will be in constantX(and vice-versa).So if constant was X, sideDanglers are Y,
            //if constant was Y now its X
            if (xOrY === 'y') {
                coordinatesFix.push(parseInt(played[sideDanglerCycles - 1].parentNode.dataset.y));
                coordinatesRun.push(parseInt(played[sideDanglerCycles - 1].parentNode.dataset.x));
                //zeroRun captures the run coordinates of the first tile in a dangler cycle.  Later it's
                //incorpated into var danglerOrigin so that the origin tile can be added to a sideDanglerRun
                zeroRun = parseInt(played[sideDanglerCycles - 1].parentNode.dataset.x);
            }else if (xOrY === 'x')  {
                coordinatesFix.push(parseInt(played[sideDanglerCycles - 1].parentNode.dataset.x));
                coordinatesRun.push(parseInt(played[sideDanglerCycles - 1].parentNode.dataset.y));
                zeroRun = parseInt(played[sideDanglerCycles - 1].parentNode.dataset.y);
            }

            console.log('FIX'+coordinatesFix);
            console.log('RUN'+coordinatesRun);
            console.log('SDC X-VAL' + coordinatesFix[0]);
            console.log('SDC Y-VAL' + coordinatesRun[0]);
            console.log(zeroRun);
            assignSideOneSideDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);
        }

        function assignSideOneSideDangler (xOrY, coordinatesFix, yOrX, coordinatesRun){
            console.log('SIDE-ONE-DANGLER');
            console.log(xOrY, yOrX);
            console.log (typeof coordinatesRun[0]);
            danglerFixCoord = coordinatesFix[0];
            danglerRunCoord = coordinatesRun[coordinatesRun.length - 1] + 1;
            console.log(danglerFixCoord);
            console.log(danglerRunCoord);
            checkForDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);
        }

        function assignSideTwoSideDangler(xOrY, coordinatesFix, yOrX, coordinatesRun){
            console.log('SIDE-TWO-DANGLER');
            danglerFixCoord = coordinatesFix[0];
            danglerRunCoord = coordinatesRun[0] - 1;
            console.log('DFC: ',danglerFixCoord);
            console.log('DRC: ',danglerRunCoord);
            console.log('FIXZERO', coordinatesRun[0]);
            checkForDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);
        }

/////////////////////////////////////
// CHECK & ADD DANGLERS
///////////////////////////////////////

        //checks if a dangler tile, an empty trayspace or an edge exists beyond
        //the end of a given tile run
        function checkForDangler(xOrY, coordinatesFix, yOrX, coordinatesRun) {
            console.log(xOrY+yOrX);
            console.log( 'DANGLER IS:'+danglerRunCoord,danglerFixCoord);
            console.log(coordinatesFix);
            testDangler = document.querySelector('[data-' + xOrY + ' = "' + danglerFixCoord + '"][data-' + yOrX + ' = "' + danglerRunCoord + '"]');
            // encompasses Board-edge scenarios, any positive will terminate current run

            if ( danglerRunCoord === 0 || danglerRunCoord === 16 || yOrX === 'y' && danglerRunCoord === 13 || !testDangler.hasChildNodes()) {
                console.log('HitAnEDGE!!! (OR RUN END)');
                console.log('RUNNUM: ', runNumber);
                isEndRunDone(xOrY, coordinatesFix, yOrX, coordinatesRun);
            }else /*if(testDangler.hasChildNodes())*/ {
                console.log('ADDINGADANGLER');
                addDanglers(xOrY, coordinatesFix, yOrX, coordinatesRun);
            }
        }

        //if dangler tile exists, tagged with classname for later scoring
        function addDanglers (xOrY, coordinatesFix, yOrX, coordinatesRun) {
            console.log('ADD DANG!!!');

            if (isSwitchXY === 0) {
                console.log('ADDING-GREEN-DANG');
                testDangler.firstChild.classList.add('mainDangler');
            }else {
                console.log('ADDING-SD');
                console.log(testDangler);
              //  danglerOrigin.firstChild.classList.add('sideDanglerScore');
                testDangler.classList.add('sideDanglerRed');
                testDangler.firstChild.classList.add('sideDanglerScore');
            }
            coordinatesFix.push(danglerFixCoord);
            coordinatesRun.push(danglerRunCoord);
            coordinatesRun.sort(function (a, b) {
               return a-b;
            });
            console.log(coordinatesFix);
            console.log(coordinatesRun);
            console.log (yOrX);

            isFrontOrEnd(xOrY, coordinatesFix, yOrX, coordinatesRun);
        }

///////////////////////////////////////////////////////
//ROUTES TILE VERIFICATION TO THE NEXT APPROPRIATE TILE IN THE CURRENT RUN
//////////////////////////////////////////////////////
        function isFrontOrEnd (xOrY, coordinatesFix, yOrX, coordinatesRun) {
            console.log('FUNCTION:isFrontOrEnd');

            if (runNumber === 1) {
                 assignMainRunFrontDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);

            }else if (runNumber === 2) {
                assignMainRunEndDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);

            }else if (runNumber === 3) {
                assignSideOneSideDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);

            }else if (runNumber === 4) {
                assignSideTwoSideDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);
            }
        }


///////////////////////////////////////////////////////////////////
//ROUTES TILE VERIFICATION TO THE NEXT APPROPRIATE RUN WHEN A RUN HAS COMPLETED
///////////////////////////////////////////////////////////////////
        function isEndRunDone (xOrY, coordinatesFix, yOrX, coordinatesRun) {
            console.log('CCCRRR: ',coordinatesRun);
            console.log('FUNCTION:isEndRunDone');
            console.log('RUNNUM:',runNumber);
            console.log('VFM PRE-CHECKS(1):', veryFirstMove);
            console.log(getSides);

            //enters with frontDangler completed
            if (runNumber === 1) {
                runNumber = 2;
                console.log("goin2MAINENDDANGLER!!!");
                assignMainRunEndDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);


            //starts with mainRun(frontDang,EndDang,mainRunTiles) completed
            }else if (runNumber === 2) {

                if (veryFirstMove === true) {
                    verifyMainRun(xOrY, coordinatesFix, yOrX, coordinatesRun);
                }
                else if (veryFirstMove === false) {
                    //runNumber set to 3  because any checkSideDangler option below will require it
                    runNumber = 3;

                    //If you havent run all the DanglerCycles, run the next one
                    if (sideDanglerCycles < played.length){
                        console.log('sideDanglerCycles(Pre+1): ', sideDanglerCycles);
                        console.log("goin2SideDangONE");
                        console.log(isSwitchXY);
                        console.log('XeroRun :',zeroRun);
                        console.log (coordinatesRun);
                        checkSideDanglers(xOrY, coordinatesFix, yOrX, coordinatesRun);
                    //If you've run them all, verify main run. If you've already verified it, the turn is done!
                    }else if (sideDanglerCycles === played.length){
                        console.log('NEARLY THERE!!!');
                        console.log('VMR: ', verifiedMainRun);

                        if (verifiedMainRun === false) {
                            verifyMainRun(xOrY, coordinatesFix, yOrX, coordinatesRun);
                        }else if (verifiedMainRun === true) {
                            doneDone();
                        }
                    }
                }


            }else if (runNumber === 3) {
                runNumber = 4;
                console.log("goin2SideDangTWO");
                assignSideTwoSideDangler(xOrY, coordinatesFix, yOrX, coordinatesRun);


            }else if (runNumber === 4) {
                runNumber = 2;

                if (coordinatesRun.length > 1) {
                    //placeholder for xy coordinates for starting element for each sideDangler tilerun
                    var danglerOrigin = document.querySelector('[data-' + xOrY + ' = "' + coordinatesFix[0] + '"][data-' + yOrX + ' = "' + zeroRun+ '"]');
                    console.log(coordinatesRun);
                    console.log('ORIGIN :',danglerOrigin);
                    danglerOrigin.classList.add('sideDanglerRed');
                    danglerOrigin.firstChild.classList.add('sideDanglerScore');
                }

                var getSides = document.getElementsByClassName('sideDanglerScore');
                console.log(getSides);
                console.log('GOT SIDES');
                //This zeroRun can go elsewhere(beginning of CSD) if problematic
                zeroRun = '';
                //all of below should be new separate function leading2assignScore
                //this terminates with individual sideDangler scorecheck

                if (getSides.length > 0) {
                    console.log('GOING TO SCORE THE DANGLERS');
                    sideDanglerFlag = true;
                    assignScore(getSides, tileSet, xOrY, coordinatesFix, yOrX, coordinatesRun);
                }else (dialBackToTwo(xOrY, coordinatesFix, yOrX, coordinatesRun));


            }else if (runNumber ===5) {
                runNumber = 1;
                isSwitchXY = 0;
                sideDanglerCycles = 0;
                verifiedMainRun = false;
            }
        }

/////////////////////////////////////
//VERIFY MAIN RUN TILES PLAYED
///////////////////////////////////////

        function verifyMainRun(xOrY, coordinatesFix, yOrX, coordinatesRun) {
            //veryfirstmove true waives requirement that game moves must intersect with previous plays
            //For GreenRuns endOnly
            //VFM needs 3 or 4 to go out, must cross 'start' square, gets 2x points
            if (veryFirstMove === true) {
                console.log('TRUEYTRUE!!!')
                console.log('CCCRRR VMR: ',coordinatesRun);
                console.log('NEW VFM:', veryFirstMove);
                assignScore(played, tileSet, xOrY, coordinatesFix, yOrX, coordinatesRun);

            }else if (veryFirstMove === false) {
                console.log('FALSEYFALSE!!!');

                if (verifiedMainRun === false) {
                    console.log('FALSEYFALSE!!!');
                    //remove this when final resets are implented
                    console.log('FALSEYFALSE!!!');
                    var checkIntersect = errorChecker('intersect');
                    console.log('checkIntersect:', checkIntersect);

                    if (checkIntersect === false) {
                        errorAlerts('hasIntersect');
                    }else if (checkIntersect === true) {
                        verifiedMainRun = true;
                        var minusOne = '';
                        var playClass = document.getElementsByClassName('play');
                        var mainClass = document.getElementsByClassName('mainDangler');
                        if (playClass.length === 1 && mainClass.length === 0) {
                            minusOne = true;
                        }

                        var selectedEls = document.querySelectorAll('.mainDangler, .gap, .play');
                        assignScore(selectedEls, tileSet, xOrY, coordinatesFix, yOrX, coordinatesRun, minusOne);
                    }
                }
            }
        }

        function errorChecker(test) {
            if (test === 'intersect') {
                var getRun = document.querySelectorAll('.mainDangler, .gap, .sideDanglerRed');
                    console.log('GreenIntersectElem',getRun);
                    if (getRun.length !== 0) {
                        return true;
                    }else {
                        return false;
                    }
            }
        }

/////////////////////////////////////
//ASSIGN SCORE IF TILES MATCH SHAPE OR COLOR
///////////////////////////////////////

        function assignScore (elements, tileSet, xOrY, coordinatesFix, yOrX, coordinatesRun, minusOne) {
            //called By isEndRunDone  runNum = 2
            //need to make sure this is accessible from the object/method calling it
            document.getElementById('validateButton').innerHTML = 'Click Again!';

            runNumber = 2;
            var elementIDs = [];
            var comparePieces = [];
            console.log('CCCRRR assignScor: ',coordinatesRun);

            for (var i = 0; i < elements.length; i++) {
                elementIDs.push(parseInt(elements[i].id));
            }

            elementIDs.forEach(function(elementid) {
                tileSet.filter(function (tile) {
                    if (tile.id === elementid) {
                    comparePieces.push(tile);
                    }
                });
            });

            comparePieces.forEach(function (piece) {
                console.log(piece.color);
            });

            console.log('COMPAREPIECES:' ,comparePieces);
            console.log(elementIDs);
            console.log(tileSet);

            var colorCheck = comparePieces.every(function (tile) {
                return tile.color === comparePieces[0].color;
            });

            var shapeCheck = comparePieces.every(function (tile) {
                return tile.shape === comparePieces[0].shape;
            });

            console.log(playerArr[0].score);

            if (colorCheck === true || shapeCheck === true) {
                console.log('NEWPOINTS:',elements.length);
                comparePieces.forEach(function(piece) {
                    playerArr[0].score += 1;
                });

                if (minusOne === true) {
                    playerArr[0].score -= 1;
                }


                console.log('SCORE FOR',playerArr[0].name,': ', playerArr[0].score);

                if (sideDanglerFlag === true){
                    console.log('LOWERINGTHEFLAGS');
                    var removeSD = document.querySelectorAll('.sideDanglerScore');
                    console.log ('FIRST RSD:',removeSD);

                    for (var i = 0; i < removeSD.length; i ++) {
                          removeSD[i].classList.remove('sideDanglerScore');
                    }

                    removeSD = document.querySelectorAll('.sideDanglerScore');
                    console.log ('SECOND RSD:', removeSD);
                    sideDanglerFlag = false;
                    isEndRunDone(xOrY, coordinatesFix, yOrX, coordinatesRun);

                }else if (sideDanglerFlag === false) {
                    if (veryFirstMove === true){
                        veryFirstMove = false;
                        doneDone();
                    }else if (veryFirstMove === false) {
                        doneDone();
                        //isEndRunDone(xOrY, coordinatesFix, yOrX, coordinatesRun);
                    }
                }

            }else {
                  errorAlerts ('badPlay');
                  toggle = true;
                  var findDangler = document.querySelectorAll('.mainDangler, .sideDanglerRed, .sideDanglerScore, .gap');

                  for (var i = 0; i < findDangler.length; i ++) {
                      findDangler[i].classList.remove('mainDangler');
                      findDangler[i].classList.remove('sideDanglerRed');
                      findDangler[i].classList.remove('sideDanglerScore');
                      findDangler[i].classList.remove('gap');
                  }

                  runNumber = 5;
                  isEndRunDone (xOrY, coordinatesFix, yOrX, coordinatesRun);
            }
        }

        function dialBackToTwo(xOrY, coordinatesFix, yOrX, coordinatesRun) {
            isEndRunDone(xOrY, coordinatesFix, yOrX, coordinatesRun);
        }

        function resets(){
            played = '';
            runNumber = 1;
            sideDanglerCycles = 0;
            dataX = [];
            dataY = [];
            xCoords = [];
            yCoords = [];
            isSwitchXY = 0;
            verifiedMainRun = false;
        }

        function doneDone(){
            played = '';
            runNumber = 1;
            sideDanglerCycles = 0;
            dataX = [];
            dataY = [];
            xCoords = [];
            yCoords = [];
            isSwitchXY = 0;
            verifiedMainRun = false;
            console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>VALIDATED!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
        }

        /*
        self.passPlay = function() {
            rotatePlay();
        }
        */


    }




////////////////////////////////////////////////////////////
//INTERACT DRAGGABLE
////////////////////////////////////////////////////////////

    interact('.draggable').draggable({
        snap: {
            mode: 'anchor',
            anchors: [],
            range: Infinity,
            elementOrigin: { x: .5, y: .5 },
            endOnly: true
        },

        intertia: true,
        restrict: {
            //restriction: "parent",
            endOnly: true,
            elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
        },
        onmove: dragMoveListener
    });

    interact('.dropzone').dropzone({ overlap: .51 });
    interact('.dropzone')
        .on('drop', function (event) {
            var dropRect = interact.getElementRect(event.target),
                dropCenter = {
                    x: dropRect.left + dropRect.width  / 2,
                    y: dropRect.top  + dropRect.height / 2
                };

                event.draggable.snap({
                anchors: [ dropCenter ]
                });

            var thisTile = event.relatedTarget;
            thisTile.style.transform = '';
            thisTile.removeAttribute('data-x');
            thisTile.removeAttribute('data-y');

            event.target.appendChild(thisTile.parentNode.removeChild(thisTile));
            //adds '.play' class to tile when tile is dragged onto a boardsquare
            if (event.target.classList.contains('boardSquare')) {
                event.relatedTarget.classList.add('play');
                event.relatedTarget.classList.remove('inTray');
            }

            if (event.target.classList.contains('traySquare')) {
                event.relatedTarget.classList.add('inTray');
                event.relatedTarget.classList.remove('play');
            }

            if (event.target.classList.contains('bagDrop')) {
                var trashTile = parseInt(thisTile.id);
                console.log('TRASHTILE: ',trashTile);
                tileSet.filter(function (tile) {
                    if (trashTile === tile.id) {
                        tile.inPlay = false;
                        console.log('TILEId: ',tile.id);
                    }
                });
                thisTile.remove();
                tileBag.countTiles(tileSet);
                console.log(tileSet);
            }
        })


        .on('dragleave', function (event) {
            event.draggable.snap(false);
            event.relatedTarget.classList.remove('play');

             // when leaving a dropzone, snap to the start position
             // event.draggable.snap({ anchors: [startPos] });
    });

    function dragMoveListener (event) {
        var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

        // translate the element
        target.style.webkitTransform =
        target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';

        // update the position attributes
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    }

    var playerArr = [];
    var tileData = new TileData();
    var makeData = tileData.createData();
    var tileFactory = new TileFactory(makeData, Tile);
    var tileSet = tileFactory.makeTiles;
    var boardEl = document.querySelector('#board');
    var board = new Board(boardEl);
    var playPanelEl  = document.querySelector('#playPanel');
    var playPanel = new PlayPanel(playPanelEl, GameLogic, tileSet);
    var tileBagEl = document.querySelector('#tileBagger');
    var tileBag = new TileBag(tileBagEl, tileSet);
    tileBag.drawTileBag();
    tileBag.countTiles(tileSet);
    board.drawBoard();
    console.log(tileSet);
}(document));
