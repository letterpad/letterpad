describe("Settings", () => {
  beforeEach(() => {
    cy.login();
  });

  it("General", () => {
    cy.get("a[href*='/admin/settings']").click();
    cy.get("[data-testid='tab-general']").click();
    cy.get("[data-testid='site_title']").type("1");
    cy.get("[data-testid='site_tagline']").type("1");
    cy.get("[data-testid='site_email']").type("1");
    cy.get("[data-testid='site_description']").type("1");
    cy.get("[data-testid='site_url']").type("1");
    cy.get("[data-testid='site_footer']").type("1");
    cy.get("[data-testid='google_analytics']").type("1");
  });

  it.only("Navigation", () => {
    cy.get("a[href*='/admin/settings']").click();
    cy.get("[data-testid='tab-navigation']").click();

    cy.wait(1000);
    cy.get("button")
      .contains("New")
      .click();

    cy.get("[data-testid='empty-label-item']")
      .type("First Post Tag")
      .tab()
      .type("first-post")
      .tab();
    cy.wait(1000);

    cy.visit("http://localhost:4040");
    cy.contains("First Post Tag").click();
    cy.contains("Welcome to Letterpad");
  });
});
