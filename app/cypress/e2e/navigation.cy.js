describe("Navigation and User Registration E2E Tests", () => {
  it("creates a user against real API and updates count", () => {
    const suffix = Date.now();
    const newUser = {
      firstName: "Théo",
      lastName: "Lafond",
      email: `theo.${suffix}@example.com`,
      birthDate: "2001-09-02",
      zip: "03100",
      city: "Montluçon",
    };

    cy.visit("/");

    cy.get("[data-cy=user-count]")
      .invoke("text")
      .then((countText) => {
        const initialCount = Number(countText.trim());

        cy.get("[data-cy=nav-register]").click();
        cy.url().should("include", "/register");

        cy.get("[data-cy=firstName]").type(newUser.firstName);
        cy.get("[data-cy=lastName]").type(newUser.lastName);
        cy.get("[data-cy=email]").type(newUser.email);
        cy.get("[data-cy=birthDate]").type(newUser.birthDate);
        cy.get("[data-cy=zip]").type(newUser.zip);
        cy.get("[data-cy=city]").type(newUser.city);
        cy.get("[data-cy=submit]").click();

        cy.contains(/enregistr/i).should("be.visible");

        cy.get("[data-cy=back-home]").click();
        cy.get("[data-cy=user-count]").should("contain", String(initialCount + 1));
        cy.get("[data-cy=user-list]").should("contain", `${newUser.firstName} ${newUser.lastName}`);
      });
  });
});
