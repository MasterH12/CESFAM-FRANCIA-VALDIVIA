//<script src="https://www.gstatic.com/firebasejs/7.2.2/firebase-app.js"></script>
var usuarioLogeado;
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
	await obtenerUsuario(u.email);
	var str = "";
	str = str + "<button type='button' class='btn btn-outline-primary' style='float:right;' onClick='logOut()'>Log Out</button>" + window.usuarioLogeado.desplegarUsuario();
	if(window.usuarioLogeado.admin){
		str = str + "<button type='button' class='btn btn-outline-primary' data-toggle='modal' data-target='#aEvento'>+ Evento</button>&nbsp;&nbsp;&nbsp;";
		str = str + "<button type='button' class='btn btn-outline-primary' data-toggle='modal' data-target='#aReunion'>+ Reunión</button>";
	}
	str = str + "<div id='calendar'></div>";
	if(window.usuarioLogeado.admin){
		str = str + "<div id='users'></div>";
	}
	document.getElementById("informacion").innerHTML = str;
	window.usuarioLogeado.desplegarCalendario();
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
async function obtenerUsuario(email){
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
	if (usuario.admin){
		window.usuarioLogeado = new Administrador(usuario.nombre, usuario.cecosf, usuario.especialidad, email);
	}else{
		window.usuarioLogeado = new Usuario(usuario.nombre, usuario.cecosf, usuario.especialidad, email);
	}
}
class Usuario{
	constructor(nombre, cecosf, especialidad, correo){
		this.nombre = nombre;
		this.cecosf = cecosf;
		this.especialidad = especialidad;
		this.correo = correo;
		this.especialidades;
		this.calendar;
	}
	desplegarUsuario(){
		var str = "<div class='row'>";
		str = str + "<div class='col'>";
		str = str + "Nombre: " + this.nombre;
		str = str + "<br>";
		str = str + "Establecimiento: " + establecimiento(this.cecosf);		
		str = str + "<br>";
		str = str + "Especialidad: " + this.especialidad;
		str = str + "<br>";
		str = str + "Correo: " + this.correo;
		str = str + "<br>";
		str = str + "</div>";
		str = str + "</div>";
		return str;
	}
	async desplegarCalendario(){
		var fecha = Date.now();
		fecha = fecha - 2592000000;
		var eventos = [];
		//OBTENCION DE EVENTOS
		await firebase.firestore().collection("Eventos").where("cecosf","==",this.cecosf).where("fecha",">=",fecha).get()
        .then(function(querySnapshot) {

	            // doc.data() is never undefined for query doc snapshots
            querySnapshot.forEach(function(doc) {
            	eventos.push({
            		"title": doc.data().nombre,
            		"start": doc.data().fecha,
            		"description": doc.data().desc,
            		"organiza": doc.data().cecosf,
            		"tematica": doc.data().tipo,
            		//EL ATRIBUTO NAT, INDICA SI ES UN EVENTO O UNA REUNION
            		"nat":"evento"
            	});
            });
        });
        //OBTENCION DE REUNIONES
        await firebase.firestore().collection("Reuniones").where("cecosf","==",this.cecosf).where("fecha",">=",fecha).get()
        .then(function(querySnapshot) {

	            // doc.data() is never undefined for query doc snapshots
            querySnapshot.forEach(function(doc) {
            	eventos.push({
            		"title": doc.data().nombre,
            		"start": doc.data().fecha,
            		"description": doc.data().desc,
            		"organiza": doc.data().cecosf,
            		"tematica": doc.data().tipo,
            		//EL ATRIBUTO NAT, INDICA SI ES UN EVENTO O UNA REUNION
            		"nat":"reunion"
            	});
            });
        });

		this.calendar = new FullCalendar.Calendar(calendarEl, {
          	plugins: [ 'dayGrid' ],
	        locale:'es',
	        navLinks: false, // can click day/week names to navigate views

		    weekNumberCalculation: 'ISO',
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
		        document.getElementById("evento").innerHTML = desplegarEvento(info.event);
		    }
        });

