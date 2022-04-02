Cypress.Commands.add("getTestId", (value) => {
  return cy.get(`[data-testid='${value}']`);
});

Cypress.Commands.add("login", ({ email, password }) => {
  cy.getTestId("email").type(email);
  cy.getTestId("password").type(password);
  cy.getTestId("loginBtn").click();
  cy.url().then(($url) => {
    if ($url.includes("home")) {
      cy.getTestId("dismissIntro").click();
    }
  });
});

Cypress.Commands.add("setContent", ({ title, content }) => {
  // wait for tinymce editor to load
  cy.wait(3000);
  cy.getTestId("postTitleInput").type(`${title}{enter}`);
  // wait for the new slug to generate
  cy.wait(2000);
  cy.window().then((_win) => {
    //@ts-ignore
    // win.tinymce.activeEditor.setContent(content);
    console.log(content);
  });
});

Cypress.Commands.add("openSettings", () => {
  cy.getTestId("postMenuBtn").trigger("click");
  cy.getTestId("postSettingsLink").trigger("click");
});

Cypress.Commands.add("enterTags", (tags) => {
  tags.forEach((tag) => {
    cy.get(".react-tags__search-input").type(`${tag}{enter}`);
  });
});

Cypress.Commands.add("visitLogin", () => cy.visit("/login"));
Cypress.Commands.add("visitHome", () => cy.visit("/home"));
Cypress.Commands.add("visitPosts", () => cy.visit("/posts"));
Cypress.Commands.add("visitPages", () => cy.visit("/pages"));
Cypress.Commands.add("visitProfile", () => cy.visit("/profile"));
Cypress.Commands.add("visitSettings", () => cy.visit("/settings"));

beforeEach(function () {
  cy.visitLogin();
  cy.login({ email: "demo@demo.com", password: "demo" });
  window.localStorage.setItem("intro_dismissed", "true");
});

afterEach(function () {
  cy.clearCookies();
  cy.clearLocalStorage();
});

const asModule = {};
export default asModule;
