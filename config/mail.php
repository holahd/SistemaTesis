<?php

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}


return [
    'host' => 'smtp.gmail.com',
    'username' => 'firesafenoreply@gmail.com',
    'password' => 'fkgl mlxd sqgz jiqd ',
    'port' => 587,
    'from_email' => 'firesafenoreply@gmail.com',
    'from_name' => $_SESSION['nombre'],
];
