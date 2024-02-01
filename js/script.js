mostrarTareas();
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
function actualizarTareas(id, titulo, descripcion, hecha, mostrar){
    $.ajax({
        type: 'POST',
        url: 'php/updateTarea',
        data:{
            id:id,
            titulo:titulo,
            descripcio: descripcion,
            hecha: hecha,
        }
        ,
        dataType: 'json',
        success: mostrar,
        error: function (error) {
            console.log("Error al cambiar la lista de tareas: " + error);
        }
    })
}
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
function mostrarTareas(mostrar) {
        $.ajax({
        type: 'GET',
        url: 'php/selectTarea.php',
        dataType: 'json',
        success: mostrar,
        error: function (error) {
            console.log("Error al obtener la lista de tareas: " + error);
        }
    });
}
