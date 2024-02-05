$(document).ready(function() {
        mostrarTareas();

        $("#id_nuevatarea").on("click", mostrarFormulario);
        $("#id_cancelartarea").on("click", mostrarFormulario);

        $("#id_formulariotarea").on("submit", function(e) {
                e.preventDefault();
                insertTarea($("#id_titulo").val(), $("#id_descripcion").val(), 0, mostrarTareas);
                mostrarFormulario();
        })
});

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
        url: 'php/updateTarea.php',
        data:{
            id:id,
            titulo:titulo,
            descripcion: descripcion,
            hecha: hecha,
        },
        success: mostrar,
        error: function (e) {
            console.error(e);
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
		success: mostrar,
		error: function(e) {
			console.error(e);
		}
	});
}

//seleccionar
function mostrarTareas() {
        $.ajax({
        type: 'GET',
        url: 'php/selectTarea.php',
        dataType: 'json',
        success: mostrar,
        error: function (e) {
                console.error(e);
        }
    });
}

function mostrar(res){
        var tareas = $("#tareas")
        var tareasCompletadas = $("#tareascompletadas")
        tareas.children('.tarea').remove();
        tareasCompletadas.children('.tarea').remove();

        res.forEach((tarea) => {
                var contenedor= $("<div>").addClass("tarea");
                var titulo = $("<h3>").text(tarea.Titulo);
                var descripcion = $("<p>").text(tarea.Descripcion);
                var botonModificar = $("<button>")
                        .text("Modificar")
                        .addClass("editartarea");
                var botonCompletar = $("<button>")
                        .text("Completar")
                        .addClass("completartarea")
                        .on("click", function() {
                                actualizarTareas(tarea.ID, tarea.Titulo, tarea.Descripcion, (tarea.Hecha ? 0 : 1) , mostrarTareas);
                        });
                var botonBorrar = $("<button>").text("Borrar").addClass("borrartarea").on("click", function(){
                    eliminarTarea(tarea.ID, mostrarTareas);
                });

                contenedor.append(botonCompletar);
                contenedor.append(botonBorrar);
                contenedor.append(botonModificar);
                contenedor.append(titulo);
                contenedor.append(descripcion);
                
                if (!tarea.Hecha) {
                        tareas.append(contenedor);
                } else {
                        tareasCompletadas.append(contenedor);
                }


        });
}

function mostrarFormulario() {
	let _mostrado = $("#id_formulariotarea").toggleClass('esconder').hasClass('esconder');
        $("#id_nuevatarea").toggleClass('esconder', !_mostrado);
	if (!_mostrado) {
		$("#id_formulariotarea")[0].reset();
	}
}
