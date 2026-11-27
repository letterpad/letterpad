describe("Settings", () => {
  it.skip("add new item in navigation", () => {
    cy.visitSettings();
    cy.getTestId("menu-open-btn").click();
    cy.getTestId("newMenuBtn").click();
    cy.addNavItem("New Tag", "first-post");
    cy.getTestId("save-btn").click({ force: true });
  });

  it("can fill SEO settings", () => {
    cy.visitSettings();

    cy.getTestId("siteTitle").clear().type("site title");
    cy.getTestId("shortDescription").clear().type("short description");
    cy.getTestId("siteTagline").clear().type("site tagline");
    cy.getTestId("siteEmail").clear().type("editor@example.com");
    cy.getTestId("css").clear().type("body { color: black; }", {
      parseSpecialCharSequences: false,
    });

    saveSettings();

    cy.reload();
    cy.getTestId("siteTitle").should("have.value", "site title");
    cy.getTestId("shortDescription").should("have.value", "short description");
  });

  it("can select pages", () => {
    cy.visitSettings();
    cy.getTestId("aboutPageCb").click({ force: true });
    saveSettings();

    cy.getTestId("tagsPageCb").click({ force: true });
    saveSettings();
  });

  it("can set integrations", () => {
    cy.visitSettings();

    cy.getTestId("cKey").type("123");

    cy.getTestId("cName").type("123");

    cy.getTestId("cSecret").type("123");

    saveSettings();
  });
});

function saveSettings() {
  cy.getTestId("save-btn").click({ force: true });
  cy.wait("@UpdateOptionsMutation")
    .its("response.body.data.updateOptions.__typename")
    .should("eq", "Setting");
}

export {};
