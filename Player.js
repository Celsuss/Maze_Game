
class Player{
    constructor(radius, room, mazeGenerator, db, id=0){
        this.posX = 10;
        this.posY = 10;
        this.gridPosX = 0;
        this.gridPosY = 0;
        this.radius = radius;
        this.room = room;
        this.mazeGenerator = mazeGenerator;
        this.db = db;

        this.id = -1;
        this.color = "green";

        this.setRandomStartingPosition();
        if(id == 0){
            this.db.createUser("test", this);
        }
        else{
            this.setIdAndColor(id, "blue");
        }

        document.addEventListener('keydown', this.move.bind(this));      
        this.onDestroy();
    }

    onDestroy(){
        // var self = this;
        // var id = this.id;
        // window.onbeforeunload = function (e) {
        //     // this.db.removePlayer(this.id);
        //     this.id = 0;
        //     self.db.removePlayer(id);
        //     var message = "Your confirmation message goes here.",

        //     e = e || window.event;
        //     // For IE and Firefox
        //     if (e) {
        //         e.returnValue = message;
        //     }   
          
        //     // For Safari
        //     return message;
        //   };
    }

    setIdAndColor(id, color){
        this.id = id;
        this.color = color;
        this.listenForPositionChange();
    }

    listenForPositionChange(){
        const path = "users/" + this.id;
        const docRef = this.db.getDB().doc(path);
        docRef.onSnapshot(function(doc) {
            // console.log("Current data: ", doc.data());
            this.posX = doc.data()["posX"];
            this.posY = doc.data()["posY"];
        });
    }

    setRandomStartingPosition(){
        const cell = this.mazeGenerator.getRandomGridCell();
        this.posX = cell.getPositionX();
        this.posY = cell.getPositionY();
        this.gridPosX = cell.getGridPositionX();
        this.gridPosY = cell.getGridPositionY();
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
        this.db.updatePlayerPosition(this.id, this.posX, this.posY);
    }

    draw(){
        var canvas = document.getElementById('canvas');
        // Always check for properties and methods, to make sure your code doesn't break in other browsers.
        if (canvas.getContext) {
            var context = canvas.getContext('2d');  
            // Reset the current path
            context.beginPath();
            context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
            context.fillStyle = this.color;
            context.fill();
            // Draw the circle
            context.stroke();
            // console.log("Pos x " + this.posX);
            // console.log("Pos y " + this.posY);
        }
    }

    getPositionX(){
        return this.posX;
    }

    getPositionY(){
        return this.posY;
    }
}