$(document).ready(function(){
    mostrarTareas(mostrar);

})
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
            descripcion: descripcion,
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

function mostrar(res){
    var tareas = $("#id_tareas")
    res.foreach(e=>{
        var contenedor= $("<div>").addClass("tarea");
        var titulo = $("<h3>").text(e.titulo);
        var descripcion = $("<p>").text(e.descripcion);
        var hecha = $("<label>").text("hecha: ").append($("<imput type='checkbox'>"));

        contenedor.append(titulo);
        contenedor.append(descripcion);
        contenedor.append(hecha);

        tareas.append(contenedor);
    });



}
