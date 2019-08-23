
class FireBase{
    constructor(){
        var firebaseConfig = {
            apiKey: "AIzaSyBW29zLdR7dPSf_xHnafhcgOFNpRMgIAB4",
            authDomain: "maze-game-7837a.firebaseapp.com",
            databaseURL: "https://maze-game-7837a.firebaseio.com",
            projectId: "maze-game-7837a",
            storageBucket: "",
            messagingSenderId: "158239574084",
            appId: "1:158239574084:web:98dafcec25730c58"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        
        this.db = firebase.firestore();

        // this.authorise();
    }

    authorise(mazeGenrator){
        var self = this;

        firebase.auth().signInAnonymously().catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(error, "", message);
        });

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User is signed in.
                var isAnonymous = user.isAnonymous;
                self.uid = user.uid;
                self.setupRealtimeDBPressence();
                mazeGenrator.createAllPlayers(user.uid);
                console.log("User signed in with uid ", user.uid);
            }
            else {
                // User is signed out.
                console.log("User signed out");
            }
        });
    }

    setupRealtimeDBPressence(){
        // Fetch the current user's ID from Firebase Authentication.
        var uid = firebase.auth().currentUser.uid;
        this.uid = uid;
        console.log("Firebase auth id ", uid);

        // Create a reference to this user's specific status node.
        // This is where we will store data about being online/offline.
        var userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
        var userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);

        // We'll create two constants which we will write to 
        // the Realtime database when this device is offline
        // or online.
        var isOfflineForDatabase = {
            state: 'offline',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };

        var isOnlineForDatabase = {
            state: 'online',
            last_changed: firebase.database.ServerValue.TIMESTAMP,
        };

        var isOfflineForFirestore = {
            state: 'offline',
            last_changed: firebase.firestore.FieldValue.serverTimestamp(),
        };

        var isOnlineForFirestore = {
            state: 'online',
            last_changed: firebase.firestore.FieldValue.serverTimestamp(),
        };

        // Create a reference to the special '.info/connected' path in 
        // Realtime Database. This path returns `true` when connected
        // and `false` when disconnected.
        firebase.database().ref('.info/connected').on('value', function(snapshot) {
            // If we're not currently connected, we'll set Firestore's state
            // to 'offline'. This ensures that our Firestore cache is aware
            // of the switch to 'offline.
            if (snapshot.val() == false) {
                userStatusFirestoreRef.set(isOfflineForFirestore);
                return;
            };

            // If we are currently connected, then use the 'onDisconnect()' 
            // method to add a set which will only trigger once this 
            // client has disconnected by closing the app, 
            // losing internet, or any other means.
            userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function() {
                // The promise returned from .onDisconnect().set() will
                // resolve as soon as the server acknowledges the onDisconnect() 
                // request, NOT once we've actually disconnected:
                // https://firebase.google.com/docs/reference/js/firebase.database.OnDisconnect

                // We can now safely set ourselves as 'online' knowing that the
                // server will mark us as offline once we lose connection.
                userStatusDatabaseRef.set(isOnlineForDatabase);

                // We'll also add Firestore set here for when we come online.
                userStatusFirestoreRef.set(isOnlineForFirestore);
            });
        });
    }

    getMazeSeedDocRef(){
        return this.db.doc("maze/settings");
    }

    getMazeSeed(mazeGenrator){ 
        const docRef = this.db.doc("maze/settings");

        docRef.get().then(function(doc) {
            if (doc.exists) {
                console.log("Document data:", doc.data());
                const seed = doc.data()["seed"];
                console.log("Seed ", seed);
                mazeGenrator.generate(seed);
            }
            else {
                console.log("No such document!");
            }
        }).catch(function(error) {
            console.log("Error getting document:", error);
        });

        return -1;
    }

    createPlayerInDB(player){
        this.createPlayerPosition(player);
        return this.uid;
    }

    createPlayerPosition(player){
        const uid = this.uid;
        this.db.collection("position").doc(uid).set({
            posX: player.getPositionX(),
            posY: player.getPositionY()
        })
        .then(function(docRef) {
            // When we have the id we can create the position for this player
            console.log("Created player position");
        })
        .catch(function(error) {
            console.error("Error creating player position: ", error);
        });
    }

    updatePlayerPosition(uId, posX, posY){
        if(uId == 0){
            return;
        }

        const path = "position/" + uId;
        const docRef = this.db.doc(path);
        docRef.update({
            posX: posX,
            posY: posY
        })
        .then(function(ref){
            // console.log("Document written with ID: ", ref.id);
            console.log("Updated player position");
        })
        .catch(function(error){
            console.error("Error updating player position: ", error, " with id: ", uId);
        });
    }

    removePlayer(id){
        console.log("Removing player");
        const path = "users/" + id;
        const docRef = this.db.doc(path);


        docRef.delete().then(function(ref){
            console.log("Removed player");
        })
        .catch(function(error){
            console.error("Error removing player: ", error);
        });
    }

    getUniqueColor(){
        // Create a list with all possible colors
        // Loop through the colors and check if any player uses that color.
    }

    // Will create user if user don't exist.
    updateUser(userName){

    }

    getDB(){
        return this.db;
    }

    getAllPlayers(){
        var players = [];
        this.db.collection("users").get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                players.push(doc.id);
                console.log(`${doc.id} => ${doc.data()}`);
            });
        });
    }
}