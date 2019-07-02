
class Player{
    constructor(posX, posY, gridPosX, gridPosY, radius, room, mazeGenerator){
        this.posX = posX;
        this.posY = posY;
        this.gridPosX = gridPosX;
        this.gridPosY = gridPosY;
        this.radius = radius;
        this.room = room;
        this.mazeGenerator = mazeGenerator;

        document.addEventListener('keydown', this.move.bind(this));      
    }

    move(event){
        var dirX = 0;
        var dirY = 0;

        switch(event.keyCode){
            case 37:
            case 65:
                // Left direction
                if(!this.room.hasWall("left")){
                    dirX = -1;
                }
                break;
            case 39:
            case 68:
                // Right direction
                if(!this.room.hasWall("right")){
                    dirX = 1;
                }
                break;
            case 38:
            case 87:
                // Up direction
                if(!this.room.hasWall("top")){
                    dirY = -1;
                }
                break;
            case 40:
            case 83:
                // Down direction
                if(!this.room.hasWall("bottom")){
                    dirY = 1;
                }
                break;
        }
        this.posX += (dirX * (this.radius*2));
        this.posY += (dirY * (this.radius*2));
        this.gridPosX = this.gridPosX + dirX;
        this.gridPosY = this.gridPosY + dirY;

        this.room = this.mazeGenerator.getRoomFromGridPosition(this.gridPosX, this.gridPosY);
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