
class Wall{
    constructor(posX, posY, width, height){
        this.posX1 = posX;
        this.posY1 = posY;
        this.posX2 = posX + width;
        this.posY2 = posY + height;
        this.width = width;
        this.height = height;
    }

    getPosition1(){
        return this.posX1, this.posY1;
    }

    getPosition2(){
        return this.posX2, this.posY2;
    }

    draw(){
        var canvas = document.getElementById('canvas');
        // Always check for properties and methods, to make sure your code doesn't break in other browsers.
        if (canvas.getContext) {
            var context = canvas.getContext('2d');
            // Reset the current path
            context.beginPath(); 
            // Staring point (10,45)
            context.moveTo(this.posX1, this.posY1);
            // End point (180,47)
            context.lineTo(this.posX2, this.posY2);
            // Make the line visible
            context.stroke();
        }
     }
}