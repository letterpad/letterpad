-- MySQL dump 10.13  Distrib 5.6.25, for osx10.8 (x86_64)
--
-- Host: localhost    Database: reactcms
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
-- Current Database: `reactcms`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `reactcms` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `reactcms`;

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `authors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES (1,'Admin','$2a$10$.dPLmaFVW2jTF/rMcUPRjucno5oKMwVMGeTjrPGDVinSQtPNy9Mdy',NULL,'2017-03-25 16:16:05','2017-03-25 16:16:05');
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `options`
--

DROP TABLE IF EXISTS `options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `options` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `option` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `options`
--

LOCK TABLES `options` WRITE;
/*!40000 ALTER TABLE `options` DISABLE KEYS */;
/*!40000 ALTER TABLE `options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_taxonomy_relation`
--

DROP TABLE IF EXISTS `post_taxonomy_relation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_taxonomy_relation` (
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `post_id` int(11) NOT NULL DEFAULT '0',
  `taxonomy_id` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`post_id`,`taxonomy_id`),
  KEY `taxonomy_id` (`taxonomy_id`),
  CONSTRAINT `post_taxonomy_relation_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `post_taxonomy_relation_ibfk_2` FOREIGN KEY (`taxonomy_id`) REFERENCES `taxonomies` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_taxonomy_relation`
--

LOCK TABLES `post_taxonomy_relation` WRITE;
/*!40000 ALTER TABLE `post_taxonomy_relation` DISABLE KEYS */;
INSERT INTO `post_taxonomy_relation` VALUES ('2017-03-25 16:16:06','2017-03-25 16:16:06',2,4),('2017-03-25 16:16:06','2017-03-25 16:16:06',3,3),('2017-03-25 16:16:06','2017-03-25 16:16:06',3,5),('2017-03-25 16:16:06','2017-03-25 16:16:06',3,7),('2017-03-25 16:16:06','2017-03-25 16:16:06',3,10),('2017-03-25 16:16:06','2017-03-25 16:16:06',4,4),('2017-03-25 16:16:06','2017-03-25 16:16:06',4,5),('2017-03-25 16:16:06','2017-03-25 16:16:06',4,8),('2017-03-25 16:16:06','2017-03-25 16:16:06',4,9),('2017-03-25 16:16:06','2017-03-25 16:16:06',4,10),('2017-03-25 16:16:06','2017-03-25 16:16:06',4,11),('2017-03-25 16:16:06','2017-03-25 16:16:06',5,2),('2017-03-25 16:16:06','2017-03-25 16:16:06',5,3),('2017-03-25 16:16:06','2017-03-25 16:16:06',5,5),('2017-03-25 16:16:06','2017-03-25 16:16:06',5,11),('2017-03-25 16:16:06','2017-03-25 16:16:06',6,5),('2017-03-25 16:16:06','2017-03-25 16:16:06',6,9),('2017-03-25 16:16:06','2017-03-25 16:16:06',6,10),('2017-03-25 16:16:06','2017-03-25 16:16:06',6,12),('2017-03-25 16:16:06','2017-03-25 16:16:06',7,5),('2017-03-25 16:16:06','2017-03-25 16:16:06',7,6),('2017-03-25 16:16:06','2017-03-25 16:16:06',7,7),('2017-03-25 16:16:06','2017-03-25 16:16:06',7,8),('2017-03-25 16:16:06','2017-03-25 16:16:06',7,11),('2017-03-25 16:16:06','2017-03-25 16:16:06',7,12),('2017-03-25 16:18:43','2017-03-25 16:18:43',7,31),('2017-03-25 16:18:43','2017-03-25 16:18:43',7,32),('2017-03-25 16:16:06','2017-03-25 16:16:06',8,3),('2017-03-25 16:16:06','2017-03-25 16:16:06',8,8),('2017-03-25 16:16:06','2017-03-25 16:16:06',8,9),('2017-03-25 16:16:06','2017-03-25 16:16:06',8,11),('2017-03-25 16:16:06','2017-03-25 16:16:06',9,5),('2017-03-25 16:16:06','2017-03-25 16:16:06',9,9),('2017-03-25 16:16:06','2017-03-25 16:16:06',9,10),('2017-03-25 16:16:06','2017-03-25 16:16:06',9,12),('2017-03-25 16:16:06','2017-03-25 16:16:06',10,2),('2017-03-25 16:16:06','2017-03-25 16:16:06',10,3),('2017-03-25 16:16:06','2017-03-25 16:16:06',10,7),('2017-03-25 16:16:06','2017-03-25 16:16:06',10,8),('2017-03-25 16:16:06','2017-03-25 16:16:06',10,9),('2017-03-25 16:16:06','2017-03-25 16:16:06',10,10),('2017-03-25 16:16:06','2017-03-25 16:16:06',10,11),('2017-03-25 16:16:06','2017-03-25 16:16:06',11,4),('2017-03-25 16:16:06','2017-03-25 16:16:06',11,7),('2017-03-25 16:16:06','2017-03-25 16:16:06',11,8),('2017-03-25 16:16:06','2017-03-25 16:16:06',12,5),('2017-03-25 16:16:06','2017-03-25 16:16:06',12,10),('2017-03-25 16:16:06','2017-03-25 16:16:06',12,12);
/*!40000 ALTER TABLE `post_taxonomy_relation` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT '',
  `body` text,
  `excerpt` varchar(400) DEFAULT '',
  `cover_image` varchar(255) DEFAULT '',
  `type` varchar(255) DEFAULT '',
  `status` varchar(255) DEFAULT 'draft',
  `permalink` varchar(255) DEFAULT '',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  `author_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,'Vel dolorum maxime incidunt praesentium iure et temporibus esse dolores.','A cumque dolor non natus voluptas enim. Ut deserunt voluptas. Sit voluptatibus voluptatem voluptatem accusantium ipsum praesentium velit. Recusandae occaecati corporis quam sed et architecto. Laudantium aut debitis. Neque nihil itaque aut accusantium nam dolor odio est.\n \rRerum quia quibusdam quisquam excepturi sequi repellendus. Ab at ipsum expedita dolorem. A qui asperiores nemo ratione et. Debitis et similique et atque sit sapiente officiis aliquid. Aut fugit consectetur pariatur.\n \rExcepturi id qui explicabo. Voluptatum voluptatem dolorem est enim unde doloribus deleniti non. Molestias rerum dolor eum consequuntur maxime sint aperiam neque quos. Eos odio repellendus sint voluptas et iusto. Quis minus nostrum eaque qui.\n \rProvident velit blanditiis doloremque quis maxime rerum nemo. Nostrum quos aperiam laudantium. Voluptas ratione odit iure ullam est sunt possimus maxime. Suscipit ea eos ut deserunt et maiores est. Consequatur molestias illo recusandae a.\n \rDucimus ut dignissimos. Vel sit qui et non autem quidem in ut quia. Nobis eos aspernatur nobis deserunt quidem molestias esse quod. Et accusamus atque at nisi magnam aperiam rem.\n \rAt suscipit fuga reiciendis. Dolores exercitationem dolorum cumque. Et culpa ex voluptatem qui explicabo et nulla. Laboriosam iusto dolor cupiditate quia expedita dicta. Voluptatem sunt et alias repellendus et. Quae commodi minus laborum sint nesciunt voluptatem adipisci autem deleniti.','Odit iure perspiciatis alias numquam explicabo. Quis nisi ipsum. Autem at asperiores et. Ducimus placeat molestiae et consequatur. Molestiae dolore dolore. Ab commodi veritatis nemo sit laborum ex et non quaerat.','http://lorempixel.com/900/400/abstract','post','draft','vel-dolorum-maxime-incidunt-praesentium-iure-et-temporibus-esse-dolores','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(2,'Fugiat nulla qui aliquid et.','Suscipit corrupti omnis et est est dignissimos tempora porro illum. Itaque iusto et praesentium id odio quae. Molestias iusto ex nihil asperiores et aperiam est repellat.\n \rEarum quis quam quia ea. Accusantium eaque possimus molestias. Voluptatem accusantium delectus. Est et labore ut rerum. Reprehenderit asperiores eaque beatae impedit pariatur cumque molestiae delectus. Nisi distinctio mollitia est pariatur provident.\n \rDoloribus non voluptates ab. Et provident ut sapiente nihil ipsum optio illum. Odio eum eaque debitis dolorum. Rerum qui voluptas aliquid alias perspiciatis. Optio ea alias voluptas dolor voluptatem expedita minima ut harum. Consequatur veniam ut.\n \rNeque cupiditate sed dolor rerum non non est tenetur consequatur. Est in rem aut eaque est ipsam assumenda. Qui ut aperiam a dolores non debitis reiciendis deleniti. Magnam numquam rerum laborum nesciunt ea eos ipsum ipsa dolorem.\n \rDolores ut quisquam occaecati. Asperiores ex et. Non in accusantium possimus ea ut enim placeat dolores et. Commodi nihil amet unde iure enim molestiae voluptatem.\n \rVoluptate dolores deleniti aliquid quas similique dolore. Quo quam odio harum quod dolorum. Voluptatem corrupti nobis vel autem. Possimus qui doloribus. Voluptas sit veritatis magni autem.','Aliquid ratione facilis fugiat dolorem quaerat et. Nisi aut esse repellendus modi.','http://lorempixel.com/900/400/abstract','page','draft','fugiat-nulla-qui-aliquid-et','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(3,'Eius id numquam.','Esse quia autem. Cumque aut nihil. Possimus deserunt atque architecto veniam blanditiis quos. Iure provident in. Sapiente est voluptas deleniti error fuga alias neque.\n \rDolorem asperiores ab est saepe magni. Placeat quod facere. Dolores voluptate perferendis praesentium beatae est ut nam. Alias aut minus odio corrupti laudantium distinctio fuga qui. Cum possimus consectetur ducimus reprehenderit assumenda officia. Tempora omnis sit.\n \rHic et rerum maiores dolores ut non dolorem adipisci. Non distinctio nesciunt et. Explicabo distinctio voluptas assumenda assumenda harum animi in. Inventore voluptatum quas quisquam dolor corporis neque sed. Est quis ab impedit quia et aperiam.\n \rSed suscipit a. Expedita numquam tempora libero quod aspernatur in non sit. Tenetur cum aliquid. Sunt quis nemo id deleniti laborum et aut et mollitia. Pariatur molestiae provident adipisci odit tempora nihil sed. Sapiente tenetur mollitia libero est.\n \rEos asperiores sed illum autem ad et nihil recusandae voluptate. Vero consequuntur tempora eius dolores quaerat quia. Expedita et a voluptatum.\n \rExpedita rem ea cum. Qui est exercitationem similique accusantium harum. Ut natus temporibus ipsam ut facere quod. Exercitationem magni laudantium libero non sunt itaque dolore.','Aut ipsum odio ut dolor facere explicabo. Id accusamus nobis laborum veritatis temporibus eveniet ipsa. Consequatur consequatur fugiat necessitatibus maiores. Commodi qui id similique cum eveniet molestiae. Voluptas eos recusandae architecto asperiores nihil.','http://lorempixel.com/900/400/abstract','page','draft','eius-id-numquam','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(4,'Architecto in laudantium.','Atque illo aliquam doloremque error recusandae. Accusantium eius sunt corporis labore enim cumque. Similique doloribus quod et consequatur quod.\n \rQui in nobis accusantium est tenetur ratione ut quasi libero. Nesciunt non id voluptas sint exercitationem voluptatibus. Qui ipsam culpa in quia et temporibus eum dolorem. Minima quae sit aliquam sint excepturi.\n \rAt inventore sit voluptas. Reprehenderit et excepturi. Modi veritatis qui eos quo eum.\n \rEa vel recusandae rem nostrum vel nihil et. Suscipit dolores nesciunt sunt expedita ut corrupti placeat. Sint quis tempore et distinctio sint possimus numquam.\n \rEnim dolorem exercitationem accusamus cupiditate consequatur accusantium corrupti voluptatem. Dolor mollitia placeat accusamus esse. Eligendi eum cumque. Eum dolores alias nam. Praesentium ea mollitia tempora. Expedita rem et et sit enim.\n \rSed quis veniam iusto. Non et unde ducimus deserunt repellendus aut praesentium. Quibusdam molestias voluptates dignissimos aut voluptas voluptate ut impedit consequuntur. Eum sit possimus sunt.','Similique eos in. Et voluptatum aut tenetur sed harum et. Est repellendus tenetur sit aut unde cumque fugiat doloribus.','http://lorempixel.com/900/400/abstract','post','draft','architecto-in-laudantium','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(5,'Animi ut et laborum amet explicabo sint.','Harum velit repellat. Voluptatibus sed harum voluptatibus eveniet asperiores illum praesentium quas quod. Modi dolorem et eos rerum non quod. Odit vel dignissimos officiis. Sit rerum quod.\n \rExpedita velit qui. Alias magnam fugit minus qui. Sint velit facilis fugit veritatis fugiat. Libero unde eveniet itaque quos doloremque voluptatem quo. Delectus voluptatum dolorem excepturi sequi.\n \rEt ut hic aspernatur fugiat necessitatibus ex. Optio alias at deleniti consequuntur incidunt. Dignissimos corporis voluptatibus ipsum. Aut qui labore laudantium. Totam possimus repudiandae excepturi mollitia et facilis debitis quidem sequi.\n \rEos rerum laudantium quia. Ea sit iure. Inventore nesciunt distinctio excepturi dignissimos aut error molestiae harum est. Earum qui autem. Molestias rem omnis est iste impedit molestiae aut.\n \rMolestiae vel explicabo deserunt ea reiciendis molestias repellendus et est. Quia omnis amet rerum. Doloremque voluptatem odit ea dignissimos. Totam accusantium rerum necessitatibus et et. Molestiae qui dicta suscipit odit deserunt dicta. Consectetur ut iusto quas quos nihil earum ut.\n \rLaudantium ad aut aspernatur accusantium sint quisquam aspernatur. Cumque nulla est officiis voluptatem debitis. Culpa incidunt magni laudantium. Aperiam nisi neque provident ut similique. Earum incidunt aut nihil commodi quod modi magnam vitae. Nam et blanditiis eligendi eligendi.','Ipsam provident ut pariatur odit repudiandae. Magnam earum incidunt ut dolorum autem corporis. Quia qui voluptatum sit ab aut quis repellat voluptatum. Consequuntur alias ut hic eos. Maxime aliquam temporibus et corporis sit nihil et.','http://lorempixel.com/900/400/abstract','page','draft','animi-ut-et-laborum-amet-explicabo-sint','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(6,'Et dolor quo voluptas blanditiis.','Harum nemo aliquam voluptatem consequatur sed. Et harum rem vitae quisquam natus officia. In sit quasi consequatur itaque perspiciatis. Neque quibusdam inventore facere.\n \rDeleniti possimus et tenetur praesentium magnam occaecati. Voluptatem eaque fugit incidunt eos nostrum officia consequatur eos quo. Suscipit aut voluptas ipsum placeat est maxime consequatur.\n \rDolor est ut doloribus saepe dolores vitae dolorem id ex. Animi qui molestiae minus deleniti omnis ipsam eius. Atque aut molestiae quia.\n \rConsequatur impedit molestiae ut fugiat nihil. Harum asperiores nobis est quos quos suscipit aut. Minima nemo qui quis ad dolor. Voluptas dolor impedit laudantium odit officia. Non aut odio qui illo dolorum. Qui est dolorem repellendus est modi.\n \rEt eos non. Accusantium quis ullam porro natus minus iste dolore. Autem alias voluptatem. Id vel qui facilis. Autem ipsa nam.\n \rSed accusantium cupiditate. Natus et recusandae nisi repudiandae odit ut impedit est. Suscipit impedit cupiditate quos ut quia officia quod. Pariatur ullam dolorem omnis. Exercitationem quisquam nemo quae ipsam ut omnis quis.','Aliquid eos quae aut qui sed. Consequatur dignissimos consequuntur nulla et harum nulla culpa sed. Voluptatem ipsum sit. Voluptatibus cumque deserunt quo. Architecto molestiae facere hic. Minima ipsa esse aut nulla sit cupiditate.','http://lorempixel.com/900/400/abstract','page','draft','et-dolor-quo-voluptas-blanditiis','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(7,'Sint aperiam aut est et est ipsa non.','<p>Aspernatur provident officiis quasi doloribus aut laudantium accusantium. Omnis ipsum omnis fugiat. Quidem maxime necessitatibus autem. Vel autem accusantium sit voluptates incidunt qui beatae sequi. Saepe neque est. Natus autem rerum et voluptatem numquam tenetur accusamus et temporibus.\n \nQuia sunt magnam rerum illum ad id ullam dolor magnam. Ut eos omnis aliquid. Aliquid reprehenderit ipsum animi voluptatibus. Voluptatem at dignissimos. Et voluptatem eos saepe quo at in provident voluptatem quidem.\n \nNihil iste corrupti voluptatum quisquam quos rerum ad. Quia necessitatibus explicabo nobis voluptatem in cupiditate. Laudantium ducimus neque molestias recusandae recusandae corrupti sapiente ipsum iste. Dolores harum ullam nihil. In et autem vel reiciendis eaque exercitationem sit labore.\n \nIn minima illum iusto modi. Ut amet ipsum minus consequuntur eligendi vitae reiciendis commodi omnis. Est enim cumque sapiente illum. Assumenda pariatur molestias sunt non qui exercitationem voluptatem iusto. Delectus accusamus accusamus ad. Deleniti pariatur dolores excepturi quis ad ea suscipit.\n \nVoluptatem nulla amet dolore sequi vel repudiandae. Et iste ut quam quia quia ut. Iusto eveniet magni provident perferendis perferendis omnis. In nihil magni quia. Est omnis est corrupti non consequuntur. Tempora dignissimos ratione blanditiis et cum veniam modi nobis qui.\n \nMagnam adipisci reprehenderit consequatur. Eum et nulla nihil impedit aliquam. Officiis non ullam voluptas suscipit animi omnis vel qui.</p>','Quo iste nemo officia. Voluptatem tempora nisi cumque ratione ea necessitatibus. Maxime autem labore voluptatem. Temporibus itaque qui.','http://lorempixel.com/900/400/abstract','post','draft','sint-aperiam-aut-est-et-est-ipsa-non','2017-03-25 16:16:05','2017-03-25 16:18:43',1),(8,'Eum nostrum explicabo voluptatem dolor voluptatem est dicta.','Debitis omnis animi autem et qui. Non unde et tenetur facere autem molestiae non magni velit. Dolor voluptatum quia. Soluta molestias quod vitae dolorem voluptas temporibus laborum deleniti.\n \rVel cupiditate eum. Est soluta necessitatibus voluptatem reiciendis reprehenderit eum qui nihil. Nihil est natus voluptatem est numquam.\n \rAt culpa aspernatur quaerat. Dolorem voluptas dolor eius. Omnis sunt nostrum recusandae.\n \rEt velit ipsa nam iure et rem. Qui alias amet eum tenetur quae error voluptatem. Qui eaque officiis ipsam quae perspiciatis est. Provident pariatur omnis aut. Ab ut iure omnis accusantium repudiandae ad nihil voluptatem dolores.\n \rVelit a qui animi quia necessitatibus a repellat officiis est. Dolorem et natus corporis illum eos a eaque ratione. Necessitatibus ipsam dignissimos atque ducimus expedita iste nam iste. Ab explicabo harum consequuntur ipsam qui maiores iste aut. Totam assumenda repellat quas necessitatibus esse.\n \rQuaerat ipsam ut sit sit. Rerum nisi sint temporibus. Aut aut et est qui cumque. Numquam ducimus quia sed amet ipsam quia qui hic. Ipsa error est laboriosam beatae omnis laborum eaque. Nobis est dicta qui culpa in qui eius repellat.','Tenetur laudantium quia. Voluptate et ratione rerum ipsum omnis omnis. Sed similique sit. Et et cumque aut distinctio delectus ipsum possimus. Nihil sed tenetur est adipisci esse.','http://lorempixel.com/900/400/abstract','page','draft','eum-nostrum-explicabo-voluptatem-dolor-voluptatem-est-dicta','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(9,'Dicta dolorum amet et ab cumque voluptas vitae deleniti enim.','Dicta ea a dolorem voluptas. Quas praesentium fugiat. Quis aliquam quasi commodi sunt quae. Neque saepe vel deleniti quo tenetur velit provident quia dolores.\n \rPlaceat id unde consequatur. Dolor natus placeat temporibus vel eos aut consectetur exercitationem officia. Et aliquam voluptatum accusamus accusamus. In et ullam. Ipsam beatae aliquid. Vel sed sint.\n \rPlaceat exercitationem sunt fugiat aut necessitatibus aspernatur ratione placeat assumenda. Earum laborum qui quae ea temporibus et illum. Ullam rerum placeat necessitatibus dolor atque est. Aut quisquam eius dolorem blanditiis est repellendus. Architecto et itaque laudantium exercitationem minima corrupti.\n \rEt et dolor. Quia aut blanditiis. Quia praesentium nam ipsum corporis nemo. Laborum vel et ut reprehenderit.\n \rDolores molestiae laboriosam dolores aut sint. Non incidunt porro in corrupti numquam rem ipsum perferendis. Et et saepe non officiis quos. Quaerat expedita dolorum enim est et eveniet dignissimos.\n \rSed et rem optio rerum dolore distinctio. Veritatis et sed vel explicabo eum ut et. Illum et architecto aut rerum. Quisquam et nam libero modi.','Explicabo vitae vero saepe possimus debitis non et ab. Est dolorem ut possimus enim vel explicabo. Totam similique est esse quod. Molestiae nisi officiis expedita nostrum.','http://lorempixel.com/900/400/abstract','post','draft','dicta-dolorum-amet-et-ab-cumque-voluptas-vitae-deleniti-enim','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(10,'Ab minus nihil animi excepturi molestias vel.','Sint repellat voluptatem molestias animi corrupti. Pariatur quia sint sit voluptatibus autem perspiciatis. Omnis eos molestiae perspiciatis dolor.\n \rUt est quasi ad. Eum ducimus voluptatem. Odio fuga vel perferendis. Voluptatem occaecati consectetur corporis ea. Libero praesentium et quia veniam itaque mollitia quos et.\n \rLaborum ipsum iure molestiae. Architecto ipsum eum dolores fugiat consequuntur nihil quibusdam itaque. Cupiditate repudiandae vero neque. Nulla expedita provident.\n \rMolestias animi quas. Libero ipsam occaecati tempore praesentium fuga. Non suscipit sunt. Quod minima sapiente.\n \rUt officiis dolorum id sunt. Et earum sunt. Omnis similique quasi eaque. Aliquam aut rerum reiciendis quo pariatur eligendi voluptas ab. Deserunt vitae quas totam animi et quis velit. Est ex est.\n \rNisi explicabo debitis officia dolorem aut esse laborum corrupti explicabo. Voluptas alias labore debitis aut non atque maxime praesentium deleniti. Eaque maiores libero quisquam nemo quia. Nobis nihil rem et consequatur.','Quam quae laborum sapiente facilis mollitia commodi cumque eveniet. Neque at temporibus. Aliquid vel dolore repellat quia sed. Iusto eos labore laboriosam et sed facere voluptas. Ut perspiciatis in et consequatur possimus repellendus alias.','http://lorempixel.com/900/400/abstract','page','draft','ab-minus-nihil-animi-excepturi-molestias-vel','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(11,'Officiis dolorem et id incidunt.','Vel velit sint dolores eveniet est libero pariatur quis. Eum nisi sit numquam quo est et nesciunt aut quo. Qui officia debitis est eius voluptatem accusantium velit minus.\n \rEnim omnis voluptatem laudantium velit ea voluptatem ipsum. Molestias totam in harum. Et totam odio officia id. Laudantium est nulla quam itaque harum. Occaecati eum eos.\n \rNatus eum repellat et qui odio enim hic et commodi. Autem perferendis et fugiat aut facere quidem. A porro laborum voluptatem. Minima vitae rem ex quasi et eveniet consequatur aut amet.\n \rUt sunt et vel voluptas officia et aspernatur sed. Ut nihil nihil ut ipsa et occaecati. Fuga reprehenderit omnis quos. Dolores esse consequatur blanditiis assumenda magnam.\n \rEt doloribus omnis voluptas vel. Doloremque harum asperiores sunt laborum esse consectetur. Dolores recusandae qui ut delectus quaerat animi. Voluptate blanditiis aliquam non quibusdam repellat sed amet odio dolor. Ut molestias officia quia aut maxime ab omnis cupiditate eligendi. Cum nobis velit facere recusandae voluptatibus.\n \rEt unde quia pariatur quos nostrum rem consequatur et officia. Veniam consequatur aliquam commodi neque sunt debitis provident. Sed ab in nihil qui in enim nemo quia facilis. Adipisci similique pariatur a est. Ut nesciunt ea sit rerum.','Occaecati sed minima sed voluptas tempora et mollitia dicta. Deserunt libero reiciendis praesentium ut unde rerum eveniet. Enim eaque magni. Exercitationem quisquam et quo nihil aut eaque in dolor.','http://lorempixel.com/900/400/abstract','page','draft','officiis-dolorem-et-id-incidunt','2017-03-25 16:16:05','2017-03-25 16:16:05',1),(12,'Voluptas corrupti error nemo magni dolorem et atque architecto.','Et similique enim aut necessitatibus nihil. Rerum ex perspiciatis et alias. Voluptatum incidunt illo. Magni quaerat quia. Qui quasi a officiis quam.\n \rNihil ad ut illo repellendus eos. Est nemo cupiditate ad quae labore id voluptatem. Nulla exercitationem laborum officia sed sequi et asperiores architecto ad.\n \rIn facere consectetur sint soluta. Autem vitae quae officiis fuga eos. Suscipit pariatur eius sunt officia atque iure nesciunt enim quos.\n \rMolestias accusantium atque sequi iure impedit laboriosam laborum. Veritatis excepturi ut enim sed vero consequatur maxime. Incidunt repellendus sed minima ab beatae tempora dolor et beatae. Cum sit ut.\n \rLibero reiciendis expedita. Sint est quos aliquid nobis. Ut voluptas et facilis aut praesentium.\n \rRem nemo non laudantium illum nesciunt. Fugiat et quasi. Distinctio deleniti et ut itaque. Quia recusandae porro sed. Perspiciatis in sint consectetur officiis minus est. Porro accusantium nisi voluptatem porro vero error velit est.','Laudantium dolorum repudiandae rerum placeat quia dolores incidunt ea consequuntur. Omnis et magnam et quisquam itaque possimus dolor veritatis. Illo vel error ut nam inventore aut ut.','http://lorempixel.com/900/400/abstract','post','draft','voluptas-corrupti-error-nemo-magni-dolorem-et-atque-architecto','2017-03-25 16:16:05','2017-03-25 16:16:05',1);
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `taxonomies`
--

DROP TABLE IF EXISTS `taxonomies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `taxonomies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `taxonomies`
--

LOCK TABLES `taxonomies` WRITE;
/*!40000 ALTER TABLE `taxonomies` DISABLE KEYS */;
INSERT INTO `taxonomies` VALUES (1,'reiciendis','post_tag','2017-03-25 16:16:05','2017-03-25 16:16:05'),(2,'ea','post_category','2017-03-25 16:16:05','2017-03-25 16:16:05'),(3,'sint','post_tag','2017-03-25 16:16:05','2017-03-25 16:16:05'),(4,'aliquid','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(5,'error','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(6,'corporis','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(7,'qui','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(8,'voluptate','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(9,'et','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(10,'non','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(11,'doloremque','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(12,'odio','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(13,'quaerat','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(14,'et','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(15,'ipsa','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(16,'quam','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(17,'neque','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(18,'similique','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(19,'asperiores','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(20,'possimus','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(21,'sit','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(22,'in','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(23,'dicta','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(24,'cumque','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(25,'possimus','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(26,'enim','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(27,'quia','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(28,'et','post_category','2017-03-25 16:16:06','2017-03-25 16:16:06'),(29,'occaecati','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(30,'ducimus','post_tag','2017-03-25 16:16:06','2017-03-25 16:16:06'),(31,'error','post_category','2017-03-25 16:18:43','2017-03-25 16:18:43'),(32,'testing','post_category','2017-03-25 16:18:43','2017-03-25 16:18:43');
/*!40000 ALTER TABLE `taxonomies` ENABLE KEYS */;
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
