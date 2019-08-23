
class Player{
    constructor(mazeGenerator, db, id=0){
        this.posX = 10;
        this.posY = 10;
        this.gridPosX = 0;
        this.gridPosY = 0;
        this.radius = 10;
        this.room = 0;
        this.mazeGenerator = mazeGenerator;
        this.db = db;
        this.onlineStatus = true;

        if(id == 0){
            // Local player
            this.localPlayer = true;
            this.color = "green";
            this.setRandomStartingPosition();
            this.id = this.db.createPlayerInDB(this);
        }
        else{
            // Remove player
            this.id = id;
            this.localPlayer = false;
            this.color = "blue";
            this.listenForPositionChange();
        }

        document.addEventListener('keydown', this.move.bind(this));
    }

    listenForDisconnect(){
        const path = "status/" + this.id;
        const id = this.id;
        const docRef = this.db.getDB().doc(path); 
        const self = this;

        docRef.onSnapshot(function(doc) {
            const status = doc.data()["state"];
            if(status == "offline")
                self.onlineStatus = false;
                // console.log("Setting offline player to offline");

            console.log("Player ", id, "status: ", status);
        });
    }

    listenForPositionChange(){
        var self = this;
        const path = "position/" + this.id;
        const docRef = this.db.getDB().doc(path);
        docRef.onSnapshot(function(doc) {
            self.posX = doc.data()["posX"];
            self.posY = doc.data()["posY"];
        });
    }

    setRandomStartingPosition(){
        const cell = this.mazeGenerator.getRandomGridCell();
        this.posX = cell.getPositionX();
        this.posY = cell.getPositionY();
        this.gridPosX = cell.getGridPositionX();
        this.gridPosY = cell.getGridPositionY();
        this.room = cell;
    }

    move(event){
        if(!this.localPlayer)
            return;

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

    setId(id){
        this.id = id;
    }

    getId(){
        return this.id;
    }

    isOnline(){
        return this.onlineStatus;
    }
}