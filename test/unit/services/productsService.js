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

  describe('Função create', () => { 
    describe('Erro ao passar nenhum parâmetro', () => { 
      it("Retorna um TypeError", async () => {
        try {
          await productModels.create();
        } catch (e) {
          expect(e).to.be.an.instanceof(TypeError);
        }
      });
    })
    
    describe('Produto já existe', () => { 
      const mockProductToCreate = {
          name: "produto A",
          quantity: 10
        }
      
      const getAllResponse =   [
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
        sinon.stub(productModels, 'getAll').resolves(getAllResponse);
      });
    
      after(() => {
        productModels.getAll.restore();
      });

      it('Retorno null se produto existir', async () => {
        const response = await productsServices.create(mockProductToCreate);
        expect(response).to.be.deep.equal(null);
      })
    })

    describe('Sucesso ao criar produto', () => { 
      const mockProductToCreate = {
        name: "produto C",
        quantity: 10
      }
    
      const getAllResponse =   [
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

      const expectation = {
        id: 3,
        name: "produto C",
        quantity: 10
      }


      before(() => {
        sinon.stub(productModels, 'getAll').resolves(getAllResponse);
        sinon.stub(productModels, 'create').resolves({ insertId: 3 });
      });
    
      after(() => {
        productModels.getAll.restore();
      });

      it("objeto não é vazio", async () => {
        const response = await productsServices.create(mockProductToCreate);
        expect(response).to.be.not.empty;
      });

      it('Retorno de objeto esperado com chave id', async () => {
        const response = await productsServices.create(mockProductToCreate);
        expect(response).to.be.deep.equal(expectation)
      })

      it('O objeto contém as chaves: id, name e quantity', async () => {
        const response = await productsServices.create(mockProductToCreate);

        expect(response).to.include.all.keys(
          "id",
          "name",
          "quantity",
        );
      })

      it('id não pode ser 0', async () => {
        const response = await productsServices.create(mockProductToCreate);

        expect(response.id).not.to.be.equal(0)
      })
    })
   })

   describe('Função update', () => {
    describe('Erro ao passar nenhum parâmetro', () => { 
      it("Retorna um TypeError se não haver parâmetro", async () => {
        try {
          await productModels.update();
        } catch (e) {
          expect(e).to.be.an.instanceof(TypeError);
        }
      });
    })

    describe('Atualizar produto que não existe', () => { 
      const mockProductToCreate = {
        id: 3,
        name: "produto C",
        quantity: 10
      }
      
      const getAllResponse =   [
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
        sinon.stub(productModels, 'getAll').resolves(getAllResponse);
      });
    
      after(() => {
        productModels.getAll.restore();
      });

      it('Retorno null se produto não existir', async () => {
        const response = await productsServices.update(mockProductToCreate);
        expect(response).to.be.deep.equal(null);
      })
    })

    describe('Verifica se produto foi atualizado realmente', () => {
      const mockProduct = {
        id: 1,
        name: "produto A",
        quantity: 15
      }
      
      const getAllResponse =   [
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
        sinon.stub(productModels, 'getAll').resolves(getAllResponse);
        sinon.stub(productModels, 'update').resolves({ affectedRows: 0 });
      });
    
      after(() => {
        productModels.getAll.restore();
        productModels.update.restore();
      });

      it('nenhuma linha afetada', async () => {
        const response = await productsServices.update(mockProduct);
        expect(response).to.be.deep.equal(null);
      })
     })
     
     describe('Sucesso ao atualizar produto', () => { 
      const mockProduct = {
        id: 1,
        name: "produto A",
        quantity: 15
      }
      
      const getAllResponse =   [
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
        sinon.stub(productModels, 'getAll').resolves(getAllResponse);
        sinon.stub(productModels, 'update').resolves({ affectedRows: 1 });
      });
    
      after(() => {
        productModels.getAll.restore();
        productModels.update.restore();
      });

      it("objeto não é vazio", async () => {
        const response = await productsServices.update(mockProduct);
        expect(response).to.be.not.empty;
      });

      it('retorna objeto esperado', async () => {
        const response = await productsServices.update(mockProduct);
        expect(response).to.be.deep.equal(mockProduct);
      })

      it('O objeto contém as chaves: id, name e quantity', async () => {
        const products = await productsServices.update(mockProduct);

        expect(products).to.include.all.keys(
          "id",
          "name",
          "quantity",
        );
      })
    })

    describe('Função destroy', () => { 
      describe('Se produto não existir', () => { 
        before(() => {
          sinon.stub(productModels, 'findById').resolves(null);
        })

        after(() => {
          productModels.findById.restore();
        })

        it('retorna false se produto não existir', async () => {
          const response = await productsServices.destroy(100);
          expect(response).to.be.false;
        })
       })
    })

    describe('Sucesso ao excluir produto', () => {
      const resultSetHeader = {
        fieldCount: 0,
        affectedRows: 0,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      }
      

      const mockReturnFindById =  {
        "id": 1,
        "name": "produto A",
        "quantity": 10
      }

      before(() => {
        sinon.stub(productModels, 'findById').resolves(mockReturnFindById);
        sinon.stub(productModels, 'destroy').resolves(resultSetHeader);
      })

      after(() => {
        productModels.findById.restore();
        productModels.destroy.restore();
      })

      it("objeto não é vazio", async () => {
        const response = await productsServices.destroy(1);
        expect(response).to.be.not.empty;
      });

      it('retorna "true"', async () => {
        const response = await productsServices.destroy(1);
        expect(typeof response).to.be.equal("object");
      })
    })
  })
});