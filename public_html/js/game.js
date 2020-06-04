var config = {
    screenWidth: 600,
    screenHeight: 412,
    
    tileWidth: 32,
    tileHeight: 32,
        
    boardWidth: 9,
    boardHeight: 9,
    
    totalMines: 10
};

var states = {
    game: "game"
};

var graphicAssets = {
    tiles:{URL:'assets/tiles.png', name:'tiles', frames:14}
};

var fontStyles = {
    counterFontStyle:{font: '20px Arial', fill: '#FFFFFF'},
};

var gameState = function(game){
    
    this.boardTop;
    this.boardLeft;
    this.board;
    this.timer;
    this.counter;
    this.restart;
};

gameState.prototype = {
    
    init: function () {
        this.boardTop = 40;
        this.boardLeft = 0;

    },
    
    preload: function () {
        game.load.spritesheet(graphicAssets.tiles.name, graphicAssets.tiles.URL, config.tileWidth, config.tileHeight, graphicAssets.tiles.frames);
        game.load.image('menu', 'assets/menu.png', 90, 270);
        game.load.audio('explosion', 'assets/explosion.mp3');

        //zapne zvuk na android + chrome
        if (this.game.device.android && this.game.device.chrome && this.game.device.chromeVersion >= 55) 
        {
            this.game.sound.setTouchLock();
            this.game.input.touch.addTouchLockCallback(function () 
            {
                if (this.noAudio || !this.touchLocked || this._unlockSource !== null) 
                {
                return true;
                }
                if (this.usingWebAudio) 
                {
                    var buffer = this.context.createBuffer(1, 1, 22050);
                    this._unlockSource = this.context.createBufferSource();
                    this._unlockSource.buffer = buffer;
                    this._unlockSource.connect(this.context.destination);

                    if (this._unlockSource.start === undefined) 
                    {
                        this._unlockSource.noteOn(0);
                    }
                    else 
                    {
                        this._unlockSource.start(0);
                    }


                    if (this._unlockSource.context.state === 'suspended') 
                    {
                        this._unlockSource.context.resume();
                    }
                }
                return true;

            }, this.game.sound, true);
        }    

    },
    
    create: function () {
        this.initBoard();  
        this.initUI();
        pause = game.add.text(config.screenWidth - 100, this.boardTop - 35, 'Obtížnost', fontStyles.counterFontStyle);
        pause.inputEnabled = true;
        
        //pauza
        pause.events.onInputUp.add(function () {
            
        game.paused = true;


        menu = game.add.sprite(config.screenWidth/2,config.screenHeight/2, 'menu');
        menu.anchor.setTo(0.5, 0.5);

        game.input.onDown.add(unpause, self);
        
        //vykresleni menu
        function unpause(event){
        if(game.paused){

            var x1 = config.screenWidth/2 - 90/2, x2 = config.screenWidth/2 + 90/2,
                y1 = config.screenHeight/2 - 270/2, y2 = config.screenHeight/2 + 270/2;

            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){



                var  y = event.y - y1;


                var choice = Math.floor(y / 90);

                var miny = config.totalMines;
                if(choice ==0)
                {
                    config.boardHeight=9;
                    config.boardWidth=9;
                    config.totalMines=10;
                    if (miny!= 10)
                    {
                    game.state.start(states.game);
                    }
                    menu.destroy();
                    game.paused = false;
                }
                else if(choice ==1)
                {
                    config.boardHeight=10;
                    config.boardWidth=12;
                    config.totalMines=20;
                    if (miny!= 20)
                    {
                    game.state.start(states.game);
                    }
                    menu.destroy();
                    game.paused = false;
                }
                else 
                {
                    config.boardHeight=10;
                    config.boardWidth=15;
                    config.totalMines=30;
                    if (miny!= 30)
                    {
                    game.state.start(states.game);
                    }
                    menu.destroy();
                    game.paused = false;
                }
                
            }
            else{
                menu.destroy();
                game.paused = false;

            }
        }
    };
        
        
    });

    },

    update: function () {
        
    },
    
    initBoard: function () {

        this.board = new Board(config.boardWidth, config.boardHeight, config.totalMines);
        this.board.moveTo(this.boardLeft, this.boardTop);
        this.board.onTileClicked.addOnce(this.startGame, this);
        this.board.onEndGame.addOnce(this.endGame, this);
        this.board.onTileFlagged.add(this.updateMines, this);
        
    },
    
    initUI : function () {
        var top = this.boardTop - 20;
        var left = this.boardLeft;
        var right = left + (config.boardWidth * config.tileWidth);
        
        this.timer = new Timer(left, top);
        this.counter = new Counter(right, top, config.totalMines);
        
        this.restart = game.add.text(config.boardWidth * config.tileWidth * 0.5, top, "Restart", fontStyles.counterFontStyle);
        this.restart.anchor.set(0.5, 0.5);game.stage.width * 0.5
        this.restart.inputEnabled = true;
        this.restart.events.onInputDown.add(this.restartGame, this);

    },
    
    startGame: function () {
        this.timer.start();
    },
    
    endGame: function () {
        this.timer.stop();

    },
    
    restartGame: function () {
        game.state.start(states.game);
    },
    
    updateMines: function (value) {
        this.counter.update(value);
    },
    

};

var game = new Phaser.Game(config.screenWidth, config.screenHeight, Phaser.AUTO, 'gameDiv');
game.state.add(states.game, gameState);
game.state.start(states.game);