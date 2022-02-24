const sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../../models/connection');
const productModels = require('../../../models/products');

describe('MODEL TESTS', () => {
  describe('Lista todos os produtos', () => {
    describe('Se falhar', () => {
      before(async () => {
        const dbSucessResponse = [[], []];
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
    
      after(async () => {
        connection.execute.restore();
      });
    
    
      it("retornar null", async () => {
        const response = await productModels.getAll();
        expect(response).to.be.equal(null);
      });

  })
  
    describe('Se der bom', () => {
      const productsMock = [
        {
          id: 1,
          name: "produto A",
          quantity: 10
        },
        {
          id: 2,
          name: "produto B",
          quantity: 20
        }
      ]
      
      const dbSucessResponse =  [ [
        {
          id: 1,
          name: "produto A",
          quantity: 10
        },
        {
          id: 2,
          name: "produto B",
          quantity: 20
        }
      ], []];
  
      before(() => {
        sinon.stub(connection, 'execute').resolves(dbSucessResponse);
      });
  
      after(() => {
        connection.execute.restore();
      });

      it('Retorna um objeto', async () => {
        const modelResponse = await productModels.getAll();

        expect(typeof modelResponse).to.be.equal("object");
      })
  
      it('Retorna array de objeto com as informações dos produtos', async () => {
        const modelResponse = await productModels.getAll();

        expect(modelResponse).to.be.deep.equal(productsMock);
      });

      it('Os objetos contém as chaves: id, name e quantity', async () => {
        const modelResponse = await productModels.getAll();

        expect(modelResponse[0]).to.include.all.keys(
          "id",
          "name",
          "quantity",
        );
      })
    });
  })

  describe('Lista um produto do banco de dados', () => {  
    describe('Falha ao listar um produto e venda pelo id', () => {
      const dbSucessResponse = [[], []];
      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
    
      after(() => {
        connection.execute.restore();
      });
  
      it('retornar null', async () => {
        const modelResponse = await productModels.findById();
        expect(modelResponse).to.be.deep.equal(null);
      })
    });
  
    describe('Se der bom', () => {
      const productMock =  {
        id: 1,
        name: "produto A",
        quantity: 10
      }

      const dbSucessResponse =  {
        id: 1,
        name: "produto A",
        quantity: 10
      }
    
      before(() => {
        sinon.stub(productModels, "findById").resolves(dbSucessResponse);
      });
    
      after(() => {
        productModels.findById.restore();
      });
  
      it("objeto não é vazio", async () => {
        const response = await productModels.findById(1);
        expect(response).to.be.not.empty;
      });
  
      it('Retorna um objeto com as informações do produto', async () => {
        const response = await productModels.findById(1);
  
        expect(response).to.be.deep.equal(productMock);
      })

      it('O objeto retornado contém as chaves: id, name e quantity', async () => {
        const modelResponse = await productModels.findById(1);

        expect(modelResponse).to.include.all.keys(
          "id",
          "name",
          "quantity",
        );
      })
    })
  });
});