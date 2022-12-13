describe("Profile", () => {
  it("Can update basic profile details", () => {
    cy.visitProfile();
    cy.getTestId("basic").click();

    cy.getTestId("name").type("name");
    cy.wait("@UpdateAuthorMutation");

    cy.getTestId("about").type("about");
    cy.wait("@UpdateAuthorMutation");

    cy.getTestId("occupation").type("occupation");
    cy.wait("@UpdateAuthorMutation");

    cy.getTestId("company").type("company");
    cy.wait("@UpdateAuthorMutation");

    // cy.addUnplsashImage("avatar");
  });
});

export {};
