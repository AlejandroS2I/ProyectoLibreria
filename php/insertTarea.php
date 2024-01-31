<?php
        require_once 'connect.php';
        $db = 'lista_alumnos';

        $conexion = conectar($db);
        $parametros = array(
            ":nombre"=>$_POST['nombre'],
            ":apellidos"=>$_POST['apellidos'],
            ":email"=>$_POST['email'],
            ":tlf"=>$_POST['telefono']
        );
        $sql = "INSERT INTO `alumnos` (`id`, `nombre`, `apellidos`, `email`, `telefono`) VALUES (NULL, :nombre, :apellidos, :email, :tlf)";
        $pdo = $conexion->prepare($sql);
        $pdo->execute($parametros);
    
?>