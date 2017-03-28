-- MySQL dump 10.13  Distrib 5.6.25, for osx10.8 (x86_64)
--
-- Host: localhost    Database: youtube_chrome
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
-- Current Database: `youtube_chrome`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `youtube_chrome` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `youtube_chrome`;

--
-- Table structure for table `favourites`
--

DROP TABLE IF EXISTS `favourites`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `favourites` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `item_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_favourites_item` (`item_id`),
  KEY `index_foreignkey_favourites_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favourites`
--

LOCK TABLES `favourites` WRITE;
/*!40000 ALTER TABLE `favourites` DISABLE KEYS */;
INSERT INTO `favourites` VALUES (19,85,21,'2016-02-26 11:39:21'),(21,86,21,'2016-02-26 11:43:28'),(22,76,1,'2016-02-26 11:43:53'),(23,86,1,'2016-02-26 11:56:00'),(24,93,24,'2016-02-26 14:29:39'),(25,77,1,'2016-02-26 15:47:35'),(26,96,24,'2016-02-27 03:54:28'),(28,104,1,'2016-02-27 17:44:16'),(29,106,24,'2016-02-27 18:51:07');
/*!40000 ALTER TABLE `favourites` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `groups`
--

DROP TABLE IF EXISTS `groups`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `groups` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin` int(11) unsigned DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `group_rights` enum('can_read','can_post') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_public` enum('1','0') COLLATE utf8mb4_unicode_ci DEFAULT '1',
  `password` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `desc` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `groups`
--

LOCK TABLES `groups` WRITE;
/*!40000 ALTER TABLE `groups` DISABLE KEYS */;
INSERT INTO `groups` VALUES (1,'Global',1,'2016-02-22 17:43:44','can_post','1',NULL,NULL),(4,'PsyShare',1,'2016-02-22 17:43:44','can_post','1',NULL,NULL),(5,'Goa',8,'2016-02-23 21:23:41','can_post','1',NULL,NULL),(9,'Rocket',1,'2016-02-24 15:35:39','can_post','1',NULL,NULL),(10,'TestGroup',1,'2016-02-26 12:18:19','can_post','1',NULL,NULL),(11,'lol',23,'2016-02-26 14:05:19','can_post','1',NULL,NULL),(12,'S@h@',1,'2016-02-26 14:09:24','can_post','1',NULL,NULL),(13,'GREMS',1,'2016-02-27 08:22:46','can_post','1',NULL,NULL),(21,'Public_can_read',1,'2016-02-28 19:51:13','can_read','1',NULL,NULL);
/*!40000 ALTER TABLE `groups` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tracks`
--

DROP TABLE IF EXISTS `tracks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tracks` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `group_id` int(11) unsigned DEFAULT NULL,
  `thumbnail` text COLLATE utf8mb4_unicode_ci,
  `deleted` int(11) DEFAULT '0',
  `comments` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime DEFAULT NULL,
  `times_clicked` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_tracks_user` (`user_id`),
  KEY `index_foreignkey_tracks_group` (`group_id`)
) ENGINE=InnoDB AUTO_INCREMENT=109 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tracks`
--

LOCK TABLES `tracks` WRITE;
/*!40000 ALTER TABLE `tracks` DISABLE KEYS */;
INSERT INTO `tracks` VALUES (22,'https://www.youtube.com/watch?v=WdYjTfwiqcs','Neo Goa Mix - YouTube',1,1,'https://i.ytimg.com/vi/WdYjTfwiqcs/maxresdefault.jpg',0,NULL,'2016-02-23 13:13:08',0),(23,'https://www.youtube.com/watch?v=QHopBWYm9rM','Goa Spirit - Psychedelic Goa Trance (part 4) - YouTube',1,1,'https://i.ytimg.com/vi/QHopBWYm9rM/maxresdefault.jpg',0,NULL,'2016-02-23 13:13:29',0),(24,'https://www.youtube.com/watch?v=9MY8-lTBgOA','Psychedelic Trance Mix - 2015 [ PSYBERATION ] - YouTube',1,1,'https://i.ytimg.com/vi/9MY8-lTBgOA/maxresdefault.jpg',0,NULL,'2016-02-23 13:13:41',0),(25,'https://www.youtube.com/watch?v=9MY8-lTBgOA','Psychedelic Trance Mix - 2015 [ PSYBERATION ] - YouTube',1,4,'https://i.ytimg.com/vi/9MY8-lTBgOA/maxresdefault.jpg',0,NULL,'2016-02-23 13:45:47',0),(29,'https://www.youtube.com/watch?v=-tGkOp2WfU4','INSOMNIA - Progressive Uplifting Psytrance Mix 2015 - YouTube',1,4,'https://i.ytimg.com/vi/-tGkOp2WfU4/maxresdefault.jpg',0,NULL,'2016-02-23 20:54:47',0),(73,'https://www.youtube.com/watch?v=ThheURpb8-4','Merry Go Round Life (Howl\'s Moving Castle Theme) - Joe Hisaishi - YouTube',20,9,'https://i.ytimg.com/vi/ThheURpb8-4/hqdefault.jpg',0,'','2016-02-24 14:32:07',0),(74,'https://www.youtube.com/watch?v=Y2y3lf7hjLk','SHIVANJUNA - Progressive Psytrance Mix 2015 - YouTube',1,9,'https://i.ytimg.com/vi/Y2y3lf7hjLk/maxresdefault.jpg',0,'','2016-02-24 14:32:48',0),(75,'https://www.youtube.com/watch?v=j1mYWYV9nAM','Kanye West en live, Saturday Night Live du 13/02 - YouTube',20,9,'https://i.ytimg.com/vi/j1mYWYV9nAM/maxresdefault.jpg',0,'HALLELUJAH','2016-02-24 14:39:57',0),(76,'https://www.youtube.com/watch?v=Y2y3lf7hjLk','SHIVANJUNA - Progressive Psytrance Mix 2015 - YouTube',1,5,'https://i.ytimg.com/vi/Y2y3lf7hjLk/maxresdefault.jpg',0,'','2016-02-24 17:40:25',0),(77,'https://www.youtube.com/watch?v=3RhxGewa6C8','EUPHORIA - Progressive Psytrance Mix 2015 - YouTube',1,9,'https://i.ytimg.com/vi/3RhxGewa6C8/maxresdefault.jpg',0,'','2016-02-24 19:51:19',0),(78,'https://www.youtube.com/watch?v=YMRqF1UMPhs','Dream Frequency (Progressive Psytrance Mix) - YouTube',1,9,'https://i.ytimg.com/vi/YMRqF1UMPhs/maxresdefault.jpg',0,'','2016-02-24 19:55:38',0),(79,'https://www.youtube.com/watch?v=HBjDZMJUduo','Laserkraft 3D - Nein Mann (official Video) - YouTube',17,9,'https://i.ytimg.com/vi/HBjDZMJUduo/maxresdefault.jpg',0,'','2016-02-25 10:04:18',0),(81,'https://www.reddit.com/','reddit: the front page of the internet',1,5,'',0,'','2016-02-25 21:05:25',0),(85,'https://www.youtube.com/watch?v=mFnqEo9367s','Bondax - Gold (Snakehips Bootleg) - YouTube',21,9,'https://i.ytimg.com/vi/mFnqEo9367s/maxresdefault.jpg',0,'','2016-02-26 11:33:45',0),(86,'https://www.youtube.com/watch?v=1TO48Cnl66w','Dido - Thank You - YouTube',1,9,'https://i.ytimg.com/vi/1TO48Cnl66w/maxresdefault.jpg',0,'Thank you all !','2016-02-26 11:35:25',0),(87,'http://techcrunch.com/2016/02/10/acre-designs-wants-to-change-the-way-we-buy-and-build-houses/','Acre Designs Wants To Change The Way We Buy And Build Houses  |  TechCrunch',1,9,'https://tctechcrunch2011.files.wordpress.com/2016/02/origin-seriesa_exterior1-1.jpg?w=764',0,'','2016-02-26 12:16:12',0),(88,'https://www.youtube.com/watch?v=yNHyTk2jYNA','PEOPLE ARE AWESOME! 2015 (IMPOSSIBLE) - YouTube',1,1,'https://i.ytimg.com/vi/yNHyTk2jYNA/hqdefault.jpg',1,'','2016-02-26 12:55:29',0),(89,'https://www.youtube.com/watch?v=COwidtYzmJo','PEOPLE ARE AWESOME 2015 NEW!! - YouTube',1,1,'https://i.ytimg.com/vi/COwidtYzmJo/hqdefault.jpg',1,'If I had one of these quality, I would have shot my solo video.','2016-02-26 12:57:38',0),(90,'https://www.youtube.com/watch?v=eXqPYte8tvc','Ewan Dobson - Time 2 - Guitar - www.candyrat.com - YouTube',1,9,'https://i.ytimg.com/vi/eXqPYte8tvc/maxresdefault.jpg',0,'','2016-02-26 13:42:16',0),(91,'https://www.youtube.com/watch?v=7gphiFVVtUI','Estas Tonne - The Song of the Golden Dragon - YouTube',1,12,'https://i.ytimg.com/vi/7gphiFVVtUI/maxresdefault.jpg',0,'Testing','2016-02-26 14:15:26',0),(92,'https://angel.co/','AngelList - Where the world meets startups',24,12,'https://angel.co/images/shared/peace_large.jpg',0,'','2016-02-26 14:17:55',0),(93,'https://www.youtube.com/watch?v=xk3BvNLeNgw','Hang Massive - Once Again - 2011 ( hang drum duo ) ( HD ) - YouTube',1,12,'https://i.ytimg.com/vi/xk3BvNLeNgw/maxresdefault.jpg',0,'','2016-02-26 14:21:53',0),(96,'https://www.youtube.com/watch?v=XTbVIekRVmk','June - day out - YouTube',1,12,'https://i.ytimg.com/vi/XTbVIekRVmk/maxresdefault.jpg',0,'','2016-02-26 17:24:26',0),(98,'https://www.youtube.com/watch?v=ym9E1YG3_QQ','RC Edition | Dude Perfect - YouTube',1,9,'https://i.ytimg.com/vi/ym9E1YG3_QQ/maxresdefault.jpg',0,'','2016-02-26 17:50:29',0),(99,'https://www.youtube.com/watch?v=yyeTYF5U2ts','Hang Massive - Kanthi Song -   ( Album AS IT IS ( 2014 ) ) ( HD ) - YouTube',1,10,'https://i.ytimg.com/vi/yyeTYF5U2ts/maxresdefault.jpg',0,'test for Jake','2016-02-27 13:07:36',0),(100,'https://www.youtube.com/watch?v=QSwg7fxXsd8','Ace Ventura ',7,4,'https://i.ytimg.com/vi/QSwg7fxXsd8/maxresdefault.jpg',0,'','2016-02-27 15:57:45',0),(101,'https://www.youtube.com/watch?v=mDisKERzcF8','Symbolic - Insidious - YouTube',7,4,'https://i.ytimg.com/vi/mDisKERzcF8/hqdefault.jpg',0,'','2016-02-27 16:01:53',0),(102,'https://www.youtube.com/watch?v=4TEQKahfwFs','Night Hex - Sleep Paralysis - YouTube',7,4,'https://i.ytimg.com/vi/4TEQKahfwFs/maxresdefault.jpg',0,'','2016-02-27 16:10:04',0),(103,'https://www.youtube.com/watch?v=GUrmPaLGyIY','Night Hex - Night Visitors - YouTube',7,4,'https://i.ytimg.com/vi/GUrmPaLGyIY/maxresdefault.jpg',0,'','2016-02-27 16:27:19',0),(104,'https://www.youtube.com/watch?v=I3rlh18G11E','Hilight Tribe - Free tibet - - YouTube',1,4,'https://i.ytimg.com/vi/I3rlh18G11E/hqdefault.jpg',0,'We cant miss this out..','2016-02-27 17:42:01',0),(105,'https://www.youtube.com/watch?v=3ott8jMmMtM','DigiCult vs DNA - Rite Of Passage (Space Tribe Remix) - YouTube',1,4,'https://i.ytimg.com/vi/3ott8jMmMtM/hqdefault.jpg',0,'','2016-02-27 17:54:07',0),(106,'https://www.youtube.com/watch?v=I3rlh18G11E','Hilight Tribe - Free tibet - - YouTube',1,12,'https://i.ytimg.com/vi/I3rlh18G11E/hqdefault.jpg',0,'This track was played at the Hilltop Festival','2016-02-27 18:04:46',0),(107,'https://www.youtube.com/watch?v=tZ0e8JRu_9U','What is God? - YouTube',26,4,'https://i.ytimg.com/vi/tZ0e8JRu_9U/maxresdefault.jpg',0,'sdas','2016-02-27 18:40:34',1),(108,'https://www.youtube.com/watch?v=c-gB0C4hVoM','Saeed Asayesh - Nazi Nazi - YouTube',1,4,'https://i.ytimg.com/vi/c-gB0C4hVoM/hqdefault.jpg',0,'Consider this as Psy..please','2016-02-27 18:43:01',0);
/*!40000 ALTER TABLE `tracks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usergrouprelation`
--

DROP TABLE IF EXISTS `usergrouprelation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `usergrouprelation` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `group_id` int(11) unsigned DEFAULT NULL,
  `user_id` int(11) unsigned DEFAULT NULL,
  `not_count` int(11) DEFAULT '0',
  `created_at` datetime DEFAULT NULL,
  `is_public` enum('0','1') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `group_rights` enum('can_read','can_post') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_usergrouprelation_group` (`group_id`),
  KEY `index_foreignkey_usergrouprelation_user` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usergrouprelation`
--

LOCK TABLES `usergrouprelation` WRITE;
/*!40000 ALTER TABLE `usergrouprelation` DISABLE KEYS */;
INSERT INTO `usergrouprelation` VALUES (1,1,1,0,'2016-02-22 17:43:44','1','can_post'),(6,4,1,0,'2016-02-22 19:20:12','1','can_post'),(10,1,7,1,'2016-02-23 21:17:09','1','can_post'),(11,4,7,4,'2016-02-23 21:17:25','1','can_post'),(14,5,1,0,'2016-02-23 21:27:57','1','can_read'),(20,1,13,3,'2016-02-23 22:33:55','1','can_post'),(21,4,13,9,'2016-02-23 22:38:29','1','can_post'),(22,1,14,1,'2016-02-24 00:41:34','1','can_post'),(23,5,14,6,'2016-02-24 00:49:42','1','can_post'),(24,6,1,0,'2016-02-24 14:18:39','1','can_post'),(25,7,1,0,'2016-02-24 14:18:39','1','can_post'),(26,8,1,0,'2016-02-24 14:18:39','1','can_post'),(27,9,1,0,'2016-02-24 15:35:39','1','can_post'),(28,1,15,3,'2016-02-24 15:36:25','1','can_post'),(29,9,15,6,'2016-02-24 15:36:53','1','can_post'),(30,1,16,1,'2016-02-24 15:37:54','1','can_post'),(31,9,16,0,'2016-02-24 15:38:01','1','can_post'),(32,1,17,3,'2016-02-24 15:40:19','1','can_post'),(33,1,18,3,'2016-02-24 15:42:16','1','can_post'),(34,9,18,6,'2016-02-24 15:44:18','1','can_post'),(35,9,17,6,'2016-02-24 15:46:34','1','can_post'),(36,1,19,3,'2016-02-24 15:53:55','1','can_post'),(37,9,19,6,'2016-02-24 15:55:01','1','can_post'),(38,1,20,3,'2016-02-24 20:00:29','1','can_post'),(39,9,20,6,'2016-02-24 14:30:35','1','can_post'),(40,1,21,3,'2016-02-26 11:32:56','1','can_post'),(41,9,21,4,'2016-02-26 11:33:01','1','can_post'),(42,10,1,0,'2016-02-26 12:18:19','1','can_post'),(43,1,23,1,'2016-02-26 14:00:02','1','can_post'),(44,11,23,0,'2016-02-26 14:05:19','1','can_post'),(45,12,1,0,'2016-02-26 14:09:24','1','can_post'),(47,1,24,1,'2016-02-26 14:13:15','1','can_post'),(48,12,24,0,'2016-02-26 14:13:25','1','can_post'),(49,13,1,0,'2016-02-27 08:22:46','1','can_post'),(50,1,25,1,'2016-02-27 13:01:26','1','can_post'),(51,10,25,0,'2016-02-27 13:06:39','1','can_post'),(52,1,26,1,'2016-02-27 18:39:08','1','can_post'),(53,4,26,0,'2016-02-27 18:40:00','1','can_post'),(65,21,1,0,'2016-02-28 19:51:13','1','can_post'),(66,NULL,NULL,0,NULL,NULL,NULL),(67,NULL,NULL,0,NULL,NULL,NULL),(68,NULL,NULL,0,NULL,NULL,NULL),(69,NULL,NULL,0,NULL,NULL,NULL);
/*!40000 ALTER TABLE `usergrouprelation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `chrome_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT '',
  `nickname` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_seen` datetime DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `version` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_users_chrome` (`chrome_id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2278e7b15c284bd882cc1d884c8c8983ed8e6d298c1b76dc4c47a7d56d7ff69','Redsnow','2016-03-02 10:20:51','e10adc3949ba59abbe56e057f20f883e','3.3'),(7,'d65cf5151ba676b5ca4691b2acefa448780e420e5216132fd6e24f7c3e0b4','Psyphibian','2016-02-27 18:02:53','425071a15a7486128ab144947ee4de0b','2.3'),(13,'d28eedacf31b23f62c9a32076cfba4d1e57b68249e233f170c423e62534dfe','ARSENAL KI MKC','2016-02-23 22:33:55','e10adc3949ba59abbe56e057f20f883e',NULL),(14,'66a6d05fda5480a62e193587fdb5dba6e68651338d25d88262c284246cc40','Ajaxtown','2016-02-26 15:28:54','e10adc3949ba59abbe56e057f20f883e',NULL),(15,'7a9b9b3e183f65f5bb4933b49e8dbce26b8dd8cdda57f6ef511c92fc5c4d7a','skali','2016-02-26 22:14:20','abe9ccf709e712eaa05249c85680377d',NULL),(16,'3e34bd4af27d775ee1c954d58d7179f5ed288bc8d0db38a0f798cd44959a','Baptiste','2016-02-26 18:02:01','6dc99b2f347f13e58e32ae47a2076fae','2.3'),(17,'da1767fe6a8741198ded459f2f4459daf5f708fef4c2db112715337ccb487','theManyFacedGod','2016-02-24 15:40:19','38beb84530590a802d8f026151f152a0',NULL),(18,'667952c9445734d6f9a95d6336d132ca85bd5dbe77dfa8926ccdb4291fc1a379','vandre3000','2016-02-24 15:42:16','3895017a8fd2883524931316fc830ff3',NULL),(19,'4f279eb77af118926444d51052762f869b62a5fd1b468d3c96cd498d624f117','jacquelinechen','2016-02-24 15:53:55','3a63152ce132ceff5e6917f524d0826f',NULL),(20,'157d78d3386fb8b22d835068905186b252a65cba42b5b257daef2f9fb13e712','manessa','2016-02-24 20:00:29','e10adc3949ba59abbe56e057f20f883e',NULL),(21,'54647bbd2dcb63c96da3e842e1b2e658ed37748728f6d76bc547cf594f4ecc','jacquelinechen','2016-02-26 11:32:56','11498902b7f5d771ca613224ab00dfbe',NULL),(23,'b1fd4bc9835b28e99d895921362cdf181d3ed6d9ca044b6bfc829d7d0bae690','Titanium','2016-02-28 09:32:06','d7348a4449d13f6a56c1c6b2d8f7779c','2.1'),(24,'5368165bc0723697fae530ac51ecd21e44e45b61cd1f5853c1bf8536cd92089','anandsaha','2016-02-28 10:28:25','16d7a4fca7442dda3ad93c9a726597e4','2.3'),(25,'40522a1cc4222ed2e7a94da75827b6e1fb3583b632daa2c259fca72e6682133','Jake','2016-02-28 10:28:35','5f4dcc3b5aa765d61d8327deb882cf99','2.3'),(26,'a31f7f9759df576dac4de8482abee784f5e07a56c34213f392131bcff6888','Rajeev','2016-02-27 20:14:55','e2104374a89f4a592d52b83bb7fffd7c','2.3');
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
