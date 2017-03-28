-- MySQL dump 10.13  Distrib 5.6.25, for osx10.8 (x86_64)
--
-- Host: localhost    Database: NewPushTest
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
-- Current Database: `NewPushTest`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `NewPushTest` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `NewPushTest`;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `owner` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
INSERT INTO `accounts` VALUES (1,'Abhi','abhishek.saha@rocket-internet.de');
/*!40000 ALTER TABLE `accounts` ENABLE KEYS */;
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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (63,'HomePage Test',1,'/','a:2:{s:7:\"control\";a:5:{s:2:\"js\";s:123:\"{\n    title: \"Hello\",\n    body: \"The matrix is the world that has been pulled over your eyes to blind you from the truth\"\n}\";s:4:\"name\";s:7:\"Control\";s:2:\"id\";s:7:\"control\";s:7:\"traffic\";s:5:\"40.00\";s:6:\"paused\";s:5:\"false\";}s:11:\"variation-1\";a:5:{s:2:\"js\";s:123:\"{\n    title: \"Hello\",\n    body: \"The matrix is the world that has been pulled over your eyes to blind you from the truth\"\n}\";s:4:\"name\";s:10:\"Variation1\";s:2:\"id\";s:11:\"variation-1\";s:7:\"traffic\";s:5:\"60.00\";s:6:\"paused\";s:5:\"false\";}}',1,'active',80,'2016-09-01',0);
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES (3,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:21:48'),(4,'STATUS_CHANGE',1,63,NULL,'2016-09-21 12:22:12'),(5,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:22:33'),(6,'STATUS_CHANGE',1,63,NULL,'2016-09-21 12:23:13'),(7,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:24:11'),(8,'STATUS_CHANGE',1,63,NULL,'2016-09-21 12:25:22'),(9,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:26:29'),(10,'STATUS_CHANGE',1,63,NULL,'2016-09-21 12:33:38'),(11,'STATUS_CHANGE',0,63,NULL,'2016-09-21 12:34:01'),(12,'STATUS_CHANGE',1,63,NULL,'2016-09-21 13:16:48'),(13,'STATUS_CHANGE',0,1,NULL,'2016-09-21 15:45:55'),(14,'STATUS_CHANGE',1,1,NULL,'2016-09-21 15:45:56'),(15,'STATUS_CHANGE',1,67,NULL,'2016-09-21 15:56:14'),(16,'STATUS_CHANGE',0,67,NULL,'2016-09-21 19:59:48'),(17,'STATUS_CHANGE',1,67,NULL,'2016-09-22 09:27:03'),(18,'STATUS_CHANGE',0,67,NULL,'2016-09-22 09:27:04');
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
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rules`
--

LOCK TABLES `rules` WRITE;
/*!40000 ALTER TABLE `rules` DISABLE KEYS */;
INSERT INTO `rules` VALUES (1,63,'{\"url\":[\"http:\\/\\/dev.ehdoc\\/\",\"http:\\/\\/localhost:8080\\/\"],\"url_contains\":[\"campaign\"],\"url_excludes\":[\"fb\"]}','{\"allow_desktop\":\"false\",\"allow_mobile\":\"true\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"true\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}','{\"exclude_cookie\":[],\"include_cookie\":[]}','{\"js\":\"(function() {\\n\\n  if($(\'#page-top\').length > 0) { return true; }\\n  return false;\\n\\n})();\"}','{\"all_users\":\"true\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(2,64,NULL,'{\"allow_desktop\":\"false\",\"allow_mobile\":\"false\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"false\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}',NULL,'{\"js\":\"\"}','{\"all_users\":\"false\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(3,65,NULL,'{\"allow_desktop\":\"false\",\"allow_mobile\":\"false\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"false\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}',NULL,'{\"js\":\"\"}','{\"all_users\":\"false\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(4,66,NULL,'{\"allow_desktop\":\"false\",\"allow_mobile\":\"false\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"false\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}',NULL,'{\"js\":\"\"}','{\"all_users\":\"false\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(5,67,NULL,'{\"allow_desktop\":\"false\",\"allow_mobile\":\"false\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"false\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}',NULL,'{\"js\":\"\"}','{\"all_users\":\"false\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}'),(7,71,'{\"url\":[\"http:\\/\\/dev.ehdoc\\/\"],\"url_contains\":[\"campaign\"],\"url_excludes\":[\"fb\"]}','{\"allow_desktop\":\"true\",\"allow_mobile\":\"true\"}','{\"IE\":\"true\",\"Chrome\":\"true\",\"Safari\":\"true\",\"Firefox\":\"true\",\"Opera\":\"true\"}','{\"all_countries\":\"true\",\"allowed_countries\":\"false\",\"exclude_countries\":\"false\"}','{\"exclude_cookie\":[],\"include_cookie\":[]}','{\"js\":\"(function() {\\n\\n  if($(\'#page-top\').length > 0) { return true; }\\n  return false;\\n\\n})();\"}','{\"all_users\":\"true\",\"new_users\":\"false\",\"returning_users\":\"false\"}','{\"include_ips\":[],\"exclude_ips\":[]}','{\"allowed_languages\":[],\"exclude_languages\":[]}');
/*!40000 ALTER TABLE `rules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokens` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` varchar(11) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `key` varchar(191) DEFAULT NULL,
  `auth_secret` varchar(191) DEFAULT NULL,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `landing_page` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_tokens_campaign` (`campaign_id`),
  KEY `index_foreignkey_tokens_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (2,'123456','https://android.googleapis.com/gcm/send/dbzT-aMocfQ:APA91bHM2T3_9bHGte-NS3N-AYsYW79RUZYsf9EPDAtdXmBjV4pT2T3BrFSBqw6pVchpcXsXwELSJRpvD5rd3lspTSBi1VlRiKkoe1CxxjwYkDbKkFGtyFnpH7hONl_k1l-CqIHZdJ5W','BCkBAsK10TVfPJDvzGt7hha8vEnO2YlLkktb40HsQZpVfVoceItImrJrafO0qpaQIAfHZFZNblIh8dK8A8Ko01s=','FGJEJXp2bPTOioRJ49INng==',63,NULL,NULL),(3,'12345','https://android.googleapis.com/gcm/send/dbzT-aMocfQ:APA91bHM2T3_9bHGte-NS3N-AYsYW79RUZYsf9EPDAtdXmBjV4pT2T3BrFSBqw6pVchpcXsXwELSJRpvD5rd3lspTSBi1VlRiKkoe1CxxjwYkDbKkFGtyFnpH7hONl_k1l-CqIHZdJ5W','BCkBAsK10TVfPJDvzGt7hha8vEnO2YlLkktb40HsQZpVfVoceItImrJrafO0qpaQIAfHZFZNblIh8dK8A8Ko01s=','FGJEJXp2bPTOioRJ49INng==',63,2,NULL),(4,'1234','https://android.googleapis.com/gcm/send/fKcYyUjCH00:APA91bHurk6v_3HOA1hAA9JwYLd4etDOdVPnxH4SHR40v-zcrybR7A_tn0bKy9P_0DdOl4jJj7y_mUx4F04wDxnyic9HrNnRjnAiqqD_2lOpInJWZgN3wo8AagOtq7oJbBFdbzzIi-_g','BCXf3pIDOWNVkx/nnC15bKHAk6UOSu9aXegYVDYKPfKvrlUrKh1zGCILNWe6BoRl8mZgJFbxF8hlg/Lq/ih2kog=','EmWJsrnlXDx iC9Y ZiCDw==',63,3,'http://localhost:8080/');
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `client_id` varchar(20) DEFAULT NULL,
  `ui_optin` int(1) DEFAULT '0',
  `system_optin` int(1) DEFAULT '0',
  `created_on` datetime DEFAULT CURRENT_TIMESTAMP,
  `updated_on` datetime DEFAULT NULL,
  `push_sent` int(1) DEFAULT '0',
  `push_clicked` int(1) DEFAULT '0',
  `campaign_id` int(11) DEFAULT NULL,
  `landing_page` varchar(191) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'123456',0,0,'2016-09-29 15:52:23','2016-09-29 15:52:23',0,0,63,NULL),(2,'12345',0,0,'2016-09-29 15:54:38','2016-09-29 15:54:38',0,0,63,NULL),(3,'1234',0,1,'2016-09-29 16:00:32','2016-10-05 09:44:25',0,0,63,'http://localhost:8080/');
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
