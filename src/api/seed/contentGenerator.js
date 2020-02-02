import Faker from "faker";
// import Prism from "prismjs";

const generateHeading = () => {
  return `## ${Faker.company.catchPhrase()}`;
};

const generateParagraph = () => {
  const para = Faker.lorem.paragraphs(2);
  return `
  ${para}
  ${generateHeading()}
  ${para}
  
  ---
  
  `;
};

const generateCode = () => {
  const code = `
  
\`\`\`js
var fname = "foo";
var lname = "bar";

console.log(fname + " " + lname);
\`\`\``;

  return code;
};

const generateList = () => {
  return `${generateSentence()}   
    - ${Faker.company.catchPhraseAdjective()}
    - ${Faker.company.catchPhraseAdjective()}
    - ${Faker.company.catchPhraseAdjective()}
    - ${Faker.company.catchPhraseAdjective()}
    
    ${generateSentence()}`;
};

const generateQuote = () => {
  return `${generateSentence()}
  
  > ${Faker.hacker.phrase()}
  
  ${generateSentence()}`;
};

const generateSentence = () => {
  return `
    ${Faker.lorem.sentences(3)}
  `;
};

const getImage = () => {
  const random = Math.floor(Math.random() * 10) + 1;
  const image = process.env.baseName + "/uploads/" + random + ".jpg";
  return `${generateSentence()}

  ${image}
  
  ${generateSentence()}
  `;
};

const shuffleArray = arr =>
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

const generatePost = () => {
  return `
  # Letterpad Editor

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
  
  
  `;

  const items = [
    generateCode(),
    generateCode(),
    generateHeading(),
    generateList(),
    generateQuote(),
    getImage(),
    generateParagraph(),
    generateList(),
    generateParagraph(),
    getImage(),
    generateQuote(),
  ];
  // add sentences in the front and some sentences in the end
  return generateSentence() + shuffleArray(items).join("") + generateSentence();
};
// console.log(generatePost());
export default generatePost;
