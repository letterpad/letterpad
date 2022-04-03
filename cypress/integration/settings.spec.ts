describe("Settings", () => {
  it("add new item in navigation", () => {
    cy.visitSettings();
    cy.get(".navigation [role=button]").click();
    cy.getTestId("newMenuBtn").click();
    cy.addNavItem("New Tag", "/tag/first-post");
  });
});

export {};

// cy.url().then((url) => {
//   const saveLocation = `cypress/results/data/${Cypress.spec.name}.location.txt`;
//   cy.writeFile(saveLocation, url);
// });

// cy.readFile(`cypress/results/data/${Cypress.spec.name}.location.txt`).then(
//   (url) => {
//     cy.log(`returning back to editor ${url}`);
//     cy.visit(url);
//     cy.openSettings();
//     cy.getTestId("publishCb").click();
//     cy.wait("@updatePostMutation");
//   },
// );
