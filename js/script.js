var filtro = {
        titulo : '',
        descripcion : ''
};

var filtroCompletadas = {
        titulo : '',
        descripcion : ''
};

$(document).ready(function() {
        mostrarTareas();

        $("#id_nuevatarea").on("click", mostrarFormulario);
        $("#id_cancelartarea").on("click", mostrarFormulario);

        $("#id_formulariotarea").on("submit", function(e) {
                e.preventDefault();
                insertTarea($("#id_titulo").val(), $("#id_descripcion").val(), 0, mostrarTareas);
                mostrarFormulario();
        })

        $("#filtroTitulo").on("change keyup", function(e) {
                filtro.titulo = $(this).val();
                filtrar();
        });

        $("#filtroDescripcion").on("change keyup", function(e) {
                filtro.descripcion = $(this).val();
                filtrar();
        });

        $("#filtroTituloCompletas").on("change keyup", function(e) {
                filtroCompletadas.titulo= $(this).val();
                filtrarCompletadas();
        });

        $("#filtroDescripcionCompletas").on("change keyup", function(e) {
                filtroCompletadas.descripcion = $(this).val();
                filtrarCompletadas();
        });
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
                        .addClass("editartarea")
                        .on("click", function() {
                                modificar(tarea.ID, tarea.Titulo, tarea.Descripcion, tarea.Hecha, this.parentElement);
                        });
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

function filtrar() {
        $('#tareas .tarea').each(function(index, e) {
                $(e).toggleClass(
                        'esconder', 
                        (
                                !$($(e).children('h3')[0])
                                        .text()
                                        .toLowerCase()
                                        .includes(filtro.titulo.toLowerCase())
                                ||
                                !$($(e).children('p')[0])
                                        .text()
                                        .toLowerCase()
                                        .includes(filtro.descripcion.toLowerCase())
                        )
                );
        });
}

function filtrarCompletadas() {
        $('#tareascompletadas .tarea').each(function(index, e) {
                $(e).toggleClass(
                        'esconder', 
                        (
                                !$($(e).children('h3')[0])
                                        .text()
                                        .toLowerCase()
                                        .includes(filtroCompletadas.titulo.toLowerCase())
                                ||
                                !$($(e).children('p')[0])
                                        .text()
                                        .toLowerCase()
                                        .includes(filtroCompletadas.descripcion.toLowerCase())
                        )
                );
        });
}

function modificar(id, titulo, descripcion, hecha, tarea) {
        tarea = $(tarea);

        let _form = $("#id_formulariomodificar")
                .removeClass('esconder')
                .insertBefore(tarea);

        _form.find('#id_tituloModificar').val(titulo);
        _form.find('#id_descripcionModificar').val(descripcion);
        _form.find('#id_cancelarModificar').on('click', function() {
                _form.addClass('esconder');
                tarea.removeClass('esconder');
        });
        _form.on('submit', function(e) {
                e.preventDefault();
                actualizarTareas(id, _form.find("#id_tituloModificar").val(), _form.find("#id_descripcionModificar").val(), hecha, mostrarTareas);
                _form.addClass('esconder');
                _form.off('submit');
        });

        tarea.addClass('esconder');
}
