const axios = require("axios");
const expect = require("chai").expect;

const recibirProd = () => axios("http://localhost:8080/api/productos/");

 describe("Comprobando que el servidor funcione bien", function () {
  it("Debe responder status 200", function (done) {
    recibirProd()
      .then((response) => {
        expect(response.status).to.eql(200);
        done();
      })
      .catch((error) => {
        console.log(error);
        done();
      });
  });
});
 
