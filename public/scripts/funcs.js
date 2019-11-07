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

async function despliegue(u, pag){
	document.getElementById("content").innerHTML="<div id='informacion'></div>";
	var usuario = new Usuario();
	await usuario.obtenerUsuario(u.email);
	document.getElementById("informacion").innerHTML = "<button type='button' class='btn btn-outline-primary' style='float:right;' onClick='logOut()'>Log Out</button>" + usuario.desplegarUsuario() + "<div id='calendar'></div>";
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
	desplegarCalendario(){
		if(this.user.admin){
			var calendarEl = document.getElementById('calendar');

	        var calendar = new FullCalendar.Calendar(calendarEl, {
	          plugins: [ 'interaction', 'dayGrid' ],
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
	str = str + "<button type='button' class='btn btn-outline-danger'>Eliminar</button>";
	str = str + "</div>";
	str = str + "</div>";
	str = str + "<div class='row'>";
	str = str + "<div class='col'>";			
	str = str + "<h6 class='modal-title' id='fechaEvento'>" + evento.fecha + "</h6>";				
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