    (() =>{
        firebase.initializeApp({
            apiKey: process.env.FIREBASE_API,
            authDomain: process.env.FIREBASE_DOMAIN,
            databaseURL: process.env.FIREBASE_DB,
            projectId: process.env.IREBASE_ID,
            storageBucket: process.env.FIREBASE_STORAGE,
            messagingSenderId: process.env.FIREBASE_IDSEND
        });

        return cloudDB ={
            use: firebase.firestore()
        };
    })();