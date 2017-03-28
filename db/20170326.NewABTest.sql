-- MySQL dump 10.13  Distrib 5.6.25, for osx10.8 (x86_64)
--
-- Host: localhost    Database: NewABTest
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
-- Current Database: `NewABTest`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `NewABTest` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `NewABTest`;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `venture` varchar(100) DEFAULT NULL,
  `owner` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (4,'Eaglehorn','1');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `analytics`
--

DROP TABLE IF EXISTS `analytics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `analytics` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `access_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expire_at` int(11) unsigned DEFAULT NULL,
  `refresh_token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `token_type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `expires_in` int(11) unsigned DEFAULT NULL,
  `created` int(11) unsigned DEFAULT NULL,
  `account` int(11) unsigned DEFAULT NULL,
  `property` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `profile` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `account_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `id_token` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_analytics_campaign` (`campaign_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics`
--

LOCK TABLES `analytics` WRITE;
/*!40000 ALTER TABLE `analytics` DISABLE KEYS */;
/*!40000 ALTER TABLE `analytics` ENABLE KEYS */;
UNLOCK TABLES;

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
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `created_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (96,'Eaglehorn',4,NULL,'a:2:{s:7:\"control\";a:6:{s:2:\"js\";s:36:\"//js control\nconsole.log(\'control\');\";s:3:\"css\";s:5:\"//css\";s:4:\"name\";s:7:\"Control\";s:2:\"id\";s:7:\"control\";s:7:\"traffic\";s:2:\"50\";s:6:\"paused\";s:5:\"false\";}s:11:\"variation-1\";a:6:{s:2:\"js\";s:40:\"//js variation\nconsole.log(\'variation\');\";s:3:\"css\";s:5:\"//css\";s:4:\"name\";s:9:\"Variation\";s:2:\"id\";s:11:\"variation-1\";s:7:\"traffic\";s:2:\"50\";s:6:\"paused\";s:5:\"false\";}}',1,'inactive',100,'2016-11-29',0,'2016-11-29 13:57:02',1);
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goals` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `arrive_action` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `page_path` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `type` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_pp_pattern` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_pp` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `e_label` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `e_action` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `e_category` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `segment_sequence` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `segment_sequence_filter` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `segment_condition` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `segment_condition_filter` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `action_arrive_pp_pattern` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goals`
--

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
/*!40000 ALTER TABLE `goals` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log`
--

DROP TABLE IF EXISTS `log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `log` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `code` varchar(191) DEFAULT NULL,
  `value` tinyint(1) unsigned DEFAULT NULL,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_log_campaign` (`campaign_id`),
  KEY `index_foreignkey_log_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES (3,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:21:48'),(4,'STATUS_CHANGE',1,63,NULL,'2016-09-21 12:22:12'),(5,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:22:33'),(6,'STATUS_CHANGE',1,63,NULL,'2016-09-21 12:23:13'),(7,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:24:11'),(8,'STATUS_CHANGE',1,63,NULL,'2016-09-21 12:25:22'),(9,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:26:29'),(10,'STATUS_CHANGE',1,63,NULL,'2016-09-21 12:33:38'),(11,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:34:01'),(12,'STATUS_CHANGE',1,63,NULL,'2016-09-21 13:16:48'),(13,'STATUS_CHANGE',0,1,NULL,'2016-09-21 15:45:55'),(14,'STATUS_CHANGE',1,1,NULL,'2016-09-21 15:45:56'),(15,'STATUS_CHANGE',1,67,NULL,'2016-09-21 15:56:14'),(16,'STATUS_CHANGE',0,67,NULL,'2016-09-21 19:59:48'),(17,'STATUS_CHANGE',1,67,NULL,'2016-09-22 09:27:03'),(18,'STATUS_CHANGE',0,67,NULL,'2016-09-22 09:27:04'),(19,'STATUS_CHANGE',0,71,NULL,'2016-10-07 23:41:58'),(20,'STATUS_CHANGE',0,63,NULL,'2016-10-09 23:49:40'),(21,'STATUS_CHANGE',1,63,NULL,'2016-10-10 12:30:55'),(22,'STATUS_CHANGE',0,63,NULL,'2016-10-10 13:03:00'),(23,'STATUS_CHANGE',1,63,NULL,'2016-10-10 13:05:34'),(24,'STATUS_CHANGE',0,63,NULL,'2016-10-10 13:12:04'),(25,'STATUS_CHANGE',1,63,NULL,'2016-10-18 15:10:15'),(26,'STATUS_CHANGE',0,63,NULL,'2016-10-18 15:10:19'),(27,'STATUS_CHANGE',0,68,NULL,'2016-10-24 13:17:41'),(28,'STATUS_CHANGE',1,68,NULL,'2016-10-24 13:18:02'),(29,'STATUS_CHANGE',1,68,NULL,'2016-10-24 13:40:54'),(30,'STATUS_CHANGE',0,68,NULL,'2016-10-24 13:41:06'),(31,'STATUS_CHANGE',1,96,NULL,'2016-11-29 13:02:11');
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rules`
--

LOCK TABLES `rules` WRITE;
/*!40000 ALTER TABLE `rules` DISABLE KEYS */;
INSERT INTO `rules` VALUES (14,96,'{\"url\":[],\"url_contains\":[],\"url_excludes\":[]}','{\"allow_desktop\":\"true\",\"allow_mobile\":\"true\",\"allow_tablet\":\"true\"}','{\"IE\":\"true\",\"Chrome\":\"false\",\"Safari\":\"false\",\"Firefox\":\"false\",\"Opera\":\"false\"}',NULL,'{\"exclude_cookie\":[\"ddd\"],\"include_cookie\":[\"dd\"]}','{\"js\":\"ff\"}','{\"all_users\":\"true\",\"new_users\":\"true\",\"returning_users\":\"true\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}');
/*!40000 ALTER TABLE `rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user_relation`
--

DROP TABLE IF EXISTS `user_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user_relation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `account_id` int(11) DEFAULT NULL,
  `role` varchar(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user_relation`
--

LOCK TABLES `user_relation` WRITE;
/*!40000 ALTER TABLE `user_relation` DISABLE KEYS */;
INSERT INTO `user_relation` VALUES (1,1,4,'READ_WRITE'),(2,2,9,'READ_WRITE');
/*!40000 ALTER TABLE `user_relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@abtest.com','ed6cc5544cf347265bc3cba09a131be3','Admin');
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

-- Dump completed on 2017-03-26 13:23:10
