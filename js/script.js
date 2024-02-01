//insertar
function insertTarea(titulo, descripcion, hecha, mostrar) {
	$.ajax({
		type: 'POST',
		url: 'php/insertTarea.php',
		data: {
			Titulo: titulo,
			Descripcion: descripcion,
			Hecha: hecha
		},
		dataType: 'json',
		success: mostrar,
		error: function(e) {
			console.error(e);
		}
	});
}
//actualizar

//eliminar
function eliminarTarea(id, mostrar) {
	$.ajax({
		type: 'POST',
		url: 'php/deleteTarea.php',
		data: {
			id: id,
		},
		dataType: 'json',
		success: mostrar,
		error: function(e) {
			console.error(e);
		}
	});
}

//seleccionar

