-- MySQL dump 10.13  Distrib 5.6.25, for osx10.8 (x86_64)
--
-- Host: localhost    Database: zonechat
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
-- Current Database: `zonechat`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `zonechat` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */;

USE `zonechat`;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `message_id` varchar(11) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `to` int(11) DEFAULT NULL,
  `from` int(11) DEFAULT NULL,
  `message` longtext COLLATE utf8mb4_unicode_ci,
  `created_on` timestamp NULL DEFAULT NULL,
  `status` enum('read','delivered','sent') CHARACTER SET latin1 DEFAULT 'sent',
  `msgType` enum('text','image','link') COLLATE utf8mb4_unicode_ci DEFAULT 'text',
  PRIMARY KEY (`id`),
  KEY `to` (`to`,`from`),
  KEY `from` (`from`,`to`)
) ENGINE=InnoDB AUTO_INCREMENT=693 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,NULL,1,2,'session_variable','2016-10-27 14:49:51','read','text'),(2,NULL,2,1,'browser_update','2016-10-27 14:49:51','read','text'),(22,NULL,1,2,'local_storage','2016-10-31 10:03:46','read','text'),(47,NULL,1,2,'temp_cookie','2016-10-31 16:08:51','read','text'),(61,NULL,1,2,'Yo Redsnow!','2016-10-31 22:02:38','read','text'),(63,NULL,2,1,'Not now. Reply from Redsnow','2016-10-31 22:07:27','read','text'),(115,NULL,3,1,'Testing incoming..','2016-11-02 21:02:08','read','text'),(116,NULL,1,3,'Received. Pass 1. Transmit new.','2016-11-02 21:02:31','read','text'),(117,NULL,3,1,'Transmitting from API.. Check and Ping back','2016-11-02 21:03:00','read','text'),(118,NULL,1,3,'Received from API.. Cool shit :)','2016-11-02 21:11:31','read','text'),(119,NULL,3,1,'Browser refresh and continue. Socket relay.','2016-11-02 21:12:04','read','text'),(120,NULL,1,3,'Beautiful sleepers','2016-11-02 21:14:00','read','text'),(169,NULL,2,1,'I am the dreamer. Kill time.','2016-11-06 14:04:35','read','text'),(170,NULL,2,1,'Photosynthesis.. Come alive','2016-11-06 14:05:54','read','text'),(171,NULL,2,1,'How about some Dota tonight ?','2016-11-06 14:06:01','read','text'),(172,NULL,2,1,'Lets fuck Nevermore! Tonight @ 9','2016-11-06 14:06:07','read','text'),(173,NULL,2,1,'Add security layer. Hell lot of them','2016-11-06 14:28:34','read','text'),(174,NULL,2,1,'I am gonna take pudge and gank the fuck out.','2016-11-08 01:30:23','read','text'),(175,NULL,3,1,'Gank baby gank!','2016-11-08 23:56:17','sent','text'),(176,NULL,3,1,'Come mid. We gotta take this sniper. Lets do some Rampage','2016-11-08 23:57:12','sent','text'),(177,NULL,1,2,'Nodejs dream code and React is such a heavy drug','2016-11-09 00:02:48','read','text'),(178,NULL,3,1,'Test.. Ping back','2016-11-09 00:02:54','sent','text'),(329,NULL,1,2,'this is cool','2016-11-15 12:34:43','read','text'),(346,NULL,1,2,'Lets play a game','2016-11-16 16:14:43','read','text'),(450,NULL,2,1,'hello','2016-11-18 13:48:32','read','text'),(451,NULL,2,1,'https://media1.giphy.com/media/oPyzztuHVnRvO/200_d.gif','2016-11-18 13:48:41','read','image'),(452,NULL,2,1,'http://media3.giphy.com/media/8pqAaTAgqjQM8/200_d.gif','2016-11-18 13:48:50','read','image'),(453,NULL,2,1,'http://media1.giphy.com/media/7N5VFbR0i25JS/200_d.gif','2016-11-18 13:48:58','read','image'),(454,NULL,2,1,'http://media3.giphy.com/media/mMDwu4zpmmPEQ/200_d.gif','2016-11-18 13:49:05','read','image'),(455,NULL,2,1,'http://media0.giphy.com/media/Kw8qFSesQfEU8/200_d.gif','2016-11-18 13:49:18','read','image'),(456,NULL,2,1,'http://media4.giphy.com/media/ppFKTGfSETHDq/200_d.gif','2016-11-18 15:43:45','read','image'),(457,NULL,2,1,'http://media4.giphy.com/media/l3vQYCrVvWIAH6dEs/200_d.gif','2016-11-18 15:43:45','read','image'),(458,NULL,2,1,'http://media0.giphy.com/media/xT5LMNWIOq8E1JJ3b2/200_d.gif','2016-11-18 15:43:59','read','image'),(459,NULL,2,1,'hi','2016-11-18 16:03:14','read','text'),(460,NULL,2,1,'lll','2016-11-18 16:03:54','read','text'),(461,'2000',2,1,'yo','2016-11-18 16:07:15','read','text'),(462,'2280',2,1,'hi','2016-11-18 16:14:55','read','text'),(463,'1831',2,1,'hi','2016-11-18 21:18:11','read','text'),(464,'1808',2,1,'hello','2016-11-18 21:19:29','read','text'),(465,'1785',2,1,'jjj','2016-11-18 21:20:30','read','text'),(466,'1785',2,1,'dddd','2016-11-18 21:21:11','read','text'),(467,'1666',2,1,'hello','2016-11-21 14:35:10','read','text'),(468,'1506',2,1,'yo','2016-11-21 14:42:09','read','text'),(469,'1681',2,1,'http://media0.giphy.com/media/mbeDfJTpypAoE/200_d.gif','2016-11-21 14:43:30','read','image'),(470,'1506',2,1,'https://media2.giphy.com/media/l3E6FhtRRNGvRJ1Je/200_d.gif','2016-11-21 14:44:10','read','image'),(471,NULL,2,1,'awesome','2016-11-21 14:52:00','read','text'),(472,NULL,2,1,'cool','2016-11-21 14:52:10','read','text'),(473,NULL,2,1,'boom','2016-11-21 14:52:49','read','text'),(474,NULL,2,1,'wow','2016-11-21 14:56:09','read','text'),(475,NULL,2,1,'omfg','2016-11-21 14:57:18','read','text'),(476,NULL,2,1,'this is dope','2016-11-21 14:57:35','read','text'),(477,NULL,2,1,'hmmm','2016-11-21 14:59:27','read','text'),(478,NULL,2,1,'wow','2016-11-21 14:59:37','read','text'),(479,NULL,2,1,'this is cool babes','2016-11-21 14:59:52','read','text'),(480,NULL,2,1,'http://media1.giphy.com/media/ASd0Ukj0y3qMM/200_d.gif','2016-11-21 15:02:57','read','image'),(481,NULL,2,1,'that is mean','2016-11-21 15:04:43','read','text'),(482,NULL,2,1,'whats up','2016-11-21 15:05:56','read','text'),(483,NULL,2,1,'whoa','2016-11-21 15:10:40','read','text'),(484,NULL,2,1,'yes','2016-11-21 15:10:46','read','text'),(485,NULL,2,1,'hhh','2016-11-21 15:10:58','read','text'),(486,NULL,2,1,'yaaay','2016-11-21 15:11:34','read','text'),(487,NULL,2,1,'http://media4.giphy.com/media/eZXvN7OH207h6/200_d.gif','2016-11-21 15:11:39','read','image'),(488,NULL,2,1,'awesome','2016-11-21 15:11:45','read','text'),(489,NULL,2,1,'http://media4.giphy.com/media/xT9KVmr0MOOZmGIVm8/200_d.gif','2016-11-22 13:50:08','read','image'),(490,NULL,1,2,'hi','2016-11-23 22:20:01','read','text'),(491,NULL,2,1,'lll','2016-11-23 22:20:21','read','text'),(591,NULL,2,1,'yay','2016-12-07 13:29:07','read','text'),(592,NULL,3,1,'http://media3.giphy.com/media/3oEjHOWlyBm3IE1p7O/200_d.gif','2016-12-15 17:09:35','sent','image'),(593,NULL,3,1,'http://media3.giphy.com/media/l3vRaJJvCo6jq1ggE/200_d.gif','2016-12-15 17:09:54','sent','image'),(594,NULL,2,1,'hi','2017-01-06 12:07:34','read','text'),(595,NULL,2,1,'hi','2017-01-06 12:08:00','read','text'),(596,NULL,2,1,'hello','2017-01-06 12:12:21','read','text'),(597,NULL,2,1,'yo','2017-01-06 12:12:57','read','text'),(598,NULL,2,1,'yo','2017-01-06 12:36:48','read','text'),(599,NULL,2,1,'hi','2017-01-06 12:40:18','read','text'),(600,NULL,2,1,'yo','2017-01-06 12:41:17','read','text'),(601,NULL,2,1,'hello','2017-01-06 12:42:28','read','text'),(602,NULL,2,1,'awesome man','2017-01-06 12:42:52','read','text'),(603,NULL,2,1,'oh fuck','2017-01-06 12:44:52','read','text'),(604,NULL,2,1,'tooo good to believe','2017-01-06 12:45:05','read','text'),(605,NULL,2,1,'d','2017-01-06 12:45:13','read','text'),(606,NULL,2,1,'d','2017-01-06 12:45:16','read','text'),(607,NULL,2,1,'http://media1.giphy.com/media/l0HlUwKzvfSgzm91u/200_d.gif','2017-01-06 13:11:47','read','image'),(608,NULL,2,1,'whats up','2017-01-06 14:14:39','read','text'),(609,NULL,2,1,'hello','2017-01-06 14:46:02','read','text'),(610,NULL,2,1,'hello','2017-01-07 21:57:46','read','text'),(611,NULL,2,1,'yo','2017-01-07 21:58:56','read','text'),(612,NULL,2,1,'hello','2017-01-07 21:59:33','read','text'),(613,NULL,2,1,'ok','2017-01-07 21:59:52','read','text'),(614,NULL,1,2,'hmm','2017-01-07 22:00:03','read','text'),(615,NULL,2,1,'hi','2017-01-07 22:01:13','read','text'),(616,NULL,2,1,'yo','2017-01-07 22:11:07','read','text'),(617,NULL,2,1,'test','2017-01-07 22:12:57','read','text'),(618,NULL,2,1,'www','2017-01-07 22:14:35','read','text'),(619,NULL,1,2,'yo','2017-01-07 22:16:58','read','text'),(620,NULL,2,1,'hey','2017-01-07 22:20:01','read','text'),(621,NULL,2,1,'hi','2017-01-07 22:24:00','read','text'),(622,NULL,2,1,'kk','2017-01-07 22:29:23','read','text'),(623,NULL,2,1,'yoooo','2017-01-07 22:35:04','read','text'),(624,NULL,1,2,'yo','2017-01-09 11:58:57','read','text'),(625,NULL,1,2,'hi','2017-01-09 12:00:21','read','text'),(626,NULL,1,2,'yo','2017-01-09 12:00:57','read','text'),(627,NULL,1,2,'sss','2017-01-09 12:01:28','read','text'),(628,NULL,1,2,'sss','2017-01-09 12:02:04','read','text'),(629,NULL,1,2,'yo','2017-01-09 12:05:25','read','text'),(630,NULL,1,2,'rrrr','2017-01-09 12:05:36','read','text'),(631,NULL,1,2,'eee','2017-01-09 12:05:44','read','text'),(632,NULL,2,1,'ssswww','2017-01-09 12:06:13','read','text'),(633,NULL,2,1,'sqqqqq','2017-01-09 12:06:40','read','text'),(634,NULL,1,2,'ddd','2017-01-09 12:09:19','read','text'),(635,NULL,1,2,'ddd','2017-01-09 12:09:41','read','text'),(636,NULL,1,2,'sgsgsgsgd','2017-01-09 12:21:21','read','text'),(637,NULL,1,2,'a','2017-01-09 13:04:31','read','text'),(638,NULL,2,1,'sd','2017-01-09 13:21:56','read','text'),(639,NULL,2,1,'rr','2017-01-09 13:34:28','read','text'),(640,NULL,2,1,'ccc','2017-01-09 13:35:17','read','text'),(641,NULL,2,1,'d','2017-01-09 13:36:35','read','text'),(642,NULL,2,1,'s','2017-01-09 13:39:35','read','text'),(643,NULL,2,1,'fff','2017-01-09 13:40:53','read','text'),(644,NULL,2,1,'ccsffc','2017-01-09 13:52:15','read','text'),(645,NULL,2,1,'ff','2017-01-09 13:53:17','read','text'),(646,NULL,2,1,'dd','2017-01-09 14:02:17','read','text'),(647,NULL,2,1,'ss','2017-01-09 14:05:16','read','text'),(648,NULL,2,1,'sssd','2017-01-09 14:11:10','read','text'),(649,NULL,2,1,'ddaa','2017-01-09 14:21:21','read','text'),(650,NULL,2,1,'xx','2017-01-09 14:21:25','read','text'),(651,NULL,2,1,'ddd','2017-01-09 14:21:53','read','text'),(652,NULL,2,1,'ccccc','2017-01-09 14:23:10','read','text'),(653,NULL,2,1,'d','2017-01-09 14:24:18','read','text'),(654,NULL,2,1,'hello','2017-01-09 14:52:37','read','text'),(655,NULL,1,2,'rrr','2017-01-09 15:09:51','read','text'),(656,NULL,1,2,'hi','2017-01-09 15:18:07','read','text'),(657,NULL,1,2,'rr','2017-01-09 15:28:43','read','text'),(658,NULL,1,2,'dd','2017-01-09 15:28:56','read','text'),(659,NULL,1,2,'ff','2017-01-13 12:44:26','read','text'),(660,NULL,1,2,'mm','2017-01-13 12:46:13','read','text'),(661,NULL,1,2,'dd','2017-01-13 12:55:45','read','text'),(662,NULL,1,2,'test','2017-01-13 13:11:22','read','text'),(663,NULL,1,2,'yo','2017-01-13 14:45:49','read','text'),(664,NULL,1,2,'yes','2017-01-13 14:47:38','read','text'),(665,NULL,1,2,'test','2017-01-13 14:55:57','read','text'),(666,NULL,1,2,'yegi','2017-01-13 15:03:04','read','text'),(667,NULL,1,2,'ko','2017-01-13 15:03:56','read','text'),(668,NULL,1,2,'haha','2017-01-13 15:07:01','read','text'),(669,NULL,1,2,'jjj','2017-01-13 15:09:00','read','text'),(670,NULL,1,2,'hello','2017-01-13 15:10:32','read','text'),(671,NULL,1,2,'kkk','2017-01-13 15:13:07','read','text'),(672,NULL,1,2,'hshshs','2017-01-13 15:14:48','read','text'),(673,NULL,1,2,'sss','2017-01-13 15:15:48','read','text'),(674,NULL,1,2,'mmmm','2017-01-13 15:17:28','read','text'),(675,NULL,1,2,'sss','2017-01-13 15:19:44','read','text'),(676,NULL,1,2,'mmm','2017-01-13 15:21:56','read','text'),(677,NULL,1,2,'fff','2017-01-13 15:23:48','read','text'),(678,NULL,1,2,'abcd','2017-01-13 15:24:38','read','text'),(679,NULL,1,2,'yo','2017-01-13 15:33:30','read','text'),(680,NULL,2,1,'mast','2017-01-13 15:33:48','read','text'),(681,NULL,1,2,'jsjs','2017-01-13 15:34:13','read','text'),(682,NULL,1,2,'dd','2017-01-13 15:36:11','read','text'),(683,NULL,2,1,'yaa','2017-01-14 07:38:48','read','text'),(684,NULL,1,2,'a','2017-01-22 10:30:18','read','text'),(685,NULL,1,2,'aa','2017-01-22 10:33:09','read','text'),(686,NULL,2,1,'aa','2017-01-22 10:33:19','sent','text'),(687,NULL,2,1,'http://media1.giphy.com/media/l41YzgvxPKVzXw2uA/200_d.gif','2017-02-06 00:15:56','sent','image'),(688,NULL,2,1,'http://media3.giphy.com/media/9Hj162sRzQRy0/200_d.gif','2017-02-06 00:16:41','sent','image'),(689,NULL,2,1,'http://media4.giphy.com/media/3otPoSyc3ty37iTKsU/200_d.gif','2017-02-06 00:16:49','sent','image'),(690,NULL,2,1,'http://media3.giphy.com/media/5sOZ87tkS3yow/200_d.gif','2017-02-06 00:16:56','sent','image'),(691,NULL,2,1,'hi','2017-02-06 01:12:44','sent','text'),(692,NULL,NULL,0,'hi','2017-02-06 01:14:16','sent','text');
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notifications` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notifications`
--

