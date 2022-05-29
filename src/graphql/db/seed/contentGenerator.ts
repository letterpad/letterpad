import { NavigationType } from "@/__generated__/__types__";
import { mdToHtml } from "@/shared/converter";

export default function generatePost(type) {
  const post = {
    html: mdToHtml(postMd()),
  };
  const page = {
    html: mdToHtml(pageMd()),
  };

  const data = { post, page };
  return data[type];
}

// this is the thing that can be done in addition to the delay that has been caused by the problem in the later  part of the sysmtem faiule

function postMd() {
  return `
We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.

From the left side navigation menu, select posts and then click on **New** to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - **first-post**. 

You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.


> Tags help in grouping your posts together and then you can have this tag in the navigation menu item. 

To set the navigation menu, go to the Navigation Menu item on the left side and click on **New.** Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be. 

> The first menu item in the navigation menu will always be Home.

You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.

We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at [https://github.com/letterpad/letterpad](https://github.com/letterpad/letterpad) and create a issue or you can write us on Twitter at [https://twitter.com/letterpad_cms](https://twitter.com/letterpad_cms).

Thank you,

Letterpad Team
  `;
}

function pageMd() {
  return `
You may choose to use markdown or the inline editing toolbars for writing text. The toolbar can be found by writing a text and selecting it or by clicking the + icon on every new line. 
# h1 Heading 1


## h2 Heading


### h3 Heading


#### h4 Heading


##### h5 Heading


###### h6 Heading


## Horizontal Rules

---
# Emphasis

**This is bold text**

__This is underlined text__

_This is italic text_

~~Strikethrough~~

---

## Blockquotes


> The blockquote element is used to indicate the quotation of a large section of text from another source.

---

## Lists

* Create a list by starting a line with +, - or * followed by a space.
* Sub-lists are made by tab:
    * Marker character change forces new list start:
      * Ac tristique libero volutpat at
      * Facilisis in pretium nisl aliquet
      * Nulla volutpat aliquam velit
* Very easy!


## Code

Inline \`code\` can be written by wrapping the text inside backticks \`.

You can write codeblock with syntax highlighting by two backticks.

\`\`\`javascript
// Some comments
var a = 1;
var b = 2;
var sum = a + b;
cosnole.log(sum); // 3

\`\`\`

---

## Embeds

You can embed spotify, youtube and gist links by just pasting the link.


[https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58](https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58)

## Links

You can wrap [certain text with link](http://google.com) or just have the url [http://google.com](http://google.com) which will automatically convert into a link.

## Images

![Smoky morning in Cascades](https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1789&q=80)

`;
}

export const menu = [
  {
    label: "home",
    original_name: "home",
    slug: "home",
    type: NavigationType.Tag,
  },
  {
    label: "Page",
    original_name: "Page",
    slug: "letterpad-typography",
    type: NavigationType.Page,
  },
];
