describe("Settings", () => {
  it("add new item in navigation", () => {
    cy.visitSettings();
    cy.get(".navigation [role=button]").click();
    cy.getTestId("newMenuBtn").click();
    cy.addNavItem("New Tag", "/tag/first-post");
  });

  it("can fill general settings", () => {
    cy.visitSettings();
    cy.get(".general-settings [role=button]").click();

    cy.getTestId("siteTitle").type("site title");
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("shortDescription").type("short description").tab();
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("siteTagline").type("site tagline");
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("siteEmail").type("site email");
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("footerDescription").type("footer description").tab();
    cy.wait("@UpdateOptionsMutation");
  });

  it("can can select pages", () => {
    cy.visitSettings();
    cy.get(".pages [role=button]").click();

    cy.getTestId("aboutPageCb").click();
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("tagsPageCb").click();
    cy.wait("@UpdateOptionsMutation");
  });

  it("can can set integrations", () => {
    cy.visitSettings();
    cy.get(".integrations [role=button]").click();

    cy.getTestId("cKey").type("123");
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("cName").type("123");
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("cSecret").type("123");
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("gA").type("123");
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("plausible").type("123");
    cy.wait("@UpdateOptionsMutation");

    cy.getTestId("umai").type("123");
    cy.wait("@UpdateOptionsMutation");
  });
});

export {};

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
