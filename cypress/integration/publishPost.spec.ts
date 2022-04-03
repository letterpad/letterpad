describe("Publishing", () => {
  const title = "Once upon a time in mexico " + +new Date();
  const slug = "/post/" + title.toLocaleLowerCase().replace(/ /g, "-");

  it("can publish new post", () => {
    cy.getTestId("createPostBtn").click();
    cy.getTestId("postStatus").should("have.text", "draft");

    cy.setContent({ title, content: "Content written from cypress test" });

    cy.openSettings();
    cy.enterTags(["first-post"]);
    cy.getTestId("slugInp").should("have.value", slug);
    cy.getTestId("publishCb").click();
    cy.getTestId("postStatus").should("have.text", "published");
    cy.get(".ant-drawer-close").click();
    cy.get(".ant-page-header-back-button").click();
  });

  it("can publish new post with same title and autogeneratd new tag", () => {
    cy.getTestId("createPostBtn").click();
    cy.setContent({
      title,
      content: "Content written from cypress test",
    });
    cy.openSettings();
    cy.getTestId("slugInp").should("have.value", slug + "-1");
  });

  it("fails to publish post with no tags", () => {
    cy.getTestId("createPostBtn").click();
    cy.setContent({
      title: "Another new post",
      content: "Content written from cypress test",
    });
    cy.openSettings();

    cy.getTestId("publishCb").click();
    cy.get(".no-tags-modal").should("exist");
    cy.get(".okModalBtn").click();

    cy.enterTags(["new-tag"]);
    cy.getTestId("publishCb").click();
    cy.get(".tags-notlinked-modal").should("exist");
    cy.get(".okModalBtn").click();

    cy.enterTags(["first-post"]);
    cy.getTestId("publishCb").click();
    cy.wait("@updatePostMutation");
  });
});

const asModule = {};
export default asModule;
