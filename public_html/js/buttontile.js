var Buttontile = function (x, y) {
    
    this.states = {
        DEFAULT: 9,
        FLAG: 10
    };
    

    this.x = x;
    this.y = y;
    
    this.currentState = this.states.DEFAULT;
    
    
    var sprite = game.add.sprite(this.x, this.y, 'tiles', this.currentState);
    
    var init = function () {        
        sprite.inputEnabled = true;
        sprite.events.onInputDown.add(click, this);
    };
        
    var click = function () {
        if (window.buttonTile.currentState == 9) {
            window.buttonTile.currentState = 10;
            sprite.animations.frame = window.buttonTile.currentState;
        } else {
            window.buttonTile.currentState = 9;
            sprite.animations.frame = window.buttonTile.currentState;
        }
        
        
    }
    
    init();
};