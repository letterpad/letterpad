SET FOREIGN_KEY_CHECKS = 0;

-- CREATE DATABASE IF NOT EXISTS letterpad;
--
-- Table structure for table `_PostToTag`
--
DROP 
  TABLE IF EXISTS `_PostToTag`;
CREATE TABLE `_PostToTag` (
  `A` int NOT NULL, 
  `B` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  UNIQUE KEY `_PostToTag_AB_unique` (`A`, `B`), 
  KEY `_PostToTag_B_index` (`B`), 
  CONSTRAINT `_posttotag_ibfk_1` FOREIGN KEY (`A`) REFERENCES `Post` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, 
  CONSTRAINT `_posttotag_ibfk_2` FOREIGN KEY (`B`) REFERENCES `Tag` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `_PostToTag`
--
LOCK TABLES `_PostToTag` WRITE;
INSERT INTO `_PostToTag` 
VALUES 
  (1, 'first-post'), 
  (2, 'first-post'), 
  (3, 'first-post'), 
  (1, 'Home'), 
  (2, 'Home'), 
  (3, 'Home');
UNLOCK TABLES;
--
-- Table structure for table `Author`
--
DROP 
  TABLE IF EXISTS `Author`;
CREATE TABLE `Author` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `bio` text COLLATE utf8mb4_unicode_ci NOT NULL, 
  `occupation` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `company_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `avatar` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `social` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}', 
  `verified` tinyint(1) NOT NULL DEFAULT '0', 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  `verify_attempt_left` int DEFAULT '3', 
  `analytics_id` int DEFAULT NULL, 
  `analytics_uuid` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL, 
  `role_id` int NOT NULL, 
  `login_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'credentials', 
  `last_seen` datetime(3) DEFAULT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE KEY `Author_username_key` (`username`), 
  UNIQUE KEY `Author_email_key` (`email`), 
  KEY `Author_role_id_fkey` (`role_id`), 
  CONSTRAINT `Author_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Author`
--
LOCK TABLES `Author` WRITE;
INSERT INTO `Author` 
VALUES 
  (
    1, 'Admin', 'admin', 'admin@admin.com', 
    '$2a$12$86Ac4RXqVpRhQ3HlAE6eeu6DufSo9Dr1hYWYHpEatbXPxBB6wDYLG', 
    '', '', '', '', '{\"twitter\":\"\",\"facebook\":\"\",\"github\":\"\",\"instagram\":\"\"}', 
    1, '2022-04-29 08:07:11.547', '2022-04-29 08:07:11.576', 
    3, NULL, NULL, 1, 'credentials', NULL
  ), 
  (
    2, 'Demo Author', 'demo', 'demo@demo.com', 
    '$2a$12$GitFEguMMCgF7kLaHI9FluJkUX9FZljmQmslQJ4vB0y/IfX9fBfbC', 
    'You can write some information about yourself for the world to know you a little better.', 
    'Principal Engineer @ Ajaxtown', 
    'Letterpad', 'https://images.unsplash.com/photo-1572478465144-f5f6573e8bfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80', 
    '{\"twitter\":\"https://twitter.com\",\"facebook\":\"https://facebook.com\",\"github\":\"https://github.com\",\"instagram\":\"https://instagram.com\",\"linkedin\":\"https://linkedin.com\"}', 
    1, '2022-04-29 08:07:12.267', '2022-04-29 08:07:12.308', 
    3, NULL, NULL, 2, 'credentials', NULL
  );
UNLOCK TABLES;
--
-- Table structure for table `Domain`
--
DROP 
  TABLE IF EXISTS `Domain`;
CREATE TABLE `Domain` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `mapped` tinyint(1) NOT NULL DEFAULT '0', 
  `ssl` tinyint(1) NOT NULL, 
  `updatedAt` datetime(3) DEFAULT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `author_id` int NOT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE KEY `Domain_author_id_key` (`author_id`), 
  CONSTRAINT `Domain_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Author` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Domain`
--
LOCK TABLES `Domain` WRITE;
UNLOCK TABLES;
--
-- Table structure for table `Email`
--
DROP 
  TABLE IF EXISTS `Email`;
CREATE TABLE `Email` (
  `template_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `subject` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `body` varchar(4000) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  PRIMARY KEY (`template_id`), 
  UNIQUE KEY `Email_template_id_key` (`template_id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Email`
--
LOCK TABLES `Email` WRITE;
UNLOCK TABLES;
--
-- Table structure for table `EmailDelivery`
--
DROP 
  TABLE IF EXISTS `EmailDelivery`;
CREATE TABLE `EmailDelivery` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `template_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL, 
  `author_id` int DEFAULT NULL, 
  `post_id` int DEFAULT NULL, 
  `subscriber_id` int DEFAULT NULL, 
  `delivered` int DEFAULT NULL, 
  `last_delivery_attempt` datetime(3) DEFAULT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `EmailDelivery`
--
LOCK TABLES `EmailDelivery` WRITE;
UNLOCK TABLES;
--
-- Table structure for table `Permission`
--
DROP 
  TABLE IF EXISTS `Permission`;
CREATE TABLE `Permission` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE KEY `Permission_name_key` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Permission`
--
LOCK TABLES `Permission` WRITE;
INSERT INTO `Permission` 
VALUES 
  (
    1, 'MANAGE_ALL_POSTS', '2022-04-29 08:07:10.626', 
    '2022-04-29 08:07:10.628'
  ), 
  (
    2, 'MANAGE_USERS', '2022-04-29 08:07:10.626', 
    '2022-04-29 08:07:10.629'
  ), 
  (
    3, 'MANAGE_SETTINGS', '2022-04-29 08:07:10.629', 
    '2022-04-29 08:07:10.632'
  ), 
  (
    4, 'READ_ONLY_POSTS', '2022-04-29 08:07:10.627', 
    '2022-04-29 08:07:10.630'
  ), 
  (
    5, 'MANAGE_OWN_POSTS', '2022-04-29 08:07:10.627', 
    '2022-04-29 08:07:10.631'
  );
UNLOCK TABLES;
--
-- Table structure for table `Post`
--
DROP 
  TABLE IF EXISTS `Post`;
CREATE TABLE `Post` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '', 
  `html` text COLLATE utf8mb4_unicode_ci NOT NULL, 
  `html_draft` text COLLATE utf8mb4_unicode_ci, 
  `excerpt` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '', 
  `cover_image` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '', 
  `cover_image_width` int NOT NULL DEFAULT '0', 
  `cover_image_height` int NOT NULL DEFAULT '0', 
  `type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'post', 
  `featured` tinyint(1) NOT NULL DEFAULT '0', 
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'draft', 
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '', 
  `reading_time` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '', 
  `publishedAt` datetime(3) DEFAULT NULL, 
  `scheduledAt` datetime(3) DEFAULT NULL, 
  `updatedAt` datetime(3) DEFAULT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `author_id` int NOT NULL, 
  PRIMARY KEY (`id`), 
  KEY `Post_author_id_fkey` (`author_id`), 
  CONSTRAINT `Post_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Author` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Post`
--
LOCK TABLES `Post` WRITE;
INSERT INTO `Post` 
VALUES 
  (
    1, 'Another sunny day', '<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>\n<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>\n<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>\n<blockquote>\n  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>\n</blockquote>\n<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>\n<blockquote>\n  <p>The first menu item in the navigation menu will always be Home.</p>\n</blockquote>\n<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>\n<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href=\"https://github.com/letterpad/letterpad\">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href=\"https://twitter.com/letterpad_cms\">https://twitter.com/letterpad_cms</a>.</p>\n<p>Thank you,</p>\n<p>Letterpad Team</p>', 
    NULL, 'You can use this space to write a small description about the topic. This will be helpful in SEO.', 
    'https://images.unsplash.com/photo-1502134249126-9f3755a50d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDEzfHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU0OTU&ixlib=rb-1.2.1&q=80&w=1080', 
    100, 100, 'post', 0, 'published', 'another-sunny-day', 
    '5 mins', '2022-04-29 08:07:12.000', 
    NULL, '2022-04-29 08:07:12.497', 
    '2022-04-29 08:07:12.480', 2
  ), 
  (
    2, 'A walk through time', '<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>\n<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>\n<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>\n<blockquote>\n  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>\n</blockquote>\n<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>\n<blockquote>\n  <p>The first menu item in the navigation menu will always be Home.</p>\n</blockquote>\n<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>\n<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href=\"https://github.com/letterpad/letterpad\">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href=\"https://twitter.com/letterpad_cms\">https://twitter.com/letterpad_cms</a>.</p>\n<p>Thank you,</p>\n<p>Letterpad Team</p>', 
    NULL, 'You can use this space to write a small description about the topic. This will be helpful in SEO.', 
    'https://images.unsplash.com/photo-1497294815431-9365093b7331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDM1fHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU4MjU&ixlib=rb-1.2.1&q=80&w=1080', 
    100, 100, 'post', 0, 'published', 'a-walk-through-time', 
    '5 mins', '2022-04-29 08:07:12.000', 
    NULL, '2022-04-29 08:07:12.541', 
    '2022-04-29 08:07:12.538', 2
  ), 
  (
    3, 'Magical moments', '<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>\n<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>\n<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>\n<blockquote>\n  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>\n</blockquote>\n<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>\n<blockquote>\n  <p>The first menu item in the navigation menu will always be Home.</p>\n</blockquote>\n<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>\n<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href=\"https://github.com/letterpad/letterpad\">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href=\"https://twitter.com/letterpad_cms\">https://twitter.com/letterpad_cms</a>.</p>\n<p>Thank you,</p>\n<p>Letterpad Team</p>', 
    NULL, 'You can use this space to write a small description about the topic. This will be helpful in SEO.', 
    'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDYyfHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU4MzM&ixlib=rb-1.2.1&q=80&w=1080', 
    100, 100, 'post', 0, 'published', 'magical-moments', 
    '5 mins', '2022-04-29 08:07:12.000', 
    NULL, '2022-04-29 08:07:12.578', 
    '2022-04-29 08:07:12.571', 2
  ), 
  (
    4, 'Letterpad Typography', '<p>You may choose to use markdown or the inline editing toolbars for writing text. The toolbar can be found by writing a text and selecting it or by clicking the + icon on every new line. </p>\n<h1 id=\"h1heading1\">h1 Heading 1</h1>\n<h2 id=\"h2heading\">h2 Heading</h2>\n<h3 id=\"h3heading\">h3 Heading</h3>\n<h4 id=\"h4heading\">h4 Heading</h4>\n<h5 id=\"h5heading\">h5 Heading</h5>\n<h6 id=\"h6heading\">h6 Heading</h6>\n<h2 id=\"horizontalrules\">Horizontal Rules</h2>\n<hr />\n<h1 id=\"emphasis\">Emphasis</h1>\n<p><strong>This is bold text</strong></p>\n<p><strong>This is underlined text</strong></p>\n<p><em>This is italic text</em></p>\n<p>~~Strikethrough~~</p>\n<hr />\n<h2 id=\"blockquotes\">Blockquotes</h2>\n<blockquote>\n  <p>The blockquote element is used to indicate the quotation of a large section of text from another source.</p>\n</blockquote>\n<hr />\n<h2 id=\"lists\">Lists</h2>\n<ul>\n<li>Create a list by starting a line with +, - or * followed by a space.</li>\n<li>Sub-lists are made by tab:<ul>\n<li>Marker character change forces new list start:</li>\n<li>Ac tristique libero volutpat at</li>\n<li>Facilisis in pretium nisl aliquet</li>\n<li>Nulla volutpat aliquam velit</li></ul></li>\n<li>Very easy!</li>\n</ul>\n<h2 id=\"code\">Code</h2>\n<p>Inline <code>code</code> can be written by wrapping the text inside backticks `.</p>\n<p>You can write codeblock with syntax highlighting by two backticks.</p>\n<pre><code class=\"javascript language-javascript\">// Some comments\nvar a = 1;\nvar b = 2;\nvar sum = a + b;\ncosnole.log(sum); // 3\n</code></pre>\n<hr />\n<h2 id=\"embeds\">Embeds</h2>\n<p>You can embed spotify, youtube and gist links by just pasting the link.</p>\n<p><a href=\"https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58\">https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58</a></p>\n<h2 id=\"links\">Links</h2>\n<p>You can wrap <a href=\"http://google.com\">certain text with link</a> or just have the url <a href=\"http://google.com\">http://google.com</a> which will automatically convert into a link.</p>\n<h2 id=\"images\">Images</h2>\n<p><img src=\"https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1789&q=80\" alt=\"Smoky morning in Cascades\" /></p>', 
    NULL, 'You can use this space to write a small description about the topic. This will be helpful in SEO.', 
    'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80', 
    100, 100, 'page', 0, 'published', 'letterpad-typography', 
    '5 mins', '2022-04-29 08:07:12.000', 
    NULL, '2022-04-29 08:07:12.611', 
    '2022-04-29 08:07:12.608', 2
  );
UNLOCK TABLES;
--
-- Table structure for table `Role`
--
DROP 
  TABLE IF EXISTS `Role`;
CREATE TABLE `Role` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE KEY `Role_name_key` (`name`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Role`
--
LOCK TABLES `Role` WRITE;
INSERT INTO `Role` 
VALUES 
  (
    1, 'ADMIN', '2022-04-29 08:07:10.663', 
    '2022-04-29 08:07:10.664'
  ), 
  (
    2, 'AUTHOR', '2022-04-29 08:07:10.673', 
    '2022-04-29 08:07:10.674'
  ), 
  (
    3, 'REVIEWER', '2022-04-29 08:07:10.685', 
    '2022-04-29 08:07:10.686'
  ), 
  (
    4, 'READER', '2022-04-29 08:07:10.696', 
    '2022-04-29 08:07:10.698'
  );
UNLOCK TABLES;
--
-- Table structure for table `RolePermissions`
--
DROP 
  TABLE IF EXISTS `RolePermissions`;
CREATE TABLE `RolePermissions` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  `role_id` int NOT NULL, 
  `permission_id` int NOT NULL, 
  PRIMARY KEY (`id`), 
  KEY `RolePermissions_permission_id_fkey` (`permission_id`), 
  KEY `RolePermissions_role_id_fkey` (`role_id`), 
  CONSTRAINT `RolePermissions_permission_id_fkey` FOREIGN KEY (`permission_id`) REFERENCES `Permission` (`id`) ON DELETE CASCADE ON UPDATE CASCADE, 
  CONSTRAINT `RolePermissions_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `Role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 9 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `RolePermissions`
--
LOCK TABLES `RolePermissions` WRITE;
INSERT INTO `RolePermissions` 
VALUES 
  (
    1, '2022-04-29 08:07:10.736', '2022-04-29 08:07:10.738', 
    1, 4
  ), 
  (
    2, '2022-04-29 08:07:10.736', '2022-04-29 08:07:10.738', 
    1, 2
  ), 
  (
    3, '2022-04-29 08:07:10.739', '2022-04-29 08:07:10.740', 
    1, 3
  ), 
  (
    4, '2022-04-29 08:07:10.735', '2022-04-29 08:07:10.738', 
    1, 5
  ), 
  (
    5, '2022-04-29 08:07:10.740', '2022-04-29 08:07:10.740', 
    4, 4
  ), 
  (
    6, '2022-04-29 08:07:10.741', '2022-04-29 08:07:10.741', 
    2, 5
  ), 
  (
    7, '2022-04-29 08:07:10.742', '2022-04-29 08:07:10.743', 
    3, 1
  ), 
  (
    8, '2022-04-29 08:07:10.759', '2022-04-29 08:07:10.759', 
    1, 1
  );
UNLOCK TABLES;
--
-- Table structure for table `Setting`
--
DROP 
  TABLE IF EXISTS `Setting`;
CREATE TABLE `Setting` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `site_title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `site_tagline` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `site_email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `site_url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `site_footer` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `site_description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `subscribe_embed` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `social_twitter` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `social_facebook` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `social_instagram` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `social_github` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `display_author_info` tinyint(1) NOT NULL DEFAULT '0', 
  `cloudinary_key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `cloudinary_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `cloudinary_secret` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `menu` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '[]', 
  `css` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `google_analytics` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `analytics` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}', 
  `theme` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `client_token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `banner` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}', 
  `site_logo` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}', 
  `site_favicon` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '{}', 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  `graphcomment_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '', 
  `intro_dismissed` tinyint(1) NOT NULL, 
  `show_about_page` tinyint(1) NOT NULL DEFAULT '1', 
  `show_tags_page` tinyint(1) NOT NULL DEFAULT '0', 
  `author_id` int NOT NULL, 
  PRIMARY KEY (`id`), 
  UNIQUE KEY `Setting_author_id_key` (`author_id`), 
  CONSTRAINT `Setting_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Author` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 3 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Setting`
--
LOCK TABLES `Setting` WRITE;
INSERT INTO `Setting` 
VALUES 
  (
    1, 'Admin Account', 'My space', 'admin@letterpad.app', 
    'https://admin.letterpad.app', 
    'Letterpad is an open source project licensed under MIT.', 
    'Use this space to describe your blog.', 
    '', '', '', '', '', 1, '', '', '', '[{\"label\":\"home\",\"original_name\":\"home\",\"slug\":\"first-post\",\"type\":\"tag\"},{\"label\":\"Page\",\"original_name\":\"Page\",\"slug\":\"letterpad-typography\",\"type\":\"page\"}]', 
    '', 'UA-120251616-1', '{}', 'minimal', 
    'YWRtaW5AYWRtaW4uY29tNmdFeFhIYkgzTU1UYUZueWRkNGt2c2NEN1pDNlRDN1c=', 
    '{}', '{\"src\":\"https://letterpad.app/admin/uploads/logo.png\",\"width\":200,\"height\":200}', 
    '{\"src\":\"https://letterpad.app/admin/uploads/logo.png\",\"width\":200,\"height\":200}', 
    '2022-04-29 08:07:11.548', '2022-04-29 08:07:11.549', 
    '', 0, 1, 1, 1
  ), 
  (
    2, 'Demo Account', 'Hello, I am letterpad', 
    'admin@letterpad.app', 'https://demo.letterpad.app', 
    'Letterpad is an open source project licensed under MIT.', 
    'Use this space to describe your blog.', 
    '', '', '', '', '', 1, '', '', '', '[{\"label\":\"home\",\"original_name\":\"home\",\"slug\":\"first-post\",\"type\":\"tag\"},{\"label\":\"Page\",\"original_name\":\"Page\",\"slug\":\"letterpad-typography\",\"type\":\"page\"}]', 
    '', 'UA-120251616-1', '{}', 'minimal', 
    'ZGVtb0BkZW1vLmNvbTZnRXhYSGJIM01NVGFGbnlkZDRrdnNjRDdaQzZUQzdX', 
    '{}', '{\"src\":\"https://letterpad.app/admin/uploads/logo.png\",\"width\":200,\"height\":200}', 
    '{\"src\":\"https://letterpad.app/admin/uploads/logo.png\",\"width\":200,\"height\":200}', 
    '2022-04-29 08:07:12.267', '2022-04-29 08:07:12.269', 
    '', 0, 1, 1, 2
  );
UNLOCK TABLES;
--
-- Table structure for table `Subscriber`
--
DROP 
  TABLE IF EXISTS `Subscriber`;
CREATE TABLE `Subscriber` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `author_id` int NOT NULL, 
  `verified` tinyint(1) NOT NULL DEFAULT '0', 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  `verify_attempt_left` int DEFAULT '3', 
  PRIMARY KEY (`id`), 
  UNIQUE KEY `Subscriber_email_author_id_key` (`email`, `author_id`), 
  KEY `Subscriber_author_id_fkey` (`author_id`), 
  CONSTRAINT `Subscriber_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Author` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Subscriber`
--
LOCK TABLES `Subscriber` WRITE;
UNLOCK TABLES;
--
-- Table structure for table `SubscribersDelivery`
--
DROP 
  TABLE IF EXISTS `SubscribersDelivery`;
CREATE TABLE `SubscribersDelivery` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `subscriber_id` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL, 
  `post_id` int NOT NULL, 
  `delivered` tinyint(1) NOT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  PRIMARY KEY (`id`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `SubscribersDelivery`
--
LOCK TABLES `SubscribersDelivery` WRITE;
UNLOCK TABLES;
--
-- Table structure for table `Tag`
--
DROP 
  TABLE IF EXISTS `Tag`;
CREATE TABLE `Tag` (
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `desc` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT '', 
  `slug` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `updatedAt` datetime(3) DEFAULT NULL, 
  PRIMARY KEY (`name`), 
  UNIQUE KEY `Tag_name_key` (`name`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Tag`
--
LOCK TABLES `Tag` WRITE;
INSERT INTO `Tag` 
VALUES 
  (
    'first-post', '', 'first-post', '2022-04-29 08:07:12.496', 
    '2022-04-29 08:07:12.497'
  ), 
  (
    'Home', '', 'home', '2022-04-29 08:07:12.496', 
    '2022-04-29 08:07:12.497'
  );
UNLOCK TABLES;
--
-- Table structure for table `Upload`
--
DROP 
  TABLE IF EXISTS `Upload`;
CREATE TABLE `Upload` (
  `id` int NOT NULL AUTO_INCREMENT, 
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL, 
  `width` int NOT NULL, 
  `height` int NOT NULL, 
  `description` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '', 
  `updatedAt` datetime(3) DEFAULT NULL, 
  `createdAt` datetime(3) DEFAULT CURRENT_TIMESTAMP(3), 
  `author_id` int NOT NULL, 
  PRIMARY KEY (`id`), 
  KEY `Upload_author_id_fkey` (`author_id`), 
  CONSTRAINT `Upload_author_id_fkey` FOREIGN KEY (`author_id`) REFERENCES `Author` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;
--
-- Dumping data for table `Upload`
--
LOCK TABLES `Upload` WRITE;
UNLOCK TABLES;
SET FOREIGN_KEY_CHECKS = 1;