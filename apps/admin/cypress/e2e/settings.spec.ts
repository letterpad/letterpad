describe("Settings", () => {
  it("add new item in navigation", () => {
    cy.visitSettings();
    cy.getTestId("navigation").click();
    cy.getTestId("newMenuBtn").click();
    cy.addNavItem("New Tag", "first-post");
  });

  it("can fill SEO settings", () => {
    cy.visitSettings();
    cy.getTestId("seo").click();

    cy.getTestId("siteTitle").type("site title");

    cy.getTestId("shortDescription").type("short description").tab();

    cy.getTestId("siteTagline").type("site tagline");

    cy.getTestId("siteEmail").type("site email");

    cy.getTestId("footerDescription").type("footer description").tab();
    cy.getTestId("save-seo").click();
    cy.wait("@UpdateOptionsMutation");
  });

  it("can can select pages", () => {
    cy.visitSettings();
    cy.getTestId("pages").click();

    cy.getTestId("aboutPageCb").click({ force: true });
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("tagsPageCb").click({ force: true });
    cy.wait("@UpdateOptionsMutation");
  });

  it("can can set integrations", () => {
    cy.visitSettings();
    cy.getTestId("integrations").click();

    cy.getTestId("cKey").type("123");

    cy.getTestId("cName").type("123");

    cy.getTestId("cSecret").type("123");

    cy.getTestId("save-integrations").click();

    cy.wait("@UpdateOptionsMutation");
  });
});

export { };

// cy.url().then((url) => {
//   const saveLocation = `cypress/results/data/${Cypress.spec.name}.location.txt`;
//   cy.writeFile(saveLocation, url);
// });

// cy.readFile(`cypress/results/data/${Cypress.spec.name}.location.txt`).then(
//   (url) => {
//     cy.log(`returning back to editor ${url}`);
//     cy.visit(url);
//     cy.openSettings();
//     cy.getTestId("publishCb").click();
//     cy.wait("@updatePostMutation");
//   },
// );
