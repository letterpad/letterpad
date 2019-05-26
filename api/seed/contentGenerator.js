import Faker from "faker";
import Prism from "prismjs";

const generateHeading = () => {
  return `<h2>${Faker.company.catchPhrase()}</h2>`;
};

const generateParagraph = () => {
  return `${Faker.lorem.paragraphs(2)}
                ${generateHeading()}
            ${Faker.lorem.paragraphs(2)}<hr>`;
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
  return `<p><pre class="prism-dark">${html}</pre></p>`;
};

const generateList = () => {
  return `${generateSentence()}<p><ul><li>${Faker.company.catchPhraseAdjective()}</li><li>${Faker.company.catchPhraseAdjective()}</li><li>${Faker.company.catchPhraseAdjective()}</li><li>${Faker.company.catchPhraseAdjective()}</li></ul></p>
    ${generateSentence()}`;
};

const generateQuote = () => {
  return `<p>${generateSentence()}</p><p><blockquote>${Faker.hacker.phrase()}</blockquote></p><p>${generateSentence()}</p>`;
};

const generateSentence = () => {
  return `${Faker.lorem.sentences(3)}`;
};

const getImage = () => {
  const random = Math.floor(Math.random() * 10) + 1;
  const image = "/uploads/" + random + ".jpg";
  return `${generateSentence()}<p style="text-align: center"><img height="400" src="${image}"></p><p>${generateSentence()}</p>`;
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
