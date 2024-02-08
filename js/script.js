// Filtros de las tareas
// Explicación: Esto nos permite actualizar el filtro desde cualquier punto
//              del código y llevar a cabo condiciones conjuntas para que
//              cosas como el filtro del título y el de la descripción no se
//              pisen entre ellos como es la que usamos:
//
//              !titulo = filtro.titulo || !descripción = filtro.descripción

var filtro = {
        titulo : '',
        descripcion : ''
};

var filtroCompletadas = {
        titulo : '',
        descripcion : ''
};

// Función inicial
$(document).ready(function() {

        // Mostramos la lista de tareas inicial
        mostrarTareas();

        // Añadimos los eventos a los botones de creación de tareas

        $("#id_nuevatarea").on("click", mostrarFormulario);
        $("#id_cancelartarea").on("click", mostrarFormulario);

        // Añadimos el evento para controlar la creación de una tarea
        $("#id_formulariotarea").on("submit", function(e) {
                // Prevenimos la actuación por defecto
                e.preventDefault();

                // Insertamos la tarea con los valores de los campos
                insertTarea($("#id_titulo").val(), $("#id_descripcion").val(), 0, mostrarTareas);

                // Escondemos el formulario
                mostrarFormulario();
        })

        // Controlamos la escritura en todos los filtros
        $("#filtroTitulo").on("change keyup", function(e) {
                // Al levantar una tecla dentro de este campo se actualiza
                // el filtro y se llama a la función para filtrar
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

// Función para insertar una tarea en la BBDD
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

// Función para actualizar una tarea de la BBDD
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

// Función para eliminar una tarea de la BBDD
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

// Función para mostrar las tareas existentes en la BBDD
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

// Función para mostrar las tareas recibidas por la BBDD
function mostrar(res){
        // Obtenemos los contenedores de las tareas
        var tareas = $("#tareas")
        var tareasCompletadas = $("#tareascompletadas")

        // Vaciámos los contenedores de las tareas
        tareas.children('.tarea').remove();
        tareasCompletadas.children('.tarea').remove();

        // Iteramos por toda la lista que nos ha devuelto el servidor
        res.forEach((tarea) => {
                // Creamos el contenedor de la tarea
                var contenedor= $("<div>").addClass("tarea");
                
                // Generamos los campos y les populamos con sus respectivos valores
                var titulo = $("<h3>").text(tarea.Titulo);
                var descripcion = $("<p>").text(tarea.Descripcion);

                // Generamos los botones y controlamos su evento "click"
                var botonModificar = $("<button>")
                        .text("Modificar")
                        .addClass("editartarea")
                        .on("click", function() {
                                // Llamamos a la función para comenzar la modificación y le pasamos los datos
                                // necesarios para esta
                                modificar(tarea.ID, tarea.Titulo, tarea.Descripcion, tarea.Hecha, this.parentElement);
                        });
                var botonCompletar = $("<button>")
                        .text("Completar")
                        .addClass("completartarea")
                        .on("click", function() {
                                // Actualizamos la tarea con los mismos datos que esta ya contiene modificando el estado del campo
                                // "hecha" dependiendo de su valor
                                actualizarTareas(tarea.ID, tarea.Titulo, tarea.Descripcion, (tarea.Hecha ? 0 : 1) , mostrarTareas);
                        });
                var botonBorrar = $("<button>")
                        .text("Borrar")
                        .addClass("borrartarea")
                        .on("click", function(){
                                // Eliminamos la tarea seleccionada
                                eliminarTarea(tarea.ID, mostrarTareas);
                        });

                // Añadimos todos los elementos generados a nuestro contenedor
                contenedor.append(botonCompletar);
                contenedor.append(botonBorrar);
                contenedor.append(botonModificar);
                contenedor.append(titulo);
                contenedor.append(descripcion);
                
                // La insertamos a su correspondiente contenedor
                if (!tarea.Hecha) {
                        tareas.append(contenedor);
                } else {
                        tareasCompletadas.append(contenedor);
                }


        });
}

// Función para mostrar u ocultar el formulario de creación
function mostrarFormulario() {
        // Escondemos o mostramos el formulario y obtenemos su estado después de la modificación
	let _mostrado = $("#id_formulariotarea").toggleClass('esconder').hasClass('esconder');

        // En caso de que esté escondido mostramos el botón, sino lo escondemos
        $("#id_nuevatarea").toggleClass('esconder', !_mostrado);

        // Si no está mostrado lo que haremos será borrar el contenido de sus campos
	if (!_mostrado) {
		$("#id_formulariotarea")[0].reset();
	}
}

// Función para filtrar las tareas sin completar
function filtrar() {
        // Iteramos por todas las tareas dentro del contenedor de tareas sin completar
        $('#tareas .tarea').each(function(index, e) {
                // Escondemos o mostramos el elemento dependiendo de si cumple con el filtro
                $(e).toggleClass(
                        'esconder', 
                        (
                                // Condición:   Si el título o la descripción no coinciden se esconde,
                                //              en caso contrario se muestra
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

// Función para filtrar las tareas completadas
function filtrarCompletadas() {
        // Iteramos por todas las tareas dentro del contenedor de tareas completadas
        $('#tareascompletadas .tarea').each(function(index, e) {
                // Escondemos o mostramos el elemento dependiendo de si cumple con el filtro
                $(e).toggleClass(
                        'esconder', 
                        (
                                // Condición:   Si el título o la descripción no coinciden se esconde,
                                //              en caso contrario se muestra
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
        // Envolvemos el elemento que recibimos para convertirlo en uno JQuery
        tarea = $(tarea);

        // Mostramos el formulario de modificación y lo insertamos anterior a la tarea
        let _form = $("#id_formulariomodificar")
                .removeClass('esconder')
                .insertBefore(tarea);

        // Populamos sus campos con los valores correspondientes
        _form.find('#id_tituloModificar').val(titulo);
        _form.find('#id_descripcionModificar').val(descripcion);

        // Controlamos el evento de cancelar
        _form.find('#id_cancelarModificar').on('click', function() {
                _form.addClass('esconder');
                tarea.removeClass('esconder');
        });

        // Controlamos la modificación
        _form.on('submit', function(e) {
                // Prevenimos la actuación por defecto
                e.preventDefault();

                // Actualizamos la tarea con los nuevos datos
                actualizarTareas(id, _form.find("#id_tituloModificar").val(), _form.find("#id_descripcionModificar").val(), hecha, mostrarTareas);

                // Escondemos el formulario
                _form.addClass('esconder');

                // Eliminamos este evento
                _form.off('submit');
        });

        // Escondemos la tarea
        tarea.addClass('esconder');
}
