const sinon = require('sinon');
const { expect } = require('chai');

const connection = require('../../../models/connection');
const salesModels = require('../../../models/sales');

describe('SALES MODEL TESTS', () => {
  describe('Testa função getAll', () => {
    describe('retorna todas as vendas do banco de dados', () => {
      const salesMock =  [
        {
          saleId: 1,
          date: "2021-09-09T04:54:29.000Z",
          productId: 1,
          quantity: 2
        },
        {
          saleId: 1,
          date: "2021-09-09T04:54:54.000Z",
          productId: 2,
          quantity: 2
        }
      ];
      
      const dbSucessResponse = [[
        {
          sale_id: 1,
          date: "2021-09-09T04:54:29.000Z",
          product_id: 1,
          quantity: 2
        },
        {
          sale_id: 1,
          date: "2021-09-09T04:54:54.000Z",
          product_id: 2,
          quantity: 2
        }
      ], []];

      before(() => {
        sinon.stub(connection, 'execute').resolves(dbSucessResponse);
      });

      after(() => {
        connection.execute.restore();
      });

      it('Retorna um objeto', async () => {
        const response = await salesModels.getAll();

        expect(typeof response).to.be.equal("object");
      })

      it('Retorna todos os produtos', async () => {
        const salesResponse = await salesModels.getAll();
        expect(salesResponse).to.be.deep.equal(salesMock);
      });

      it('Os objetos contém as chaves: saleId, productId, quantity e date', async () => {
        const salesResponse = await salesModels.getAll();

        expect(salesResponse[0]).to.include.all.keys(
          "saleId",
          "productId",
          "quantity",
          "date"
        );
      });
    });
  })

  describe('Testa função findById', () => {
    describe('Se id não exitir', () => { 
        const dbSucessResponse = [[], []];
      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
    
      after(() => {
        connection.execute.restore();
      });
  
      it('retornar null', async () => {
        const response = await salesModels.findById();
        expect(response).to.be.deep.equal(null);
      })
     })
    describe('retorna venda pelo id', () => {
      const saleMock = [{
          date: "2021-09-09T04:54:29.000Z",
          productId: 1,
          quantity: 2
        }]

      const dbSucessResponse = [[{
          date: "2021-09-09T04:54:29.000Z",
          product_id: 1,
          quantity: 2
        }], []]

      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
    
      after(() => {
        connection.execute.restore();
      });

      it("objeto não é vazio", async () => {
        const [response] = await salesModels.findById(1);
        expect(response).to.be.not.empty;
      });
  
      it('Retorna um objeto com as informações da venda', async () => {
        const response = await salesModels.findById(1);
  
        expect(response).to.be.deep.equal(saleMock);
      })

      it('O objeto retornado contém as chaves: productId, quantity e date', async () => {
        const [response] = await salesModels.findById(1);

        expect(response).to.include.all.keys(
          "productId",
          "quantity",
          "date"
        );
      })
    })
  });

  describe('Testa função create', () => { 
    describe('Sucesso na criação da venda', () => {
      describe('Criação de uma venda', () => { 
          const saleMock = { insertId: 3 }

          const dbSucessResponse = [{ insertId: 3 }]

          before(() => {
            sinon.stub(connection, "execute").resolves(dbSucessResponse);
          });
        
          after(() => {
            connection.execute.restore();
          });

          it("objeto não é vazio", async () => {
            const response = await salesModels.create();
            expect(response).to.be.not.empty;
          });

          it('Cria venda', async () => {
            const response = await salesModels.create();
          
          expect(response).to.be.deep.equal(saleMock);
          });

          it('O objeto retornado contém as chaves: productId e quantity', async () => {
            const response = await salesModels.create();
          
            expect(response).to.include.all.keys(
              "insertId",
          );
        })
      })

      //  describe('Criação de várias vendas', () => { 
      //   const saleMock =  []

      // const dbSucessResponse = []

      // before(() => {
      //   sinon.stub(connection, "execute").resolves(dbSucessResponse);
      // });
    
      // after(() => {
      //   connection.execute.restore();
      // });

      //   })
      
     })
   })
})