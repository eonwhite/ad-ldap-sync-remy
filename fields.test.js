const transformPhone = require("./fields").transformPhone;

test("transform phone numbers", () => {
  expect(transformPhone("+15551234567")).toEqual("+1-555-123-4567");
  expect(transformPhone("+155512345678")).toEqual("+155512345678");
});