LOCK TABLES `notifications` WRITE;
/*!40000 ALTER TABLE `notifications` DISABLE KEYS */;
/*!40000 ALTER TABLE `notifications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `options` (
  `option_id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `notification` tinyint(1) DEFAULT '1',
  `theme` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT 'dark',
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`option_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
INSERT INTO `options` VALUES (1,1,'dark',1),(2,1,'dark',2);
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `expires` int(11) unsigned NOT NULL,
  `data` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('3SEHz007Sao33kvPsU4Z3MSORpwwyXSm',1516828185,'{\"cookie\":{\"originalMaxAge\":31535999902,\"expires\":\"2018-01-24T21:09:45.084Z\",\"httpOnly\":true,\"path\":\"/\"},\"user_id\":2,\"email\":\"yuki@gmail.com\",\"logged_in\":true,\"name\":\"Sacred Warrior\"}'),('9dxcNb94s2ScoJxD4OOVy8cz0-5817n1',1517899355,'{\"cookie\":{\"originalMaxAge\":31535999896,\"expires\":\"2018-02-06T06:42:35.332Z\",\"httpOnly\":true,\"path\":\"/\"},\"user_id\":1,\"email\":\"abhisheksaha11@gmail.com\",\"name\":\"Redsnow\",\"logged_in\":true}'),('F2bPJTyxbclczBBJXPM1FTPOG_2ygVrw',1512508965,'{\"cookie\":{\"originalMaxAge\":31536000000,\"expires\":\"2017-12-05T21:22:44.578Z\",\"httpOnly\":true,\"path\":\"/\"},\"user_id\":2,\"email\":\"yuki@gmail.com\",\"logged_in\":true,\"name\":\"Sacred Warrior\"}'),('Md9P7tuQvLux81GJfNruVkhLKmP3NVfS',1515511454,'{\"cookie\":{\"originalMaxAge\":31535999996,\"expires\":\"2018-01-09T15:24:13.859Z\",\"httpOnly\":true,\"path\":\"/\"},\"user_id\":2,\"email\":\"yuki@gmail.com\",\"logged_in\":true,\"name\":\"Sacred Warrior\"}'),('TYHVPiTPjSegeFnidgTwZbtEHS3cesDD',1515511454,'{\"cookie\":{\"originalMaxAge\":31535999997,\"expires\":\"2018-01-09T15:24:14.050Z\",\"httpOnly\":true,\"path\":\"/\"},\"user_id\":1,\"email\":\"abhisheksaha11@gmail.com\",\"logged_in\":true,\"name\":\"Redsnow\"}'),('f3ERLEz5y2_E0S-aVQsD9pMKC7z9nwYd',1512249889,'{\"cookie\":{\"originalMaxAge\":31536000000,\"expires\":\"2017-12-02T21:24:49.323Z\",\"httpOnly\":true,\"path\":\"/\"},\"user_id\":2,\"email\":\"yuki@gmail.com\",\"logged_in\":true,\"name\":\"Sacred Warrior\"}'),('hOi4fHPZ9PtVAqboIxrJM25Vs8wU0OoF',1512250476,'{\"cookie\":{\"originalMaxAge\":31535999998,\"expires\":\"2017-12-02T21:34:36.450Z\",\"httpOnly\":true,\"path\":\"/\"},\"user_id\":2,\"email\":\"yuki@gmail.com\",\"logged_in\":true,\"name\":\"Sacred Warrior\"}'),('zl6bJshPwucUvsUIm0TJIO7hdmLQBgvq',1516862535,'{\"cookie\":{\"originalMaxAge\":31535999918,\"expires\":\"2018-01-25T06:42:15.105Z\",\"httpOnly\":true,\"path\":\"/\"},\"user_id\":2,\"email\":\"yuki@gmail.com\",\"logged_in\":true,\"name\":\"Sacred Warrior\"}');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `settings` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `template`
--

DROP TABLE IF EXISTS `template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `template` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `template`
--

LOCK TABLES `template` WRITE;
/*!40000 ALTER TABLE `template` DISABLE KEYS */;
/*!40000 ALTER TABLE `template` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tokens`
--

DROP TABLE IF EXISTS `tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tokens` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `authSecret` varchar(100) DEFAULT NULL,
  `endpoint` varchar(300) DEFAULT NULL,
  `publicKey` varchar(100) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `flag` int(11) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tokens`
--

LOCK TABLES `tokens` WRITE;
/*!40000 ALTER TABLE `tokens` DISABLE KEYS */;
INSERT INTO `tokens` VALUES (8,'5eenBMuEBZg1vT/I1BLB2Q==','https://android.googleapis.com/gcm/send/dDewFKn9vbg:APA91bG6HvCH2VneMlbRJQNzCh0HWTes8vfcpauXKgkWsjiRdTU0grc-LoK847Y3iMayYi1jXIrQDusWaozaBPEZsd8tqlCm7UZKJCZBSzE0AWZZZAAYanHl8FArS6zPco3eHdRBNX961','BCJMIB1+6mpXnE6UY18GZSQIBa9wUzcSCbq8fux/P5kTfUvVd2YVeK5bWzCqGh7Yav+HuSTP6+UtIoXEowv2qHk=',1,0),(11,'5eenBMuEBZg1vT/I1BLB2Q==','https://android.googleapis.com/gcm/send/dDewFKn9vbg:APA91bG6HvCH2VneMlbRJQNzCh0HWTes8vfcpauXKgkWsjiRdTU0grc-LoK847Y3iMayYi1jXIrQDusWaozaBPEZsd8tqlCm7UZKJCZBSzE0AWZZZAAYanHl8FArS6zPco3eHdRBNX96','BCJMIB1+6mpXnE6UY18GZSQIBa9wUzcSCbq8fux/P5kTfUvVd2YVeK5bWzCqGh7Yav+HuSTP6+UtIoXEowv2qHk=',2,0),(12,'5eenBMuEBZg1vT/I1BLB2Q==','https://android.googleapis.com/gcm/send/dDewFKn9vbg:APA91bG6HvCH2VneMlbRJQNzCh0HWTes8vfcpauXKgkWsjiRdTU0grc-LoK847Y3iMayYi1jXIrQDusWaozaBPEZsd8tqlCm7UZKJCZBSzE0AWZZZAAYanHl8FArS6zPco3eHdRBNX961','BCJMIB1+6mpXnE6UY18GZSQIBa9wUzcSCbq8fux/P5kTfUvVd2YVeK5bWzCqGh7Yav+HuSTP6+UtIoXEowv2qHk=',2,0);
/*!40000 ALTER TABLE `tokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `userfriendrelation`
--

DROP TABLE IF EXISTS `userfriendrelation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `userfriendrelation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `friend_id` int(11) DEFAULT NULL,
  `accepted` int(11) DEFAULT '0',
  `created` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `userfriendrelation`
--

LOCK TABLES `userfriendrelation` WRITE;
/*!40000 ALTER TABLE `userfriendrelation` DISABLE KEYS */;
INSERT INTO `userfriendrelation` VALUES (1,1,2,1,'2016-10-27 16:49:31'),(2,3,1,1,'2016-10-31 10:24:09'),(3,2,3,1,'2016-11-03 02:32:32');
/*!40000 ALTER TABLE `userfriendrelation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `avatar` varchar(100) DEFAULT NULL,
  `lastActiveChat` int(11) DEFAULT '0',
  `pattern` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Redsnow','abhisheksaha11@gmail.com','$2a$06$aQvK0iL4XtfPNCbIWvmpDeNqRb/CEbti5aBAwtTEuX1bkr5E9VfXe','/public/images/user/user_3.jpg',2,7415369),(2,'Sacred Warrior','yuki@gmail.com','$2a$06$aQvK0iL4XtfPNCbIWvmpDeNqRb/CEbti5aBAwtTEuX1bkr5E9VfXe','/public/images/user/user_2.jpg',2,7415369),(3,'Pudge','aakash@gmail.com','$2a$06$aQvK0iL4XtfPNCbIWvmpDeNqRb/CEbti5aBAwtTEuX1bkr5E9VfXe','/public/images/user/user_1.jpg',1,7415369);
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

-- Dump completed on 2017-03-26 13:23:13
