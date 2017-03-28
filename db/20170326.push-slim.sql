-- MySQL dump 10.13  Distrib 5.6.25, for osx10.8 (x86_64)
--
-- Host: localhost    Database: push-slim
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
-- Current Database: `push-slim`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `push-slim` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `push-slim`;

--
-- Table structure for table `campaigns`
--

DROP TABLE IF EXISTS `campaigns`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `campaigns` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `page_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `variations` text COLLATE utf8mb4_unicode_ci,
  `status` int(1) DEFAULT '0',
  `flag` enum('active','inactive') COLLATE utf8mb4_unicode_ci DEFAULT 'inactive',
  `traffic` int(11) unsigned DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `archived` int(11) DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (63,'HomePage Test',1,'/','a:2:{s:7:\"control\";a:6:{s:2:\"js\";s:12:\"//js control\";s:3:\"css\";s:35:\".navbar {\n    background: yellow;\n}\";s:4:\"name\";s:7:\"Control\";s:2:\"id\";s:7:\"control\";s:7:\"traffic\";s:5:\"40.00\";s:6:\"paused\";s:5:\"false\";}s:11:\"variation-1\";a:6:{s:2:\"js\";s:14:\"//js variation\";s:3:\"css\";s:32:\".navbar {\n    background: red;\n}\";s:4:\"name\";s:10:\"Variation1\";s:2:\"id\";s:11:\"variation-1\";s:7:\"traffic\";s:5:\"60.00\";s:6:\"paused\";s:5:\"false\";}}',1,'active',80,'2016-09-01',0),(67,'New Campaign - 6755',NULL,NULL,'a:2:{s:7:\"control\";a:5:{s:2:\"js\";s:12:\"//js control\";s:3:\"css\";s:5:\"//css\";s:4:\"name\";s:7:\"Control\";s:2:\"id\";s:7:\"control\";s:7:\"traffic\";s:2:\"50\";}s:11:\"variation-1\";a:5:{s:2:\"js\";s:14:\"//js variation\";s:3:\"css\";s:5:\"//css\";s:4:\"name\";s:9:\"Variation\";s:2:\"id\";s:11:\"variation-1\";s:7:\"traffic\";s:2:\"50\";}}',0,'inactive',10,'2016-09-21',1),(71,'HomePage Test-clone-93479',1,'/','a:2:{s:7:\"control\";a:6:{s:2:\"js\";s:12:\"//js control\";s:3:\"css\";s:35:\".navbar {\n    background: yellow;\n}\";s:4:\"name\";s:7:\"Control\";s:2:\"id\";s:7:\"control\";s:7:\"traffic\";s:5:\"40.00\";s:6:\"paused\";s:5:\"false\";}s:11:\"variation-1\";a:6:{s:2:\"js\";s:14:\"//js variation\";s:3:\"css\";s:32:\".navbar {\n    background: red;\n}\";s:4:\"name\";s:10:\"Variation1\";s:2:\"id\";s:11:\"variation-1\";s:7:\"traffic\";s:5:\"60.00\";s:6:\"paused\";s:5:\"false\";}}',1,'active',80,'2016-09-01',0);
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `experiments`
--

DROP TABLE IF EXISTS `experiments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `experiments` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` int(11) DEFAULT NULL,
  `messages` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `experiments`
--

LOCK TABLES `experiments` WRITE;
/*!40000 ALTER TABLE `experiments` DISABLE KEYS */;
/*!40000 ALTER TABLE `experiments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rules`
--

DROP TABLE IF EXISTS `rules`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `rules` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `device` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `browser` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `geographic` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cookie` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `script` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ip` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `language` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_rules_campaign` (`campaign_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rules`
--

LOCK TABLES `rules` WRITE;
/*!40000 ALTER TABLE `rules` DISABLE KEYS */;
INSERT INTO `rules` VALUES (1,63,'{\"url\":[\"http:\\/\\/dev.ehdoc\\/\"],\"url_contains\":[\"campaign\"],\"url_excludes\":[\"fb\"]}','{\"allow_desktop\":\"true\",\"allow_mobile\":\"true\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"true\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}','{\"exclude_cookie\":[],\"include_cookie\":[]}','{\"js\":\"(function() {\\n\\n  if($(\'#page-top\').length > 0) { return true; }\\n  return false;\\n\\n})();\"}','{\"all_users\":\"true\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(2,64,NULL,'{\"allow_desktop\":\"false\",\"allow_mobile\":\"false\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"false\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}',NULL,'{\"js\":\"\"}','{\"all_users\":\"false\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(3,65,NULL,'{\"allow_desktop\":\"false\",\"allow_mobile\":\"false\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"false\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}',NULL,'{\"js\":\"\"}','{\"all_users\":\"false\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(4,66,NULL,'{\"allow_desktop\":\"false\",\"allow_mobile\":\"false\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"false\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}',NULL,'{\"js\":\"\"}','{\"all_users\":\"false\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(5,67,NULL,'{\"allow_desktop\":\"false\",\"allow_mobile\":\"false\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"false\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}',NULL,'{\"js\":\"\"}','{\"all_users\":\"false\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(6,63,'{\"url\":[\"http:\\/\\/dev.ehdoc\\/\"],\"url_contains\":[\"campaign\"],\"url_excludes\":[\"fb\"]}','{\"allow_desktop\":\"true\",\"allow_mobile\":\"true\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"true\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}','{\"exclude_cookie\":[],\"include_cookie\":[]}','{\"js\":\"(function() {\\n\\n  if($(\'#page-top\').length > 0) { return true; }\\n  return false;\\n\\n})();\"}','{\"all_users\":\"true\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(7,71,'{\"url\":[\"http:\\/\\/dev.ehdoc\\/\"],\"url_contains\":[\"campaign\"],\"url_excludes\":[\"fb\"]}','{\"allow_desktop\":\"true\",\"allow_mobile\":\"true\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"true\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}','{\"exclude_cookie\":[],\"include_cookie\":[]}','{\"js\":\"(function() {\\n\\n  if($(\'#page-top\').length > 0) { return true; }\\n  return false;\\n\\n})();\"}','{\"all_users\":\"true\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}');
/*!40000 ALTER TABLE `rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Saha'),(2,'Saha'),(3,'Saha'),(4,'Saha');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2017-03-26 13:23:12
