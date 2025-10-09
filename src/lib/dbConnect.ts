import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?:number
}

const connection: ConnectionObject ={
}

async function dbConnect():Promise<void>{
    if(connection.isConnected){
        console.log("Already connected to database");
        return
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI ||'',{})
        connection.isConnected=db.connections[0].readyState
    console.log("db connected succesfully!")

    } catch (error) {
        console.log("Database connection failed",error)
        process.exit(1)
    }
}

export default  dbConnect;

// import {initializeApp, getApps, getApp, FirebaseOptions,FirebaseApp} from "firebase/app"
// import { getFirestore, Firestore } from "firebase/firestore"
// import { getAuth, Auth } from "firebase/auth"
// import { getStorage, FirebaseStorage } from "firebase/storage"

// type FirebaseServices={
//     app?:FirebaseApp;
//     db?:Firestore;
//     auth?:Auth;
//     storage?:FirebaseStorage;
// }

// const cached:FirebaseServices={};

// function getFirebaseConfig():FirebaseOptions{
//     if(process.env.FIREBASE_CONFIG){
//         try {
//             const config = JSON.parse(process.env.FIREBASE_CONFIG)
//             if(config && config.apiKey) return config
//         } catch (error) {
//             console.warn('Warning: Failed to parse NEXT_PUBLIC_FIREBASE_CONFIG.')
//         }
//     }

//     const firebaseConfig:FirebaseOptions = {
//         apiKey: process.env.FIREBASE_API_KEY,
//         authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//         projectId: process.env.FIREBASE_PROJECT_ID,
//         storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//         messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//         appId: process.env.FIREBASE_APP_ID,
//     }

//     if(!firebaseConfig.apiKey||!firebaseConfig.projectId){
//         throw new Error('Firebase configuration is incomplete. Check your .env.local file.')
//     }

//     return firebaseConfig;
// }

// export async function connectionToFirebase():Promise<FirebaseServices>{
//     if(cached.db && cached.auth&& cached.storage){
//         console.log("Using cached firebase services")
//         return cached;
//     }
//     try {

//         const app = !getApps().length? initializeApp(getFirebaseConfig()):getApp();

//         console.log("getApps(): ",getApps(),"getApps()'s length: ",getApps().length)
//         console.log("Firebase app : ",app)
//         console.log("getApp(): ",getApp())

//         const db = getFirestore(app);
//         const auth = getAuth(app);
//         const storage = getStorage(app);

//         console.log("Firestore instance: ",db)
//         console.log("Auth instance: ",auth)
//         console.log("Storage instance: ",storage)

//         cached.app = app;
//         cached.db = db;
//         cached.auth = auth;
//         cached.storage = storage;

//         console.log('Firebase connected and services initialized!')
//         return cached

//     } catch (error) {
//         console.error("Failed to connect Firebase: ",error)
//         process.exit(1)
//     }
// }
