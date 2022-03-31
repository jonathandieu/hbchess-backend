import request from "supertest";
import { app } from "../setUpServer";
import { setupDB } from "./tests_setup";

setupDB();

// describe("POST /users/login", () => {
//   describe("given a VALID email and password", () => {
//     test("should respond with a 200 status code", async () => {
//       const response = await request(app).post("/api/users/login").send({
//         email: "email@gmail.com",
//         password: "password"
//       });
//       expect(response.statusCode).toBe(200);
//     });
//   });

describe("POST /users/login", () => {
  describe("given an email and password", () => {
    test("should respond with a 400 status code", async () => {
      const response = await request(app).post("/api/users/login").send({
        email: "email@gmail.com",
        password: "password"
      });
      expect(response.statusCode).toBe(400);
    });
  });

  describe("when the username and password is missing", () => {
    test("should respond with a status code of 400", async () => {
      const bodyData = [{ email: "email" }, { password: "password" }, {}];
      for (const body of bodyData) {
        const response = await request(app).post("/api/users/login").send(body);
        expect(response.statusCode).toBe(400);
      }
    });
  });
});
