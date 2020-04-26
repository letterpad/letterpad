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

  it("Navigation", () => {
    //create a post first to test.
    const title = "A new post to test navigation";
    const body = "Testing post navigation body";
    const tag = "hello-world";
    const navLabel = "Hello World";

    cy.createPost({
      title: title,
      body: body,
      tags: [tag],
      status: "publish",
    });

    cy.get("[data-testid='go-back']").click();

    cy.get("a[href*='/admin/settings']").click();
    cy.get("[data-testid='tab-navigation']").click();

    cy.wait(1000);
    cy.addNavigationItem({ label: navLabel, slug: tag });

    cy.visit("http://localhost:4040");

    cy.contains(navLabel).click();
    cy.contains(title);
    cy.contains(body);
  });

  it("Navigation tag as home page", () => {
    cy.get("a[href*='/admin/settings']").click();
    cy.get("[data-testid='tab-navigation']").click();

    cy.get("[data-testid='button-nav-delete']").each($ele => {
      $ele.click();
    });
    const title = "A new post to test navigation";
    const tag = "hello-world";
    const navLabel = "Hello World";

    cy.addNavigationItem({ label: navLabel, slug: tag });
    cy.visit("http://localhost:4040");
    cy.contains(title);
  });
});
