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

      const dbSucessResponse =  [[{
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

  describe('Função create', () => { 
    // describe('Erro ao criar produto', () =>)

    describe('Sucesso ao criar produto', () => {
      const mockProduct = { name: "produto", quantity: 2 }

      const dbSucessResponse = [[{
        fieldCount: 0,
        affectedRows: 1,
        insertId: 4,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      }],[]];

      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
      
      after(() => {
        connection.execute.restore();
      });

      it('retorno não é vazio', async () => {
        const response = await productModels.create(mockProduct);
        expect(response).to.be.not.empty;
      });

      it('Cria produto com sucesso retornando o id do produto', async () => {
        const [response] = await productModels.create(mockProduct);
          
        expect(response.insertId).to.be.deep.equal(4);
      });

      it('O objeto retornado contém as chaves: insertId', async () => {
        const [response] = await productModels.create(mockProduct);
          
        expect(response).to.include.all.keys(
          "insertId",
        );
      });
    });
   });

   describe('Função update', () => { 
    describe('Erro ao passar nenhum parâmetro', () => { 
      it("Retorna um TypeError", async () => {
        try {
          await productModels.update();
        } catch (e) {
          expect(e).to.be.an.instanceof(TypeError);
        }
      });
    })

    describe('Sucesso ao atualizar produto', () => {
      const productModel = { id: 4, name: "produto", quantity: 15 }
         
      const dbSucessResponse =  [
        [{
          fieldCount: 0,
          affectedRows: 1,
          insertId: 0,
          info: 'Rows matched: 1  Changed: 1  Warnings: 0',
          serverStatus: 2,
          warningStatus: 0,
          changedRows: 1
        }], []];

      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
    
      after(() => {
        connection.execute.restore();
      });

      it("objeto não é vazio", async () => {
        const response = await productModels.update(productModel);
        expect(response).to.be.not.empty;
      });

      it('Atualização afeta apenas 1 linha', async () => {
        const [response] = await productModels.update(productModel);
        
        expect(response.affectedRows).to.be.equal(1);
      })

      it('Atualização info da mudança como esperado', async () => {
        const [response] = await productModels.update(productModel);
        const info = 'Rows matched: 1  Changed: 1  Warnings: 0';
        
        expect(response.info).to.be.equal(info);
      })
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
        const response = await productModels.destroy();
        expect(response).to.be.deep.equal([]);
      })
    })

    describe('Se id existir,', () => {
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
      ];

      before(() => {
        sinon.stub(connection, "execute").resolves(dbSucessResponse);
      });
  
      after(() => {
        connection.execute.restore();
      });

      it('retorna um objeto', async () => {
        const response = await productModels.destroy(1);
        expect(typeof response).to.be.equal("object");
      })

      it("objeto não é vazio", async () => {
        const [response] = await productModels.destroy(1);
        expect(response).to.be.not.empty;
      });
    })
  })
});