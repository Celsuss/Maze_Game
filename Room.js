
class Room{
    constructor(posX, posY, width, height){
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;

        this.visited = false;

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

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }

    draw(){
        var top = "top";
        var right = "right";
        var bottom = "bottom";
        var left = "left";

        if(top in this.walls){
            this.walls[top].draw();
        }
        if(right in this.walls){
            this.walls[right].draw();
        }
        if(bottom in this.walls){
            this.walls[bottom].draw();
        }
        if(left in this.walls){
            this.walls[left].draw();
        }
    }
}