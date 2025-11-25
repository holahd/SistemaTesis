CREATE DATABASE  IF NOT EXISTS `firesafe` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `firesafe`;
-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: firesafe
-- ------------------------------------------------------
-- Server version	8.0.37

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `auditoria_inv`
--

DROP TABLE IF EXISTS `auditoria_inv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria_inv` (
  `idauditoria` int NOT NULL AUTO_INCREMENT,
  `fk_id_lote` int NOT NULL,
  `cantidad_salida` int NOT NULL DEFAULT '0',
  `cantidad_entrada` int NOT NULL DEFAULT '0',
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`idauditoria`),
  KEY `fk_id_lote_idx` (`fk_id_lote`),
  CONSTRAINT `fk_id_lote` FOREIGN KEY (`fk_id_lote`) REFERENCES `lote` (`lote_id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auditoria_inv`
--

LOCK TABLES `auditoria_inv` WRITE;
/*!40000 ALTER TABLE `auditoria_inv` DISABLE KEYS */;
INSERT INTO `auditoria_inv` VALUES (7,3,0,150,'2025-08-04 21:29:26'),(8,4,0,100,'2025-08-04 21:29:53'),(9,5,0,35,'2025-08-04 21:30:48'),(10,6,0,30,'2025-08-04 21:31:48'),(11,7,0,60,'2025-08-04 21:32:33'),(12,8,0,55,'2025-08-04 21:33:38'),(13,9,0,30,'2025-08-04 21:34:35'),(14,10,0,50,'2025-08-04 21:36:01'),(15,11,0,100,'2025-08-04 21:37:02'),(16,12,0,43,'2025-08-04 21:37:52'),(17,13,0,65,'2025-08-04 21:38:45'),(18,14,0,100,'2025-08-04 21:39:27'),(19,15,0,150,'2025-08-04 21:44:05'),(20,16,0,100,'2025-08-04 21:47:33'),(21,17,0,100,'2025-08-04 21:47:58'),(22,18,0,100,'2025-08-04 21:48:48'),(23,19,0,100,'2025-08-04 21:50:35'),(24,20,0,90,'2025-08-04 21:52:31'),(25,21,0,50,'2025-08-04 21:54:29'),(26,22,0,50,'2025-08-04 21:55:59'),(27,23,0,100,'2025-08-04 21:57:43'),(28,19,13,0,'2025-08-05 14:27:57'),(29,10,5,0,'2025-08-05 14:27:57'),(30,16,10,0,'2025-08-05 14:27:57'),(31,17,10,0,'2025-08-05 14:27:57'),(32,18,5,0,'2025-08-05 14:27:58'),(33,6,12,0,'2025-08-12 16:20:59'),(34,5,15,0,'2025-08-13 10:23:35'),(35,6,12,0,'2025-08-13 10:23:35'),(36,10,3,0,'2025-08-13 10:23:35'),(37,21,10,0,'2025-08-13 10:23:35');
/*!40000 ALTER TABLE `auditoria_inv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `categoria`
--

DROP TABLE IF EXISTS `categoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria` (
  `categoria_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `padre_id` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`categoria_id`),
  UNIQUE KEY `categoría_id_UNIQUE` (`categoria_id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria`
--

LOCK TABLES `categoria` WRITE;
/*!40000 ALTER TABLE `categoria` DISABLE KEYS */;
INSERT INTO `categoria` VALUES (1,'Extintores',0),(2,'Vestimenta',0),(3,'ABC',1),(4,'BC',1),(5,'A',1),(6,'D',1),(7,'F',1),(8,'Guantes',2),(9,'Calzado de seguridad',2),(10,'Chalecos',2),(11,'Cascos',2),(12,'Protección ocular',2);
/*!40000 ALTER TABLE `categoria` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cotizacion`
--

DROP TABLE IF EXISTS `cotizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cotizacion` (
  `cotizacion_id` int NOT NULL AUTO_INCREMENT,
  `email_cliente` varchar(250) NOT NULL,
  `fecha_solicitud` date NOT NULL,
  `estado` enum('espera','enviado','vendido','cancelada') NOT NULL DEFAULT 'espera',
  `usu_ventas_id` int DEFAULT NULL,
  `nombre_cliente` varchar(200) DEFAULT NULL,
  `cedula_cliente` varchar(10) DEFAULT NULL,
  `direccion_cliente` varchar(300) DEFAULT NULL,
  `telefono_cliente` varchar(10) DEFAULT NULL,
  `pdfCot` text,
  PRIMARY KEY (`cotizacion_id`),
  KEY `usu_ventas_idx` (`usu_ventas_id`),
  CONSTRAINT `usu_ventas` FOREIGN KEY (`usu_ventas_id`) REFERENCES `usuario` (`usuario_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cotizacion`
--

LOCK TABLES `cotizacion` WRITE;
/*!40000 ALTER TABLE `cotizacion` DISABLE KEYS */;
INSERT INTO `cotizacion` VALUES (1,'holahd231@gmail.com','2025-08-04','vendido',1,'Xavier Vera','0850047606','Av. Atahualpa Ricardo sánchez','0984189192','../temp/cotizacion_1754318729.pdf'),(2,'holahd231@gmail.com','2025-08-04','vendido',1,'Juan Pérez','0854462514','av123 y calle 331','0994198182','../temp/cotizacion_1754347096.pdf'),(3,'juanito123@gmail.com','2025-08-04','vendido',1,'Juanito Flores','0850047606','Av. atahualpa Ricardo sánchez','0883246374','../temp/cotizacion_1755032845.pdf'),(4,'cmontalvo@ist17dejulio.edu.ec','2025-08-05','vendido',1,'Christian Montalvo','1002922464','Ibarra','0983318104','../temp/cotizacion_1754421917.pdf'),(5,'gvalladares@ist17dejulio.edu.ec','2025-08-13','vendido',1,'Gabriela Valladares','1003297809','Ibarra','0992937736','../temp/cotizacion_1755098527.pdf');
/*!40000 ALTER TABLE `cotizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalle_cotizacion`
--

DROP TABLE IF EXISTS `detalle_cotizacion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalle_cotizacion` (
  `detalle_id` int NOT NULL AUTO_INCREMENT,
  `cotizacion_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `talla` varchar(10) DEFAULT NULL,
  `pvp` decimal(10,2) DEFAULT NULL,
  `total` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`detalle_id`),
  KEY `cotizacion_id_idx` (`cotizacion_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `cotizacion_id` FOREIGN KEY (`cotizacion_id`) REFERENCES `cotizacion` (`cotizacion_id`),
  CONSTRAINT `producto_id` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`producto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalle_cotizacion`
--

LOCK TABLES `detalle_cotizacion` WRITE;
/*!40000 ALTER TABLE `detalle_cotizacion` DISABLE KEYS */;
INSERT INTO `detalle_cotizacion` VALUES (1,1,1,24,'40',17.24,413.76),(2,1,1,20,'36',20.03,400.60),(3,2,1,20,'40',17.24,344.80),(4,2,1,10,'36',20.29,202.90),(5,3,1,12,'40',46.57,558.84),(6,4,4,13,'7',32.02,416.26),(7,4,14,5,NULL,47.44,237.20),(8,4,12,10,'8',26.86,268.60),(9,4,12,10,'6',24.00,240.00),(10,4,12,5,'10',29.75,148.75),(11,5,1,15,'38',65.74,986.10),(12,5,1,12,'40',46.57,558.84),(13,5,14,3,NULL,47.44,142.32),(14,5,11,10,'9',30.43,304.30);
/*!40000 ALTER TABLE `detalle_cotizacion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `escala_descuentos`
--

DROP TABLE IF EXISTS `escala_descuentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `escala_descuentos` (
  `idescala_descuentos` int NOT NULL AUTO_INCREMENT,
  `cantidad_minima` int NOT NULL,
  `margen_ganancia` float NOT NULL,
  `descuento` float NOT NULL,
  PRIMARY KEY (`idescala_descuentos`),
  UNIQUE KEY `cantidad_minima_UNIQUE` (`cantidad_minima`),
  UNIQUE KEY `descuento_UNIQUE` (`descuento`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `escala_descuentos`
--

LOCK TABLES `escala_descuentos` WRITE;
/*!40000 ALTER TABLE `escala_descuentos` DISABLE KEYS */;
INSERT INTO `escala_descuentos` VALUES (5,1,34,0),(6,10,34,5),(7,15,34,10),(10,25,34,25),(11,50,34,30);
/*!40000 ALTER TABLE `escala_descuentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lote`
--

DROP TABLE IF EXISTS `lote`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `lote` (
  `lote_id` int NOT NULL AUTO_INCREMENT,
  `producto_id` int NOT NULL,
  `numero_lote` int DEFAULT NULL,
  `cantidad` int NOT NULL,
  `fecha_ingreso` date NOT NULL,
  `proveedor` varchar(300) NOT NULL,
  `fecha_cad` date DEFAULT NULL,
  `precio_unit` decimal(10,2) NOT NULL,
  `talla` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`lote_id`),
  KEY `fkProducto` (`producto_id`),
  CONSTRAINT `fkProducto` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`producto_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lote`
--

LOCK TABLES `lote` WRITE;
/*!40000 ALTER TABLE `lote` DISABLE KEYS */;
INSERT INTO `lote` VALUES (3,9,3,150,'2025-08-05','Kimberly-Clark',NULL,3.40,'M'),(4,9,4,100,'2025-08-05','Kimberly-Clark',NULL,4.30,'ML'),(5,1,5,20,'2025-08-05','Bata Industrials',NULL,50.34,'38'),(6,1,6,6,'2025-08-05','Bata Industrials',NULL,35.20,'40'),(7,6,7,60,'2025-08-05','3M',NULL,20.45,'Ajustable'),(8,5,8,55,'2025-08-05','Dräger',NULL,28.00,'Ajustable'),(9,7,9,30,'2025-08-05','LIBUS',NULL,23.43,'Ajustable'),(10,14,10,42,'2025-08-04','elitex','2025-08-22',35.40,NULL),(11,16,11,100,'2025-08-04','GRUPO TRUPER','2026-08-04',25.00,NULL),(12,13,12,43,'2025-08-04','Amerex','2026-07-08',30.00,NULL),(13,15,13,65,'2025-08-04','Amerex','2026-06-17',35.25,NULL),(14,17,14,100,'2025-08-04','Yukon','2026-08-19',50.00,NULL),(15,8,15,150,'2025-08-05','LIBUS',NULL,15.34,'MS'),(16,12,16,90,'2025-08-05','Kimberly-Clark',NULL,20.30,'8'),(17,12,17,90,'2025-08-05','Kimberly-Clark',NULL,18.14,'6'),(18,12,18,95,'2025-08-05','Kimberly-Clark',NULL,22.20,'10'),(19,4,19,87,'2025-08-05','T-Performance',NULL,24.20,'7'),(20,3,20,90,'2025-08-05','MARLUVAS',NULL,40.12,'41'),(21,11,21,40,'2025-08-05','KLEENGUARD',NULL,23.00,'9'),(22,10,22,50,'2025-08-05','LIBUS',NULL,20.00,'M'),(23,2,23,100,'2025-08-05','croydon',NULL,35.46,'38');
/*!40000 ALTER TABLE `lote` ENABLE KEYS */;
UNLOCK TABLES;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
/*!50003 CREATE*/ /*!50017 DEFINER=`root`@`localhost`*/ /*!50003 TRIGGER `lote_BEFORE_INSERT` AFTER INSERT ON `lote` FOR EACH ROW BEGIN
INSERT INTO auditoria_inv (fk_id_lote, cantidad_entrada, fecha_hora)
    VALUES (NEW.lote_id, NEW.cantidad, NOW());
END */;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `producto_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(250) NOT NULL,
  `descripcion` text NOT NULL,
  `categoría` int NOT NULL,
  `imagen` text NOT NULL,
  `descontinuado` tinyint NOT NULL DEFAULT '0',
  PRIMARY KEY (`producto_id`),
  UNIQUE KEY `nombre_UNIQUE` (`nombre`),
  KEY `categoría_idx` (`categoría`),
  CONSTRAINT `categoría` FOREIGN KEY (`categoría`) REFERENCES `categoria` (`categoria_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Botínes DART','../public/files/fichas/1754358143_BOTIN-DART_compressed-2.pdf',9,'../public/img/1754355219_Botin-Dart-bata.jpg',0),(2,'Zapatón Workman','../public/files/fichas/1754355721_ZAPATON-WORKMAN-OIL-RESISTANT-AMARILLO-sku-c_p_compressed.pdf',9,'../public/img/1754355721_Zapaton-Workman-Safety-Amarillo-CP-croydon.jpg',0),(3,'Botin 50B22 A marluvas','../public/files/fichas/1754355768_50B22-A-PA-NEGRO-sku-mar18504.pdf',9,'../public/img/1754355768_Botin-50B22-A-Pa-marluvas.jpg',0),(4,'Guante t performance','../public/files/fichas/1754355832_FICHA-T-PERFORMANCE.pdf',8,'../public/img/1754355832_Guante-t-performance-tonicomsa-nitrilo-t-glove.jpg',0),(5,'Casco HPS 3500 drager','../public/files/fichas/1754358212_CASCO-HPS-3500-sku-DRA12101_compressed.pdf',11,'../public/img/1754355944_Casco-Hps-3500-drager.jpg',0),(6,'Casco H 700 R 3M','../public/files/fichas/1754358347_ficha-tecnica-casco-h700-3m-secure-fit.pdf',11,'../public/img/1754358347_Casco-H-700-R-3M.jpg',0),(7,'Casco Milenium','../public/files/fichas/1754358544_Casco-Milenium-Class-sku-LIB12501.pdf',11,'../public/img/1754358544_Casco-Milenium-Class-902380-libus.jpg',0),(8,'Gafas argon','../public/files/fichas/1754358852_ANTEOJO-DE-SEGURIDAD-ARGON-CLARO-sku-LIB13101.pdf',12,'../public/img/1754358852_Gafas-argon-900494.jpg',0),(9,'Anteojos Nemesis V30','../public/files/fichas/1754358898_FT-GAFAS-DE-PROTECCION-DEPORTIVAS-NEMESIS-V30-sku-JAC13203.pdf',12,'../public/img/1754358898_Anteojo-Nemesis-V30-kleenguard.jpg',0),(10,'Monogafa Aviator','../public/files/fichas/1754359036_MONOGAFA-AVIATOR-903121-sku-LIB13109_compressed.pdf',12,'../public/img/1754359036_Monogafa-Aviator-903121-libus.jpg',0),(11,'Guantes G10 kleenguard','../public/files/fichas/1754359181_Ficha-Tecnica-G10-2PRO.pdf',8,'../public/img/1754359181_Guante-G10-kleenguard.jpg',0),(12,'Guante ainticorte G60','../public/files/fichas/1754359214_GUANTE-G60-ANTICORTE-NIVEL-3-sku-jac-17205.pdf',8,'../public/img/1754359214_Guante-G60-Anticorte-Nivel-3-kleenguard.jpg',0),(13,'Extintor amerex agua pulverizada desionizada','../public/files/fichas/1754359408_Extintor-Amerex-water-mist-agua-pulverizada-desionizada-desmineralizada-Modelo-B272-2-5-galones-certificacion-UL-NFPA-10-Indeci-ntp-350-043_compressed.pdf',5,'../public/img/1754359408_extintor-amerex-de-agua-pulverizada-desionizada-6-litros-2.png',0),(14,'extintor 6 litros agua espuma AFFF','../public/files/fichas/1754359603_FICHA TECNICA EXTINTOR CLASE F.pdf',7,'../public/img/1754359603_extintor-6-litros-agua-espuma-AFFF.jpg',0),(15,'Extintor Clase D para metales','../public/files/fichas/1754359659_Amerex-FT-Clase-D-30-Libras-B570-C-P_compressed.pdf',6,'../public/img/1754359659_Extintor-Clase-D-para-metales-30-libras-B570.jpg',0),(16,'Extintor ABC Trupper','../public/files/fichas/1754359700_101174.pdf',3,'../public/img/1754359700_EXT-450.jpg',0),(17,'Extintor Co2 7kg Yukon','../public/files/fichas/1754359738_fuego-co2.pdf',4,'../public/img/1754359738_matafuego-dioxido-carbono-7-kg-yukon.jpg',0);
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `usuario_id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(300) NOT NULL,
  `contraseña` varchar(100) NOT NULL,
  `rol` enum('admin','ventas','inventario') NOT NULL DEFAULT 'admin',
  `estado` tinyint DEFAULT '0',
  PRIMARY KEY (`usuario_id`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'Xavier','Vera','holahd231@gmail.com','12345','admin',1),(3,'Alan','Delgado Velez','alandelgado500@gmail.com','1234','inventario',1),(4,'Elmo','Pérez','perezelmo344@gmail.com','FireSafe2025','ventas',0),(9,'Alvaro ','Morillo','almo@gmail.com','12345','ventas',1);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'firesafe'
--

--
-- Dumping routines for database 'firesafe'
--
/*!50003 DROP PROCEDURE IF EXISTS `confirmar_cot` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `confirmar_cot`(
    IN p_email_cliente VARCHAR(250),
    IN p_nombre_cliente VARCHAR(250),
    IN p_cedula_cliente VARCHAR(250),
    IN p_direccion_cliente VARCHAR(250),
    IN p_telefono_cliente VARCHAR(250),
    IN p_cotizacion_id VARCHAR(250)
)
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE v_producto_id INT;
    DECLARE v_cantidad_necesaria INT;
    DECLARE v_lote_id INT;
    DECLARE v_cantidad_lote INT;
    DECLARE v_total_disponible INT;
    DECLARE v_msg VARCHAR(255);
    DECLARE v_talla VARCHAR(10); -- añadimos la talla

    -- Cursor que ahora también obtiene la talla
    DECLARE cur CURSOR FOR
        SELECT producto_id, cantidad, talla
        FROM detalle_cotizacion 
        WHERE cotizacion_id = p_cotizacion_id;

    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    -- Actualizar cliente
    UPDATE cotizacion 
    SET email_cliente = p_email_cliente,
        nombre_cliente = p_nombre_cliente,
        cedula_cliente = p_cedula_cliente,
        direccion_cliente = p_direccion_cliente,
        telefono_cliente = p_telefono_cliente
    WHERE cotizacion_id = p_cotizacion_id;

    OPEN cur;

    leer_loop: LOOP
        FETCH cur INTO v_producto_id, v_cantidad_necesaria, v_talla;
        IF done THEN
            LEAVE leer_loop;
        END IF;

        -- Verificar stock suficiente para esa talla
        SELECT IFNULL(SUM(cantidad), 0)
        INTO v_total_disponible
        FROM lote
        WHERE producto_id = v_producto_id
          AND cantidad > 0
          AND (
            (v_talla IS NOT NULL AND talla = v_talla AND fecha_cad IS NULL)
            OR
            (v_talla IS NULL AND talla IS NULL AND fecha_cad IS NOT NULL)
          );

        IF v_total_disponible < v_cantidad_necesaria THEN
            SET v_msg = CONCAT('No hay stock suficiente para el producto ID: ', v_producto_id, ' (talla ', v_talla, ')');
            SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = v_msg;
        END IF;

        -- Descontar stock desde el lote más antiguo compatible
        WHILE v_cantidad_necesaria > 0 DO
            SELECT lote_id, cantidad
            INTO v_lote_id, v_cantidad_lote
            FROM lote
            WHERE producto_id = v_producto_id
              AND cantidad > 0
              AND (
                (v_talla IS NOT NULL AND talla = v_talla AND fecha_cad IS NULL)
                OR
                (v_talla IS NULL AND talla IS NULL AND fecha_cad IS NOT NULL)
              )
            ORDER BY lote_id ASC
            LIMIT 1;

            IF v_cantidad_lote >= v_cantidad_necesaria THEN
                UPDATE lote
                SET cantidad = cantidad - v_cantidad_necesaria
                WHERE lote_id = v_lote_id;
                -- Auditoría
                INSERT INTO auditoria_inv (fk_id_lote, cantidad_salida, cantidad_entrada, fecha_hora)
                VALUES (v_lote_id, v_cantidad_necesaria, 0, NOW());
                SET v_cantidad_necesaria = 0;
            ELSE
                UPDATE lote
                SET cantidad = 0
                WHERE lote_id = v_lote_id;
                -- Auditoría
                INSERT INTO auditoria_inv (fk_id_lote, cantidad_salida, cantidad_entrada, fecha_hora)
                VALUES (v_lote_id, v_cantidad_lote, 0, NOW());
                SET v_cantidad_necesaria = v_cantidad_necesaria - v_cantidad_lote;
            END IF;
        END WHILE;

    END LOOP;

    CLOSE cur;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_buscar_producto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_buscar_producto`(
    IN p_busqueda VARCHAR(250)
)
BEGIN
    DECLARE termino TEXT;
    DECLARE palabra TEXT;

    -- Limpiar y normalizar el término de búsqueda
    SET termino = LOWER(p_busqueda);
    SET termino = REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(termino, 'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u');

    -- Crear tabla temporal para palabras
    DROP TEMPORARY TABLE IF EXISTS palabras_busqueda;
    CREATE TEMPORARY TABLE palabras_busqueda (
        palabra TEXT
    );

    -- Separar palabras e insertarlas en la tabla temporal
    WHILE CHAR_LENGTH(termino) > 0 DO
        IF LOCATE(' ', termino) > 0 THEN
            SET palabra = SUBSTRING_INDEX(termino, ' ', 1);
            SET termino = SUBSTRING(termino FROM LOCATE(' ', termino) + 1);
        ELSE
            SET palabra = termino;
            SET termino = '';
        END IF;

        IF CHAR_LENGTH(palabra) > 0 THEN
            INSERT INTO palabras_busqueda (palabra) VALUES (palabra);
        END IF;
    END WHILE;

    -- Consulta con JOIN a stock (lote) para stock_total
    SELECT DISTINCT 
        p.producto_id,
        p.nombre,
        p.descripcion,
        cat_padre.nombre AS categoria,
        cat_hijo.nombre AS subcategoria,
        cat_padre.categoria_id AS categoria_id,
        cat_hijo.categoria_id AS subcategoria_id,
        p.imagen,
        IF(p.descontinuado = 1, 'si', 'no') AS descontinuado,
        COALESCE(SUM(l.cantidad), 0) AS stock_total
    FROM producto p
    INNER JOIN categoria cat_hijo ON p.categoría = cat_hijo.categoria_id
    LEFT JOIN categoria cat_padre ON cat_hijo.padre_id = cat_padre.categoria_id
    LEFT JOIN lote l ON p.producto_id = l.producto_id
    JOIN palabras_busqueda pb ON (
        LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(p.nombre, 'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u')) LIKE CONCAT('%', pb.palabra, '%')
        OR LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(p.descripcion, 'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u')) LIKE CONCAT('%', pb.palabra, '%')
        OR LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(cat_padre.nombre, 'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u')) LIKE CONCAT('%', pb.palabra, '%')
        OR LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(cat_hijo.nombre, 'á','a'), 'é','e'), 'í','i'), 'ó','o'), 'ú','u')) LIKE CONCAT('%', pb.palabra, '%')
    )
    GROUP BY 
        p.producto_id,
        p.nombre,
        p.descripcion,
        cat_padre.nombre,
        cat_hijo.nombre,
        cat_padre.categoria_id,
        cat_hijo.categoria_id,
        p.imagen,
        p.descontinuado;

    -- Eliminar tabla temporal
    DROP TEMPORARY TABLE IF EXISTS palabras_busqueda;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_categoria` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_categoria`(
    IN op INT,
    IN p_categoria_id INT,
    IN p_nombre VARCHAR(100),
    IN p_padre_id INT
)
BEGIN
    CASE op
        WHEN 1 THEN
            SELECT * FROM categoria;
        WHEN 2 THEN
            INSERT INTO categoria (categoria_id, nombre, padre_id)
            VALUES (p_categoria_id, p_nombre, p_padre_id);
        WHEN 3 THEN
            UPDATE categoria
            SET nombre = p_nombre, padre_id = p_padre_id
            WHERE categoria_id = p_categoria_id;
        WHEN 4 THEN
            DELETE FROM categoria WHERE categoria_id = p_categoria_id;
        when 5 then
        
        select * from categoria where padre_id = 0;
        
        when 6 then 
        select * from categoria where p_categoria_id = padre_id;
		
    END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_cotizacion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_cotizacion`(
    IN op INT,
    IN p_cotizacion_id INT,
    IN p_email_cliente VARCHAR(250),
    in p_nombre_cliente varchar (250),
    in p_telefono_cliente varchar (10),
    IN p_fecha_solicitud DATE,
    IN p_estado ENUM('espera','enviado','vendido', 'cancelada'),
    IN p_usu_ventas_id INT
)
BEGIN
    CASE op
        WHEN 1 THEN
            SELECT * FROM cotizacion where p_cotizacion_id = cotizacion_id;
        WHEN 2 THEN
            INSERT INTO cotizacion (email_cliente, fecha_solicitud, nombre_cliente, telefono_cliente)
            VALUES (p_email_cliente, CURDATE(), p_nombre_cliente, p_telefono_cliente);
              SELECT LAST_INSERT_ID() AS cotizacion_id;
        WHEN 3 THEN
            UPDATE cotizacion
            SET estado = p_estado,
                usu_ventas_id = p_usu_ventas_id
            WHERE cotizacion_id = p_cotizacion_id;
        WHEN 4 THEN
            DELETE FROM cotizacion WHERE cotizacion_id = p_cotizacion_id;
        -- Agregar dentro del CASE del procedimiento `sp_cotizacion`

WHEN 5 THEN
    -- Listado de cotizaciones por estado con productos unidos en texto
    SELECT 
        c.cotizacion_id,
        c.email_cliente,
        c.nombre_cliente,
        c.telefono_cliente,
        GROUP_CONCAT(p.nombre SEPARATOR ', ') AS productos_solicitados
    FROM cotizacion c
    JOIN detalle_cotizacion dc ON c.cotizacion_id = dc.cotizacion_id
    JOIN producto p ON dc.producto_id = p.producto_id
    WHERE c.estado = p_estado
    GROUP BY c.cotizacion_id, c.email_cliente;

WHEN 6 THEN
    SELECT 
        d.detalle_id,
        p.nombre AS producto,
        d.cantidad AS cantidad_solicitada,
        d.talla,

        -- Stock total compatible
        (
            SELECT IFNULL(SUM(l.cantidad), 0)
            FROM lote l
            WHERE l.producto_id = d.producto_id
              AND l.cantidad > 0
              AND (
                    (d.talla IS NOT NULL AND l.talla = d.talla AND l.fecha_cad IS NULL)
                    OR
                    (d.talla IS NULL AND l.talla IS NULL AND l.fecha_cad IS NOT NULL)
              )
        ) AS stock_total,

        -- Precio más alto entre los lotes necesarios (FIFO)
               -- Precio más alto entre los lotes usados por FIFO para cubrir la cantidad solicitada
(
    SELECT MAX(l2.precio_unit)
    FROM (
        SELECT 
            l.precio_unit,
            @acum := @acum + l.cantidad AS acumulado,
            l.cantidad
        FROM lote l, (SELECT @acum := 0) vars
        WHERE l.producto_id = d.producto_id
          AND l.cantidad > 0
          AND (
                (d.talla IS NOT NULL AND l.talla = d.talla AND l.fecha_cad IS NULL)
                OR
                (d.talla IS NULL AND l.talla IS NULL AND l.fecha_cad IS NOT NULL)
          )
        ORDER BY l.lote_id ASC
    ) AS l2
) AS precio_unitario_crudo



    FROM detalle_cotizacion d
    INNER JOIN producto p ON d.producto_id = p.producto_id
    WHERE d.cotizacion_id = p_cotizacion_id;

    END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_detalle_cotizacion` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_detalle_cotizacion`(
    IN op INT,
    IN p_detalle_id INT,
    IN p_cotizacion_id INT,
    IN p_producto_id INT,
    IN p_cantidad INT,
    IN p_pvp DECIMAL(10,2),
    IN p_total DECIMAL(10,2),
    IN p_talla VARCHAR(10)
)
BEGIN
    CASE op
       WHEN 1 THEN
    SELECT 
        dc.cotizacion_id,
        dc.detalle_id,
        p.nombre AS producto,
        dc.cantidad,
        dc.pvp,
        dc.total,
        dc.talla,
        IFNULL(SUM(
            CASE 
                WHEN dc.talla IS NOT NULL 
                     AND l.talla = dc.talla 
                     AND l.fecha_cad IS NULL THEN l.cantidad
                WHEN dc.talla IS NULL 
                     AND l.talla IS NULL 
                     AND l.fecha_cad IS NOT NULL THEN l.cantidad
                ELSE 0
            END
        ), 0) AS stock_total
    FROM detalle_cotizacion dc
    JOIN producto p ON dc.producto_id = p.producto_id
    LEFT JOIN lote l ON dc.producto_id = l.producto_id
    WHERE dc.cotizacion_id = p_cotizacion_id 
    GROUP BY dc.detalle_id, dc.cotizacion_id, p.nombre, dc.cantidad, dc.pvp, dc.total, dc.talla;


        WHEN 2 THEN
            -- Solo inserta lo básico en solicitud: sin precios ni totales
            INSERT INTO detalle_cotizacion (cotizacion_id, producto_id, cantidad, talla)
            VALUES (p_cotizacion_id, p_producto_id, p_cantidad, p_talla);

        WHEN 3 THEN
            -- Actualiza los valores cuando ya se calculan los precios
            UPDATE detalle_cotizacion
            SET pvp = p_pvp,
                total = p_total
            WHERE detalle_id = p_detalle_id;

        WHEN 4 THEN
            DELETE FROM detalle_cotizacion WHERE detalle_id = p_detalle_id;
    END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_escala_descuento` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_escala_descuento`(
    IN op INT,
    IN p_id INT,
    IN p_cantidad_minima INT,
    IN p_margen_ganancia DECIMAL(5,2),
    IN p_descuento DECIMAL(5,2)
)
BEGIN
    CASE op
        WHEN 1 THEN
            -- Obtener todas las reglas
            SELECT 
            idescala_descuentos as id,
            cantidad_minima as cantidad,
            margen_ganancia as ganancia,
            descuento
            FROM escala_descuentos;

        WHEN 2 THEN
            -- Insertar nueva regla
            INSERT INTO escala_descuentos (cantidad_minima, margen_ganancia, descuento)
            VALUES (p_cantidad_minima, p_margen_ganancia, p_descuento);

        WHEN 3 THEN
            -- Actualizar una regla existente
            UPDATE escala_descuentos
    SET 
        cantidad_minima = p_cantidad_minima,
        margen_ganancia = p_margen_ganancia,
        descuento = p_descuento
    WHERE idescala_descuentos = p_id;

    -- Sincronizar margen en todos los registros
    UPDATE escala_descuentos
    SET margen_ganancia = p_margen_ganancia;

        WHEN 4 THEN
            -- Eliminar una regla por ID
            DELETE FROM escala_descuentos
            WHERE idescala_descuentos = p_id;
            
		WHEN 5 THEN
            -- Obtener la mejor regla aplicable según la cantidad
            SELECT idescala_descuentos as id,
            cantidad_minima as cantidad,
            margen_ganancia as ganancia,
            descuento
            FROM escala_descuentos
            WHERE cantidad_minima <= p_cantidad_minima
            ORDER BY cantidad_minima DESC
            LIMIT 1;
            

    END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_get_notificaciones` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_get_notificaciones`(
  IN umbral_expiracion INT,     -- días antes de caducar
  IN umbral_stock      INT      -- umbral mínimo de stock
)
BEGIN
   SELECT tipo, ref_id, mensaje FROM (
    -- Cotizaciones pendientes
    SELECT
      'cotizacion' AS tipo,
      c.cotizacion_id AS ref_id,
      CONCAT(
        'Cotización #', c.cotizacion_id,
        ' pendiente desde ', DATE_FORMAT(c.fecha_solicitud, '%d/%m/%Y')
      ) AS mensaje
    FROM firesafe.cotizacion c
    WHERE c.estado = 'espera'

    UNION ALL

    -- Lotes próximos a caducar
    SELECT
      'caducidad' AS tipo,
      l.lote_id AS ref_id,
      CONCAT(
        'Lote ', l.numero_lote,
        ' de "', p.nombre,'" caduca en ',
        DATEDIFF(l.fecha_cad, CURDATE()), ' días (', 
        DATE_FORMAT(l.fecha_cad, '%d/%m/%Y'), ')'
      ) AS mensaje
    FROM firesafe.lote l
    JOIN firesafe.producto p ON l.producto_id = p.producto_id
    WHERE l.fecha_cad BETWEEN CURDATE() 
                         AND DATE_ADD(CURDATE(), INTERVAL umbral_expiracion DAY)

    UNION ALL

    -- Stock bajo o agotado
    -- Stock bajo o agotado por talla (si aplica)
SELECT
  'stock' AS tipo,
  p.producto_id AS ref_id,
  CONCAT(
    'Producto "', p.nombre,
    IFNULL(CONCAT(' talla ', l.talla), ''),
    '" con stock bajo: ',
    CAST(COALESCE(SUM(l.cantidad), 0) AS CHAR),
    ' unidades'
  ) AS mensaje
FROM firesafe.producto p
LEFT JOIN firesafe.lote l ON p.producto_id = l.producto_id
GROUP BY p.producto_id, p.nombre, l.talla
HAVING COALESCE(SUM(l.cantidad), 0) <= umbral_stock

  ) AS todas
  ORDER BY FIELD(tipo,'cotizacion','caducidad','stock'), mensaje;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_guardarPdf` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_guardarPdf`(
in op int,
in p_cotizacion_id int,
in p_directorio text
)
BEGIN
CASE op
	when 1 then
			UPDATE cotizacion
            SET pdfCot = p_directorio
            WHERE cotizacion_id = p_cotizacion_id;
            
            when 2 then
		select pdfCot 
        from cotizacion 
        where cotizacion_id=p_cotizacion_id;
            
	end case;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_lote` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_lote`(
    IN op INT,
    in P_lote_id int,
    IN p_producto_nombre VARCHAR(250),
    IN p_numero_lote INT,
    IN p_cantidad INT,
    IN p_fecha_ingreso DATE,
    IN p_proveedor VARCHAR(300),
    IN p_fecha_cad DATE,
    in p_talla varchar(10),
    IN p_precio_unit DECIMAL(10,2)
)
BEGIN
    DECLARE p_producto_id INT;

    -- Solo buscar producto_id si se necesita (op != 1 y op != 4)
    IF op NOT IN (1, 4) THEN
        SELECT producto_id INTO p_producto_id 
        FROM producto 
        WHERE nombre = p_producto_nombre 
        LIMIT 1;
    END IF;

    CASE op
        WHEN 1 THEN
            -- LISTAR con JOIN para mostrar nombre de producto
            SELECT 
            l.lote_id,
    p.nombre AS producto,
    l.numero_lote,
    l.cantidad,
    l.fecha_ingreso,
    l.proveedor,
    IF(l.fecha_cad IS NULL, 'No aplica', l.fecha_cad) AS fecha_caducidad,
    IF(l.talla IS NULL, 'No aplica', l.talla) AS talla,
    l.precio_unit
FROM lote l
INNER JOIN producto p ON p.producto_id = l.producto_id;


      WHEN 2 THEN
    IF p_fecha_cad IS NULL AND p_talla IS NOT NULL THEN
        -- Caso: vestimenta (talla pero no caducidad)
        INSERT INTO lote (
            producto_id,  cantidad, fecha_ingreso, proveedor, talla, precio_unit
        )
        VALUES (
            p_producto_id,  p_cantidad, p_fecha_ingreso, p_proveedor, p_talla, p_precio_unit
        );

    ELSEIF p_fecha_cad IS NOT NULL AND p_talla IS NULL THEN
        -- Caso: extintores (caducidad pero no talla)
        INSERT INTO lote (
            producto_id, numero_lote, cantidad, fecha_ingreso, proveedor, fecha_cad, precio_unit
        )
        VALUES (
            p_producto_id, p_numero_lote, p_cantidad, curdate(), p_proveedor, p_fecha_cad, p_precio_unit
        );

    ELSE
        -- Caso no válido (ambos NULL o ambos llenos)
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Error: debes ingresar talla o fecha de caducidad, pero no ambas';
    END IF;


        WHEN 3 THEN
            UPDATE lote
            SET producto_id = p_producto_id,
                
                cantidad = p_cantidad,
               
                proveedor = p_proveedor,
                fecha_cad = p_fecha_cad,
                talla = p_talla,
                precio_unit = p_precio_unit
            WHERE lote_id = p_lote_id;

        WHEN 4 THEN
            DELETE FROM lote WHERE numero_lote = p_numero_lote;
            
            WHEN 5 THEN
            SELECT 
        p.nombre AS producto,
        cat_hijo.nombre AS subcategoria,
        cat_padre.nombre AS categoria
    FROM producto p
    INNER JOIN categoria cat_hijo ON p.categoría = cat_hijo.categoria_id
    LEFT JOIN categoria cat_padre ON cat_hijo.padre_id = cat_padre.categoria_id
    ORDER BY p.nombre ASC;
            
    END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_producto` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_producto`(
    IN op INT,
    IN p_producto_id INT,
    IN p_nombre VARCHAR(250),
    IN p_descripcion TEXT,
    IN p_categoria INT,
    IN p_imagen TEXT
)
BEGIN

    CASE op
        WHEN 1 THEN
          SELECT 
    p.producto_id,
    p.nombre,
    p.descripcion,
    cat_padre.nombre AS categoria,
    cat_hijo.nombre AS subcategoria,
    cat_padre.categoria_id AS categoria_id,
    cat_hijo.categoria_id AS subcategoria_id,
    p.imagen,
    IF(p.descontinuado = 1, 'si', 'no') AS descontinuado,
     CASE 
        WHEN cat_padre.categoria_id = 1 THEN COALESCE(SUM(s.cantidad), 0)
        ELSE NULL
    END AS stock_total
FROM producto p
INNER JOIN categoria cat_hijo ON p.categoría = cat_hijo.categoria_id
LEFT JOIN categoria cat_padre ON cat_hijo.padre_id = cat_padre.categoria_id
LEFT JOIN lote s ON p.producto_id = s.producto_id
GROUP BY 
    p.producto_id,
    p.nombre,
    p.descripcion,
    cat_padre.nombre,
    cat_hijo.nombre,
    cat_padre.categoria_id,
    cat_hijo.categoria_id,
    p.imagen,
    p.descontinuado;


        WHEN 2 THEN
            INSERT INTO producto (nombre, descripcion, categoría, imagen)
            VALUES (p_nombre, p_descripcion, p_categoria, p_imagen);
        WHEN 3 THEN
            UPDATE producto
SET 
    nombre = p_nombre,
    descripcion = p_descripcion,
    categoría = p_categoria,
    imagen = CASE 
                WHEN p_imagen IS NOT NULL AND p_imagen <> '' THEN p_imagen
                ELSE imagen  -- mantener la imagen actual si p_imagen es nulo o vacío
            END
WHERE producto_id = p_producto_id;
        WHEN 4 THEN
            DELETE FROM producto WHERE producto_id = p_producto_id;
            
		when 5 then 
			update producto set descontinuado = 1 where producto_id = p_producto_id ;
            
            when 6 then 
			update producto set descontinuado = 0 where producto_id = p_producto_id ;
            
            when 7 then
            
			SELECT 
				talla,
				SUM(cantidad) AS stock
			FROM lote
			WHERE producto_id = p_producto_id
			  AND talla IS NOT NULL
			GROUP BY talla;


    END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_reporte_auditoria_inv` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_reporte_auditoria_inv`(
  IN fecha_inicio DATE,
  IN fecha_fin DATE,
  IN prod_nombre TEXT
)
BEGIN
  SELECT
    p.nombre AS producto,
    l.numero_lote,
    l.talla,
    l.proveedor,
    a.cantidad_entrada,
    a.cantidad_salida,
    a.fecha_hora
  FROM auditoria_inv a
  INNER JOIN lote l ON a.fk_id_lote = l.lote_id
  INNER JOIN producto p ON l.producto_id = p.producto_id
  WHERE a.fecha_hora >= fecha_inicio
    AND a.fecha_hora < DATE_ADD(fecha_fin, INTERVAL 1 DAY)
    AND (prod_nombre IS NULL OR p.nombre = prod_nombre)
  ORDER BY a.fecha_hora;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `sp_usuario` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_usuario`(
    IN op INT,
    IN p_usuario_id INT,
    IN p_nombre VARCHAR(100),
    IN p_apellido VARCHAR(100),
    IN p_email VARCHAR(300),
    IN p_contraseña VARCHAR(100),
    IN p_rol ENUM('admin','ventas','inventario')
)
BEGIN

