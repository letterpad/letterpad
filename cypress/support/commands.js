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

require("@cypress/snapshot").register({ useRelativeSnapshots: true });

Cypress.Commands.add("dbReset", () => {
  const env = Cypress.env("NODE_ENV") || "production";
  let dbName = "lettepad.sqlite";
  if (env === "test") {
    dbName = "test.sqlite";
  }

  cy.task("resetDb", { dbName }, { timeout: 30000 });
  cy.visit("http://localhost:4040");
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

Cypress.Commands.add("createPost", props => {
  let { title, body, tags, excerpt, featured, status } = props;

  cy.get("a[href*='/admin/post-new']").click();

  if (!title) {
    title = "A new Post";
  }
  if (!body) {
    body = "This is the body a new post";
  }
  // write title and body
  cy.get(".post-header div")
    .type(title)
    .tab()
    .type(body);

  cy.wait(1000);

  if (tags || excerpt || featured) {
    // open settings

    cy.settingsPanel(true);

    if (status === "publish") {
      // publish now
      cy.get("[data-testid='button-publishnow']").click();

      // publish now is disabled
      cy.get("[data-testid='button-publishnow']").should("be.disabled");

      // switch unpublish should be enabled
      cy.get("[data-testid='switch-unpublish'] input").should("be.checked");
    }

    for (let i = 0; i < tags.length; i++) {
      cy.get("#react-select-2-input")
        .type(tags[i])
        .type("{enter}");
      cy.wait(500);
    }

    if (featured) {
      cy.get("[data-testid='switch-featured'] input").check();
      cy.get("[data-testid='switch-featured'] input").should("be.checked");
    }
    cy.settingsPanel(false);
  }
});

Cypress.Commands.add("settingsPanel", open => {
  cy.wait(500);
  if (open) {
    cy.get("[data-testid='button-settings']").click({ force: true });
  } else {
    cy.get("[data-testid='close-settings']").click({ force: true });
  }
});

Cypress.Commands.add("addNavigationItem", ({ label, slug }) => {
  cy.get("button")
    .contains("New")
    .click();

  cy.get("[data-testid='empty-label-item']")
    .type(label)
    .tab()
    .type(slug)
    .tab();
  cy.wait(1000);
});
