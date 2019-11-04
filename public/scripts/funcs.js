//<script src="https://www.gstatic.com/firebasejs/7.2.2/firebase-app.js"></script>
async function inicializar(){
	var firebaseConfig = {
	    apiKey: "AIzaSyAmTGCzHl7-SxeNf8q81Nt01n67vjqfv0U",
	    authDomain: "cesfam-francia.firebaseapp.com",
	    databaseURL: "https://cesfam-francia.firebaseio.com",
	    projectId: "cesfam-francia",
	    storageBucket: "cesfam-francia.appspot.com",
	    messagingSenderId: "1098474308171",
	    appId: "1:1098474308171:web:ce3d547564502df8f3c3ce"
	};
	firebase.initializeApp(firebaseConfig);
	firebase.auth().onAuthStateChanged( async function(user) {
		if (user) {
		  	var user = firebase.auth().currentUser;
		  	await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
		  		var validado= true;
		  		if(idToken===null){
		  			window.location.href="../index.html";
		  		}
			}).catch(function(error) {
				window.location.href="../index.html";
			});

			await firebase.firestore().collection("Usuarios").where("nombre","==",user.displayName).get()
			.then(function(querySnapshot) {
				var validado= true;
			});
		}
		else{
			window.location.href="../index.html";
		}
	});
}
class Visita{
	constructor(){
		this.user;	
	}
	
}
class Usuario{
}
class Admin extends Usuario{
	constructor(){
		super();
	}
}

function loginF(){
	var p = document.forms["login"]["pass"].value.toString();
    var u = document.forms["login"]["user"].value.toString();

    if(p=="admin" && u=="admin@correo"){
    	document.getElementById("aviso").innerHTML = "conectado";
    	document.getElementById("aviso").style.class = "text-success";
    }
    return false;
}