DECLARE p_id INT;
SELECT usuario_id INTO p_id FROM usuario WHERE email = p_email LIMIT 1;

    CASE op
        WHEN 1 THEN
            SELECT * FROM usuario;
        WHEN 2 THEN
            INSERT INTO usuario (nombre, apellido, email, contraseña, rol)
            VALUES (p_nombre, p_apellido, p_email, "FireSafe2025", p_rol);
            
        WHEN 3 THEN
            UPDATE usuario
            SET nombre = p_nombre,
                apellido = p_apellido,
                email = p_email,
                rol = p_rol
            WHERE usuario_id = p_usuario_id;
            
        WHEN 4 THEN
            DELETE FROM usuario WHERE usuario_id = p_usuario_id;
        
        When 5 then
			select * from usuario where  p_email = email and p_contraseña = contraseña;
		
        when 6 then 
         update usuario
 
 set contraseña=p_contraseña , estado = 1
 
 where email = p_email;
		
        when 7 then
 
	update usuario

	set contraseña = 'FireSafe2025',

	estado = 0

	where usuario_id = p_id;
        
        END CASE;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!50003 DROP PROCEDURE IF EXISTS `tallas_disponibles` */;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;
/*!50003 SET character_set_client  = utf8mb4 */ ;
/*!50003 SET character_set_results = utf8mb4 */ ;
/*!50003 SET collation_connection  = utf8mb4_0900_ai_ci */ ;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION' */ ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `tallas_disponibles`(IN p_producto_id INT)
BEGIN
  SELECT DISTINCT talla 
    FROM lote 
    WHERE producto_id = p_producto_id 
      AND cantidad > 0 
      AND talla IS NOT NULL;
END ;;
DELIMITER ;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;
/*!50003 SET character_set_client  = @saved_cs_client */ ;
/*!50003 SET character_set_results = @saved_cs_results */ ;
/*!50003 SET collation_connection  = @saved_col_connection */ ;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-08-14  8:48:40
