import request from "supertest";
import { App } from "../app.ts";
import { describe, expect, it } from "@rstest/core";

describe("GET /", () => {
    it("responds with json", async () => {
        const response = await request(App)
            .get("/")
            .set("Accept", "application/json")
            .expect("Content-Type", /json/)
            .expect(200);

        expect(response.body).toEqual({
            success: true,
            status: "Hello World!"
        });
    });
});


