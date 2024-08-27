describe("Profile", () => {
  it("can register and login", () => {
    const email = `test@test.com`;
    cy.url().should("contain", "/posts");
    cy.getTestId("menu-open-btn").click();
    // cy.getTestId("close-cookie-banner").click();
    cy.getTestId("logout").click();
    // cy.url().should("contain", "/login");
    cy.visitRegister();
    cy.url().should("contain", "/register");
    cy.getTestId("email").type(email);
    cy.getTestId("password").type("testing@123");
    cy.getTestId("registerBtn").click();
    cy.wait("@createAuthorMutation");
    cy.location("pathname").should("include", "/messages/registered");
    cy.request(`/api/testVerified?email=${email}`);
    cy.visitLogin();
    cy.getTestId("email").type(email);
    cy.getTestId("password").type("testing@123");
    cy.getTestId("loginBtn").click();

    cy.location("pathname").should("include", "/update/profile-info");

    cy.getTestId("name").type("Testing User");
    cy.getTestId("username").type("test");
    cy.getTestId("name").type("Testing User");
    cy.getTestId("bio").type(
      "This is a bio that has been written automatically by tests"
    );
    cy.getTestId("updateProfile").click();

    cy.location("pathname").should("include", "/update/site-info");
    cy.getTestId("siteName").type("Site Name");
    cy.getTestId("siteTagline").type("A tagling for site");
    cy.getTestId("siteDescription").type("Site description");
    cy.getTestId("updateSiteBtn").click();
    cy.wait("@UpdateOptionsMutation");

    // cy.location("pathname").should("include", "/posts");
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
