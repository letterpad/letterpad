describe("Login", () => {
  it("it works", () => {
    // cy.visitLogin();
    // cy.login({ email: "demo@demo.com", password: "demo" });
    cy.location("pathname").should("eq", "/admin/posts");
  });
});

const asModule = {};
export default asModule;
