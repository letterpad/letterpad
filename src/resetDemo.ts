const env = require("node-env-file");
env(__dirname + "/../.env.development.local");

import { startImport } from "./pages/api/import";

const data = {
  authors: {
    "demo@demo.com": {
      id: 2,
      name: "Demo Author",
      username: "demo",
      email: "demo@demo.com",
      password: "$2a$12$0lhlrREBbBqdsYA5TdKkBeFfJLOboyhBS02HBcSSgFrF7VANiE1mO",
      bio: "You can some information about yourself for the world to know you a little better.",
      avatar:
        "https://images.unsplash.com/photo-1572478465144-f5f6573e8bfd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=120&q=80",
      social:
        '{"twitter":"https://twitter.com","facebook":"https://facebook.com","github":"https://github.com","instagram":"https://instagram.com"}',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      verify_attempt_left: 3,
      role_id: 2,
      posts: [
        {
          id: 1,
          title: "Another sunny day",
          html: '<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>\n<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>\n<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>\n<blockquote>\n  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>\n</blockquote>\n<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>\n<blockquote>\n  <p>The first menu item in the navigation menu will always be Home.</p>\n</blockquote>\n<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>\n<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href="https://github.com/letterpad/letterpad">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href="https://twitter.com/letterpad_cms">https://twitter.com/letterpad_cms</a>.</p>\n<p>Thank you,</p>\n<p>Letterpad Team</p>',
          html_draft: "",
          excerpt:
            "You can use this space to write a small description about the topic. This will be helpful in SEO.",
          cover_image:
            "https://images.unsplash.com/photo-1502134249126-9f3755a50d78?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDEzfHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU0OTU&ixlib=rb-1.2.1&q=80&w=1080",
          cover_image_width: 100,
          cover_image_height: 100,
          type: "post",
          featured: false,
          status: "published",
          slug: "another-sunny-day",
          reading_time: "5 mins",
          publishedAt: new Date(),
          scheduledAt: null,
          updatedAt: new Date(),
          createdAt: new Date(),
          author_id: 2,
          tags: [
            {
              name: "Home",
              desc: "",
              slug: "home",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              name: "first-post",
              desc: "",
              slug: "first-post",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: 2,
          title: "A walk through time",
          html: '<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>\n<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>\n<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>\n<blockquote>\n  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>\n</blockquote>\n<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>\n<blockquote>\n  <p>The first menu item in the navigation menu will always be Home.</p>\n</blockquote>\n<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>\n<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href="https://github.com/letterpad/letterpad">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href="https://twitter.com/letterpad_cms">https://twitter.com/letterpad_cms</a>.</p>\n<p>Thank you,</p>\n<p>Letterpad Team</p>',
          html_draft: "",
          excerpt:
            "You can use this space to write a small description about the topic. This will be helpful in SEO.",
          cover_image:
            "https://images.unsplash.com/photo-1497294815431-9365093b7331?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDM1fHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU4MjU&ixlib=rb-1.2.1&q=80&w=1080",
          cover_image_width: 100,
          cover_image_height: 100,
          type: "post",
          featured: false,
          status: "published",
          slug: "a-walk-through-time",
          reading_time: "5 mins",
          publishedAt: new Date(),
          scheduledAt: null,
          updatedAt: new Date(),
          createdAt: new Date(),
          author_id: 2,
          tags: [
            {
              name: "Home",
              desc: "",
              slug: "home",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              name: "first-post",
              desc: "",
              slug: "first-post",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: 3,
          title: "Magical moments",
          html: '<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>\n<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>. </p>\n<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>\n<blockquote>\n  <p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item. </p>\n</blockquote>\n<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. </p>\n<blockquote>\n  <p>The first menu item in the navigation menu will always be Home.</p>\n</blockquote>\n<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>\n<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href="https://github.com/letterpad/letterpad">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href="https://twitter.com/letterpad_cms">https://twitter.com/letterpad_cms</a>.</p>\n<p>Thank you,</p>\n<p>Letterpad Team</p>',
          html_draft:
            '<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>\n<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>.</p>\n<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>\n<blockquote>\n<p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item.</p>\n</blockquote>\n<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be.</p>\n<blockquote>\n<p>The first menu item in the navigation menu will always be Home.</p>\n</blockquote>\n<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>\n<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href="https://github.com/letterpad/letterpad">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href="https://twitter.com/letterpad_cms">https://twitter.com/letterpad_cms</a>.</p>\n<p>Thank you,</p>\n<p>Letterpad Team</p>',
          excerpt:
            "You can use this space to write a small description about the topic. This will be helpful in SEO.",
          cover_image:
            "https://images.unsplash.com/photo-1538370965046-79c0d6907d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzMTU3NnwwfDF8c2VhcmNofDYyfHxzcGFjZXxlbnwwfHx8fDE2NDAwMTU4MzM&ixlib=rb-1.2.1&q=80&w=1080",
          cover_image_width: 100,
          cover_image_height: 100,
          type: "post",
          featured: false,
          status: "published",
          slug: "magical-moments",
          reading_time: "5 mins",
          publishedAt: new Date(),
          scheduledAt: null,
          updatedAt: new Date(),
          createdAt: new Date(),
          author_id: 2,
          tags: [
            {
              name: "Home",
              desc: "",
              slug: "home",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
            {
              name: "first-post",
              desc: "",
              slug: "first-post",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
        {
          id: 4,
          title: "Letterpad Typography",
          html: '<p>You may choose to use markdown or the inline editing toolbars for writing text. The toolbar can be found by writing a text and selecting it or by clicking the + icon on every new line. </p>\n<h1 id="h1heading1">h1 Heading 1</h1>\n<h2 id="h2heading">h2 Heading</h2>\n<h3 id="h3heading">h3 Heading</h3>\n<h4 id="h4heading">h4 Heading</h4>\n<h5 id="h5heading">h5 Heading</h5>\n<h6 id="h6heading">h6 Heading</h6>\n<h2 id="horizontalrules">Horizontal Rules</h2>\n<hr />\n<h1 id="emphasis">Emphasis</h1>\n<p><strong>This is bold text</strong></p>\n<p><strong>This is underlined text</strong></p>\n<p><em>This is italic text</em></p>\n<p>~~Strikethrough~~</p>\n<hr />\n<h2 id="blockquotes">Blockquotes</h2>\n<blockquote>\n  <p>The blockquote element is used to indicate the quotation of a large section of text from another source.</p>\n</blockquote>\n<hr />\n<h2 id="lists">Lists</h2>\n<ul>\n<li>Create a list by starting a line with +, - or * followed by a space.</li>\n<li>Sub-lists are made by tab:<ul>\n<li>Marker character change forces new list start:</li>\n<li>Ac tristique libero volutpat at</li>\n<li>Facilisis in pretium nisl aliquet</li>\n<li>Nulla volutpat aliquam velit</li></ul></li>\n<li>Very easy!</li>\n</ul>\n<h2 id="code">Code</h2>\n<p>Inline <code>code</code> can be written by wrapping the text inside backticks `.</p>\n<p>You can write codeblock with syntax highlighting by two backticks.</p>\n<pre><code class="javascript language-javascript">// Some comments\nvar a = 1;\nvar b = 2;\nvar sum = a + b;\ncosnole.log(sum); // 3\n</code></pre>\n<hr />\n<h2 id="embeds">Embeds</h2>\n<p>You can embed spotify, youtube and gist links by just pasting the link.</p>\n<p><a href="https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58">https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58</a></p>\n<h2 id="links">Links</h2>\n<p>You can wrap <a href="http://google.com">certain text with link</a> or just have the url <a href="http://google.com">http://google.com</a> which will automatically convert into a link.</p>\n<h2 id="images">Images</h2>\n<p><img src="https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1789&q=80" alt="Smoky morning in Cascades" /></p>',
          html_draft: "",
          excerpt:
            "You can use this space to write a small description about the topic. This will be helpful in SEO.",
          cover_image:
            "https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1500&q=80",
          cover_image_width: 100,
          cover_image_height: 100,
          type: "page",
          featured: false,
          status: "published",
          slug: "letterpad-typography",
          reading_time: "5 mins",
          publishedAt: new Date(),
          scheduledAt: null,
          updatedAt: new Date(),
          createdAt: new Date(),
          author_id: 2,
          tags: [],
        },
      ],
      setting: {
        id: 2,
        site_title: "Demo Account",
        site_tagline: "Hello, I am letterpad",
        site_email: "admin@letterpad.app",
        site_url: "https://demo.letterpad.app",
        site_footer: "",
        site_description: "",
        subscribe_embed: "",
        social_twitter: "",
        social_facebook: "",
        social_instagram: "",
        social_github: "",
        display_author_info: true,
        cloudinary_key: "",
        cloudinary_name: "",
        cloudinary_secret: "",
        menu: '[{"label":"home","original_name":"home","slug":"first-post","type":"tag"},{"label":"Page","original_name":"Page","slug":"letterpad-typography","type":"page"}]',
        css: "",
        google_analytics: "UA-120251616-1",
        theme: "hugo",
        client_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRlbW9AZGVtby5jb20iLCJpYXQiOjE2NDUxODE0NjQsImV4cCI6MTY0NTE4MjA2NH0.RvsRMFfJGfHb4DK2J2mWlzKsv7G_mBGbwd-i6MCELk0",
        banner:
          '{"src":"https://images.unsplash.com/photo-1527176930608-09cb256ab504?w=2000&auto=format&lossless=true","width":1502,"height":900}',
        site_logo: '{"src":"/uploads/logo.png","width":200,"height":200}',
        site_favicon: '{"src":"/uploads/logo.png","width":200,"height":200}',
        createdAt: new Date(),
        updatedAt: new Date(),
        graphcomment_id: "",
        intro_dismissed: false,
        author_id: 2,
      },
      subscribers: [],
      uploads: [],
    },
  },
};

async function resetDemo() {
  try {
    await startImport(data["authors"], false);
  } catch (e) {
    console.log(e);
  }
}

setInterval(resetDemo, 1000 * 60 * 60 * 12);
