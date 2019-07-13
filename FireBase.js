
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

        // Initialize Cloud Firestore through Firebase
        // firebase.initializeApp({
        //     apiKey: '### FIREBASE API KEY ###',
        //     authDomain: '### FIREBASE AUTH DOMAIN ###',
        //     projectId: '### CLOUD FIRESTORE PROJECT ID ###'
        // });
        
        this.db = firebase.firestore();


        // Create or Write to database
        // db.collection("users").add({    // Can aluse use .set()
        //     first: "Ada",
        //     last: "Lovelace",
        //     born: 1815,
        //     color: "red"
        // })
        // .then(function(docRef) {
        //     console.log("Document written with ID: ", docRef.id);
        // })
        // .catch(function(error) {
        //     console.error("Error adding document: ", error);
        // });

        // Read from database
        // db.collection("users").get().then((querySnapshot) => {
        //     querySnapshot.forEach((doc) => {
        //         console.log(`${doc.id} => ${doc.data()}`);
        //     });
        // });

        // const docRef = db.collection("users").doc("jens");
        const docRef = this.db.doc("users/jens");
        docRef.set({
            first: "Ada",
            last: "Lovelace",
            born: 1815,
            color: "red"
        })
        .then(function(ref){
            // console.log("Document written with ID: ", ref.id);
            console.log("Document written");
        })
        .catch(function(error){
            console.error("Error adding document: ", error);
        });

        // On data change
        // getRealtimeUpdates = function(){
        //     docRef.onSnapshot(function (doc){
        //         if(doc && doc.exists){
        //             console.log("Data got updated");
        //         }
        //     });
        // }
        // getRealtimeUpdates();

        // docRef.onSnapshot(function (doc){
        //     if(doc && doc.exists){
        //         const data = doc.data();
        //         console.log("Data got updated to ", data);
        //     }
        // });
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

    // Send a reference for the player objet you want to create.
    createUser(userName, player){
        // Create or Write to database
        this.db.collection("users").add({
            first: userName,
            color: "green",
            posX: player.getPositionX(),
            posY: player.getPositionY()
        })
        .then(function(docRef) {
            console.log("Created player with id : ", docRef.id);
            player.setIdAndColor(docRef.id, "green");
        })
        .catch(function(error) {
            console.error("Error creating player: ", error);
        });
        return -1;
    }

    updatePlayerPosition(id, posX, posY){
        const path = "users/" + id;
        const docRef = this.db.doc(path);
        docRef.set({
            posX: posX,
            posY: posY
        })
        .then(function(ref){
            // console.log("Document written with ID: ", ref.id);
            console.log("Updated player position");
        })
        .catch(function(error){
            console.error("Error updating player position: ", error);
        });
    }

    getUniqueColor(){
        // Create a list with all possible colors
        // Loop through the colors and check if any player uses that color.
    }

    // Will create user if user don't exist.
    updateUser(userName){

    }
}