        this.calendar.render();
	}
	desplegarEvento(evento){
		var str = "<div class='modal-dialog' role='document'>";
		str = str + "<div class='modal-content'>";
		str = str + "<div class='modal-header' style='display: block'>";
		str = str + "<div class='row'>";
		str = str + "<div class='col'>";
		str = str + "<h5 class='modal-title' id='tituloEvento'>" + evento.title + "</h5>";
		str = str + "</div>";
		str = str + "</div>";
		str = str + "<div class='row'>";
		str = str + "<div class='col'>";
		var iMins = evento.start.getMinutes();	
		str = str + "<h6 class='modal-title' id='fechaEvento'>" + evento.start.toLocaleDateString() + " " + evento.start.getHours() + ":" + ((iMins>9)?iMins:"0"+iMins) + "</h6>";				
		str = str + "</div>";
		str = str + "</div>";
		str = str + "</div>";
		str = str + "<div class='modal-body'>";
		str = str + "<h6 id='tematica'>" + evento.extendedProps.tematica + "</h6>";		
		str = str + "<p id='descripcionEvento'>" + evento.extendedProps.description + "</p>";
		str = str + "<h6 id='organiza' align='center'>" + establecimiento(evento.extendedProps.organiza) + "</h6>";
		str = str + "</div>";
		str = str + "<div class='modal-footer'>";
		str = str + "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Cerrar</button>";
		str = str + "</div>";
		str = str + "</div>";
		str = str + "</div>";
		return str;
	}
}
class Administrador extends Usuario{
	constructor(nombre, cecosf, especialidad, correo){
		super(nombre, cecosf, especialidad, correo);
		this.admin=true;
	}
	desplegarUsuario(){
		var str = "<div class='row'>";
		str = str + "<div class='col'>";
		str = str + "Nombre: " + this.nombre;
		str = str + "<br>";
		str = str + "Establecimiento: " + establecimiento(this.cecosf);		
		str = str + "<br>";
		str = str + "Especialidad: " + this.especialidad;
		str = str + "<br>";
		str = str + "Correo: " + this.correo;
		str = str + "<h4 style='color:#00c0b7'>Permisos de administrador concedidos<h4>";
		str = str + "<br>";
		str = str + "</div>";
		str = str + "</div>";
		return str;
	}
	async desplegarCalendario(){
		var fecha = Date.now();
		fecha = fecha - 2592000000;
		var eventos = [];
		//OBTENCIÓN DE EVENTOS
		await firebase.firestore().collection("Eventos").where("cecosf","==",this.cecosf).where("fecha",">=",fecha).get()
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
        //OBTENCIÓN DE REUNIONES
        await firebase.firestore().collection("Reuniones").where("cecosf","==",this.cecosf).where("fecha",">=",fecha).get()
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
        //DESPLIEGUE DE CALENDARIO
        var calendarEl = document.getElementById('calendar');

        this.calendar = new FullCalendar.Calendar(calendarEl, {
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
		        document.getElementById("evento").innerHTML = window.usuarioLogeado.desplegarEvento(info.event);
		    }
        });

