-- MySQL dump 10.13  Distrib 5.6.25, for osx10.8 (x86_64)
--
-- Host: localhost    Database: ABTest
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
-- Current Database: `ABTest`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `ABTest` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `ABTest`;

--
-- Table structure for table `accounts`
--

DROP TABLE IF EXISTS `accounts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `accounts` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `company` varchar(200) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accounts`
--

LOCK TABLES `accounts` WRITE;
/*!40000 ALTER TABLE `accounts` DISABLE KEYS */;
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
  `account_id` int(11) DEFAULT NULL,
  `token` varchar(100) DEFAULT NULL,
  `refresh_token` varchar(300) DEFAULT NULL,
  `token_end_time` int(11) unsigned DEFAULT NULL,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_analytics_campaign` (`campaign_id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `analytics`
--

LOCK TABLES `analytics` WRITE;
/*!40000 ALTER TABLE `analytics` DISABLE KEYS */;
INSERT INTO `analytics` VALUES (15,60153,'ya29..ywK-Az058uCgQTOWYJfHCuo-Gdtb5UzMhpMmqvHlnTyGXBEAmxcAPELipOu6mCUbBE0v2qg','1/kxXV1c9OCfuPXWEW26Di9GY8JJM3hkRoJdMgrMnq7vLBactUREZofsF9C7PrpE-j',1461237760,37),(17,60153,'ya29.CwKB06Cf0daAGFyGOzJD3e3u4gVibfPt8zckmGxfEcvn-aG4ZOmUDOz69UIudTWWirsr','1/3W9sEYZPpKlZZs692rv96gyCNdD_GFNoC5AKoqk0ySFIgOrJDtdun6zK6XiATCKT',1444755066,38),(18,60153,'ya29.CwKkPF3XwlGOCglZQ8mtH-aPab_7dor9I0QxWpVSDT-XUTZM3xJyJzgzqEW-rjjC_hEP','1/ahB0LT7d7uennm7FthjidfUJSzwvW8QmjRY9x_3xtd_BactUREZofsF9C7PrpE-j',1444755130,39),(19,60153,'ya29.CwLrLBiujMsY30CZRAvQ9sYuJjUlZV_Wm6lygraVOpoAI43RxjWwDBlRwlqN1xH1TVkk','1/kaawP4_8RNMq9VDmF_w0rujbbDHls34oE9wBC2Oc01BIgOrJDtdun6zK6XiATCKT',1444755174,19),(22,60153,'ya29.DAKbz0Se_dezJem4I-exzMlUbvdXWKYl7sz_AcCuV2_l5rJuJ3zffMdo7f-QJhsKMrwL','1/K8s1isEMihgPquLzS2YM9n9KBySt_cAh_SdMJe1-wFA',1444813746,40),(34,60153,'ya29.DQKHajbUTxsCxiIIB2CshXKewNSlKPYXKFkJt15eGMpIlTZwWsEAw3cblIOG1iArFxtS','1/lSZFR913ibViY25N_OLrA8LS-LLvUCySByITEU3VK4Y',1444923930,53),(36,60153,'ya29.GQIhkwo9iBA0c68rIexVMULFUi0GMYW17-OiV-jmuJz50Y53KI7ko7bVGXmBGG-aCrFa','1/GEFcnlkHLlvD9ZO5Ge_ZfmCcdfqyOnwXzA2j2Tuf3QI',1445958110,55),(37,60153,'ya29.GQKbZnaEWExmvyOb2mtuMCdEkMh1lW5ZXJ5b9fiSr7u6MZRq3WwQSpHeSO2WQq647sRJ','1/IWUhyIPL2VmHzCMZ97I6OWBAe6W1pkpbMuERtXcTAx9IgOrJDtdun6zK6XiATCKT',1445966881,56),(38,60153,'ya29.QAJBlmspImdg52cW3Ytfmy2PTy7m1SQe0LFgJ__XolKAdJIw9BpFqVIC9yhN-02Qh7Xh','1/UoXyYAkkUH8Cg9JaOSQZb-pW_oQFIXT2FeKwz0IXt9I',1449225228,54),(40,1,'ya29.CjNeA9aQvg9robazwO9GEzcjZA9iX_f7vhe0b3no6WXfjfl4GSEsjsiP0vLkN8eHaLzQf_k','1/u8aD3feKizKUv8W-zJjr84VgB7_5bqKrSRBqmZaHWWQ',1473897703,58),(45,NULL,NULL,NULL,NULL,NULL),(46,1,'ya29.CjMeAwgou-ywSp6dPM3tKdvFBLC901HUvyNSPRyaDBa0YOldVL5SVUE3KgMh8p81JiFcvOw','1/-MDPUsfqQ7T6u2c36uR2l-VjfPBWKr_sUuja05PBuSIMEudVrK5jSpoR30zcRFq6',1468319118,62),(47,1,'ya29.CjMeAwgou-ywSp6dPM3tKdvFBLC901HUvyNSPRyaDBa0YOldVL5SVUE3KgMh8p81JiFcvOw','1/-MDPUsfqQ7T6u2c36uR2l-VjfPBWKr_sUuja05PBuSIMEudVrK5jSpoR30zcRFq6',1468319118,63),(48,1,'ya29.CjMeAwgou-ywSp6dPM3tKdvFBLC901HUvyNSPRyaDBa0YOldVL5SVUE3KgMh8p81JiFcvOw','1/-MDPUsfqQ7T6u2c36uR2l-VjfPBWKr_sUuja05PBuSIMEudVrK5jSpoR30zcRFq6',1468319118,64),(49,1,'ya29.CjMeAwgou-ywSp6dPM3tKdvFBLC901HUvyNSPRyaDBa0YOldVL5SVUE3KgMh8p81JiFcvOw','1/-MDPUsfqQ7T6u2c36uR2l-VjfPBWKr_sUuja05PBuSIMEudVrK5jSpoR30zcRFq6',1468319118,65);
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
  `name` varchar(50) DEFAULT NULL,
  `traffic_per` int(11) DEFAULT NULL,
  `test_url` text,
  `variations` text,
  `status` int(11) unsigned DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  `created_by` varchar(191) DEFAULT NULL,
  `domain` varchar(191) DEFAULT NULL,
  `account` varchar(191) DEFAULT NULL,
  `property` varchar(191) DEFAULT NULL,
  `view` varchar(191) DEFAULT NULL,
  `account_id` int(11) unsigned DEFAULT NULL,
  `page_path` varchar(100) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_campaigns_account` (`account_id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `campaigns`
