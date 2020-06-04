var Board = function (columns, rows, mines) {
    
    this.onTileClicked = new Phaser.Signal();
    this.onEndGame = new Phaser.Signal();
    this.onTileFlagged = new Phaser.Signal();
    
    var mineList = [];
    var flaggedTiles = [];
    var self = this;
    var board = [];
    var group = game.add.group();
    var tilesLeft = (columns * rows) - mines;
    
    window.buttonTile = new Buttontile(0,380);

    this.explosion;
    //konstruktor
    var init = function () {
        
        for (var y=0; y<rows; y++) {

            var row = [];

            for (var x=0; x<columns; x++) {
                
                var tile = new Tile(x, y, group);
                tile.onRevealed.add(onReveal, this);
                tile.onFlag.add(onFlag, this);
                row.push(tile);
            }
            
            board.push(row);
        }
        this.explosion=game.add.audio('explosion');
        setMines();
        
    };
    
    
    this.moveTo = function (x, y) {
        group.x = x;
        group.y = y;
    };
    
    
    var getRandomTile = function () {
        var randomRow = Math.floor(Math.random()*rows);
        var randomColumn = Math.floor(Math.random()*columns);

        var tile = board[randomRow][randomColumn];
        return tile;
    };
    
    //nastaveni min
    var setMines = function () {
        var tile = getRandomTile();
        
        for (var i=0; i<mines; i++) {
            while(tile.getValue() == tile.states.MINE) {
                tile = getRandomTile();
                mineList.push(tile);
            }
            
            tile.setValue(tile.states.MINE);
            updateSurroundingTiles(tile);
        }
    };
    
    //zvednuti okolnich cisel
    var updateSurroundingTiles = function (tile) {
        var targetTile;
        var surroundingTiles = getSurroundingTiles(tile);
        
        for (var i=0; i<surroundingTiles.length; i++) {
            targetTile = surroundingTiles[i];
                if (targetTile.getValue() == tile.states.MINE) {
                    continue;
                }
                
                targetTile.setValue(targetTile.getValue() + 1);
            
        }
    };
    
    //pri odhaleni
    var onReveal = function (tile) {
        self.onTileClicked.dispatch();
        var value = tile.getValue();
        
        if (value == tile.states.ZERO) {
            revealEmptyTiles(tile);
        }
        else if (value == tile.states.MINE) {
            revealAll();
        } 
        
        tilesLeft--;
        
        if(!tilesLeft) {
            endGame();
            alert("Vyhrál jsi");
        }
    };
    
    //pri zavlajkovani
    var onFlag = function (tile) {
        self.onTileClicked.dispatch();
        
        if (tile.getState() == tile.states.FLAG){
            flaggedTiles.push(tile);
        } else {
            for (var i=0; i<flaggedTiles.length; i++) {
                if (flaggedTiles[i] == tile) {
                    flaggedTiles.splice(i, 1);
                }
            }
        }
        
        self.onTileFlagged.dispatch(flaggedTiles.length);
    };
    
    //prohra
    var revealAll = function () {
        endGame();
        this.explosion.play();
        

        for (var y=0; y<rows; y++) {
            for (var x=0; x<columns; x++) {
                var tile = board[y][x];
                
                if (tile.isRevealed()) {
                    continue;
                }
                
                tile.onRevealed.remove(onReveal, this);
                tile.reveal();
            }
        } 
        
    };
    
    
    var getSurroundingTiles = function (tile) {
 
        var tileList = [];
        var targetTile;
        var column;
        var row;
        
        for (var y=-1; y<=1; y++) {
            for (var x=-1; x<=1; x++) {
                if (!x && !y) {
                    continue;
                }
 
                column = tile.column + x;
                row = tile.row + y;
 
                if (row < 0 || row >= rows || column < 0 || column >= columns) {
                    continue;
                }
                
                targetTile = board[row][column];
                
                tileList.push(targetTile);
            }
        }
        
        return tileList;
    };
    
    //odhaleni nul
    var revealEmptyTiles = function (tile) {
        
        var tileList = [tile];
        var surroundingTiles;
        var currentTile;
 
        while (tileList.length) {
            currentTile = tileList[0];
            surroundingTiles = getSurroundingTiles(currentTile);
            
                while (surroundingTiles.length) {
                    currentTile = surroundingTiles.shift();
                    
                    if (currentTile.isRevealed()) {
                        continue;
                    }
                    
                    tilesLeft--;
                    currentTile.onRevealed.remove(onReveal, this);
                    currentTile.reveal();
                    if (currentTile.getState() == currentTile.states.FLAG)
                    {
                        flaggedTiles.pop(currentTile);
                    }
                    if (currentTile.getValue() == currentTile.states.ZERO) {
                        tileList.push(currentTile);
                    }
                }
                tileList.shift();
            }
            
        if(!tilesLeft) {
            endGame();
        }
    };
    
    var endGame = function () {
        for (var i=0; i<mineList.length; i++) {
            var tile = mineList[i];
            tile.enable(false);
        }

        self.onEndGame.dispatch();
    };
    
    init();
};