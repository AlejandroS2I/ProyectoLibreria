<?php
    require_once 'connect.php';
    $db = 'tareas';

    $conexion = conectar($db);
    $parametros = array(
        ":Nombre"=>$_POST['Nombre'],
        ":Descripcion"=>$_POST['Descripcion'],
        ":Hecha"=>$_POST['Hecha']
    );
    $sql = "INSERT INTO `ttareas` ( `Nombre`, `Descripcion`, `Hecha`) VALUES (:Nombre, :Descripcion, :Hecha)";
    $pdo = $conexion->prepare($sql);
    $pdo->execute($parametros);
?>