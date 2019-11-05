//<script src="https://www.gstatic.com/firebasejs/7.2.2/firebase-app.js"></script>
async function inicializar(){
	// Your web app's Firebase configuration
	const firebaseConfig = {
	  	apiKey: "AIzaSyAmTGCzHl7-SxeNf8q81Nt01n67vjqfv0U",
	  	authDomain: "cesfam-francia.firebaseapp.com",
	  	databaseURL: "https://cesfam-francia.firebaseio.com",
	    projectId: "cesfam-francia",
	    storageBucket: "cesfam-francia.appspot.com",
	    messagingSenderId: "1098474308171",
	    appId: "1:1098474308171:web:ce3d547564502df8f3c3ce"
	};
	// Initialize Firebase
	await firebase.initializeApp(firebaseConfig);

	await firebase.auth().onAuthStateChanged( async function(user) {
	    if (user){
	    	await firebase.auth().currentUser.getIdToken(/* forceRefresh */ true).then(function(idToken) {
		        if(idToken!=null){
		        	setTimeout("despliegue()", 1000);
		        } else{
		        	document.getElementById("loading").innerHTML = "";
		        }
		    });
	    }else{
	    	document.getElementById("loading").innerHTML = "";	
	    }
	    
	});
}

function loginF(){
	document.getElementById("loading").innerHTML = "<div class='spinner-border' role='status' style='color:#00c0b7'><span class='sr-only'>Loading...</span></div><p style='color:#00c0b7'><small>comprobando sesión</small></p>";
	var entrar=true;
	var p = document.forms["login"]["pass"].value.toString();
    var u = document.forms["login"]["user"].value.toString();
	var aviso=document.getElementById("aviso");

    firebase.auth().signInWithEmailAndPassword(u, p).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        entrar=false;
        //errorCode == "auth/wrong-password"
        if(errorCode=="auth/too-many-requests"){
            aviso.innerHTML="Has intentado muchas veces, vuelve a inentarlo más tarde";
            document.getElementById("loading").innerHTML ="";
        }
        else{
            aviso.innerHTML="Contraseña y/o correo electrónico inválidos";
            document.getElementById("loading").innerHTML ="";
        }
      // ...
    }).then(function(resultado){
        if(entrar){
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    aviso.innerHTML="¡sesión iniciada!";
                    setTimeout("despliegue()", 1000);
                    document.getElementById("loading").innerHTML ="";
                }
            });
        }
    });
    return false;
}

function sacar(){
    window.location.href="login.html";
}

function despliegue(u, p, pag){
	document.getElementById("content").innerHTML="<div id='informacion'></div>";
	document.getElementById("informacion").innerHTML = "<button type='button' class='btn btn-outline-primary' style='float:right' onClick='logOut()'>Log Out</button>";
	var usuario = new Usuario();
}

async function logOut(){
	firebase.auth().signOut().then(function(){
		document.getElementById("content").innerHTML="deslogueado";
	});
}
class Visita{
	constructor(){
		this.especialidades;
		this.eventos;
	}
	
}
class Usuario{
	constructor(){
		this.user;
		this.especialidades;
		this.eventos;
		this.reuniones;
	}
	obtenerUsuario(user, pass){

	}
}