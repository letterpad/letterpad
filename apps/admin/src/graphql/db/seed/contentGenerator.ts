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
Before going digital, you might benefit from scribbling down some ideas in a sketchbook. This way, you can think things through before committing to an actual design project.

## When does design come in handy?

While it might seem like extra work at a first glance, here are some key moments in which prototyping will come in handy:

1.  **Usability testing**. Does your user know how to exit out of screens? Can they follow your intended user journey and buy something from the site you've designed? By running a usability test, you'll be able to see how users will interact with your design once it's live;
2.  **Involving stakeholders**. Need to check if your GDPR consent boxes are displaying properly? Pass your prototype to your data protection team and they can test it for real;
3.  **Impressing a client**. Prototypes can help explain or even sell your idea by providing your client with a hands-on experience;
4.  **Communicating your vision**. By using an interactive medium to preview and test design elements, designers and developers can understand each other — and the project — better.

### Laying the groundwork for best design

Before going digital, you might benefit from scribbling down some ideas in a sketchbook. This way, you can think things through before committing to an actual design project.

Let's start by including the CSS file inside the \`head\` tag of your HTML.

### Understanding typography

#### Type properties

A typeface is a collection of letters. While each letter is unique, certain shapes are shared across letters. A typeface represents shared patterns across a collection of letters.

#### Baseline

A typeface is a collection of letters. While each letter is unique, certain shapes are shared across letters. A typeface represents shared patterns across a collection of letters.

#### Measurement from the baseline

A typeface is a collection of letters. While each letter is unique, certain shapes are shared across letters. A typeface represents shared patterns across a collection of letters.

### Type classification

#### Serif

A serif is a small shape or projection that appears at the beginning or end of a stroke on a letter. Typefaces with serifs are called serif typefaces. Serif fonts are classified as one of the following:

#### Old-Style serifs

*   Low contrast between thick and thin strokes
*   Diagonal stress in the strokes
*   Slanted serifs on lower-case ascenders

### Laying the best for successful prototyping

A serif is a small shape or projection that appears at the beginning:

> Letterpad is a blog publishing platform running on steroids. Try Letterpad today.

**Consider your user**. To create an intuitive user flow, try to think as your user would when interacting with your product. While you can fine-tune this during beta testing, considering your user's needs and habits early on will save you time by setting you on the right path.

**Start from the inside out**. A nice way to both organize your tasks and create more user-friendly prototypes is by building your prototypes 'inside out'. Start by focusing on what will be important to your user, like a Buy now button or an image gallery, and list each element by order of priority. This way, you'll be able to create a prototype that puts your users' needs at the heart of your design.

And there you have it! Everything you need to design and share prototypes.
  `;
}

function pageMd() {
  return `
You may choose to use markdown or the inline editing toolbars for writing text. The toolbar can be found by writing a text and selecting it or by clicking the + icon on every new line.

# A big heading

**Lorem Ipsum** is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

## A sub heading

**Lorem Ipsum** is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

## Code blocks

Codeblocks are supported as well.

\`\`\`javascript
const a = 1;
const b = 2;
const sum = a + n;
\`\`\`

## Blockquotes

**Lorem Ipsum** is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

> The blockquote element is used to indicate the quotation of a large section of text from another source.

## Lists

*   Create a list by starting a line with +, - or * followed by a space.
*   Sub-lists are made by tab:
    *   Marker character change forces new list start:
    *   Ac tristique libero volutpat at
    *   Facilisis in pretium nisl aliquet
    *   Nulla volutpat aliquam velit
*   Very easy!

## Code

You can mark a \`word\` like this by two backticks (\`\`).

## Embeds

This will be available soon.

## Links

You can wrap [certain text with link](http://google.com) or just have the url [http://google.com](http://google.com) which will automatically convert into a link.

## Image

![](https://images.unsplash.com/photo-1491824989090-cc2d0b57eb0d)

[Ricardo Gomez Angel](https://unsplash.com/es/@rgaleriacom?utm_source=LetterpadEditor&utm_medium=referral) on [Unsplash](https://unsplash.com/?utm_source=LetterpadEditor&utm_medium=referral)


_Lorem Ipsum_ is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged.

> **Lorem Ipsum** is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.

* * *

And thats about it!
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
