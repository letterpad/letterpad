describe("Preview", () => {
  beforeEach(() => {
    cy.login();
  });

  it("draft preview should work", () => {
    cy.get("a[href*='/admin/post-new']").click();

    // write title and body
    cy.get(".post-header div")
      .type("Draft post preview - title")
      .tab()
      .type("Draft post preview - body");

    cy.wait(1000);

    // open settings
    cy.get("button")
      .contains("Publish")
      .click();

    cy.wait(1000);
    cy.get("[data-testid='link-preview']")
      .should("have.attr", "href")
      .then(src => {
        cy.visit("http://localhost:4040" + src);
        cy.contains("Draft post preview - title");
        cy.contains("Draft post preview - body");
      });
  });

  it("republish preview should work", () => {
    cy.get("a[href*='/admin/post-new']").click();

    // write title and body
    cy.get(".post-header div")
      .type("Republish post preview - title")
      .tab()
      .type("Republish post preview - body");

    cy.wait(1000);

    // open settings
    cy.settingsPanel(true);

    // publish now
    cy.get("button")
      .contains("Publish Now")
      .click();

    cy.settingsPanel(true);

    // post is published now. change some stuff
    // change body
    cy.get(".post-header div")
      .tab()
      .type("new content added");

    cy.wait(1000);

    cy.settingsPanel(false);
    cy.wait(1000);
    cy.get("[data-testid='link-preview']")
      .should("have.attr", "href")
      .then(src => {
        cy.visit("http://localhost:4040" + src);
        cy.contains("new content added");
      });
  });
});
