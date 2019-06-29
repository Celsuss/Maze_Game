
class Player{
    constructor(posX, posY, radius){
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;
    }

    draw(){
        var canvas = document.getElementById('canvas');
        // Always check for properties and methods, to make sure your code doesn't break in other browsers.
        if (canvas.getContext) {
            var context = canvas.getContext('2d');
            // Reset the current path
            context.beginPath();
            context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            context.fillStyle = 'green';
            context.fill();
            // Draw the circle
            context.stroke();
        }
    }
}