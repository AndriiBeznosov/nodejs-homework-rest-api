require("dotenv").config();

const mongoose = require("mongoose");
const { login } = require("../controllers/users.controller");
mongoose.set("strictQuery", false);
const { HOST_TEST_URI } = process.env;

const user = {
  body: {
    email: "kovalskiy2@gmail.com",
    password: "123456789",
  },
};

describe("signup controller test", () => {
  beforeAll(async () => {
    const connection = await mongoose.connect(HOST_TEST_URI);
    console.log("Database connection successful");
    return connection;
  });

  afterAll(async () => {
    await mongoose.disconnect(HOST_TEST_URI);
  });

  it("schold register new user", async () => {
    const response = await login(user);

    expect(response.user.email).toBe(user.body.email);
    expect(response.user.subscription).toBe("starter");
    expect(response.statusCode).toBe(200);
  });
});
