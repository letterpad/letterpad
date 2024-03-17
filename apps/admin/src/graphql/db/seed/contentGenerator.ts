import { NavigationType } from "letterpad-graphql";

import { mdToHtml } from "@/shared/converter";

export default function generatePost(type) {
  const post = {
    html: mdToHtml(postMd()),
  };

  const data = { post };
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

export const menu = [
  {
    label: "home",
    original_name: "home",
    slug: "home",
    type: NavigationType.Tag,
  },
];
