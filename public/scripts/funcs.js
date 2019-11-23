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
		var token=true;
	    if (user){
	    	await firebase.auth().currentUser.getIdToken(true).then(function(idToken) {
		        if(idToken===null){
		        	document.getElementById("loading").innerHTML = "";
		        	token=false;
		        }
		    });
		    if(token){
		    	setTimeout(function(){
		    		despliegue(firebase.auth().currentUser,"intranet");
		    	}, 1000);	
		    }
	    }else{
	    	document.getElementById("loading").innerHTML = "";	
	    }
	    
	});
}
async function inicializarRegistro(){
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
}
function trim(x) {
    return x.replace(/^\s+|\s+$/gm,'');
}
function validateForm(){
	//limpieza de feedback
	var fN = document.getElementById("feedbackNombre");
	var fA = document.getElementById("feedbackApellidos");
	var fU = document.getElementById("feedbackUser");
	var fC = document.getElementById("feedbackCorreo");
	var fE = document.getElementById("feedbackEspecialidad");
	var fP = document.getElementById("feedbackContraseña");
	var fCP = document.getElementById("feedbackCContraseña");

	fN.innerHTML = "";
	fA.innerHTML = "";
	fU.innerHTML = "";
	fC.innerHTML = "";
	fE.innerHTML = "";
	fP.innerHTML = "";
	fCP.innerHTML = "";

	//Obtención 8de datos del formulario
	var n = trim(document.forms["register"]["nombre"].value.toString());
	var a = trim(document.forms["register"]["apellidos"].value.toString());
	var u = document.forms["register"]["user"].value.toString();
	var c = document.forms["register"]["correo"].value.toString();
	var e = document.forms["register"]["especialidad"].value.toString();
	var p = document.forms["register"]["contraseña"].value.toString();
	var cP = document.forms["register"]["cContraseña"].value.toString();

	//Verificación de llenado
	var paso = true;
	if(n==""){
		fN.innerHTML = "<div class='invalid-feedback'>No ha ingresado nombre</div>";
		paso=false;
	}else{
		fN.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
	}

	if(a==""){
		fA.innerHTML = "<div class='invalid-feedback'>No ha ingresado apellidos</div>";
		paso=false;
	}else{
		fA.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
	}

	if(u==""){
		fU.innerHTML = "<div class='invalid-feedback'>No ha ingresado usuario</div>";
		paso=false;
	}else{
		fU.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
	}

	if(c==""){
		fC.innerHTML = "<div class='invalid-feedback'>No ha ingresado correo</div>";
		paso=false;
	}else if(c.indexOf("@")==-1 || c.indexOf("@")==0){
		fC.innerHTML = "<div class='invalid-feedback'>dirección de correo inválida</div>";
		paso=false;
	}else{
		fC.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
	}

	if(e==""){
		fE.innerHTML = "<div class='invalid-feedback'>No ha ingresado especialidad</div>";
		paso=false;
	}else{
		fE.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
	}

	if(p==""){
		fP.innerHTML = "<div class='invalid-feedback'>No ha ingresado contraseña</div>";
		paso=false;
	}else{
		fP.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
	}

	if(cP==""){
		fCP.innerHTML = "<div class='invalid-feedback'>No ha ingresado contraseña</div>";
		paso=false;
	}else{
		fCP.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
	}
	if(paso==false){
		document.getElementById("loadingForm").innerHTML = "";
		return false;
	}

	paso = comprobarCorreo(c, "b");
    if(paso==false){
    	fC.innerHTML = "<div class='invalid-feedback'>Dirección de correo en uso</div>";
    	document.getElementById("loadingForm").innerHTML = "";
		return false;
	}else{
		fC.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
	}

	document.getElementById("loadingForm").innerHTML = "<div class='spinner-border' role='status' style='color:#00c0b7'><span class='sr-only'>Loading...</span></div><p style='color:#00c0b7'><small>registrando usuario</small></p>";
	$('#registro').modal('show');
	document.getElementById("mNombres").innerHTML = "Nombre(s): " + n;
	document.getElementById("mApellidos").innerHTML = "Apellido(s): " + a;
	document.getElementById("mUser").innerHTML = "Nombre de Usuario: " + u;
	document.getElementById("mCorreo").innerHTML = "Correo electrónico: " + c;
	document.getElementById("mEspecialidad").innerHTML = "Especialidad: " + e;
	return false;
}
async function comprobarCorreo(c, cecosf){
	paso=true;
	await db.collection("Usuarios").where("cecosf","==",cecosf).get()
        .then(function(querySnapshot) {
	            // doc.data() is never undefined for query doc snapshots
            var tam=querySnapshot.size;
            var i = 0;
            while(c!=querySnapshot.docs[i].data().correo || i < tam){
            	i++;
            }
            if(i!=tam){
            	paso=false;
            }
        });
    return paso;
}
async function agregarUsuario(){
	var n = document.forms["register"]["nombre"].value.toString();
	var a = document.forms["register"]["apellidos"].value.toString();
	var u = document.forms["register"]["user"].value.toString();
	var c = document.forms["register"]["correo"].value.toString();
	var e = document.forms["register"]["especialidad"].value.toString();
	var p = document.forms["register"]["contraseña"].value.toString();

	var validado = true;
    await firebase.auth().createUserWithEmailAndPassword(c, p).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      validado = false;
      // Si no se logra el registro por un error de Firebase, se muestra en el campo correspondiente al error:
      if(error.code=="auth/weak-password"){
        document.getElementById("contraseña").innerHTML= "<div class='invalid-feedback'>Contraseña debe tener más de 6 caracteres</div>";
        document.getElementById("loadingForm").innerHTML = "";
      }
      if(error.code=="auth/email-already-in-use"){
        document.getElementById("correo").innerHTML= "<div class='invalid-feedback'>Correo ya en uso</div>";
        document.getElementById("loadingForm").innerHTML = "";
      }
      //EN CASO INVESTIGACIÓN FUTURA SOBRE OTROS ERRORES USAR:
      //aviso.innerHTML=errorCode;
    }).then(async function(){
	    	await firebase.auth().signInWithEmailAndPassword(c, p).catch(function(error) {
	        var errorCode = error.code;
	        var errorMessage = error.message;
	        validado = false;
	    }).then( async function(user){
	        await firebase.firestore().collection("Usuarios").add({
	            correo: m,
	            cecosf: "b",
	            cargo: false,
	            especialidad: e,
	            mostrar: true,
	            nombre: n,
	            apellidos: a
	            });
	    });
	});
    return validado;
}
function registrarUsuario(){
	agregarUsuario();
	return false;
}

