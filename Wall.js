
class Wall{
    constructor(posX, posY, width, height){
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
    }

    getPosition(){
        return this.posX, this.posY;
    }

    draw(){
        var canvas = document.getElementById('canvas');
        // Always check for properties and methods, to make sure your code doesn't break in other browsers.
        if (canvas.getContext) {
            var context = canvas.getContext('2d');
            // Reset the current path
            context.beginPath(); 
            // Staring point (10,45)
            context.moveTo(this.posX, this.posY);
            // End point (180,47)
            context.lineTo(this.posX + this.width, this.posY + this.height);
            // Make the line visible
            context.stroke();
        }
     }
}