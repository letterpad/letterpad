// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

const fs = require("fs");
const path = require("path");

require("@cypress/snapshot").register({ useRelativeSnapshots: true });

Cypress.Commands.add("dbReset", () => {
  downloadFile(
    "https://playground.ajaxtown.com/letterpad_demo.sqlite",
    path.join(__dirname, "../../data/letterpad.sqlite"),
  );
});

Cypress.Commands.add("login", () => {
  cy.visit("http://localhost:4040/admin/login");
  cy.get("[data-testid='input-email']").type("demo@demo.com");
  cy.get("[data-testid='input-password']").type("demo");
  cy.get("[data-testid='btn-login']").type("{enter}");

  cy.url().should("include", "/admin/posts");
});

Cypress.Commands.add("getPost", slug => {
  return fetch(`http://localhost:${Cypress.env("PORT")}/graphql`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: `{ 
        post(filters: { slug:"${slug}"}) {
          id
          title
          md
          md_draft
          html
          status
          createdAt
          publishedAt
          scheduledAt
          updatedAt
          excerpt
          reading_time
          featured
          cover_image {
            width
            height
            src
          }
          slug
          type
          author {
            fname
            lname
            avatar
            bio
          }
          tags {
            id
            name
            slug
          } 
        } 
      }`,
    }),
  })
    .then(res => res.json())
    .then(res => res.data.post);
});

const downloadFile = async (url, path) => {
  const res = await fetch(url);
  const fileStream = fs.createWriteStream(path);
  await new Promise((resolve, reject) => {
    res.body.pipe();
    res.body.on("error", err => {
      reject(err);
    });
    fileStream.on("finish", function() {
      resolve();
    });
  });
};
