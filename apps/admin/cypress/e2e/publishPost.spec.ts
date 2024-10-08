describe("Publishing", () => {
  const title = "Once upon a time in mexico " + +new Date();
  const slug = title.toLocaleLowerCase().replace(/ /g, "-");

  it("can publish new post", () => {
    // cy.getTestId("close-cookie-banner").click();
    cy.getTestId("createPostBtn").click();
    cy.getTestId("postStatus").should("have.text", "draft");

    cy.setContent({ title, content: "Content written from cypress test." });

    cy.openSettings();
    cy.enterTags(["first-post"]);
    cy.wait(1000);
    cy.wait("@UpdatePostMutation");

    // cy.getTestId("slugInp").should("have.value", slug);

    cy.getTestId("publishBtn").click();
    cy.wait("@UpdatePostMutation");

    cy.getTestId("postStatus").should("have.text", "published");
    cy.getTestId("close-drawer").click();
    cy.getTestId("back-button").click();
  });

  it.skip("can publish new post with same title and autogeneratd new tag", () => {
    cy.getTestId("createPostBtn").click();
    cy.setContent({
      title,
      content: "Content written from cypress test",
    });
    cy.openSettings();
    cy.getTestId("slugInp").should("have.value", slug + "-1");
  });

  it.only("publish post with no tags and then with tags", () => {
    cy.getTestId("createPostBtn").click();
    cy.setContent({
      title: "Another new post",
      content: "Content written from cypress test",
    });
    cy.openSettings();
    cy.getTestId("excerpt").type("This is an excerpt of the post");
    cy.getTestId("topicSelect").select("_topic_gaming", { force: true });

    cy.enterTags(["new-tag"]);
    cy.wait(1000);

    cy.enterTags(["first-post"]);
    cy.window().focus();

    cy.getTestId("publishBtn").click();
    cy.wait("@UpdatePostMutation");
  });

  it("can publish and unpublish", () => {
    cy.getTestId("createPostBtn").click();
    cy.setContent({
      title: "Another new post",
      content: "content",
    });
    cy.openSettings();
    cy.enterTags(["first-post"]);
    cy.getTestId("publishBtn").click();
    cy.getTestId("postStatus").should("have.text", "published");

    cy.getTestId("close-drawer").click();

    cy.setContent({
      content: "updated content",
    });
    cy.wait("@UpdatePostMutation");

    cy.openSettings();

    cy.getTestId("unPublishBtn").click();
    cy.wait("@UpdatePostMutation");
    cy.getTestId("postStatus").should("have.text", "draft");
  });
});

const asModule = {};
export default asModule;
