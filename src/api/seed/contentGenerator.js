import Faker from "faker";
import Prism from "prismjs";

const generateHeading = () => {
  return `<h2>${Faker.company.catchPhrase()}</h2>`;
};

const generateParagraph = () => {
  const para = Faker.lorem.paragraphs(2);
  return `${para}${generateHeading()}${para}<hr>`;
};

const generateCode = () => {
  const code = `
const client = (isAdmin = false) => {
    const middleware = isAdmin ? middlewareLinkAdmin : middlewareLinkClient;
    return new ApolloClient({
        link: errorLink.concat(middleware).concat(httpLink),
        cache: new InMemoryCache().restore(initialState),
        ssrForceFetchDelay: 100
    });
};`;
  const html = Prism.highlight(code, Prism.languages.javascript, "javascript");
  return `<section><pre class="prism-dark">${html}</pre></section>`;
};

const generateList = () => {
  return `${generateSentence()}<p><ul><li>${Faker.company.catchPhraseAdjective()}</li><li>${Faker.company.catchPhraseAdjective()}</li><li>${Faker.company.catchPhraseAdjective()}</li><li>${Faker.company.catchPhraseAdjective()}</li></ul></p>
    ${generateSentence()}`;
};

const generateQuote = () => {
  return `<section>${generateSentence()}</section><section><blockquote>${Faker.hacker.phrase()}</blockquote></p><p>${generateSentence()}</section>`;
};

const generateSentence = () => {
  return `${Faker.lorem.sentences(3)}`;
};

const getImage = () => {
  const random = Math.floor(Math.random() * 10) + 1;
  const image = process.env.baseName + "/uploads/" + random + ".jpg";
  return `${generateSentence()}<figure data-id="plugin-image-figure"><span type="wide" src="${image}" class="lp_img_wrapper"><img
        width="100%"
        height="auto"
        src="${image}"
        data-id="plugin-image"
        data-align="wide"
      /></span></figure><p>${generateSentence()}</p>`;
};

const shuffleArray = arr =>
  arr
    .map(a => [Math.random(), a])
    .sort((a, b) => a[0] - b[0])
    .map(a => a[1]);

const generatePost = () => {
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
