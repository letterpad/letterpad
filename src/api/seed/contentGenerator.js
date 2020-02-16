export default function generatePost(type) {
  const post = {
    md: `
The letterpad editor is a high level API of the [slatejs](https://slatejs.org) editor with a robust plugin architecture. It comes with a set of rich plugins (each plugin is a feature) which can be extended to build more complex features. The editor also has markdown capabilites which generates inline previews as you start writing in markdown. This page is editable and is the playground of this editor. The toolbars are visible when you select some text or in a new line.

---

Letterpad editor uses the below technologies.

- React
- Slatejs
- Typescript
- Styled Components
- Webpack
- Cypress

We have decent documentation, if you would like to contribute to its development. Visit our [github page](https://github.com/letterpad/editor) for more information.

> Most part is covered with integration tests using Cypress. So its easy to figure out if something broke due to your change.

You can develop plugins like the one below. This is a gallery plugin.

![Street of some place](https://i.ibb.co/DWvD3zm/3.jpg "Logo Title Text 1")

---

You can embed media. Lets embed a youtube video.

[https://www.youtube.com/watch?v=JjJHOYIVO98](https://www.youtube.com/watch?v=JjJHOYIVO98)

You can also embed a **souncloud track** or a **website** or a **gist**. You can nicely highlight the words that need attention.

---

Do you write code ? We have something for you.

\`\`\`javascript
import React from "react";
import { render } from "react-dom";
import LetterpadEditor from "letterpad-editor";

render(<LetterpadEditor />, document.getElementById("app"));
\`\`\`

And you can add gists like so.

[https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58](https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58)

Headings look like this:

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

Texts can be **bold and strong** or they can be **italic** and **underline**.

Lets try to embed a soundcloud track.

[https://soundcloud.com/its-deeper-sounds/alberto-jossue-deeper-sounds-mambo-radio-recorded-live-coda-dec-2019-110120](https://soundcloud.com/its-deeper-sounds/alberto-jossue-deeper-sounds-mambo-radio-recorded-live-coda-dec-2019-110120)

---

Oh you can also have a parallax image.

![alt text](https://i.ibb.co/vHftK2F/8.jpg "Logo Title Text 1")

If you have any ideas on some interesting plugin, you can [post them here](https://github.com/letterpad/editor/issues/new).
    
`,
    html: `
<div class="lp-editor" id="letterpad-editor-container">
<p>The letterpad editor is a high level API of the <a href="https://slatejs.org">slatejs</a> editor with a robust plugin architecture. It comes with a set of rich plugins (each plugin is a feature) which can be extended to build more complex features. The editor also has markdown capabilites which generates inline previews as you start writing in markdown. This page is editable and is the playground of this editor. The toolbars are visible when you select some text or in a new line.</p>
<hr>
<p>Letterpad editor uses the below technologies.</p>
<ul>
<li>React</li>
<li>Slatejs</li>
<li>Typescript</li>
<li>Styled Components</li>
<li>Webpack</li>
<li>Cypress</li>
</ul>
<p>We have decent documentation, if you would like to contribute to its development. Visit our <a href="https://github.com/letterpad/editor">github page</a> for more information.</p>
<blockquote>
<p>Most part is covered with integration tests using Cypress. So its easy to figure out if something broke due to your change.</p>
</blockquote>
<p>You can develop plugins like the one below. This is a gallery plugin.</p>
<p><img src="https://i.ibb.co/DWvD3zm/3.jpg" alt="Street of some place"></p>
<hr>
<p>You can embed media. Lets embed a youtube video.</p>
<iframe sandbox="allow-same-origin allow-scripts allow-popups allow-forms" width="100%" height="400px" type="text/html" frameborder="0" title="embed" loading="lazy" allowfullscreen="true" src="https://www.youtube.com/embed/JjJHOYIVO98?modestbranding=1"></iframe>
<p>You can also embed a <strong>souncloud track</strong> or a <strong>website</strong> or a <strong>gist</strong>. You can nicely highlight the words that need attention.</p>
<hr>
<p>Do you write code ? We have something for you.</p>
<pre class="language-javascript"><code class="language-javascript"><span class="token keyword">import</span> React <span class="token keyword">from</span> <span class="token string">"react"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> <span class="token punctuation">{</span> render <span class="token punctuation">}</span> <span class="token keyword">from</span> <span class="token string">"react-dom"</span><span class="token punctuation">;</span>
<span class="token keyword">import</span> LetterpadEditor <span class="token keyword">from</span> <span class="token string">"letterpad-editor"</span><span class="token punctuation">;</span>

<span class="token function">render</span><span class="token punctuation">(</span><span class="token operator">&lt;</span>LetterpadEditor <span class="token operator">/</span><span class="token operator">&gt;</span><span class="token punctuation">,</span> document<span class="token punctuation">.</span><span class="token function">getElementById</span><span class="token punctuation">(</span><span class="token string">"app"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

</code></pre>
<p>And you can add gists like so.</p>
<iframe width="100%" height="200px" frameborder="0" src="data:text/html;base64,PGh0bWw+PGhlYWQ+PGJhc2UgdGFyZ2V0PSJfcGFyZW50Ij48c3R5bGU+KnsgZm9udC1zaXplOjEycHg7IH0gYm9keSB7IG1hcmdpbjogMDsgfSAuZ2lzdCAuYmxvYi13cmFwcGVyLmRhdGEgeyBtYXgtaGVpZ2h0OjE1MHB4OyBvdmVyZmxvdzphdXRvOyB9PC9zdHlsZT48L2hlYWQ+PGJvZHk+PHNjcmlwdCB0eXBlPSJ0ZXh0L2phdmFzY3JpcHQiIHNyYz0iaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vZjZiMjM0ZGMxMGM0MmIzMmE1MDNiNTc0ZTNmYzZiNTguanMiPjwvc2NyaXB0PjwvYm9keT48L2h0bWw+"></iframe>
<p>Headings look like this:</p>
<h1>Heading 1</h1>
<h2>Heading 2</h2>
<h3>Heading 3</h3>
<h4>Heading 4</h4>
<h5>Heading 5</h5>
<p>Texts can be <strong>bold and strong</strong> or they can be <strong>italic</strong> and <strong>underline</strong>.</p>
<p>Lets try to embed a soundcloud track.</p>
<p><a href="https://soundcloud.com/its-deeper-sounds/alberto-jossue-deeper-sounds-mambo-radio-recorded-live-coda-dec-2019-110120">https://soundcloud.com/its-deeper-sounds/alberto-jossue-deeper-sounds-mambo-radio-recorded-live-coda-dec-2019-110120</a></p>
<hr>
<p>Oh you can also have a parallax image.</p>
<p><img src="https://i.ibb.co/vHftK2F/8.jpg" alt="alt text"></p>
<p>If you have any ideas on some interesting plugin, you can <a href="https://github.com/letterpad/editor/issues/new">post them here</a>.</p>
</div>
`,
  };
  const page = {
    md: `
You may choose to use markdown or the inline editing toolbars for writing text. The toolbars can be
found by writing a text and selecting it or by clicking the + icon on every new line.

# h1 Heading 1


## h2 Heading


### h3 Heading


#### h4 Heading


##### h5 Heading


###### h6 Heading


## Horizontal Rules

---

---

---

## Emphasis

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

Unordered

* Create a list by starting a line with +, - or * followed by a space.
* Sub-lists are made by tab:
   * Marker character change forces new list start:
      * Ac tristique libero volutpat at
      * Facilisis in pretium nisl aliquet
      * Nulla volutpat aliquam velit
* Very easy!

Ordered

1. Lorem ipsum dolor sit amet
1. Consectetur adipiscing elit
1. Integer molestie lorem at massa


1. You can use sequential numbers...
1. ...or keep all the numbers as \`1.\`


## Code

Inline \`code\` can be written by wrapping the text inside backticks \`.

You can write codeblock with syntax highlighting by three backticks followed by a space.

\`\`\`
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

[link text](http://google.com)

## Images

![Minion](https://octodex.github.com/images/minion.png)
![Stormtroopocat](https://octodex.github.com/images/stormtroopocat.jpg)

You can also highlight newly added text by wrapping the text between two ++ followed by a space.
++This is a newly added text++
`,
    html: `
    <div class='lp-editor' id='letterpad-editor-container'><p>You may choose to use markdown or the inline editing toolbars for writing text. The toolbars can be
found by writing a text and selecting it or by clicking the + icon on every new line.</p>
<h1>h1 Heading 1</h1>
<h2>h2 Heading</h2>
<h3>h3 Heading</h3>
<h4>h4 Heading</h4>
<h5>h5 Heading</h5>
<h6>h6 Heading</h6>
<h2>Horizontal Rules</h2>
<hr>
<hr>
<hr>
<h2>Emphasis</h2>
<p><strong>This is bold text</strong></p>
<p><strong>This is underlined text</strong></p>
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
<p>Unordered</p>
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
<p>Ordered</p>
<ol>
<li>
<p>Lorem ipsum dolor sit amet</p>
</li>
<li>
<p>Consectetur adipiscing elit</p>
</li>
<li>
<p>Integer molestie lorem at massa</p>
</li>
<li>
<p>You can use sequential numbers...</p>
</li>
<li>
<p>...or keep all the numbers as <code>1.</code></p>
</li>
</ol>
<h2>Code</h2>
<p>Inline <code>code</code> can be written by wrapping the text inside backticks \`.</p>
<p>You can write codeblock with syntax highlighting by three backticks followed by a space.</p>
<pre><code>// Some comments
var a = 1;
var b = 2;
var sum = a + b;
cosnole.log(sum); // 3

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
<p><a href="http://google.com">link text</a></p>
<h2>Images</h2>
<p><img src="https://octodex.github.com/images/minion.png" alt="Minion">
<img src="https://octodex.github.com/images/stormtroopocat.jpg" alt="Stormtroopocat"></p>
<p>You can also highlight newly added text by wrapping the text between two ++ followed by a space.
++This is a newly added text++</p>
</div>   
`,
  };

  const data = { post, page };
  return data[type];
}