--

LOCK TABLES `campaigns` WRITE;
/*!40000 ALTER TABLE `campaigns` DISABLE KEYS */;
INSERT INTO `campaigns` VALUES (19,'Test Campaign',50,'[\"http:\\/\\/dev.ehdoc\\/\"]','[{\"id\":\"c00\",\"js\":\"\",\"css\":\"\",\"name\":\"Control\",\"factor\":0.5},{\"name\":\"Variation 1\",\"factor\":0.5,\"id\":\"v01\",\"js\":\"\\/* Write your javascript code here *\\/\\n$(\'.intro\').css(\'background\',\'url(http:\\/\\/www.ks-images.de\\/wp-content\\/uploads\\/2013\\/04\\/ks-images-bg.jpg)\');\",\"css\":\"\\/* Write your css code here *\\/\"}]',1,'2015-09-28 19:08:51','Abhi','dev.ehdoc','55967210','UA-55967210-1','ga:92766679',NULL,NULL,NULL),(39,'Test',100,'[\"http:\\/\\/dev.ehdoc\"]','[{\"id\":\"c00\",\"js\":\"\",\"css\":\"\",\"name\":\"Control\",\"factor\":0.5},{\"name\":\"Variation 1\",\"factor\":0.5,\"id\":\"v01\",\"js\":\"\\/* Write your javascript code here *\\/\\nconsole.log(\\\"Second exp v1\\\")\",\"css\":\"\\/* Write your css code here *\\/\"}]',0,'2015-10-13 21:21:59','Abhi','dev.ehdoc',NULL,NULL,NULL,NULL,NULL,NULL),(40,'Testing Events, Labels',25,'[\"http:\\/\\/eaglehorn.org\"]','[{\"id\":\"c00\",\"name\":\"Control\",\"js\":\"\",\"css\":\"\",\"factor\":0.5},{\"id\":\"v01\",\"name\":\"Variation 1\",\"js\":\"\\/* Write your javascript code here *\\/\",\"css\":\"\\/* Write your css code here *\\/\",\"factor\":0.5}]',0,'2015-10-13 21:38:05','Abhi','dev.ehdoc','3004706','UA-3004706-6','ga:107156186',NULL,NULL,NULL),(53,'Demo Time',100,'[\"http:\\/\\/dev.ehdoc\\/\"]','[{\"id\":\"c00\",\"js\":\"\",\"css\":\"\",\"name\":\"Control\",\"factor\":0.33},{\"name\":\"Variation 1\",\"factor\":0.33,\"id\":\"v01\",\"js\":\"/* Write your javascript code here */\\nconsole.log(\\\"Variation 1\\\");\",\"css\":\"/* Write your css code here */\"},{\"name\":\"Variation 2\",\"factor\":0.33,\"id\":\"v02\",\"js\":\"/*start writing js*/\\nconsole.log(\\\"Variation 2\\\");\",\"css\":\"/*start writing css*/\"}]',0,'2015-10-15 20:14:06','Abhi','dev.ehdoc','55967210','UA-55967210-1','ga:92766679',NULL,NULL,NULL),(54,'P Test',19,'[\"https:\\/\\/pizza.de\\/\"]','[{\"id\":\"c00\",\"js\":\"\",\"css\":\"\",\"name\":\"Control\",\"factor\":0.33},{\"name\":\"Variation 1\",\"factor\":0.33,\"id\":\"v01\",\"js\":\"\\/* Write your javascript code here *\\/\",\"css\":\"\\/* Write your css code here *\\/\"},{\"name\":\"Variation 2\",\"factor\":0.33,\"id\":\"v02\",\"js\":\"\\/*start writing js*\\/\",\"css\":\"\\/*start writing css*\\/\"}]',0,'2015-10-21 00:59:06','Abhi','pizza.de','42635603','UA-42635603-1','ga:101020208',NULL,NULL,NULL),(55,'Demo 55',100,'[\"http:\\/\\/dev.ehdoc\\/\"]','[{\"id\":\"c00\",\"js\":\"\",\"css\":\"\",\"name\":\"Control\",\"factor\":0.33},{\"name\":\"Variation 1\",\"factor\":0.33,\"id\":\"v01\",\"js\":\"\\/* Write your javascript code here *\\/\",\"css\":\"\\/* Write your css code here *\\/\"},{\"name\":\"v2\",\"factor\":0.33,\"id\":\"v02\",\"js\":\"\\/*start writing js*\\/\",\"css\":\"\\/*start writing css*\\/\"}]',0,'2015-10-27 19:30:35','Abhi','dev.ehdoc','55967210','UA-55967210-1','ga:92766679',NULL,NULL,NULL),(56,'Sort Algorithm Test',100,'[\"http:\\/\\/dev.ehdoc\\/\"]','[{\"id\":\"c00\",\"js\":\"\",\"css\":\"\",\"name\":\"Control\",\"factor\":0.25},{\"name\":\"Variation 1\",\"factor\":0.25,\"id\":\"v01\",\"js\":\"\\/* Write your javascript code here *\\/\",\"css\":\"\\/* Write your css code here *\\/\"},{\"name\":\"Sort 2\",\"factor\":0.25,\"id\":\"v02\",\"js\":\"\\/*start writing js*\\/\",\"css\":\"\\/*start writing css*\\/\"},{\"name\":\"Sort 3\",\"factor\":0.25,\"id\":\"v03\",\"js\":\"\\/*start writing js*\\/\",\"css\":\"\\/*start writing css*\\/\"}]',0,'2015-10-27 21:40:48','Abhi','dev.ehdoc','55967210','UA-55967210-1','ga:92766679',NULL,NULL,NULL),(57,'Testing Ana',25,'[\"\"]','[{\"id\":\"c00\",\"name\":\"Control\",\"js\":\"\",\"css\":\"\",\"factor\":0.5},{\"id\":\"v01\",\"name\":\"Variation 1\",\"js\":\"\\/* Write your javascript code here *\\/\",\"css\":\"\\/* Write your css code here *\\/\",\"factor\":0.5}]',0,'2016-04-21 15:45:36','Abhi','test.com',NULL,NULL,NULL,NULL,NULL,NULL),(58,'Test May campaign',25,'[\"http:\\/\\/dev.ehdoc\\/\"]','[{\"id\":\"c00\",\"js\":\"\",\"css\":\"\",\"name\":\"Control\",\"factor\":0.5},{\"name\":\"Variation 1\",\"factor\":0.5,\"id\":\"v01\",\"js\":\"\\/* Write your javascript code here *\\/\\nalert(1);\",\"css\":\"\\/* Write your css code here *\\/\"}]',1,'2016-05-19 18:32:21',NULL,'dev.ehdoc','19390409','UA-19390409-3','51908909',1,'/','2016-07-16'),(62,'Campday Live',25,'[\"http:\\/\\/dev.ehdoc\\/\"]','a:2:{i:0;a:5:{s:2:\"id\";s:3:\"c00\";s:2:\"js\";s:0:\"\";s:3:\"css\";s:0:\"\";s:4:\"name\";s:7:\"Control\";s:6:\"factor\";d:0.5;}i:1;a:5:{s:4:\"name\";s:11:\"Variation 1\";s:6:\"factor\";d:0.5;s:2:\"id\";s:3:\"v01\";s:2:\"js\";s:45:\"$(\'.top-destinations\').insertAfter(\'.rooms\');\";s:3:\"css\";s:108:\"/*#index .amenities-promo .icon {*/\n/*    width: 100px !important;*/\n/*    height: 100px !important;*/\n/*}*/\";}}',0,'2016-07-22 17:42:29','A S','dev.ehdoc','75471669','UA-75471669-2','119394431',1,'/','2016-07-18'),(63,'Campday Live - Campsite',25,'[\"mmmm\",\"https:\\/\\/www.campday.de\\/de\\/campingplatz-niedersachsen\\/hoepkens-hof-campingplatz\",\"https:\\/\\/www.campday.de\\/de\\/campingplatz-niedersachsen\\/hoepkens-hof-campingplatz\",\"https:\\/\\/www.campday.de\\/de\\/campingplatz-niedersachsen\\/hoepkens-hof-campingplatz\",\"dddd\",\"dddd\",\"sssss\",\"sss\",\"mmm\"]','a:2:{i:0;a:5:{s:2:\"id\";s:3:\"c00\";s:2:\"js\";s:0:\"\";s:3:\"css\";s:0:\"\";s:4:\"name\";s:7:\"Control\";s:6:\"factor\";d:0.5;}i:1;a:5:{s:4:\"name\";s:11:\"Variation 1\";s:6:\"factor\";d:0.5;s:2:\"id\";s:3:\"v01\";s:2:\"js\";s:18:\"var a = \"t\" + \"b\";\";s:3:\"css\";s:30:\"/* Write your css code here */\";}}',0,'2016-08-03 14:20:03','A S','campday.de','75471669','UA-75471669-2','119394431',1,'/','1970-01-01'),(64,'Campday Live - Campsite_clone',25,'[\"mmmm\",\"https:\\/\\/www.campday.de\\/de\\/campingplatz-niedersachsen\\/hoepkens-hof-campingplatz\",\"https:\\/\\/www.campday.de\\/de\\/campingplatz-niedersachsen\\/hoepkens-hof-campingplatz\",\"https:\\/\\/www.campday.de\\/de\\/campingplatz-niedersachsen\\/hoepkens-hof-campingplatz\",\"dddd\",\"dddd\",\"sssss\",\"sss\",\"mmm\"]','a:2:{i:0;a:5:{s:2:\"id\";s:3:\"c00\";s:2:\"js\";s:0:\"\";s:3:\"css\";s:0:\"\";s:4:\"name\";s:7:\"Control\";s:6:\"factor\";d:0.5;}i:1;a:5:{s:4:\"name\";s:11:\"Variation 1\";s:6:\"factor\";d:0.5;s:2:\"id\";s:3:\"v01\";s:2:\"js\";s:18:\"var a = \"t\" + \"b\";\";s:3:\"css\";s:30:\"/* Write your css code here */\";}}',0,'2016-08-12 10:23:46','A S','campday.de','75471669','UA-75471669-2','119394431',1,'/',NULL),(65,'Campday Live - Campsite_clone_clone',25,'[\"https:\\/\\/www.campsy.de\\/\"]','a:3:{i:0;a:5:{s:2:\"id\";s:3:\"c00\";s:2:\"js\";s:0:\"\";s:3:\"css\";s:0:\"\";s:4:\"name\";s:7:\"Control\";s:6:\"factor\";i:0;}i:1;a:5:{s:4:\"name\";s:11:\"Variation 1\";s:6:\"factor\";d:0.5;s:2:\"id\";s:3:\"v01\";s:2:\"js\";s:18:\"var a = \"t\" + \"b\";\";s:3:\"css\";s:30:\"/* Write your css code here */\";}i:2;a:5:{s:4:\"name\";s:8:\"PControl\";s:6:\"factor\";d:0.5;s:2:\"id\";s:3:\"v02\";s:2:\"js\";s:0:\"\";s:3:\"css\";s:21:\"/*start writing css*/\";}}',0,'2016-08-12 10:23:52','A S','campsy.de','75471669','UA-75471669-2','119394431',1,'/','2016-08-01'),(68,'Eaglehorn',100,'[\"http:\\/\\/dev.ehdoc\\/\"]','a:2:{i:0;a:5:{s:2:\"id\";s:3:\"c00\";s:4:\"name\";s:7:\"Control\";s:2:\"js\";s:0:\"\";s:3:\"css\";s:0:\"\";s:6:\"factor\";d:0.5;}i:1;a:5:{s:2:\"id\";s:3:\"v01\";s:4:\"name\";s:11:\"Variation 1\";s:2:\"js\";s:37:\"/* Write your javascript code here */\";s:3:\"css\";s:30:\"/* Write your css code here */\";s:6:\"factor\";d:0.5;}}',0,'2016-08-18 14:46:13','A S','dev.ehdoc',NULL,NULL,NULL,1,'','2016-08-18');
/*!40000 ALTER TABLE `campaigns` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goal_types`
--

DROP TABLE IF EXISTS `goal_types`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goal_types` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goal_types`
--

LOCK TABLES `goal_types` WRITE;
/*!40000 ALTER TABLE `goal_types` DISABLE KEYS */;
/*!40000 ALTER TABLE `goal_types` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `goals`
--

DROP TABLE IF EXISTS `goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `goals` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `goals` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_goals_campaign` (`campaign_id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `goals`
--

LOCK TABLES `goals` WRITE;
/*!40000 ALTER TABLE `goals` DISABLE KEYS */;
INSERT INTO `goals` VALUES (3,19,'[{\"name\":\"Goal1\",\"type\":\"page-visits\",\"action\":\"url\",\"url\":\"/home/page/start/2.0\",\"eCategory\":\"\"},{\"name\":\"Checkout Conversion - Sort logic\",\"type\":\"page-visits\",\"action\":\"event\",\"url\":\"something.com/checkoutpage?para=xxx/yyy/\",\"eLabel\":\"\",\"eAction\":\"Variation\",\"eCategory\":\"ABTest\"},{\"name\":\"From home page to next page\",\"type\":\"page-visits\",\"action\":\"url\",\"url\":\"http://dev.ehdoc/home/page/install\",\"eCategory\":\"\"}]'),(9,39,NULL),(10,40,'[{\"name\":\"Goal1\",\"type\":\"page-visits\",\"action\":\"event\",\"url\":\"\",\"eLabel\":\"shop.clicked\",\"eAction\":\"shop.clicked\",\"eCategory\":\"web.home\"}]'),(23,53,NULL),(24,54,'[{\"name\":\"Web Shop Details\",\"type\":\"page-visits\",\"action\":\"event\",\"url\":\"\",\"eLabel\":\"\",\"eAction\":\"button.clicked\",\"eCategory\":\"web.shop_details\"}]'),(34,58,'[{\"name\":\"Test May campaign\",\"type\":\"page-visits\",\"action\":\"url\",\"url\":\"https://www.ajaxtown.com\",\"eCategory\":\"\",\"segmentSequence\":\"\",\"segmentSequenceFilter\":\"\",\"segmentCondition\":\"\"}]'),(38,62,'[{\"name\":\"Test\",\"type\":\"page-visits\",\"action\":\"segment-sequence\",\"url\":\"\",\"eCategory\":\"Booking\",\"segmentSequence\":\"ga:pagePath=~\\\\Q/success\\\\E$\",\"segmentSequenceFilter\":\"\",\"segmentCondition\":\"\"}]'),(39,63,'[{\"name\":\"Test\",\"type\":\"page-visits\",\"action\":\"segment-sequence\",\"url\":\"\",\"eCategory\":\"Booking\",\"segmentSequence\":\"ga:pagePath=~\\\\Q/success\\\\E$\",\"segmentSequenceFilter\":\"\",\"segmentCondition\":\"\"}]'),(40,64,'[{\"name\":\"Test\",\"type\":\"page-visits\",\"action\":\"segment-sequence\",\"url\":\"\",\"eCategory\":\"Booking\",\"segmentSequence\":\"ga:pagePath=~\\\\Q/success\\\\E$\",\"segmentSequenceFilter\":\"\",\"segmentCondition\":\"\"}]'),(41,65,'[{\"name\":\"Test\",\"type\":\"page-visits\",\"action\":\"segment-sequence\",\"url\":\"\",\"eCategory\":\"Booking\",\"segmentSequence\":\"ga:pagePath=~\\\\Q/success\\\\E$\",\"segmentSequenceFilter\":\"\",\"segmentCondition\":\"\"}]'),(44,68,NULL);
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
  `user_id` int(11) unsigned DEFAULT NULL,
  `account_id` int(11) unsigned DEFAULT NULL,
  `campaign_id` int(11) unsigned DEFAULT NULL,
  `mode` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `status` tinyint(1) unsigned DEFAULT NULL,
  `date` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `index_foreignkey_log_user` (`user_id`),
  KEY `index_foreignkey_log_account` (`account_id`),
  KEY `index_foreignkey_log_campaign` (`campaign_id`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log`
--

LOCK TABLES `log` WRITE;
/*!40000 ALTER TABLE `log` DISABLE KEYS */;
INSERT INTO `log` VALUES (1,10,60153,19,'STATUS_CHANGE',1,'2015-10-09 18:19:08'),(2,10,60153,19,'STATUS_CHANGE',1,'2015-10-09 18:22:41'),(3,NULL,NULL,NULL,NULL,NULL,NULL),(4,10,60153,19,'STATUS_CHANGE',0,'2015-10-10 23:15:58'),(5,10,60153,19,'STATUS_CHANGE',1,'2015-10-10 23:16:00'),(6,10,60153,19,'STATUS_CHANGE',0,'2015-10-10 23:16:02'),(7,10,60153,19,'STATUS_CHANGE',1,'2015-10-10 23:23:00'),(8,10,60153,19,'STATUS_CHANGE',1,'2015-10-12 19:10:27'),(9,10,60153,19,'STATUS_CHANGE',1,'2015-10-12 19:12:12'),(10,10,60153,35,'STATUS_CHANGE',1,'2015-10-13 18:45:02'),(11,10,60153,19,'STATUS_CHANGE',0,'2015-10-15 19:30:43'),(12,10,60153,19,'STATUS_CHANGE',1,'2015-10-15 19:43:27'),(13,10,60153,19,'STATUS_CHANGE',0,'2015-10-15 19:44:06'),(14,10,60153,52,'STATUS_CHANGE',1,'2015-10-15 19:44:13'),(15,10,60153,19,'STATUS_CHANGE',1,'2015-10-15 19:49:00'),(16,10,60153,53,'STATUS_CHANGE',1,'2015-10-15 20:16:32'),(17,10,60153,19,'STATUS_CHANGE',0,'2015-10-15 20:16:38'),(18,10,60153,53,'STATUS_CHANGE',0,'2015-10-15 20:18:05'),(19,10,60153,19,'STATUS_CHANGE',1,'2015-10-15 20:24:24'),(20,10,60153,53,'STATUS_CHANGE',1,'2015-10-15 21:17:33'),(21,10,60153,19,'STATUS_CHANGE',0,'2015-10-17 01:55:44'),(22,10,60153,19,'STATUS_CHANGE',1,'2015-10-17 02:04:11'),(23,10,60153,53,'STATUS_CHANGE',0,'2015-10-19 16:05:22'),(24,10,60153,19,'STATUS_CHANGE',0,'2015-10-21 16:33:43'),(25,10,60153,19,'STATUS_CHANGE',1,'2015-10-21 16:34:55'),(26,10,60153,19,'STATUS_CHANGE',0,'2015-10-22 19:41:40'),(27,10,60153,19,'STATUS_CHANGE',1,'2015-10-22 19:56:55'),(28,10,60153,19,'STATUS_CHANGE',0,'2015-10-22 20:00:43'),(29,10,60153,19,'STATUS_CHANGE',1,'2015-10-23 18:56:22'),(30,10,60153,39,'STATUS_CHANGE',1,'2015-10-23 19:19:49'),(31,10,60153,39,'STATUS_CHANGE',0,'2015-10-27 19:25:21'),(32,10,60153,39,'STATUS_CHANGE',1,'2015-10-27 19:40:24'),(33,10,60153,39,'STATUS_CHANGE',0,'2015-10-27 21:48:00'),(34,10,60153,19,'STATUS_CHANGE',0,'2016-01-29 18:32:51'),(35,10,60153,19,'STATUS_CHANGE',1,'2016-01-29 18:33:41'),(36,10,60153,19,'STATUS_CHANGE',0,'2016-04-21 15:31:22'),(37,10,60153,19,'STATUS_CHANGE',0,'2016-04-21 15:33:24'),(38,10,60153,19,'STATUS_CHANGE',1,'2016-04-21 15:46:24'),(39,10,1,58,'STATUS_CHANGE',1,'2016-07-13 15:33:29');
/*!40000 ALTER TABLE `log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sessions` (
  `session_id` varchar(32) NOT NULL DEFAULT '',
  `hash` varchar(32) NOT NULL DEFAULT '',
  `session_data` blob NOT NULL,
  `session_expire` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('6co02cijc312c6esbsu0e85430','410565e2d75a845c71c1a092b4b0299a','authenticated|b:1;email|s:14:\"abhi@gmail.com\";fullname|s:3:\"A S\";account_id|s:1:\"1\";user_id|s:2:\"10\";role|s:2:\"rw\";',1471526101),('91b4792fe3suminjmeqk3ru9o0','410565e2d75a845c71c1a092b4b0299a','authenticated|b:1;email|s:14:\"abhi@gmail.com\";fullname|s:3:\"A S\";account_id|s:1:\"1\";user_id|s:2:\"10\";role|s:2:\"rw\";oauth_access_token|s:76:\"ya29.CjNeA9aQvg9robazwO9GEzcjZA9iX_f7vhe0b3no6WXfjfl4GSEsjsiP0vLkN8eHaLzQf_k\";',1473895552);
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `account_id` int(11) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `fname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `password` varchar(100) DEFAULT NULL,
  `role` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (10,1,'abhi@gmail.com','A','S','e10adc3949ba59abbe56e057f20f883e','rw'),(11,1,'abhi_read@gmail.com','A','S','e10adc3949ba59abbe56e057f20f883e','r');
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
