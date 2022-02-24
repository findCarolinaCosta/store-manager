const sinon = require('sinon');
const { expect } = require('chai');

const productModels = require('../../../models/products');
const productsServices = require('../../../services/products');

describe('SERVICE TESTS', () => {
  describe('Testa função getAll', () => {
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
      
      const dbSucessResponse =   [
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
  
      before(() => {
        sinon.stub(productModels, 'getAll').resolves(dbSucessResponse);
      });
  
      after(() => {
        productModels.getAll.restore();
      });

      it('Retorna um array', async () => {
        const products = await productsServices.getAll();

        expect(typeof products).to.be.equal("object");
      })
  
      it('Retorna array de objeto com as informações dos produtos', async () => {
        const products = await productsServices.getAll();

        expect(products).to.be.deep.equal(productsMock);
      });

      it('Os objetos contém as chaves: id, name e quantity', async () => {
        const products = await productsServices.getAll();

        expect(products[0]).to.include.all.keys(
          "id",
          "name",
          "quantity",
        );
      })
  })

  describe('Testa função findById', () => {
    describe('Falha ao listar um produto pelo id', () => {
      const dbFailResponse = null;
      before(() => {
        sinon.stub(productModels, 'findById').resolves(dbFailResponse);
      });
  
      after(() => {
        productModels.findById.restore();
      });
  
      it("Se falhar", async () => {
        const response = await productsServices.findById();
        expect(response).to.be.deep.equal(null);
      });
    });
  
    describe('Se der bom', () => {
      const productMock =  {
        id: 1,
        name: "produto A",
        quantity: 10
      }

      const dbSucessResponse =  {
        "id": 1,
        "name": "produto A",
        "quantity": 10
      }
    
      before(() => {
        sinon.stub(productModels, 'findById').resolves(dbSucessResponse);
      });
    
      after(() => {
        productModels.findById.restore();
      });

      it('Retorna um objeto com as informações do produto', async () => {
        const response = await productsServices.findById(1);
  
        expect(response).to.be.deep.equal(productMock);
      });

      it('O objeto retornado contém as chaves: id, name e quantity', async () => {
        const modelResponse = await productsServices.findById(1);

        expect(modelResponse).to.include.all.keys(
          "id",
          "name",
          "quantity",
        );
      })
    })
  });
});