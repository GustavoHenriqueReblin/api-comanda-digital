-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           5.7.41 - MySQL Community Server (GPL)
-- OS do Servidor:               Linux
-- HeidiSQL Versão:              12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Copiando estrutura do banco de dados para digital-command
DROP DATABASE IF EXISTS `digital-command`;
CREATE DATABASE IF NOT EXISTS `digital-command` /*!40100 DEFAULT CHARACTER SET armscii8 COLLATE armscii8_bin */;
USE `digital-command`;

-- Copiando estrutura para tabela digital-command.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `id` tinyint(3) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(80) COLLATE armscii8_bin DEFAULT NULL,
  `email` varchar(60) COLLATE armscii8_bin DEFAULT NULL,
  `password` varchar(40) COLLATE armscii8_bin DEFAULT NULL,
  `token` varchar(250) COLLATE armscii8_bin DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=armscii8 COLLATE=armscii8_bin;

-- Copiando dados para a tabela digital-command.user: ~1 rows (aproximadamente)
INSERT INTO `user` (`id`, `name`, `email`, `password`, `token`) VALUES
	(1, 'Jonas', 'jonas@gmail.com', 'a', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJqb25hc0BnbWFpbC5jbyIsInBhc3N3b3JkIjoiYSIsImlhdCI6MTcwODMwNTI3MCwiZXhwIjoxNzA4MzkxNjcwfQ.zguCWDCm6dZ8FklHgaUk_S4oSSVWEZTQrrG4WbPKoWA');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
