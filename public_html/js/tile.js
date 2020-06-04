var Tile = function (column, row, group) {
    
    this.states = {
        ZERO: 0,
        ONE: 1,
        TWO: 2,
        THREE: 3,
        FOUR: 4,
        FIVE: 5,
        SIX: 6,
        SEVEN: 7,
        EIGHT: 8,
        DEFAULT: 9,
        FLAG: 10,
        UNKNOWN: 12,
        MINE: 13
    };
    
    this.column = column;
    this.row = row;
    this.x = column * config.tileWidth;
    this.y = row * config.tileHeight;
    this.onRevealed = new Phaser.Signal();
    this.onFlag = new Phaser.Signal();
    
    
    var tile = this;
    var currentState = this.states.DEFAULT;
    var currentValue = 0;
    

    
    var sprite = game.add.sprite(this.x, this.y, 'tiles', currentState, group);
    
    var init = function () {        
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(click, this);
    };
        
    //klik na policko    
    var click = function () {

        if (window.buttonTile.currentState == 10)
        {
            tile.flag();
        }
        else if (window.buttonTile.currentState == 9 && currentState==9)
        { 
            tile.reveal();
        }

    }
    
    //odhaleni policka
    this.reveal = function () {
        sprite.animations.frame = currentValue;
        sprite.inputEnabled = false;
        tile.onRevealed.dispatch(tile);
    };
    
    this.setValue = function (value) {
        currentValue = value;
    };
    
    this.getValue = function () {
        return currentValue;
    };
    
    this.getState = function () {
        return currentState;
    };
    
    this.setState = function (value) {
        currentState = value;
        sprite.animations.frame= value;
    };
    
    //zda je odhalene
    this.isRevealed = function () {
        return (sprite.animations.frame == currentValue);
    };
    
    //vlajka
    this.flag = function () {
 
        if (currentState == tile.states.DEFAULT) {
            currentState = tile.states.FLAG;
        } else if (currentState == tile.states.FLAG) {
            currentState = tile.states.UNKNOWN;
        } else if (currentState == tile.states.UNKNOWN) {
            currentState = tile.states.DEFAULT;
        }
        tile.onFlag.dispatch(tile);
        sprite.animations.frame = currentState;
    };
    
    this.enable = function(enable) {
        sprite.inputEnabled = enable;
    }
    init();
};