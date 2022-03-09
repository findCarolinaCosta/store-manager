const sinon = require("sinon");
const { expect } = require("chai");

const salesModels = require("../../../models/sales");
const salesServices = require("../../../services/sales");

describe("SALES SERVICE TESTS", () => {
  describe("Função getAll", () => {
    const salesMock = [
      {
        saleId: 1,
        date: "2021-09-09T04:54:29.000Z",
        productId: 1,
        quantity: 2,
      },
      {
        saleId: 1,
        date: "2021-09-09T04:54:54.000Z",
        productId: 2,
        quantity: 2,
      },
    ];

    const dbSucessResponse = [
      {
        saleId: 1,
        date: "2021-09-09T04:54:29.000Z",
        productId: 1,
        quantity: 2,
      },
      {
        saleId: 1,
        date: "2021-09-09T04:54:54.000Z",
        productId: 2,
        quantity: 2,
      },
    ];

    before(() => {
      sinon.stub(salesModels, "getAll").resolves(dbSucessResponse);
    });

    after(() => {
      salesModels.getAll.restore();
    });

    it("Retorna um objeto", async () => {
      const sales = await salesModels.getAll();

      expect(sales).to.be.an("array");
    });

    it("objeto não é vazio", async () => {
      const sales = await salesModels.getAll();
      expect(sales).to.be.not.empty;
    });

    it("Retorna array de objeto com as informações dos produtos", async () => {
      const sales = await salesModels.getAll();

      expect(sales).to.be.deep.equal(salesMock);
    });

    it("Os objetos contém as chaves: id, name e quantity", async () => {
      const sales = await salesModels.getAll();

      sales.forEach((product) => {
        expect(product).to.include.all.keys(
          "date",
          "productId",
          "quantity",
          "saleId"
        );
      });
    });
  });

  describe("Função findById", () => {
    describe("Se id não exitir", () => {
      before(() => {
        sinon.stub(salesModels, "findById").resolves(null);
      });

      after(() => {
        salesModels.findById.restore();
      });

      it("retornar null", async () => {
        const response = await salesServices.findById(20);
        expect(response).to.be.null;
      });
    });

    describe("retorna venda pelo id", () => {
      const saleMock = {
        date: "2021-09-09T04:54:29.000Z",
        productId: 1,
        quantity: 2,
      };

      before(() => {
        sinon.stub(salesModels, "findById").resolves(saleMock);
      });

      after(() => {
        salesModels.findById.restore();
      });

      it("objeto não é vazio", async () => {
        const response = await salesModels.findById(1);
        expect(response).to.be.not.empty;
      });

      it("Retorna um objeto", async () => {
        const response = await salesModels.findById(1);

        expect(response).to.be.an("object");
      });

      it("Retorna um objeto com as informações da venda", async () => {
        const response = await salesModels.findById(1);

        expect(response).to.be.deep.equal(saleMock);
      });

      it("O objeto retornado contém as chaves: productId, quantity e date", async () => {
        const response = await salesModels.findById(1);

        expect(response).to.include.all.keys("productId", "quantity", "date");
      });
    });
  });

  describe("Função create", () => {
    describe("Quantidade da venda é maior do que a quantidade do produto em estoque", () => {
      const responseCreate = { insertId: 3 };
      const reponseProduct = [
        {
          id: 1,
          name: "produto A",
          quantity: 10,
        },
        {
          id: 2,
          name: "produto B",
          quantity: 20,
        },
      ];

      const sales = [
        {
          productId: 1,
          quantity: 20,
        },
        {
          productId: 2,
          quantity: 50,
        },
      ];

      before(() => {
        sinon.stub(salesModels, "create").resolves(responseCreate);
        sinon.stub(salesModels, "findByProductId").resolves(reponseProduct);
      });

      after(() => {
        salesModels.create.restore();
        salesModels.findByProductId.restore();
      });

      it("quantidade de produto < quantidade da venda", async () => {
        const response = await salesServices.create(sales);

        expect(response).to.be.equal(null);
      });
    });

    describe("Quantidade da venda é menor do que a quantidade do produto em estoque", () => {
      const responseCreate = { insertId: 3 };

      const sales = [
        {
          productId: 1,
          quantity: 5,
        },
      ];

      const reponseCreateProduct = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
      };

      const mockReturn = {
        id: responseCreate.insertId,
        itemsSold: sales,
      };

      before(() => {
        sinon.stub(salesModels, "create").resolves(responseCreate);
        sinon.stub(salesModels, "findByProductId").resolves([{ quantity: 20 }]);
        sinon
          .stub(salesModels, "createSalesProduct")
          .resolves(reponseCreateProduct);
      });

      after(() => {
        salesModels.create.restore();
        salesModels.findByProductId.restore();
        salesModels.createSalesProduct.restore();
      });

      it("Retorna um objeto", async () => {
        const response = await salesModels.create(sales);

        expect(response).to.be.an("object");
      });

      it("objeto não é vazio", async () => {
        const response = await salesModels.create(sales);
        expect(response).to.be.not.empty;
      });

      it("quantidade de produto >= quantidade da venda", async () => {
        const response = await salesServices.create(sales);

        expect(response).to.be.deep.equal(mockReturn);
      });

      it("objeto contém as chaves: saleId e itemsSold", async () => {
        const response = await salesServices.create(sales);

        expect(response).to.include.all.keys("id", "itemsSold");
      });

      it("valor da chave itemsSold é um objeto", async () => {
        const response = await salesServices.create(sales);

        expect(typeof response.itemsSold).to.be.equal("object");
      });

      it("valor da chave itemsSold não é vazio", async () => {
        const response = await salesServices.create(sales);
        expect(response.itemsSold).to.be.not.empty;
      });

      it("valor da chave itemsSold é um objeto com as chaves: productId e quantity", async () => {
        const response = await salesServices.create(sales);

        response.itemsSold.forEach((item) => {
          expect(item).to.include.all.keys("productId", "quantity");
        });
      });
    });
  });

  describe("Função update", () => {
    describe("Erro ao passar nenhum parâmetro", () => {
      it("Retorna um TypeError", async () => {
        try {
          await salesServices.update();
        } catch (e) {
          expect(e).to.be.an.instanceof(TypeError);
        }
      });
    });

    describe("Erro se não achar venda pelo id", () => {
      const sales = [
        {
          productId: 1,
          quantity: 5,
        },
        {
          productId: 2,
          quantity: 15,
        },
      ];

      before(() => {
        sinon.stub(salesModels, "findById").resolves(null);
      });

      after(() => {
        salesModels.findById.restore();
      });

      it("retorna null", async () => {
        const response = await salesServices.update({ sales, id: 3 });
        expect(response).to.be.null;
      });
    });

    describe("Sucesso ao atualizar vendas", () => {
      const sales = [
        {
          productId: 1,
          quantity: 5,
        },
        {
          productId: 2,
          quantity: 15,
        },
      ];

      const returnFind = [
        { productId: 1, quantity: 20, date: "2022-03-03T20:08:43.000Z" },
        { productId: 2, quantity: 3, date: "2022-03-03T20:08:43.000Z" },
      ];

      const reponseUpdateSale = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
      };

      const mockReturn = {
        saleId: 3,
        itemUpdated: sales,
      };

      before(() => {
        sinon.stub(salesModels, "findById").resolves(returnFind);
        sinon.stub(salesModels, "update").resolves(reponseUpdateSale);
      });

      after(() => {
        salesModels.update.restore();
        salesModels.findById.restore();
      });

      it("retorna um objeto", async () => {
        const response = await salesServices.update({ sales, id: 3 });
        expect(response).to.be.an("object");
      });

      it("objeto não é vazio", async () => {
        const response = await salesServices.update({ sales, id: 3 });
        expect(response).to.be.not.empty;
      });

      it("retorna objeto com as informações das vendas", async () => {
        const response = await salesServices.update({ sales, id: 3 });

        expect(response).to.be.deep.equal(mockReturn);
      });

      it("objeto contém as chaves: saleId e itemUpdated", async () => {
        const reponse = await salesServices.update({ sales, id: 3 });

        expect(reponse).to.include.all.keys("saleId", "itemUpdated");
      });

      it("chave itemUpdated é um objeto", async () => {
        const response = await salesServices.update({ sales, id: 3 });
        expect(typeof response.itemUpdated).to.be.equal("object");
      });

      it("chave itemUpdated não é um objeto vazio", async () => {
        const response = await salesServices.update({ sales, id: 3 });
        expect(response.itemUpdated).to.be.not.empty;
      });

      it("chave itemUpdated possui dois objetos", async () => {
        const reponse = await salesServices.update({ sales, id: 3 });

        expect(reponse.itemUpdated).to.be.have.length(2);
      });

      it("valor da chave itemUpdated é objeto", async () => {
        const reponse = await salesServices.update({ sales, id: 3 });

        expect(typeof reponse.itemUpdated).to.be.equal("object");
      });

      it("valor da chave itemUpdated é um objeto com as chaves: productId e quantity", async () => {
        const reponse = await salesServices.update({ sales, id: 3 });
        reponse.itemUpdated.forEach((item) => {
          expect(item).to.include.all.keys("productId", "quantity");
        });
      });
    });
  });

  describe("Função destroy", () => {
    describe("Quando id não existir", () => {
      before(() => {
        sinon.stub(salesModels, "findById").resolves(null);
      });

      after(() => {
        salesModels.findById.restore();
      });

      it("retornar false", async () => {
        const response = await salesServices.destroy(3);
        expect(response).to.be.equal(null);
      });
    });

    describe("quando id existir", () => {
      const mockReturnDestroyModel = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
      };

      const mockReturnModel = [
        {
          productId: 3,
          quantity: 15,
          date: "2022-03-03T00:57:32.000Z",
        },
      ];

      const expectedReturn = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: "",
        serverStatus: 2,
        warningStatus: 0,
      };

      before(() => {
        sinon.stub(salesModels, "findById").resolves(mockReturnModel);
        sinon.stub(salesModels, "destroy").resolves(mockReturnDestroyModel);
      });

      after(() => {
        salesModels.findById.restore();
        salesModels.destroy.restore();
      });

      it("retorna um objeto", async () => {
        const response = await salesServices.destroy(3);
        expect(response).to.be.an("object");
      });

      it("objeto não é vazio", async () => {
        const response = await salesServices.destroy(3);
        expect(response).to.be.not.empty;
      });

      it("objeto é igual ao esperado", async () => {
        const response = await salesServices.destroy(3);
        expect(response).to.be.deep.equal(expectedReturn);
      });
    });
  });
});
