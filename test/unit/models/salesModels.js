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
      describe('Criação de apenas uma venda', () => { 
          const saleMock = {
            fieldCount: 0,
            affectedRows: 1,
            insertId: 3,
            info: '',
            serverStatus: 2,
            warningStatus: 0
          }

          const dbSucessResponse = [{
            fieldCount: 0,
            affectedRows: 1,
            insertId: 3,
            info: '',
            serverStatus: 2,
            warningStatus: 0
          }]

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
     })
   })

   describe('Função createSalesProduct', () => { 

      describe('Erro ao passar nenhum dado do objeto', () => { 
        it("Retorna um TypeError", async () => {
          try {
            await salesModels.createSalesProduct();
          } catch (e) {
            expect(e).to.be.an.instanceof(TypeError);
          }
        });
      })

     describe('Cria um produto por vez', () => { 
      const saleMock = {
        saleId: 1,
        productId: 2,
        quantity: 2,
      }
  
       const dbSucessResponse =  [[
         {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: '',
          serverStatus: 2,
          warningStatus: 0
        }
      ], []]
  
      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
    
      after(() => {
        connection.execute.restore();
      });
  
      // testando se sempre retorna objeto não vazio
      it("objeto não é vazio", async () => {
        const response = await salesModels.createSalesProduct(saleMock);
        expect(response).to.be.not.empty;
      });
  
      // testando se afeta uma linha
      it('Cria o produto corretamente', async () => {
        const response = await salesModels.createSalesProduct(saleMock);
        
        expect(response[0].affectedRows).to.be.equal(1);
      })
    })
  })

  describe('Função update', () => {
    describe('Erro ao passar nenhum parâmetro', () => { 
      it("Retorna um TypeError", async () => {
        try {
          await salesModels.update();
        } catch (e) {
          expect(e).to.be.an.instanceof(TypeError);
        }
      });
    })

    describe('Retorna quantidade de linhas afetadas', () => { 
      const saleMock = {
        saleId: 1,
        productId: 2,
        quantity: 20,
      }
  
       const dbSucessResponse =  [
         {
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: '',
          serverStatus: 2,
          warningStatus: 0
        }
      ]
  
      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
    
      after(() => {
        connection.execute.restore();
      });
  
      // testando se sempre retorna objeto não vazio
      it("objeto não é vazio", async () => {
        const response = await salesModels.update(saleMock);
        expect(response).to.be.not.empty;
      });
  
      // testando se afeta uma linha
      it('Atualização afeta apenas 1 linha', async () => {
        const response = await salesModels.update(saleMock);
        
        expect(response.affectedRows).to.be.equal(1);
      })
     })
  })
})

describe('Função findByProductId', () => {
  describe('Se id não exitir', () => { 
    const dbSucessResponse = [[], []];
    before(() => {
      sinon.stub(connection, "execute").resolves(dbSucessResponse);
    });
  
    after(() => {
      connection.execute.restore();
    });

    it('retornar null', async () => {
      const response = await salesModels.findByProductId();
      expect(response).to.be.deep.equal(null);
    })
  })

  describe('Se id exitir', () => {
    const productMock =  {
    id: 1,
    name: "produto A",
    quantity: 10
    }

    const dbSucessResponse =   [[{
    id: 1,
    name: "produto A",
    quantity: 10
    }], []]

    before(() => {
      sinon.stub(connection, "execute").resolves(dbSucessResponse);
    });

    after(() => {
      connection.execute.restore();
    });

    it("objeto não é vazio", async () => {
      const response = await salesModels.findByProductId(1);
      expect(response).to.be.not.empty;
    });

    it('Retorna um objeto com as informações do produto', async () => {
      const [response] = await salesModels.findByProductId(1);

      expect(response).to.be.deep.equal(productMock);
    })

    it('O objeto retornado contém as chaves: id, name e quantity', async () => {
      const [response] = await salesModels.findByProductId(1);

      expect(response).to.include.all.keys(
      "id",
      "name",
      "quantity",
      );
    })
  })

  describe('Função destroy', () => { 
    describe('Se id não exitir', () => { 
      const dbSucessResponse = [[], []];
      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
    
      after(() => {
        connection.execute.restore();
      });
  
      it('retornar null', async () => {
        const response = await salesModels.findByProductId();
        expect(response).to.be.deep.equal(null);
      })
    })
   })

   describe('Se id exitir', () => { 
    const productMock =  {
      fieldCount: 0,
      affectedRows: 0,
      insertId: 0,
      info: '',
      serverStatus: 2,
      warningStatus: 0
    }
  
    const dbSucessResponse =  [ 
      [{
        fieldCount: 0,
        affectedRows: 0,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      }],
      []
    ]
  
    before(() => {
      sinon.stub(connection, "execute").resolves(dbSucessResponse);
    });

    after(() => {
      connection.execute.restore();
    });

    it('retorna um array de objeto', async () => {
      const [response] = await salesModels.destroy(1);
      expect(response).to.be.deep.equal(productMock);
    })
  })
})