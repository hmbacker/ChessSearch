describe("The Search Page", function() {
  it("successfully loads", function() {
    cy.visit("/"); // change URL to match your dev URL
  });

  it("has correct title", () => {
    cy.contains("Chess Search");
  });

  it("shows result after clicking submit", () => {
    cy.get(".submit").click();
    cy.contains("Increment");
  });
  it("opens gamepage when clicking details", () => {
    cy.get(".more-info-cell")
      .first()
      .click();
    cy.url().should("include", "005lW0Xz"); //id of the first game in results
  });
});
