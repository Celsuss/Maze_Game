
class MazeGenerator{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.maze = [];
    }

    generate(){
        this.initialize();

        // Pick a random starting room
        var rooms = []; // TODO: Remove this
        var roomIndexes = [];
        var index = Math.floor(Math.random() * this.maze.length+1);
        this.maze[index].setVisited(true);
        roomIndexes.push(index);

        var done = false;
        while(roomIndexes.length > 0){
            var neightboursIndexes = this.getNeighbours(index);
            if(neightboursIndexes.length == 0){
                // Backtrack
                roomIndexes.pop();
                index = roomIndexes[roomIndexes.length-1];
            }
            else{
                // Pick random neighbour
                var rndNeighbour = Math.floor(Math.random() * neightboursIndexes.length);
                var newIndex = neightboursIndexes[rndNeighbour];
                this.breakWall(newIndex, index);
                index = newIndex;
                this.maze[index].setVisited(true);
                roomIndexes.push(index);
            }
        }
    }

    // Return neighbours that has not been visited
    getNeighbours(index){
        var x = this.maze[index].getPositionX();
        var y = this.maze[index].getPositionY();
        var h = this.maze[index].getHeight();
        var w = this.maze[index].getWidth();
        var neightboursIndexes = [];

        var leftEdge = w/2;
        var topEdge = h/2;
        var rightEdge = (this.width*w)-(w/2);
        var bottomEdge = (this.height*h)-(h/2);

        if(x != leftEdge){
            // Add left neighbour
            var leftIndex = index - 1;
            if(!this.maze[leftIndex].getVisited()){
                neightboursIndexes.push(leftIndex);
            }
        }
        if(y != bottomEdge){
            // Add bottom neighbour
            var bottomIndex = index + this.width;
            if(!this.maze[bottomIndex].getVisited()){
                neightboursIndexes.push(bottomIndex);
            }
        }
        if(x != rightEdge){
            // Add right neighbour
            var rightIndex = index + 1;
            if(!this.maze[rightIndex].getVisited()){
                neightboursIndexes.push(rightIndex);
            }
        }
        if(y != topEdge){
            // Add top neighbour
            var topIndex = index - this.width;
            if(!this.maze[topIndex].getVisited()){
                neightboursIndexes.push(topIndex);
            }
        }
        return neightboursIndexes;
    }

    breakWall(index1, index2){
        var room1 = this.maze[index1];
        var room2 = this.maze[index2];
        var x1 = room1.getPositionX();
        var y1 = room1.getPositionY();
        var x2 = room2.getPositionX();
        var y2 = room2.getPositionY();
        
        if(x2 < x1){
            // Break left wall
            room1.destroyWall("left");
            room2.destroyWall("right");
        }
        else if(x2 > x1){
            // Break right wall
            room1.destroyWall("right");
            room2.destroyWall("left");
        }
        else if(y2 < y1){
            // Break top wall
            room1.destroyWall("top");
            room2.destroyWall("bottom");
        }
        else if(y2 > y1){
            room1.destroyWall("bottom");
            room2.destroyWall("top");
        }
    }

    initialize(){
        var width = 20;
        var height = 20;
        var x = width/2;
        var y = height/2;

        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++){
                var room = new Room(x, y, width, height);
                this.maze.push(room);
                x += width;
            }
            x = width/2;
            y += height;
        }
    }

    draw(){
        for(var i = 0; i < this.maze.length; i++){
            this.maze[i].draw();
        }
    }
}