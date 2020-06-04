var Timer = function (x, y) {
 
    var count = 0;
    var time = game.add.text(x, y, "Čas: "+count, fontStyles.counterFontStyle);
    time.anchor.set(0, 0.5);
    
    var timer = game.time.events;
    
    this.start = function () {
        timer.loop(1000, update, this);
        timer.start();
    }
    
    this.stop = function () {
        timer.stop();
    }
    
    var update = function () {
        count ++;
        time.text = "Čas: " + count;
    }
 
}