describe("Settings", () => {
  it("add new item in navigation", () => {
    cy.visitProfile();

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
