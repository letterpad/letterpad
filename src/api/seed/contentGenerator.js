// import Faker from "faker";
// // import Prism from "prismjs";

// const generateHeading = () => {
//   return `## ${Faker.company.catchPhrase()}`;
// };

// const generateParagraph = () => {
//   const para = Faker.lorem.paragraphs(2);
//   return `
//   ${para}
//   ${generateHeading()}
//   ${para}

//   ---

//   `;
// };

// const generateCode = () => {
//   const code = `

// \`\`\`js
// var fname = "foo";
// var lname = "bar";

// console.log(fname + " " + lname);
// \`\`\``;

//   return code;
// };

// const generateList = () => {
//   return `${generateSentence()}
//     - ${Faker.company.catchPhraseAdjective()}
//     - ${Faker.company.catchPhraseAdjective()}
//     - ${Faker.company.catchPhraseAdjective()}
//     - ${Faker.company.catchPhraseAdjective()}

//     ${generateSentence()}`;
// };

// const generateQuote = () => {
//   return `${generateSentence()}

//   > ${Faker.hacker.phrase()}

//   ${generateSentence()}`;
// };

// const generateSentence = () => {
//   return `
//     ${Faker.lorem.sentences(3)}
//   `;
// };

// const getImage = () => {
//   const random = Math.floor(Math.random() * 10) + 1;
//   const image = process.env.baseName + "/uploads/" + random + ".jpg";
//   return `${generateSentence()}

//   ${image}

//   ${generateSentence()}
//   `;
// };

// const shuffleArray = arr =>
//   arr
//     .map(a => [Math.random(), a])
//     .sort((a, b) => a[0] - b[0])
//     .map(a => a[1]);

// const generatePost = () => {
//   return `
//   # Letterpad Editor

//   The letterpad editor is a high level API of the [slatejs](https://slatejs.org) editor with a robust plugin architecture. It comes with a set of rich plugins (each plugin is a feature) which can be extended to build more complex features. The editor also has markdown capabilites which generates inline previews as you start writing in markdown. This page is editable and is the playground of this editor. The toolbars are visible when you select some text or in a new line.

//   ---

//   Letterpad editor uses the below technologies.

//   - React
//   - Slatejs
//   - Typescript
//   - Styled Components
//   - Webpack
//   - Cypress

//   We have decent documentation, if you would like to contribute to its development. Visit our [github page](https://github.com/letterpad/editor) for more information.

//   > Most part is covered with integration tests using Cypress. So its easy to figure out if something broke due to your change.

//   You can develop plugins like the one below. This is a gallery plugin.

//   ![Street of some place](https://i.ibb.co/DWvD3zm/3.jpg "Logo Title Text 1")

//   ---

//   You can embed media. Lets embed a youtube video.

//   [https://www.youtube.com/watch?v=JjJHOYIVO98](https://www.youtube.com/watch?v=JjJHOYIVO98)

//   You can also embed a **souncloud track** or a **website** or a **gist**. You can nicely highlight the words that need attention.

//   ---

//   Do you write code ? We have something for you.

//   \`\`\`javascript
//   import React from "react";
//   import { render } from "react-dom";
//   import LetterpadEditor from "letterpad-editor";

//   render(<LetterpadEditor />, document.getElementById("app"));
//   \`\`\`

//   And you can add gists like so.

//   [https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58](https://gist.github.com/ajaxtown/f6b234dc10c42b32a503b574e3fc6b58)

//   Headings look like this:

//   # Heading 1

//   ## Heading 2

//   ### Heading 3

//   #### Heading 4

//   ##### Heading 5

//   Texts can be **bold and strong** or they can be **italic** and **underline**.

//   Lets try to embed a soundcloud track.

//   [https://soundcloud.com/its-deeper-sounds/alberto-jossue-deeper-sounds-mambo-radio-recorded-live-coda-dec-2019-110120](https://soundcloud.com/its-deeper-sounds/alberto-jossue-deeper-sounds-mambo-radio-recorded-live-coda-dec-2019-110120)

//   ---

//   Oh you can also have a parallax image.

//   ![alt text](https://i.ibb.co/vHftK2F/8.jpg "Logo Title Text 1")

//   If you have any ideas on some interesting plugin, you can [post them here](https://github.com/letterpad/editor/issues/new).

//   `;

//   const items = [
//     generateCode(),
//     generateCode(),
//     generateHeading(),
//     generateList(),
//     generateQuote(),
//     getImage(),
//     generateParagraph(),
//     generateList(),
//     generateParagraph(),
//     getImage(),
//     generateQuote(),
//   ];
//   // add sentences in the front and some sentences in the end
//   return generateSentence() + shuffleArray(items).join("") + generateSentence();
// };
// // console.log(generatePost());
// export default generatePost;

export default function generatePost() {
  return {
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
}