        this.calendar.render();
    }
    desplegarEvento(evento){
		var str = "<div class='modal-dialog' role='document'>";
		str = str + "<div class='modal-content'>";
		str = str + "<div class='modal-header' style='display: block'>";
		str = str + "<div class='row'>";
		str = str + "<div class='col'>";
		str = str + "<h5 class='modal-title' id='tituloEvento'>" + evento.title + "</h5>";
		str = str + "</div>";
		str = str + "<div class='col' align='right'>";
		str = str + "<button type='button' class='btn btn-outline-danger' onclick=\"window.usuarioLogeado.eliminarEvento('" + evento.id + "','" + evento.extendedProps.nat + "')\">Eliminar</button>";
		str = str + "</div>";
		str = str + "</div>";
		str = str + "<div class='row'>";
		str = str + "<div class='col'>";
		var iMins = evento.start.getMinutes();	
		str = str + "<h6 class='modal-title' id='fechaEvento'>" + evento.start.toLocaleDateString() + " " + evento.start.getHours() + ":" + ((iMins>9)?iMins:"0"+iMins) + "</h6>";				
		str = str + "</div>";
		str = str + "</div>";
		str = str + "</div>";
		str = str + "<div class='modal-body'>";
		str = str + "<h6 id='tematica'>" + evento.extendedProps.tematica + "</h6>";		
		str = str + "<p id='descripcionEvento'>" + evento.extendedProps.description + "</p>";
		str = str + "<h6 id='organiza' align='center'>" + establecimiento(evento.extendedProps.organiza) + "</h6>";
		str = str + "</div>";
		str = str + "<div id='loadingEvent'></div>";
		str = str + "<div class='modal-footer'>";
		str = str + "<button type='button' class='btn btn-secondary' data-dismiss='modal'>Cerrar</button>";
		str = str + "</div>";
		str = str + "</div>";
		str = str + "</div>";
		return str;
	}
	async eliminarEvento(eventId, naturaleza){
		document.getElementById("loadingEvent").innerHTML = "<div align='center' id='loading'><div class='spinner-border' role='status' style='color:#00c0b7'><span class='sr-only'>Loading...</span></div><p style='color:#00c0b7'><small>Eliminando Evento</small></p></div>";
		if(naturaleza=="evento"){
			await firebase.firestore().collection("Eventos").doc(eventId).delete();
		}else{
			await firebase.firestore().collection("Reuniones").doc(eventId).delete();
		}
		this.calendar.getEventById(eventId).remove();
		document.getElementById("loadingEvent").innerHTML = "";
		$('#evento').modal('hide');
	}
	agregarEvento(){
		document.getElementById("loadingFormEvent").innerHTML = "<div align='center' id='loading'><div class='spinner-border' role='status' style='color:#00c0b7'><span class='sr-only'>Loading...</span></div><p style='color:#00c0b7'><small id='loadingText'>Validando Evento</small></p></div>";
		var validado = true;
		var t = document.forms["agregarevento"]["nom"].value;
		var f = document.forms["agregarevento"]["fechaEvento"].value;
		var tem = document.forms["agregarevento"]["tematica"].value;
		var d = document.forms["agregarevento"]["descripcion"].value;

		var fN = document.getElementById("feedbackNombreEvent");
		var fF = document.getElementById("feedbackFechaEvent");
		document.getElementById("log").innerHTML = t;
		if(t==""){
			fN.innerHTML = "<div class='invalid-feedback'>Se requiere un título</div>";
			validado = false;
		}else{
			fN.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
		}
		f = Date.parse(new Date(f));
		if(f < Date.now()){
			fF.innerHTML = "<div class='invalid-feedback'>Eligió una fecha pasada</div>";
			validado = false;
		}else{
			fF.innerHTML = "<div class='valid-feedback'>Parece correcto</div>";
		}
		if(validado){
			document.getElementById("loadingText").innerHTML = "Agregando evento";
			this.agregarEventoDB(t, f, tem, d);
			$('#aEvento').modal('hide');
			$('body').removeClass('modal-open');
			$('.modal-backdrop').remove();
		}
		document.getElementById("loadingFormEvent").innerHTML = "";
		return false;
		
		
		
	}
	async agregarEventoDB(nombre, fecha, tematica, desc){
		var evento;
		await firebase.firestore().collection("Eventos").add({
            cecosf: window.usuarioLogeado.cecosf,
            nombre: nombre,
            fecha: fecha,
            tipo: tematica,
            desc: desc
        }).then(function(docRef) {
			evento = {
				"id": docRef.id,
				"title": nombre,
	    		"start": fecha,
	    		"description": desc,
	    		"organiza": window.usuarioLogeado.cecosf,
	    		"tematica": tematica,
	    		//EL ATRIBUTO NAT, INDICA SI ES UN EVENTO O UNA REUNION
	    		"nat":"evento"
	    	};
		});
    	this.calendar.addEvent(evento);
	}
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
