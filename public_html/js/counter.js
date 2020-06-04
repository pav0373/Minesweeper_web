var Counter = function (x, y, defaultValue) {
 
    var currentValue = defaultValue;
    var mines = game.add.text(x, y, "Min: " + defaultValue, fontStyles.counterFontStyle);
    mines.anchor.set(1, 0.5);
    
    this.update = function (value) {
        mines.text = "Min: " + (currentValue-value);
    }
 
}