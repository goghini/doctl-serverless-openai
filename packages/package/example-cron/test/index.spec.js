// Refers to the index.js in directory above
const { main } = require("../index");

describe("Test App", () => {
    test("Hello", () => {

        // Note the global call due to the webpack requirement
        let response = global.main({ name: "test_name" });
        expect(response.body).toEqual("Hello test_name!");
    });
});
