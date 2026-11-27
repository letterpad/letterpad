describe("Settings", () => {
  beforeEach(() => {
    cy.setCookie("cookie-consent", "true");
  });

  it.skip("add new item in navigation", () => {
    cy.visit("/settings?selected=navigation");
    cy.getTestId("newMenuBtn").click();
    cy.addNavItem("New Tag", "first-post");
    saveSettings();
  });

  it("saves SEO and appearance changes across sections", () => {
    cy.visitSettings();
    cy.getTestId("siteTitle").clear().type("site title");
    cy.getTestId("shortDescription").clear().type("short description");
    cy.getTestId("siteTagline").clear().type("site tagline");
    cy.getTestId("siteEmail").clear().type("editor@example.com");

    cy.contains('nav[aria-label="Settings sections"] a', "Appearance").click();
    cy.getTestId("css").clear().type("body { color: black; }", {
      parseSpecialCharSequences: false,
    });
    saveSettings();

    cy.reload();
    cy.getTestId("css").should("have.value", "body { color: black; }");
    cy.contains('nav[aria-label="Settings sections"] a', "Site & SEO").click();
    cy.getTestId("siteTitle").should("have.value", "site title");
    cy.getTestId("shortDescription").should("have.value", "short description");
  });

  it("saves both page toggles in succession", () => {
    cy.visit("/settings?selected=pages");
    toggleAndSave("aboutPageCb");
    toggleAndSave("tagsPageCb");
  });

  it("can set integrations", () => {
    cy.visit("/settings?selected=integrations");
    cy.getTestId("cKey").clear().type("123");
    cy.getTestId("cName").clear().type("123");
    cy.getTestId("cSecret").clear().type("123");
    saveSettings();
  });
});

function saveSettings() {
  cy.getTestId("save-btn").should("be.enabled").click();
  cy.wait("@UpdateOptionsMutation")
    .its("response.body.data.updateOptions.__typename")
    .should("eq", "Setting");
  cy.getTestId("save-btn").should("be.disabled");
}

function toggleAndSave(testId: string) {
  cy.getTestId(testId).then(($checkbox) => {
    const checked = $checkbox.is(":checked");
    cy.wrap($checkbox)[checked ? "uncheck" : "check"]({ force: true });
    saveSettings();
    cy.getTestId(testId).should(checked ? "not.be.checked" : "be.checked");
  });
}

export {};
