import chai from "chai";
import chaiHttp from "chai-http";
import server from "../app.js";
import fakeTimers from "@sinonjs/fake-timers";
import { sleep } from "../src/utils/index.js";

const tokenTimeout = parseInt(process.env.TOKEN_TTL);

chai.should();
chai.use(chaiHttp);
const clock = fakeTimers.install({shouldAdvanceTime: true});

before( async() => {
    // Wait for one second for setup
    await sleep(1000);
})

after( async () => {
    await server.close();
    console.log("Server closed");
});

afterEach(() => {
    clock.reset();
});

describe("Test /token/", function() {
    describe("/token/generate?=[number]", () => {
        it("should reject non-numeric parameters", async () => {
            let response = await chai
                .request(server)
                .post("/token/generate")
                .send({ tokens: "100a" });

            response.should.have.status(400);
        });
        it("should create 5 tokens for parameter 5", async () => {
            let response = await chai
                .request(server)
                .post("/token/generate")
                .send({ tokens: "5" });

            response.should.have.status(200);

            let body = JSON.parse(response.text);
            body.should.have.property("created");
            body.created.should.be.a("number");
            body.should.have.property("token");
            body.token.should.be.a("array");
            body.token.length.should.equal(5);
            body.token[0].should.be.a("string");
            this.tokenIds = body.token;
            console.log(body.token);
        });
    });

    describe("/token/check/[token]", () => {
        it("should identify available token", async () => {
            let response = await chai
                .request(server)
                .get("/token/check/" + this.tokenIds[0])
                .send();

            response.should.have.status(200);
            let body = JSON.parse(response.text);
            body.status.should.equal("available");
        });

        it("should identify redeemed token", async () => {
            // Redeem a token beforehand
            await chai
                .request(server)
                .put("/token/redeem/" + this.tokenIds[0])
                .send();

            let response = await chai
                .request(server)
                .get("/token/check/" + this.tokenIds[0])
                .send();

            response.should.have.status(200);
            let body = JSON.parse(response.text);
            body.status.should.equal("redeemed");
        });

        it("should identify expired token", async () => {
            // Advance time to after token timeout
            clock.tick(tokenTimeout + 10000);
            let response = await chai
                .request(server)
                .get("/token/check/" + this.tokenIds[1])
                .send();

            response.should.have.status(200);
            let body = JSON.parse(response.text);
            body.status.should.equal("expired");
        });

        it("should report invalid token", async() => {
            let response = await chai
                .request(server)
                .get("/token/check/1000")
                .send();

            response.should.have.status(200);
            let body = JSON.parse(response.text);
            body.status.should.equal("invalid");
        });
    });

    describe("/token/redeem/[token]", () => {
        it("should redeem available token", async () => {
            let response = await chai
                .request(server)
                .put("/token/redeem/" + this.tokenIds[2])
                .send();

            response.should.have.status(200);
            let body = JSON.parse(response.text);
            body.result.should.equal("ok");
        });

        it("should reject already redeemed token", async () => {
            let response = await chai
                .request(server)
                .put("/token/redeem/" + this.tokenIds[2])
                .send();

            response.should.have.status(410);
            let body = JSON.parse(response.text);
            body.result.should.equal("redeemed");
        });

        it("should reject expired token", async () => {
            // Advance time to after token timeout.
            clock.tick(tokenTimeout + 10000);
            let response = await chai
                .request(server)
                .put("/token/redeem/" + this.tokenIds[3])
                .send();

            response.should.have.status(410);
            let body = JSON.parse(response.text);
            body.result.should.equal("expired");
        });

        it("should reject invalid token", async() => {
            let response = await chai
                .request(server)
                .put("/token/redeem/1000")
                .send();

            response.should.have.status(410);
            let body = JSON.parse(response.text);
            body.result.should.equal("invalid");
        });
    });
});