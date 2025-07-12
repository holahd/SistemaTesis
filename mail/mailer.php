<?php
require_once '../config/mail.php';
require_once '../public/libs/PHPMailer/src/PHPMailer.php';
require_once '../public/libs/PHPMailer/src/SMTP.php';
require_once '../public/libs/PHPMailer/src/Exception.php';
require_once 'templates/plantilla_html.php';
require_once 'crear_pdf.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

function getConfiguredMailer(): PHPMailer
{
    $config = require '../config/mail.php';
    $mail = new PHPMailer(true);

    // Configuración SMTP común
    $mail->isSMTP();
    $mail->CharSet    = 'UTF-8';
    $mail->Host       = $config['host'];
    $mail->SMTPAuth   = true;
    $mail->Username   = $config['username'];
    $mail->Password   = $config['password'];
    $mail->SMTPSecure = 'tls';
    $mail->Port       = $config['port'];

    // Remitente común
    $mail->setFrom($config['from_email'], $config['from_name']);

    return $mail;
}

function enviarCorreo($datos)
{
    $mail = getConfiguredMailer();
    try {
        $mail->addAddress($datos['correo']);
        $mail->isHTML(true);
        $mail->Subject = $datos['asunto'];
        $mail->Body    = getEmailBody($datos);

        // PDF opcional
        $pdfPath = generarPDF($datos);
        $mail->addAttachment($pdfPath);
        $mail->AddEmbeddedImage('./../public/img/administrador/Pyro_emblem_RED.png', 'logoCID');

        $mail->send();
        unlink($pdfPath);

        return ['success' => true];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}

function enviarCorreoStockInsuficiente($correo, $cotId, array $productos)
{
    $mail = getConfiguredMailer();
    try {
        $mail->addAddress($correo);
        $mail->isHTML(true);
        $mail->Subject = "Cotización #{$cotId} cancelada por falta de stock";
        $mail->Body    = getEmailBodyStockInsuficiente($correo, $cotId, $productos);
        $mail->AddEmbeddedImage('./../public/img/administrador/Pyro_emblem_RED.png', 'logoCID');

        $mail->send();
        return ['success' => true];
    } catch (Exception $e) {
        return ['success' => false, 'error' => $mail->ErrorInfo];
    }
}
