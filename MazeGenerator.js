
class MazeGenerator{
    constructor(width, height, db){
        this.width = width;
        this.height = height;
        this.db = db;
        this.maze = [];
        this.player = 0;
        this.players = [];
        
        this.db.authorise(this);
    }

    /**
     * Get a seed from the database and calls the
     * generate() function passing the seed as an argument.
     */
    loadSeedAndGenerate(){
        const docRef = this.db.getMazeSeedDocRef();
        var self = this;
        docRef.get().then(function(doc){
            if(doc.exists){
                const seed = doc.data()["seed"];
                self.generate(seed);
            }
            else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });
    }

    /**
     * Generates a maze using a random seed.
     * 
     * @param randomSeed    a seed to use when getting a random integer.
     */
    generate(randomSeed){
        var rng = new Math.seedrandom(randomSeed);

        // Pick a random starting room
        var roomIndexes = [];
        var index = Math.floor(rng() * this.maze.length+1);
        this.maze[index].setVisited(true);
        roomIndexes.push(index);

        var done = false;
        while(roomIndexes.length > 0){
            var neightboursIndexes = this.getNeighboursNotVisited(index);
            if(neightboursIndexes.length == 0){
                // Backtrack
                roomIndexes.pop();
                index = roomIndexes[roomIndexes.length-1];
            }
            else{
                // Pick random neighbour
                var rndNeighbour = Math.floor(rng() * neightboursIndexes.length);
                var newIndex = neightboursIndexes[rndNeighbour];
                this.breakWall(newIndex, index);
                index = newIndex;
                this.maze[index].setVisited(true);
                roomIndexes.push(index);
            }
        }
    }

    /**
     * Find and return the left, up, right and down neighbours belonging to a room
     * that has not previously been visited.
     * 
     * @param index The index of the cell whose neighbours will be returned.
     * @return      An array containing rooms.    
     */
    getNeighboursNotVisited(index){
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

    /**
     * Compare two rooms to see if they are neighbours.
     * 
     * @param index1    Index in maze for room one.
     * @param index2    Index in maze for room two.
     * @return          Return true if rooms are neighbours, else return false.
     */
    isNeighbour(index1, index2){
        const room1 = this.maze[index1];
        const room2 = this.maze[index2];
        const x1 = room1.getPositionX();
        const y1 = room1.getPositionY();
        const x2 = room2.getPositionX();
        const y2 = room2.getPositionY();
        const w = room1.getWidth();
        const h = room1.getHeight();

        if(Math.abs(x2-x1) != w && Math.abs(y2-y1) != h ||
          (Math.abs(x2-x1) == w && Math.abs(y2-y1) == h)){
            console.log("Error, rooms are not neighbours.")
            return false;
        }
        return true;
    }

    /**
     * Breaks the walls that is between two neighbouring rooms.
     * Both rooms will a overlapping wall, this is the wall that will be deleted.
     * 
     * @param index1    Index of the first room in the maze.
     * @param index2    Index of the second room in the maze.
     */
    breakWall(index1, index2){
        if(!this.isNeighbour(index1, index2))
            return;

        const room1 = this.maze[index1];
        const room2 = this.maze[index2];
        const x1 = room1.getPositionX();
        const y1 = room1.getPositionY();
        const x2 = room2.getPositionX();
        const y2 = room2.getPositionY();
        const w = room1.getWidth();
        const h = room1.getHeight();

        if(x2 < x1){
            // Break left and right wall
            room1.destroyWall("left");
            room2.destroyWall("right");
        }
        else if(x2 > x1){
            // Break right and left wall
            room1.destroyWall("right");
            room2.destroyWall("left");
        }
        else if(y2 < y1){
            // Break top and bottom wall
            room1.destroyWall("top");
            room2.destroyWall("bottom");
        }
        else if(y2 > y1){
            // Break bottom and top wall
            room1.destroyWall("bottom");
            room2.destroyWall("top");
        }
    }

    initialize(){
        const width = 20;
        const height = 20;
        var x = width/2;
        var y = height/2;
        
        for(var i = 0; i < this.height; i++){
            for(var j = 0; j < this.width; j++){
                var room = new Room(x, y, j, i, width, height);
                this.maze.push(room);
                x += width;
            }
            x = width/2;
            y += height;
        }
        
        this.loadSeedAndGenerate();
    }
    
    createAllPlayers(localPlayerId){
        this.player = new Player(this, this.db);
        var self = this;

        this.db.getDB().collection("status").where("state", "==", "online")
          .onSnapshot(function(querySnapshot) {
            var playerIds = [];

            querySnapshot.docChanges().forEach(function(change) {
                if(localPlayerId != change.doc.id && change.doc.data()["state"] == "online"){
                    if (change.type === "added") {
                        console.log(change.doc.id, " added to game");
                        playerIds.push(change.doc.id);
                    }
                    else if (change.type === "modified") {
                        // console.log("modified snapshot of player: ", change.doc.id);
                        playerIds.push(change.doc.id);
                    }
                    else
                        console.log("? ", change.type, " snapshot of player: ", change.doc.id);
                }
            });
            self.spawnPlayers(playerIds);
        });
    }

    /**
     * Create a player object for each id in playerIds.
     * 
     * @param playerIds     An array containg id's of players to create.
     */
    spawnPlayers(playerIds){
        for(var i = 0; i < playerIds.length; i++){
            var player = new Player(this, this.db, playerIds[i]);
            player.listenForDisconnect();
            this.players.push(player);
        }
    }

    removeOfflinePlayers(){
        for(var i = 0; i < this.players.length; i++){
            if(!this.players[i].isOnline()){
                var removed = this.players.splice(i, 1);
            }
        }
    }

    draw(){
        for(var i = 0; i < this.maze.length; i++)
            this.maze[i].draw();
        
        for(var i = 0; i < this.players.length; i++)
            this.players[i].draw();

        if(this.player != 0)
            this.player.draw();
    }

    getRoom(index){
        if(index < this.maze.length){
            return this.maze[index];
        }
        return null;
    }

    getRoomFromGridPosition(posX, posY){
        var index = posX + (posY * this.width);
        if(index < this.maze.length){
            return this.maze[index];
        }
        return 0;
    }

    getMazeWidth(){
        return this.width;
    }

    getMazeHeight(){
        return this.height;
    }

    getRandomGridCell(){
        return this.maze[Math.floor(Math.random() * this.maze.length-1)];
    }
}