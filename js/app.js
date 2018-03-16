var db = firebase.database();
var choferes_ref = db.ref('choferes');
var table = $('table tbody');
setTimeout(function() {
  var oTable = $('#tabla').DataTable();
}, 5000);


function getFormData() {
  var ci = $('#ci').val();
  var nombres = $('#nombres').val();
  var apellidos = $('#apellidos').val();
  var telefono = $('#telefono').val();
  var sindicato = $('#sindicato').val();
  
  return {
    ci: ci,
    apellidos: apellidos,
    nombres: nombres,
    telefono: telefono,
    sindicato: sindicato
  };
}


function addChof(event) {
  event.preventDefault();
  var chof = getFormData();
  
  choferes_ref.push(chof);
  $('form input').val('');
}


function addToDOM(is_update, chof, key, row) {
  var el = 
    '<tr data-key="' + key + '">' + 
      '<td>' + chof.ci + '</td>' +
      '<td>' + chof.nombres + '</td>' +
      '<td>' + chof.apellidos + '</td>' + 
      '<td>' + chof.telefono + '</td>' +
      '<td>' + chof.sindicato + '</td>' +
      '<td>' +
        '<button class="btn btn-sm update">Actualizar</button>' +
        '<button class="btn btn-sm grey darken-1 delete">Eliminar</button>' +
      '</td>' +
    '</tr>';
  
  if ( is_update ) {
    row.after(el);
    row.remove();
  } else table.append(el);
}


function updateChof(key, row) {
  var chof = getFormData();
  addToDOM(true, chof, key, row);
  
  choferes_ref.child(key).set(chof);
  $('form input').val('');
  $('#submit')
    .unbind()
    .text('GUARDAR')
    .on('click', addChof);
    $('#cancel').hide();
}


function getChof() {
  var row = $(this).parents('tr');
  var key = row.data('key');
  var chofer_ref = choferes_ref.child(key);
  var submit = $('#submit');
  
  chofer_ref.once('value')
  .then(function(chof) {
    chof = chof.val();
    
    $('#ci').val(chof.ci);
    $('#nombres').val(chof.nombres);
    $('#apellidos').val(chof.apellidos);
    $('#telefono').val(chof.telefono);
    $('#sindicato').val(chof.sindicato);
    
    submit.text('ACTUALIZAR');
    submit.unbind().on('click', function(e) {
      e.preventDefault();
      
      updateChof(key, row);
    });
  });
  
  $('#cancel')
    .unbind()
    .show()
    .on('click', function(e) {
      e.preventDefault();
      $('form input').val('');
      $(this).hide();
      submit.text('GUARDAR');
      submit.unbind().on('click', addChof);
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

init();
