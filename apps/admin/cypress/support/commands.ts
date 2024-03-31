declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      getTestId: typeof getTestId;
      login: typeof login;
      setContent: typeof setContent;
      openSettings: typeof openSettings;
      enterTags: typeof enterTags;
      addNavItem: typeof addNavItem;
      visitLogin: () => void;
      visitHome: () => void;
      visitPosts: () => void;
      visitPages: () => void;
      visitProfile: () => void;
      visitRegister: () => void;
      visitSettings: () => void;
      logout: () => void;
    }
  }
}

import { aliasMutation } from "cypress/utils/graphql-test-utils";

//-----
function getTestId(value) {
  return cy.get(`[data-testid='${value}']`);
}
Cypress.Commands.add("getTestId", getTestId);

//-----
function login({ email, password }) {
  cy.getTestId("email").type(email);
  cy.getTestId("password").type(password);
  cy.getTestId("loginBtn").click();
  // cy.wait("@getCredentials");
  cy.wait("@getSession");
  cy.url().then(($url) => {
    if ($url.includes("home")) {
      cy.getTestId("dismissIntro").click();
      cy.wait("@UpdateOptionsMutation");
      // cy.visitPosts();
      // cy.visit("/posts");
    }
  });
}
Cypress.Commands.add("login", login);

//-----
function setContent({ title, content }: { title?: string; content?: string }) {
  if (!title && !content) return;
  cy.window().should("have.property", "tinymce");
  if (title) {
    cy.get("#title-editor").should("exist");
    cy.wait(2000);
    cy.window().then((win) => {
      win.document.body.click();
      //@ts-ignore
      win.tinymce.get("title-editor").setContent(title);
      // cy.wait("@UpdatePostMutation");
    });
  }
  if (content) {
    cy.get("#main-editor").should("exist");
    cy.window().then((win) => {
      win.document.body.click();
      //@ts-ignore
      win.tinymce.get("main-editor").setContent(content);
      // cy.wait("@UpdatePostMutation");
    });
  }
}
Cypress.Commands.add("setContent", setContent);

//-----
function openSettings() {
  cy.getTestId("post-actions").trigger("click");
  cy.getTestId("postSettingsLink").trigger("click");
}
Cypress.Commands.add("openSettings", openSettings);

//-----
function enterTags(tags) {
  tags.forEach((tag) => {
    cy.get(".react-tags__search-input").type(`${tag}{enter}`);
  });
  return cy.get(".react-tags__search-input");
}
Cypress.Commands.add("enterTags", enterTags);

//-----
Cypress.Commands.add("visitLogin", () => cy.visit("/login"));
Cypress.Commands.add("visitHome", () => cy.visit("/home"));
Cypress.Commands.add("visitPosts", () => cy.visit("/posts"));
Cypress.Commands.add("visitPages", () => cy.visit("/creatives"));
Cypress.Commands.add("visitProfile", () => cy.visit("/profile"));
Cypress.Commands.add("visitRegister", () => cy.visit("/register"));
Cypress.Commands.add("visitSettings", () => cy.visit("/settings"));
Cypress.Commands.add("logout", () => cy.visit("/logout"));

//-----
function addNavItem(label, slug) {
  cy.getTestId("empty-label-item").type(label);
  cy.getTestId("content-modal-btn").last().trigger("click");
  cy.getTestId(slug).click();
  cy.getTestId("saveMenuBtn").click();
  cy.wait("@UpdateOptionsMutation");
}
Cypress.Commands.add("addNavItem", addNavItem);

beforeEach(function () {
  cy.visitLogin();
  cy.intercept("POST", "http://localhost:3000/api/graphql", (req) => {
    aliasMutation(req, "UpdatePost");
    aliasMutation(req, "UpdateOptions");
    aliasMutation(req, "UpdateAuthor");
    aliasMutation(req, "createAuthor");
  });
  cy.intercept("/api/auth/session").as("getSession");
  cy.intercept("/api/auth/callback/credentials?").as("getCredentials");
  window.localStorage.setItem("intro_dismissed", "true");
  cy.login({ email: "demo@demo.com", password: "demo" });
});

afterEach(function () {
  cy.clearCookies();
  cy.clearLocalStorage();
});

const asModule = {};
export default asModule;
