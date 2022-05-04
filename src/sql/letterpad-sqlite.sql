BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "Author" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"username"	TEXT NOT NULL,
	"email"	TEXT NOT NULL,
	"password"	TEXT NOT NULL,
	"bio"	TEXT NOT NULL,
	"occupation"	TEXT NOT NULL,
	"company_name"	TEXT NOT NULL,
	"avatar"	TEXT NOT NULL,
	"social"	TEXT NOT NULL DEFAULT '{}',
	"verified"	BOOLEAN NOT NULL DEFAULT false,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	"verify_attempt_left"	INTEGER DEFAULT 3,
	"analytics_id"	INTEGER,
	"analytics_uuid"	TEXT,
	"role_id"	INTEGER NOT NULL,
	"login_type"	TEXT NOT NULL DEFAULT 'credentials',
	"last_seen"	DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Author_role_id_fkey" FOREIGN KEY("role_id") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "EmailDelivery" (
	"id"	INTEGER NOT NULL,
	"template_id"	TEXT,
	"author_id"	INTEGER,
	"post_id"	INTEGER,
	"subscriber_id"	INTEGER,
	"delivered"	INTEGER,
	"last_delivery_attempt"	DATETIME,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Email" (
	"template_id"	TEXT NOT NULL,
	"subject"	TEXT NOT NULL,
	"body"	TEXT NOT NULL,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	PRIMARY KEY("template_id")
);
CREATE TABLE IF NOT EXISTS "Permission" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Post" (
	"id"	INTEGER NOT NULL,
	"title"	TEXT NOT NULL DEFAULT '',
	"html"	TEXT NOT NULL DEFAULT '',
	"html_draft"	TEXT NOT NULL DEFAULT '',
	"excerpt"	TEXT NOT NULL DEFAULT '',
	"cover_image"	TEXT NOT NULL DEFAULT '',
	"cover_image_width"	INTEGER NOT NULL DEFAULT 0,
	"cover_image_height"	INTEGER NOT NULL DEFAULT 0,
	"type"	TEXT NOT NULL DEFAULT 'post',
	"featured"	BOOLEAN NOT NULL DEFAULT false,
	"status"	TEXT NOT NULL DEFAULT 'draft',
	"slug"	TEXT NOT NULL DEFAULT '',
	"reading_time"	TEXT NOT NULL DEFAULT '',
	"publishedAt"	DATETIME,
	"scheduledAt"	DATETIME,
	"updatedAt"	DATETIME,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"author_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Post_author_id_fkey" FOREIGN KEY("author_id") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "RolePermissions" (
	"id"	INTEGER NOT NULL,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	"role_id"	INTEGER NOT NULL,
	"permission_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "RolePermissions_permission_id_fkey" FOREIGN KEY("permission_id") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	CONSTRAINT "RolePermissions_role_id_fkey" FOREIGN KEY("role_id") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Role" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "Setting" (
	"id"	INTEGER NOT NULL,
	"site_title"	TEXT NOT NULL,
	"site_tagline"	TEXT NOT NULL,
	"site_email"	TEXT NOT NULL,
	"site_url"	TEXT NOT NULL,
	"site_footer"	TEXT NOT NULL,
	"site_description"	TEXT NOT NULL,
	"subscribe_embed"	TEXT NOT NULL,
	"social_twitter"	TEXT NOT NULL,
	"social_facebook"	TEXT NOT NULL,
	"social_instagram"	TEXT NOT NULL,
	"social_github"	TEXT NOT NULL,
	"display_author_info"	BOOLEAN NOT NULL DEFAULT false,
	"cloudinary_key"	TEXT NOT NULL,
	"cloudinary_name"	TEXT NOT NULL,
	"cloudinary_secret"	TEXT NOT NULL,
	"menu"	TEXT NOT NULL DEFAULT '[]',
	"css"	TEXT NOT NULL,
	"google_analytics"	TEXT NOT NULL,
	"analytics"	TEXT NOT NULL DEFAULT '{}',
	"theme"	TEXT NOT NULL,
	"client_token"	TEXT NOT NULL,
	"banner"	TEXT NOT NULL DEFAULT '{}',
	"site_logo"	TEXT NOT NULL DEFAULT '{}',
	"site_favicon"	TEXT NOT NULL DEFAULT '{}',
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	"graphcomment_id"	TEXT NOT NULL DEFAULT '',
	"intro_dismissed"	BOOLEAN NOT NULL,
	"show_about_page"	BOOLEAN NOT NULL DEFAULT true,
	"show_tags_page"	BOOLEAN NOT NULL DEFAULT false,
	"author_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Setting_author_id_fkey" FOREIGN KEY("author_id") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Subscriber" (
	"id"	INTEGER NOT NULL,
	"email"	TEXT NOT NULL,
	"author_id"	INTEGER NOT NULL,
	"verified"	BOOLEAN NOT NULL DEFAULT false,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	"verify_attempt_left"	INTEGER DEFAULT 3,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Subscriber_author_id_fkey" FOREIGN KEY("author_id") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Tag" (
	"name"	TEXT NOT NULL,
	"desc"	TEXT DEFAULT '',
	"slug"	TEXT,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	PRIMARY KEY("name")
);
CREATE TABLE IF NOT EXISTS "Upload" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"url"	TEXT NOT NULL,
	"width"	INTEGER NOT NULL,
	"height"	INTEGER NOT NULL,
	"description"	TEXT NOT NULL DEFAULT '',
	"updatedAt"	DATETIME,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"author_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Upload_author_id_fkey" FOREIGN KEY("author_id") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "Domain" (
	"id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"mapped"	BOOLEAN NOT NULL DEFAULT false,
	"ssl"	BOOLEAN NOT NULL,
	"updatedAt"	DATETIME,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"author_id"	INTEGER NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "Domain_author_id_fkey" FOREIGN KEY("author_id") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS "SubscribersDelivery" (
	"id"	INTEGER NOT NULL,
	"subscriber_id"	TEXT,
	"post_id"	INTEGER NOT NULL,
	"delivered"	BOOLEAN NOT NULL,
	"createdAt"	DATETIME DEFAULT CURRENT_TIMESTAMP,
	"updatedAt"	DATETIME,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "_PostToTag" (
	"A"	INTEGER NOT NULL,
	"B"	TEXT NOT NULL,
	FOREIGN KEY("A") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE,
	FOREIGN KEY("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "Author" ("id","name","username","email","password","bio","occupation","company_name","avatar","social","verified","createdAt","updatedAt","verify_attempt_left","analytics_id","analytics_uuid","role_id","login_type","last_seen") VALUES (1,'Admin','admin','admin@admin.com','$2a$12$uNODJKnjN4VKjxfKPxXs3uY4y5c2Lm6RXuDKbLy7W6w0VLc7XiE4i','','','','','{"twitter":"","facebook":"","github":"","instagram":""}',1,1651493378494,1651493378525,3,NULL,NULL,1,'credentials',NULL),
 (2,'Demo Author','demo','demo@demo.com','$2a$12$mNm0.zKV2bIdffBb9Mu9HeYLs/g88V/Ien/I7WlXR3mipmMBIqI42','You can write some information about yourself for the world to know you a little better.','Principal Engineer @ Ajaxtown','Letterpad','https://images.unsplash.com/photo-1572478465144-f5f6573e8bfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80','{"twitter":"https://twitter.com","facebook":"https://facebook.com","github":"https://github.com","instagram":"https://instagram.com","linkedin":"https://linkedin.com"}',1,1651493384204,1651493384210,3,NULL,NULL,2,'credentials',NULL);
INSERT INTO "Permission" ("id","name","createdAt","updatedAt") VALUES (1,'MANAGE_OWN_POSTS',1651493374467,1651493374467),
 (2,'READ_ONLY_POSTS',1651493374468,1651493374468),
 (3,'MANAGE_USERS',1651493374474,1651493374474),
 (4,'MANAGE_ALL_POSTS',1651493374473,1651493374473),
 (5,'MANAGE_SETTINGS',1651493374476,1651493374476);
INSERT INTO "Post" ("id","title","html","html_draft","excerpt","cover_image","cover_image_width","cover_image_height","type","featured","status","slug","reading_time","publishedAt","scheduledAt","updatedAt","createdAt","author_id") VALUES (1,'Another sunny day','<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>
<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>
<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>
<blockquote>
  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>
</blockquote>
<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>
<blockquote>
  <p>The first menu item in the navigation menu will always be Home.</p>
</blockquote>
<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>
<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href="https://github.com/letterpad/letterpad">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href="https://twitter.com/letterpad_cms">https://twitter.com/letterpad_cms</a>.</p>
<p>Thank you,</p>
<p>Letterpad Team</p>','','You can use this space to write a small description about the topic. This will be helpful in SEO.','https://images.unsplash.com/photo-1502134249126-9f3755a50d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDEzfHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU0OTU&ixlib=rb-1.2.1&q=80&w=1080',100,100,'post',0,'published','another-sunny-day','5 mins',1651486184000,NULL,1651493384317,1651493384303,2),
 (2,'A walk through time','<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>
<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>
<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>
<blockquote>
  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>
</blockquote>
<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>
<blockquote>
  <p>The first menu item in the navigation menu will always be Home.</p>
</blockquote>
<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>
<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href="https://github.com/letterpad/letterpad">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href="https://twitter.com/letterpad_cms">https://twitter.com/letterpad_cms</a>.</p>
<p>Thank you,</p>
<p>Letterpad Team</p>','','You can use this space to write a small description about the topic. This will be helpful in SEO.','https://images.unsplash.com/photo-1497294815431-9365093b7331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDM1fHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU4MjU&ixlib=rb-1.2.1&q=80&w=1080',100,100,'post',0,'published','a-walk-through-time','5 mins',1651486184000,NULL,1651493384577,1651493384574,2),
 (3,'Magical moments','<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>
<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>
<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>
<blockquote>
  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>
</blockquote>
<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>
<blockquote>
  <p>The first menu item in the navigation menu will always be Home.</p>
</blockquote>
<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>
<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href="https://github.com/letterpad/letterpad">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href="https://twitter.com/letterpad_cms">https://twitter.com/letterpad_cms</a>.</p>
<p>Thank you,</p>
<p>Letterpad Team</p>','','You can use this space to write a small description about the topic. This will be helpful in SEO.','https://images.unsplash.com/photo-1538370965046-79c0d6907d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDYyfHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU4MzM&ixlib=rb-1.2.1&q=80&w=1080',100,100,'post',0,'published','magical-moments','5 mins',1651486184000,NULL,1651493384597,1651493384593,2),
 (4,'Letterpad Typography','<p>You may choose to use markdown or the inline editing toolbars for writing text. The toolbar can be found by writing a text and selecting it or by clicking the + icon on every new line. </p>
<h1 id="h1heading1">h1 Heading 1</h1>
<h2 id="h2heading">h2 Heading</h2>
<h3 id="h3heading">h3 Heading</h3>
<h4 id="h4heading">h4 Heading</h4>
<h5 id="h5heading">h5 Heading</h5>
<h6 id="h6heading">h6 Heading</h6>
<h2 id="horizontalrules">Horizontal Rules</h2>
<hr />
<h1 id="emphasis">Emphasis</h1>
<p><strong>This is bold text</strong></p>
<p><strong>This is underlined text</strong></p>
<p><em>This is italic text</em></p>
<p>~~Strikethrough~~</p>
<hr />
<h2 id="blockquotes">Blockquotes</h2>
<blockquote>
  <p>The blockquote element is used to indicate the quotation of a large section of text from another source.</p>
</blockquote>
<hr />
<h2 id="lists">Lists</h2>
<ul>
<li>Create a list by starting a line with +, - or * followed by a space.</li>
<li>Sub-lists are made by tab:<ul>
<li>Marker character change forces new list start:</li>
<li>Ac tristique libero volutpat at</li>
<li>Facilisis in pretium nisl aliquet</li>
<li>Nulla volutpat aliquam velit</li></ul></li>
<li>Very easy!</li>
</ul>
<h2 id="code">Code</h2>
<p>Inline <code>code</code> can be written by wrapping the text inside backticks `.</p>
<p>You can write codeblock with syntax highlighting by two backticks.</p>
<pre><code class="javascript language-javascript">// Some comments
var a = 1;
var b = 2;
var sum = a + b;
cosnole.log(sum); // 3
</code></pre>
<hr />
<h2 id="embeds">Embeds</h2>
<p>You can embed spotify, youtube and gist links by just pasting the link.</p>
<p><a href="https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58">https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58</a></p>
<h2 id="links">Links</h2>
<p>You can wrap <a href="http://google.com">certain text with link</a> or just have the url <a href="http://google.com">http://google.com</a> which will automatically convert into a link.</p>
<h2 id="images">Images</h2>
<p><img src="https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1789&q=80" alt="Smoky morning in Cascades" /></p>','','You can use this space to write a small description about the topic. This will be helpful in SEO.','https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80',100,100,'page',0,'published','letterpad-typography','5 mins',1651486184000,NULL,1651493384616,1651493384613,2);
INSERT INTO "RolePermissions" ("id","createdAt","updatedAt","role_id","permission_id") VALUES (1,1651493374602,1651493374602,1,1),
 (2,1651493374603,1651493374603,3,4),
 (3,1651493374604,1651493374604,2,1),
 (4,1651493374603,1651493374603,1,5),
 (5,1651493374603,1651493374603,4,2),
 (6,1651493374604,1651493374604,1,3),
 (7,1651493374603,1651493374603,1,2),
 (8,1651493374603,1651493374603,1,4);
INSERT INTO "Role" ("id","name","createdAt","updatedAt") VALUES (1,'ADMIN',1651493374488,1651493374488),
 (2,'AUTHOR',1651493374500,1651493374500),
 (3,'REVIEWER',1651493374564,1651493374564),
 (4,'READER',1651493374575,1651493374575);
INSERT INTO "Setting" ("id","site_title","site_tagline","site_email","site_url","site_footer","site_description","subscribe_embed","social_twitter","social_facebook","social_instagram","social_github","display_author_info","cloudinary_key","cloudinary_name","cloudinary_secret","menu","css","google_analytics","analytics","theme","client_token","banner","site_logo","site_favicon","createdAt","updatedAt","graphcomment_id","intro_dismissed","show_about_page","show_tags_page","author_id") VALUES (1,'Admin Account','My space','admin@letterpad.app','https://admin.letterpad.app','Letterpad is an open source project licensed under MIT.','Use this space to describe your blog.','','','','','',1,'','','','[{"label":"home","original_name":"home","slug":"first-post","type":"tag"},{"label":"Page","original_name":"Page","slug":"letterpad-typography","type":"page"}]','','UA-120251616-1','{}','minimal','YWRtaW5AYWRtaW4uY29tNmdFeFhIYkgzTU1UYUZueWRkNGt2c2NEN1pDNlRDN1c=','{}','{"src":"https://letterpad.app/admin/uploads/logo.png","width":200,"height":200}','{"src":"https://letterpad.app/admin/uploads/logo.png","width":200,"height":200}',1651493378494,1651493378495,'',0,1,1,1),
 (2,'Demo Account','Hello, I am letterpad','admin@letterpad.app','https://demo.letterpad.app','Letterpad is an open source project licensed under MIT.','Use this space to describe your blog.','','','','','',1,'','','','[{"label":"home","original_name":"home","slug":"first-post","type":"tag"},{"label":"Page","original_name":"Page","slug":"letterpad-typography","type":"page"}]','','UA-120251616-1','{}','minimal','ZGVtb0BkZW1vLmNvbTZnRXhYSGJIM01NVGFGbnlkZDRrdnNjRDdaQzZUQzdX','{}','{"src":"https://letterpad.app/admin/uploads/logo.png","width":200,"height":200}','{"src":"https://letterpad.app/admin/uploads/logo.png","width":200,"height":200}',1651493384204,1651493384205,'',0,1,1,2);
INSERT INTO "Tag" ("name","desc","slug","createdAt","updatedAt") VALUES ('Home','','home',1651493384316,1651493384317),
 ('first-post','','first-post',1651493384316,1651493384317);
INSERT INTO "_PostToTag" ("A","B") VALUES (1,'Home'),
 (1,'first-post'),
 (2,'Home'),
 (2,'first-post'),
 (3,'Home'),
 (3,'first-post');
CREATE UNIQUE INDEX IF NOT EXISTS "Author_username_key" ON "Author" (
	"username"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Author_email_key" ON "Author" (
	"email"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Email_template_id_key" ON "Email" (
	"template_id"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Permission_name_key" ON "Permission" (
	"name"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Role_name_key" ON "Role" (
	"name"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Setting_author_id_key" ON "Setting" (
	"author_id"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Subscriber_email_author_id_key" ON "Subscriber" (
	"email",
	"author_id"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Tag_name_key" ON "Tag" (
	"name"
);
CREATE UNIQUE INDEX IF NOT EXISTS "Domain_author_id_key" ON "Domain" (
	"author_id"
);
CREATE UNIQUE INDEX IF NOT EXISTS "_PostToTag_AB_unique" ON "_PostToTag" (
	"A",
	"B"
);
CREATE INDEX IF NOT EXISTS "_PostToTag_B_index" ON "_PostToTag" (
	"B"
);
COMMIT;
