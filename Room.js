
class Room{
    constructor(posX, posY, gridPosX, gridPosY, width, height, index){
        this.posX = posX;
        this.posY = posY;
        this.gridPosX = gridPosX;
        this.gridPosY = gridPosY;
        this.width = width;
        this.height = height;
        this.index = index;

        this.visited = false;

        this.top = "top";
        this.right = "right";
        this.bottom = "bottom";
        this.left = "left";

        this.walls = {}
        this.createWalls();
    }

    createWalls(){
        var x = this.posX - this.width/2;
        var y = this.posY - this.height/2;
        var topWall = new Wall(x, y, this.width, 0);
        this.walls["top"] = topWall;

        x = this.posX + this.width/2;
        y = this.posY - this.height/2;
        var rightWall = new Wall(x, y, 0, this.height);
        this.walls["right"] = rightWall;

        x = this.posX + this.width/2;
        y = this.posY + this.height/2;
        var bottomWall = new Wall(x, y, -this.width, 0);
        this.walls["bottom"] = bottomWall;

        x = this.posX - this.width/2;
        y = this.posY + this.height/2;
        var leftWall = new Wall(x, y, 0, -this.height);
        this.walls["left"] = leftWall;
    }

    hasWall(wall){
        return wall in this.walls;

        // if(wall in this.walls){
        //     return true;
        // }
        // return false;
    }

    destroyWall(wall){
        delete this.walls[wall];
    }

    setVisited(value){
        this.visited = value;
    }

    getVisited(){
        return this.visited;
    }

    getWall(name){
        return this.walls[name];
    }

    getPositionX(){
        return this.posX;
    }

    getPositionY(){
        return this.posY;
    }

    getGridPositionX(){
        return this.gridPosX;
    }

    getGridPositionY(){
        return this.gridPosY;
    }

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }

    getIndex(){
        return this.index;
    }

    draw(){
        if(this.top in this.walls){
            this.walls[this.top].draw();
        }
        if(this.right in this.walls){
            this.walls[this.right].draw();
        }
        if(this.bottom in this.walls){
            this.walls[this.bottom].draw();
        }
        if(this.left in this.walls){
            this.walls[this.left].draw();
        }
    }
}