<?php
if (isset($_GET['id'])) {
    require_once 'connect.php';
    $db = 'tareas';

    $conexion = conectar($db);
    $parametros = array(":id" => $_GET['id']);
    $sql = "DELETE FROM ttareas WHERE ID = :id";
    $pdo = $conexion->prepare($sql);
    $pdo->execute($parametros);
}
?>
