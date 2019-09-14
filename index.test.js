const doesCharthopJobMatch = require("./index").doesCharthopJobMatch;

test("does charthop job match", () => {
  expect(
    doesCharthopJobMatch(
      {
        "contact.workEmail": "john.smith@example.com"
      },
      { mail: "john.SMITH@example-corp.com" }
    )
  ).toBeTruthy();
});
