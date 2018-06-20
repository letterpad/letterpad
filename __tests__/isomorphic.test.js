import fetch from "isomorphic-fetch";
import config from "../config";

describe("Test Server", () => {
    beforeAll(async done => {
        // increase callback async time for requests.
        jest.setTimeout(10000);
        // set the environment to production
        process.env = { ...process.env, NODE_ENV: "prod" };
        // start the server and preserve the instance.
        const exec = require("child_process").exec;
        exec("theme=hugo yarn run prod");

        // wait for the server to boot up. It usually takes 2-3 seconds
        setTimeout(() => {
            done();
        }, 5000);
    });

    afterAll(function(done) {
        done();
    });

    test("Should return 200 as status code for client", done => {
        fetch(config.rootUrl)
            .then(res => {
                if (res.status !== 200) {
                    throw new Error("Server rendering failed");
                }
                return res.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(data, "text/html");
                console.log(doc.querySelectorAll("article"));
                expect(doc.querySelectorAll("article").length).toBeGreaterThan(
                    3
                );
                done();
            });
    });
});
