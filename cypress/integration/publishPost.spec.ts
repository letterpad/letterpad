describe("Posts", () => {
  const title = "Once upon a time in mexico " + +new Date();
  const slug = "/post/" + title.toLocaleLowerCase().replace(/ /g, "-");
  it("New Post", () => {
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
  it("New Post with same title and and verify slug", () => {
    cy.getTestId("createPostBtn").click();
    cy.setContent({
      title,
      content: "Content written from cypress test",
    });
    cy.openSettings();
    cy.getTestId("slugInp").should("have.value", slug + "-1");
  });
});

const asModule = {};
export default asModule;
