export default function generatePost(type) {
  const post = {
    md: `
Welcome to Letterpad!

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
`,
    html: `
<div class="lp-editor" id="letterpad-editor-container"><p>Welcome to Letterpad!</p>
<p>We hope you will have a great writing experience while using Letterpad. This post will walk you through the basics of using Letterpad and publishing your first post.</p>
<p>From the left side navigation menu, select posts and then click on <strong>New</strong> to write your first post. Your posts needs to be tagged so that you can attach one of those tag to the menu. By default, all posts will have the default tag - <strong>first-post</strong>.</p>
<p>You will find the Publish option at the top right corner. Clicking that will open up a side menu where you can add a new tag or delete an existing tag.</p>
<blockquote>
<p>Tags help in grouping your posts together and then you can have this tag in the navigation menu item.</p>
</blockquote>
<p>To set the navigation menu, go to the Navigation Menu item on the left side and click on <strong>New.</strong> Here you can add the label of the new navigation menu item and also select the tag for which you want the collection of posts to be displayed. You can also drag the menu items in the order you want them to be.</p>
<blockquote>
<p>The first menu item in the navigation menu will always be Home.</p>
</blockquote>
<p>You can also create pages in the same way like posts, but pages dont have a tag. Since pages are static, you can directly add a page to the navigation menu.</p>
<p>We are constantly working on making Letterpad CMS better, so if you have suggestions, visit out github page at <a href="https://github.com/letterpad/letterpad">https://github.com/letterpad/letterpad</a> and create a issue or you can write us on Twitter at <a href="https://twitter.com/letterpad_cms">https://twitter.com/letterpad_cms</a>.</p>
<p>Thank you,
Letterpad Team</p>
</div>`,
  };
  const page = {
    md: `
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


> Blockquotes can also be nested...
> > ...by using additional greater-than signs right next to each other...
> > > ...or with spaces between arrows.

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

## Tables

| Option | Description |
|:--- |:--- |
| data | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext | extension to be used for dest files. |

Right aligned columns

| Option | Description |
| ---:| ---:|
| data | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext | extension to be used for dest files. |


## Links

You can wrap [certain text with link](http://google.com) or just have the url [http://google.com](http://google.com) which will automatically convert into a link.

## Images

![Smoky morning in Cascades](https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1789&q=80)

You can also highlight newly added text by wrapping the text between two ++ followed by a space.
++This is a newly added text++
`,
    html: `
    <div class='lp-editor' id='letterpad-editor-container'><p>You may choose to use markdown or the inline editing toolbars for writing text. The toolbar can be found by writing a text and selecting it or by clicking the + icon on every new line.</p>
<h1>h1 Heading 1</h1>
<h2>h2 Heading</h2>
<h3>h3 Heading</h3>
<h4>h4 Heading</h4>
<h5>h5 Heading</h5>
<h6>h6 Heading</h6>
<h2>Horizontal Rules</h2>
<hr>
<h1>Emphasis</h1>
<p><strong>This is bold text</strong></p>
<p><u>This is underlined text</u></p>
<p><em>This is italic text</em></p>
<p><s>Strikethrough</s></p>
<hr>
<h2>Blockquotes</h2>
<blockquote>
<p>Blockquotes can also be nested...</p>
<blockquote>
<p>...by using additional greater-than signs right next to each other...</p>
<blockquote>
<p>...or with spaces between arrows.</p>
</blockquote>
</blockquote>
</blockquote>
<hr>
<h2>Lists</h2>
<ul>
<li>Create a list by starting a line with +, - or * followed by a space.</li>
<li>Sub-lists are made by tab:
<ul>
<li>Marker character change forces new list start:
<ul>
<li>Ac tristique libero volutpat at</li>
<li>Facilisis in pretium nisl aliquet</li>
<li>Nulla volutpat aliquam velit</li>
</ul>
</li>
</ul>
</li>
<li>Very easy!</li>
</ul>
<h2>Code</h2>
<p>Inline <code>code</code> can be written by wrapping the text inside backticks \`.</p>
<p>You can write codeblock with syntax highlighting by two backticks.</p>
<pre class="language-javascript"><code class="language-javascript"><span class="token comment">// Some comments</span>
<span class="token keyword">var</span> a <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> b <span class="token operator">=</span> <span class="token number">2</span><span class="token punctuation">;</span>
<span class="token keyword">var</span> sum <span class="token operator">=</span> a <span class="token operator">+</span> b<span class="token punctuation">;</span>
cosnole<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>sum<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 3</span>

</code></pre>
<hr>
<h2>Embeds</h2>
<p>You can embed spotify, youtube and gist links by just pasting the link.</p>
<iframe width="100%" height="200px" frameBorder="0" src="data:text/html;base64,PGh0bWw+PGhlYWQ+PGJhc2UgdGFyZ2V0PSJfcGFyZW50Ij48c3R5bGU+KnsgZm9udC1zaXplOjEycHg7IH0gYm9keSB7IG1hcmdpbjogMDsgfSAuZ2lzdCAuYmxvYi13cmFwcGVyLmRhdGEgeyBtYXgtaGVpZ2h0OjE1MHB4OyBvdmVyZmxvdzphdXRvOyB9PC9zdHlsZT48L2hlYWQ+PGJvZHk+PHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiIHNyYz0iaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZjZiMjM0ZGMxMGM0MmIzMmE1MDNiNTc0ZTNmYzZiNTguanMiPjwvc2NyaXB0PjwvYm9keT48L2h0bWw+" ></iframe>
<h2>Tables</h2>
<table>
<thead>
<tr>
<th style="text-align:left">Option</th>
<th style="text-align:left">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">data</td>
<td style="text-align:left">path to data files to supply the data that will be passed into templates.</td>
</tr>
<tr>
<td style="text-align:left">engine</td>
<td style="text-align:left">engine to be used for processing templates. Handlebars is the default.</td>
</tr>
<tr>
<td style="text-align:left">ext</td>
<td style="text-align:left">extension to be used for dest files.</td>
</tr>
</tbody>
</table>
<p>Right aligned columns</p>
<table>
<thead>
<tr>
<th style="text-align:right">Option</th>
<th style="text-align:right">Description</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:right">data</td>
<td style="text-align:right">path to data files to supply the data that will be passed into templates.</td>
</tr>
<tr>
<td style="text-align:right">engine</td>
<td style="text-align:right">engine to be used for processing templates. Handlebars is the default.</td>
</tr>
<tr>
<td style="text-align:right">ext</td>
<td style="text-align:right">extension to be used for dest files.</td>
</tr>
</tbody>
</table>
<h2>Links</h2>
<p>You can wrap <a href="http://google.com">certain text with link</a> or just have the url <a href="http://google.com">http://google.com</a> which will automatically convert into a link.</p>
<h2>Images</h2>
<p><figure><img src="https://images.unsplash.com/photo-1511497584788-876760111969?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1789&q=80" alt="Smoky morning in Cascades"><figcaption>Minion</figcaption></figure></p>
<p>You can also highlight newly added text by wrapping the text between two ++ followed by a space.
++This is a newly added text++</p>
</div>
`,
  };

  const data = { post, page };
  return data[type];
}
