<?php
    require_once 'connect.php';
    $db = 'tareas';

    $conexion = conectar($db);
    $parametros = array(
        ":ID"=>$_POST['ID'],
        ":Nombre"=>$_POST['Nombre'],
        ":Descripcion"=>$_POST['Descripcion'],
        ":Hecha"=>$_POST['Hecha']
    );
    $sql = "INSERT INTO `ttareas` (`ID`, `Nombre`, `Descripcion`, `Hecha`) VALUES (:ID, :Nombre, :Descripcion, :Hecha)";
    $pdo = $conexion->prepare($sql);
    $pdo->execute($parametros);
?>