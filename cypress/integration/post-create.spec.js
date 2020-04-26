const post = {
  title: "A new post",
  expectedSlug: "a-new-post",
  body:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
  expectedExcerpt:
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when...",
  tags: ["foo", "foo bar", "BAZ BAM"],
};

describe("Create Post", () => {
  beforeEach(() => {
    cy.login();
  });

  it("Create a new Post and publishes it", () => {
    cy.createPost({
      title: "A new post",
      body:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.",
      tags: ["foo", "foo bar", "BAZ BAM"],
      status: "publish",
    });

    // excerpt should exist
    cy.get("[data-testid='excerpt']").should(
      "have.value",
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when...",
    );
    cy.settingsPanel(true);
    cy.get(".slug input").should("have.value", post.expectedSlug);

    cy.settingsPanel(false);

    cy.get("[data-testid='go-back']").click();

    cy.url().should("include", "/admin/posts");

    cy.getPost(post.expectedSlug).then(post => {
      delete post.createdAt;
      delete post.publishedAt;
      delete post.updatedAt;
      cy.wrap(post).snapshot();
    });
  });

  it("updates the previously created post and republishes it", () => {
    cy.get("article a")
      .first()
      .click({ force: true });

    // republish should be disabled untill content changed
    cy.get("button")
      .contains("Publish")
      .should("be.disabled");

    // change body
    cy.get(".post-header div")
      .tab()
      .type("new content added");

    cy.get("button")
      .contains("RePublish")
      .click();

    cy.wait(1000);

    cy.get("button")
      .contains("Published")
      .should("be.disabled");

    cy.get("[data-testid='go-back']").click();

    cy.url().should("include", "/admin/posts");

    cy.getPost(post.expectedSlug).then(post => {
      delete post.createdAt;
      delete post.publishedAt;
      delete post.updatedAt;
      cy.wrap(post).snapshot();
    });
  });

  it("Creates a new post with same title and checks if the slug is different", () => {
    cy.createPost({
      title: "A new post",
      body:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry.",
    });
    cy.settingsPanel(true);
    cy.get(".slug input").should("have.value", post.expectedSlug + "-1");
  });

  it("Creates a new post and updates it with featured image", () => {
    cy.get("article a")
      .first()
      .click({ force: true });

    cy.settingsPanel(true);

    cy.get("[data-testid='featured-image']").click();

    cy.get("[data-testid='input-unsplash")
      .focus()
      .type("forest")
      .type("{enter}");

    cy.wait(2000);
    cy.get("[data-testid='media-item']")
      .first()
      .click();

    cy.get("button")
      .contains("Insert")
      .click();
    cy.wait(1000);

    cy.get("[data-testid='featured-image'] img")
      .should("have.attr", "src")
      .then(src => {
        cy.wrap({ src }).snapshot();
      });
  });
});
