describe("Profile", () => {
  it("offers the email magic-link login flow", () => {
    cy.clearCookie("next-auth.session-token");
    cy.intercept("POST", "/api/auth/signin/email", {
      statusCode: 200,
      body: { url: null, status: 200, ok: true, error: null },
    }).as("sendMagicLink");
    cy.visitLogin();
    cy.getTestId("email").type("demo@demo.com");
    cy.contains("button", "Continue").click();
    cy.wait("@sendMagicLink");
    cy.contains("Check your inbox.").should("be.visible");
  });

  it("loads site info for an onboarding user without settings", () => {
    cy.task("createSessionToken", {
      registerStep: "SiteInfo",
      removeSettings: true,
    }).then((token) => {
      cy.setCookie("next-auth.session-token", String(token));
    });
    cy.visit("/update/site-info");
    cy.getTestId("siteName").should("be.visible").clear().type("Demo Writer Site");
    cy.getTestId("siteTagline").clear().type("A site created in the onboarding test");
    cy.getTestId("siteDescription")
      .clear()
      .type("Checking that onboarding can load and save missing default settings.");
    cy.getTestId("updateSiteBtn").click();
    cy.wait("@UpdateOptionsMutation");
    cy.location("pathname").should("eq", "/posts");
  });
  it("Can update basic profile details", () => {
    cy.visitProfile();

    cy.getTestId("name").type("name");

    cy.getTestId("about").type("about");

    cy.getTestId("occupation").type("occupation");

    cy.getTestId("company").type("company").blur();

    // cy.getTestId("basic-submit").click();

    // cy.addUnplsashImage("avatar");
  });
});

export {};
