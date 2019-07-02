
class Player{
    constructor(posX, posY, radius){
        this.posX = posX;
        this.posY = posY;
        this.radius = radius;

        document.addEventListener('keydown', this.move.bind(this));      
    }

    move(event){
        var dirX = 0;
        var dirY = 0;
        switch(event.keyCode){
            case 37:
            case 65:
                // Left direction
                dirX = -1;
                console.log("Move left");
                break;
            case 39:
            case 68:
                // Right direction
                dirX = 1;
                console.log("Move right");
                break;
            case 38:
            case 87:
                // Up direction
                dirY = -1;
                console.log("Move up");
                break;
            case 40:
            case 83:
                // Down direction
                dirY = 1;
                console.log("Move down");
                break;
        }
        this.posX += (dirX * (this.radius*2));
        this.posY += (dirY * (this.radius*2));
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
            // console.log("Pos x " + this.posX);
            // console.log("Pos y " + this.posY);
        }
    }
}