function loginF(){
	document.getElementById("loading").innerHTML = "<div class='spinner-border' role='status' style='color:#00c0b7'><span class='sr-only'>Loading...</span></div><p style='color:#00c0b7'><small>iniciando sesión</small></p>";
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
                    setTimeout(function(){
			    		despliegue(firebase.auth().currentUser,"intranet");
			    	}, 1000);
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

async function despliegue(u, pagina){
	document.getElementById("content").innerHTML="<div id='informacion'></div>";
	var usuario = new Usuario();
	await usuario.obtenerUsuario(u.email);
	var str = "<button type='button' class='btn btn-outline-primary' style='float:right;' onClick='logOut()'>Log Out</button>" + usuario.desplegarUsuario() + "<div id='calendar'></div>";
	if(usuario.cargo){
		str = str + "<div id='users'></div>";
	}
	document.getElementById("informacion").innerHTML = str;
	usuario.desplegarCalendario();
}

async function logOut(){
	document.getElementById("content").innerHTML="<div align='center' style='width:100%;height100%;vertical-align:middle'><div class='spinner-border' role='status' style='color:#00c0b7'><span class='sr-only'>Loading...</span></div><p style='color:#00c0b7'><small>cerrando sesión</small></p><div>";;
	firebase.auth().signOut().then(function(){
		document.getElementById("content").innerHTML=desplegarLogin();
	});
}
class Visita{
	constructor(){
		this.especialidades;
		this.eventos;
	}
	
}
function desplegarLogin(){
	var str = "";
	str = str + "<div style='padding-left:25%;padding-right: 25%;padding-top:5%;padding-bottom:5%'>";
	str = str + "<form onsubmit='return loginF()' name='login'>";
	str = str + "<div class='form-group'>";
	str = str + "<label for='exampleInputEmail1'>Correo Electrónico</label>";
	str = str + "<input type='email' name='user' class='form-control' id='exampleInputEmail1' aria-describedby='emailHelp' placeholder='ejemplo@correo.com' required/>";
	str = str + "</div>";
	str = str + "<div class='form-group'>";
	str = str + "<label for='exampleInputPassword1'>Contraseña</label>";
	str = str + "<input type='password' name='pass' class='form-control' id='exampleInputPassword1' placeholder='Contraseña' required/>";
	str = str + "</div>"; 		   
	str = str + "<p id='aviso' class='text-success' style='width:320px;border-radius: 5px;'></p>";
	str = str + "<div class='form-group form-check'>";
	str = str + "<input type='checkbox' class='form-check-input' id='exampleCheck1'>";
	str = str + "<label class='form-check-label' for='exampleCheck1'>Mantenerse conectado</label>";
	str = str + "</div>";
	str = str + "<div align='center' id='loading'>";
	str = str + "<div class='spinner-border' role='status' style='color:#00c0b7'>";
	str = str + "<span class='sr-only'>Loading...</span>";
	str = str + "</div>";
	str = str + "<p style='color:#00c0b7'><small>comprobando sesión</small></p>";
	str = str + "</div>";
	str = str + "<button type='submit' class='btn btn-primary'>Entrar</button>";
	str = str + "</form>";
	str = str + "</div>";
	str = str + "</div>";
	return str;
}
/*	constructor(nombre, fecha, desc, cecosf, tipo){
		title: doc.data().nombre,
		start: doc.data().fecha,
		description: doc.data().desc,
		organiza: doc.data().cecosf,
		tematica: doc.data().tipo
	}
}*/
class Usuario{
	constructor(){
		this.user;
		this.especialidades;
		this.eventos;
		this.reuniones;
	}
	async obtenerUsuario(email){
		var usuario= new Object();
		usuario.correo = email;
		await firebase.firestore().collection("Usuarios").where("correo","==",email).get()
		.then(function(querySnapshot) {
			const data = querySnapshot.docs[0].data();
			usuario.admin = data.cargo;
			usuario.cecosf = data.cecosf;
			usuario.especialidad = data.especialidad;
			usuario.nombre = data.nombre;
		});
		this.user = usuario;

	}
	desplegarUsuario(){
		var str = "<div class='row'>";
		str = str + "<div class='col'>";
		str = str + "Nombre: " + this.user.nombre;
		str = str + "<br>";
		str = str + "Establecimiento: " + establecimiento(this.user.cecosf);		
		str = str + "<br>";
		str = str + "Especialidad: " + this.user.especialidad;
		str = str + "<br>";
		str = str + "Correo: " + this.user.correo;
		if(this.user.admin){
			str = str + "<h4 style='color:#00c0b7'>Permisos de administrador concedidos<h4>";	
		}
		str = str + "<br>";
		str = str + "</div>";
		str = str + "</div>";
		return str;
	}
	async desplegarCalendario(){
		var fecha = Date.now();
		fecha = fecha - 2592000000;
		var eventos = [];
		await firebase.firestore().collection("Eventos").where("cecosf","==",this.user.cecosf).where("fecha",">=",fecha).get()
        .then(function(querySnapshot) {

	            // doc.data() is never undefined for query doc snapshots
            querySnapshot.forEach(function(doc) {
            	eventos.push({
            		"title": doc.data().nombre,
            		"start": doc.data().fecha,
            		"description": doc.data().desc,
            		"organiza": doc.data().cecosf,
            		"tematica": doc.data().tipo,
            		"id":doc.id,
            		"nat":"evento"
            	});
            });
        });
        await firebase.firestore().collection("Reuniones").where("cecosf","==",this.user.cecosf).where("fecha",">=",fecha).get()
        .then(function(querySnapshot) {

	            // doc.data() is never undefined for query doc snapshots
            querySnapshot.forEach(function(doc) {
            	eventos.push({
            		"title": doc.data().nombre,
            		"start": doc.data().fecha,
            		"description": doc.data().desc,
            		"organiza": doc.data().cecosf,
            		"tematica": doc.data().tipo,
            		"id":doc.id,
            		"nat":"reunion"
            	});
            });
        });
		document.getElementById("log").innerHTML = eventos[1];
        
		if(this.user.admin){
			var calendarEl = document.getElementById('calendar');

	        var calendar = new FullCalendar.Calendar(calendarEl, {
	          plugins: [ 'interaction', 'dayGrid' ],
	          locale:'es',
	          navLinks: false, // can click day/week names to navigate views

		      weekNumberCalculation: 'ISO',
		      editable:true,
		      // CUANDO SE PUEDA EDITAR, GUARDAR EL DOC_ID DE CADA EVENTO, PARA QUE CUANDO SEAN MODIFICADOS, PUEDAN SER GUARDADOS EN SUS DOC_ID'S CORRESPONDIENTES
		      eventLimit: true,
	          events: eventos,
		      eventClick: function(info) {
		        $('#evento').modal('show');
		        var evento = new Object();
		        evento.titulo = info.event.title;
		        evento.fecha = info.event.start;
		        evento.tematica = info.event.extendedProps.tematica;
		        evento.descripcion = info.event.extendedProps.description;
		        evento.organiza = establecimiento(info.event.extendedProps.organiza);
		        evento.id = info.event.extendedProps.id;
		        evento.nat = info.event.extendedProps.nat;
		        document.getElementById("evento").innerHTML = desplegarEvento(evento);
		      }
	        });
		} else{
			var calendarEl = document.getElementById('calendar');

	        var calendar = new FullCalendar.Calendar(calendarEl, {
	          plugins: ['dayGrid' ],
	          defaultDate: '2019-08-12',
	          locale:'es',
	          navLinks: false, // can click day/week names to navigate views

		      weekNumberCalculation: 'ISO',
		      editable:true,
		      // CUANDO SE PUEDA EDITAR, GUARDAR EL DOC_ID DE CADA EVENTO, PARA QUE CUANDO SEAN MODIFICADOS, PUEDAN SER GUARDADOS EN SUS DOC_ID'S CORRESPONDIENTES
		      eventLimit: true,
	          events: [
		        {
		          title: 'Business Lunch',
		          start: '2019-08-03T13:00:00',
		          constraint: 'businessHours'
		        },
		        {
		          title: 'Meeting',
		          start: '2019-08-13T11:00:00',
		          constraint: 'availableForMeeting', // defined below
		          color: '#257e4a',
		          description: 'Reunión de avances',
		          organiza: 'a',
		          tematica: 'psicología',
		        },
		        {
		          title: 'Conference',
		          start: '2019-08-18',
		          end: '2019-08-20'
		        },
		        {
		          title: 'Party',
		          start: '2019-08-29T20:00:00'
		        },

		        // areas where "Meeting" must be dropped
		        {
		          groupId: 'availableForMeeting',
		          start: '2019-08-11T10:00:00',
		          end: '2019-08-11T16:00:00',
		          rendering: 'background'
		        },
		        {
		          groupId: 'availableForMeeting',
		          start: '2019-08-13T10:00:00',
		          end: '2019-08-13T16:00:00',
		          rendering: 'background'
		        },

		        // red areas where no events can be dropped
		        {
		          start: '2019-08-24',
		          end: '2019-08-28',
		          overlap: false,
		          rendering: 'background',
		          color: '#ff9f89'
		        },
		        {
		          start: '2019-08-06',
		          end: '2019-08-08',
		          overlap: false,
		          rendering: 'background',
		          color: '#ff9f89'
		        }
		      ],
		      eventClick: function(info) {
		        $('#evento').modal('show');
		        
		        var evento = new Object();
		        evento.titulo = info.event.title;
		        evento.fecha = info.event.start.toLocaleDateString();
		        evento.tematica = info.event.extendedProps.tematica;
		        evento.descripcion = info.event.extendedProps.description;
		        evento.organiza = establecimiento(info.event.extendedProps.organiza)

		        document.getElementById("tituloEvento").innerHTML = evento.titulo;
		        document.getElementById("fechaEvento").innerHTML = evento.fecha;
		        document.getElementById("tematica").innerHTML = evento.tematica;
		        document.getElementById("descripcionEvento").innerHTML = evento.descripcion;
		        document.getElementById("organiza").innerHTML = evento.organiza;
		      }
	        });
		}
        

        calendar.render();
	}
}
function desplegarUsuarios(){

}
function establecimiento(palabra){
	switch (palabra){
		case 'a':
			return "CESFAM Francia";
		case 'b':
			return "CECOSF Gral Yañez";
		case 'c':
			 return"CECOSF Sergio Santander 4027";
		case 'd':
			return "CECOSF Arauco 709";
		case 'e':
			return "CECOSF Las Mulatas 311";
		case 'f':
			return "CECOSF Caupolican 201";
		case 'g':
			return "CECOSF Arauco 810";
	}
}
function desplegarEvento(evento){
	var str = "<div class='modal-dialog' role='document'>";
	str = str + "<div class='modal-content'>";
	str = str + "<div class='modal-header' style='display: block'>";
	str = str + "<div class='row'>";
	str = str + "<div class='col'>";
	str = str + "<h5 class='modal-title' id='tituloEvento'>" + evento.titulo + "</h5>";
	str = str + "</div>";
	str = str + "<div class='col' align='right'>";
	str = str + "<button type='button' class='btn btn-outline-danger' onclick='eliminarEvento(" + evento.id + ")'>Eliminar</button>";
	str = str + "</div>";
	str = str + "</div>";
	str = str + "<div class='row'>";
	str = str + "<div class='col'>";
	var iMins = evento.fecha.getMinutes();	
	str = str + "<h6 class='modal-title' id='fechaEvento'>" + evento.fecha.toLocaleDateString() + " " + evento.fecha.getHours() + ":" + ((iMins>9)?iMins:"0"+iMins) + "</h6>";				
	str = str + "</div>";
	str = str + "</div>";
	str = str + "</div>";
	str = str + "<div class='modal-body'>";
	str = str + "<h6 id='tematica'>" + evento.tematica + "</h6>";		
	str = str + "<p id='descripcionEvento'>" + evento.descripcion + "</p>";
	str = str + "<h6 id='organiza' align='center'>" + evento.organiza + "</h6>";
	str = str + "</div>";
	str = str + "<div class='modal-footer'>";
	str = str + "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>";
	str = str + "</div>";
	str = str + "</div>";
	str = str + "</div>";
	return str;
}
function eliminarEvento(id){
	db.collection("Eventos").doc(id).delete()
}