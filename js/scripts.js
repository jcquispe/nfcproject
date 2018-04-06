$(document).ready(function(){
	$(".button-collapse").sideNav();
	$('.collapsible').collapsible();
	$('.modal').modal();

	$('#login').click(function(){
		var email = $('#email').val().trim();
		var pass = $('#password').val().trim();
		if(email == "" || pass == ""){
			alert("Ingrese sus credenciales por favor");
		}
		else{
			firebase.auth().signInWithEmailAndPassword(email, pass)
			.then(function(firebaseUser) {
       			window.location.href = 'registro.html';
   			})
			.catch(function(error) {
			  	// Handle Errors here.
				var errorCode = error.code;
				var errorMessage = error.message;
				// ...
				alert('ERROR '+ errorCode + ': '+ errorMessage);
			});
		}
		
	});

	$('#salir').click(function(){
		firebase.auth().signOut().then(function() {
		   console.log("Logged out!");
		   window.location.href = 'index.html';
		}, function(error) {
		   console.log(error.code);
		   console.log(error.message);
		});
	});

	
});
