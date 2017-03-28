-- MySQL dump 10.13  Distrib 5.6.25, for osx10.8 (x86_64)
--
-- Host: localhost    Database: chrome
-- ------------------------------------------------------
-- Server version	5.6.25

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `chrome`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `chrome` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `chrome`;

--
-- Table structure for table `1`
--

DROP TABLE IF EXISTS `1`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `1` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `name` int(11) unsigned DEFAULT NULL,
  `variation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` tinyint(1) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_1_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `1`
--

LOCK TABLES `1` WRITE;
/*!40000 ALTER TABLE `1` DISABLE KEYS */;
/*!40000 ALTER TABLE `1` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `3`
--

DROP TABLE IF EXISTS `3`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `3` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `name` int(11) unsigned DEFAULT NULL,
  `variation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_3_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `3`
--

LOCK TABLES `3` WRITE;
/*!40000 ALTER TABLE `3` DISABLE KEYS */;
/*!40000 ALTER TABLE `3` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `4`
--

DROP TABLE IF EXISTS `4`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `4` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) unsigned DEFAULT NULL,
  `name` int(11) unsigned DEFAULT NULL,
  `variation` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_4_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `4`
--

LOCK TABLES `4` WRITE;
/*!40000 ALTER TABLE `4` DISABLE KEYS */;
/*!40000 ALTER TABLE `4` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `variations`
--

DROP TABLE IF EXISTS `variations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `variations` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` varchar(200) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `variation` longtext,
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  `token` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_variations_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `variations`
--

LOCK TABLES `variations` WRITE;
/*!40000 ALTER TABLE `variations` DISABLE KEYS */;
INSERT INTO `variations` VALUES (5,'217b38d4981353b8dea91d707ad4848fc9def373bbc4adef55eb24f4bdabff4a','2','{\"js\":\"/*Javascript goes here*/\\n//2\",\"css\":\"/* css goes here */\"}','2015-12-16 15:41:49','$7V09C7F');
/*!40000 ALTER TABLE `variations` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-03-26 13:23:10
