$(document).ready(function(){
    
  $('.sidenav').sidenav();
});

var db = firebase.database();
var choferes_ref = db.ref('choferes');
var table = $('table tbody');
setTimeout(function() {
  var oTable = $('#tabla').DataTable();
}, 2000);


function getFormData() {
  var codigo = $('#codigo').val().toUpperCase();
  var ci = $('#ci').val().toUpperCase();
  var nombres = $('#nombres').val().toUpperCase();
  var apellidos = $('#apellidos').val().toUpperCase();
  var telefono = $('#telefono').val().toUpperCase();
  var marca = $('#marca').val().toUpperCase();
  var modelo = $('#modelo').val().toUpperCase();
  var placa = $('#placa').val().toUpperCase();
  var color = $('#color').val().toUpperCase();
  var sindicato = $('#sindicato').val().toUpperCase();
  
  return {
    codigo: codigo,
    ci: ci,
    apellidos: apellidos,
    nombres: nombres,
    telefono: telefono,
    marca: marca,
    modelo: modelo,
    placa: placa,
    color: color,
    sindicato: sindicato
  };
}


function addChof(event) {
  event.preventDefault();
  if(validar()){
    var chof = getFormData();
    choferes_ref.push(chof);
    $('form input').val('');
    Materialize.updateTextFields();
  }
}


function addToDOM(is_update, chof, key, row) {
  var el = 
    '<tr data-key="' + key + '">' + 
      '<td>' + chof.ci + '</td>' +
      '<td>' + chof.nombres + '</td>' +
      '<td>' + chof.apellidos + '</td>' + 
      '<td>' + chof.telefono + '</td>' +
      '<td>' + chof.marca + '</td>' +
      '<td>' + chof.modelo + '</td>' +
      '<td>' + chof.placa + '</td>' +
      '<td>' + chof.color + '</td>' +
      '<td>' + chof.sindicato + '</td>' +
      '<td>' +
        '<button class="btn btn-sm update" style="margin-right: 5px;"><i class="large material-icons">edit</i></button>' +
        '<button class="btn btn-sm red lighten-2 delete"><i class="large material-icons">delete</i></button>' +
      '</td>' +
    '</tr>';
  
  if ( is_update ) {
    row.after(el);
    row.remove();
  } else table.append(el);
}


function updateChof(key, row) {
  if(validar()){
    var chof = getFormData();
    addToDOM(true, chof, key, row);
    debugger;
    choferes_ref.child(key).set(chof);
    $('form input').val('');
    $('#submit')
      .unbind()
      .text('GUARDAR')
      .on('click', addChof);
    $('#cancel').hide();
  }
}


function getChof() {
  $("#modal1").modal('open');
  var row = $(this).parents('tr');
  var key = row.data('key');
  var chofer_ref = choferes_ref.child(key);
  var submit = $('#submit');
  
  chofer_ref.once('value')
  .then(function(chof) {
    chof = chof.val();
    
    $('#codigo').val(chof.codigo);
    $('#ci').val(chof.ci);
    $('#nombres').val(chof.nombres);
    $('#apellidos').val(chof.apellidos);
    $('#telefono').val(chof.telefono);
    $('#marca').val(chof.marca);
    $('#modelo').val(chof.modelo);
    $('#placa').val(chof.placa);
    $('#color').val(chof.color);
    $('#sindicato').val(chof.sindicato);
    
    Materialize.updateTextFields();
    submit.text('ACTUALIZAR');
    submit.unbind().on('click', function(e) {
      e.preventDefault();
      
      updateChof(key, row);
      $('#modal1').modal('close');
    });
  });
  
  $('#cancel')
    .unbind()
    .show()
    .on('click', function(e) {
      e.preventDefault();
      $('form input').val('');
      $(this).hide();
      Materialize.updateTextFields();
      submit.text('GUARDAR');
      //submit.unbind().on('click', addChof);
    });
}


function deleteChof() {
  var row = $(this).parents('tr');
  var key = row.data('key');
  
  row.remove();
  choferes_ref.child(key).remove();
}


function getChofs() {  
  choferes_ref.on('child_added', function(chof) {
    var key = chof.key;
    chof = chof.val();
    
    addToDOM(false, chof, key);
  });

}

function init() {
  getChofs();
  
  $("#submit").on("click", addChof);
  table.on('click', 'button.update', getChof);
  table.on('click', 'button.delete', deleteChof);
}

function validar(){
  if($("#codigo").val().trim()== "" || $("#ci").val().trim()== "" || $("#nombres").val().trim()== "" || $("#apellidos").val().trim()== "" || $("#telefono").val().trim()== "" || $("#sindicato").val().trim()== "" || $("#marca").val().trim()== "" || $("#modelo").val().trim()== "" || $("#placa").val().trim()== "" || $("#color").val().trim()== ""){
    alert ("Todos los datos son obligatorios");
    return false;
  }
  else{
    return true;
  }
}

function salir(){
  firebase.auth().signOut().then(function() {
     console.log("Logged out!");
     window.location.href = 'index.html';
  }, function(error) {
     console.log(error.code);
     console.log(error.message);
  });
}

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log("login");
  } else {
    window.location.href = "index.html";
  }
});
init();
