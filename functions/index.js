const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

/*const admin = require('firebase-admin');
admin.initializeApp();
const db = admin.firestore();
const rDB = admin.database();*/

exports.basic = functions.https.onRequest((req, res) => {
     if(req.method === 'POST') { //Verifica si es GET
     	var name=req.body;
 		res.json(name);
     }
     res.status(200).send("recibi2");
 })
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
