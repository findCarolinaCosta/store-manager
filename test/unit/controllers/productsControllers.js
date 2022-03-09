const sinon = require('sinon');
const { expect } = require('chai');

const productsServices = require('../../../services/products');
const productsControllers = require('../../../controllers/products');

describe('CONTROLLERS PRODUCTS TESTS', () => {
  describe('Testa função getAll', () => {
      const productsMock = [
        {
          id: 1,
          name: 'produto A',
          quantity: 10,
        },
        {
          id: 2,
          name: 'produto B',
          quantity: 20,
        },
      ];
      
      const dbSucessResponse = [
        {
          id: 1,
          name: 'produto A',
          quantity: 10,
        },
        {
          id: 2,
          name: 'produto B',
          quantity: 20,
        },
      ];

      describe('Erro no catch', () => {
        const request = {};
        const response = {};
        let next = () => {};
        
        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          next = sinon.stub().returns();
      
          sinon.stub(productsServices, 'getAll').resolves(null);
        });

        after(() => {
          productsServices.getAll.restore();
        });

        it('next é chamado', async () => {
            const error = { status: 500, message: 'Internal server error' };
            await productsControllers.getAll(request, response, next);
            expect(next.calledWith(error)).to.be.true;
        });
      });

      describe('Em caso de sucesso', () => {
        const request = {};
        const response = {};
        const next = () => {};
        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
    
          sinon.stub(productsServices, 'getAll').resolves(dbSucessResponse);
        });
    
        after(() => {
          productsServices.getAll.restore();
        });

        it('Esperado status 200', async () => {
          await productsControllers.getAll(request, response, next);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('Espera retorno de produtos no formato json', async () => {
          await productsControllers.getAll(request, response, next);
          expect(response.json.calledWith(productsMock)).to.be.true;
        });
      });
  });

  describe('Testa função findById', () => {
    const productMock = {
      id: 1,
      name: 'produto A',
      quantity: 10,
    };

    const dbSucessResponse = {
      id: 1,
      name: 'produto A',
      quantity: 10,
    };

    describe('Erro no catch', () => {
      const request = {};
      const response = {};
      let next = () => {};
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = sinon.stub().returns();
        request.params = {};
    
        sinon.stub(productsServices, 'findById').resolves(null);
      });

      after(() => {
        productsServices.findById.restore();
      });

      it('Levantar o erro esperado que caia no catch', async () => {
          const error = { status: 400, message: 'Bad Request' };
          await productsControllers.findById(request, response, next);
          expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('Produto não encontrado', () => {
      const request = {};
      const response = {};
      let next = () => {};

      before(() => {
        request.params = { id: 10 };

        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = sinon.stub().returns();
        sinon.stub(productsServices, 'findById').resolves(null);
      });
  
      after(() => {
        productsServices.findById.restore();
      });

      it('levanta erro esperado', async () => {
        const error = { status: 404, message: 'Product not found' };  
        await productsControllers.findById(request, response, next);
        expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('Em caso de sucesso', () => {
      const request = {};
      const response = {};
      const next = () => {};
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = { id: 1 };
  
        sinon.stub(productsServices, 'findById').resolves(dbSucessResponse);
      });
  
      after(() => {
        productsServices.findById.restore();
      });

      it('Esperado status 200', async () => {
        await productsControllers.findById(request, response, next);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('Espera retorno de produtos no formato json', async () => {
        await productsControllers.findById(request, response, next);
        expect(response.json.calledWith(productMock)).to.be.true;
      });
    });
  });

  describe('Função create', () => {
    describe('Levanta erro se o produto já existe', () => { 
      const request = { };
        const response = {};
        let next = () => {};
        
        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          request.body = sinon.stub().returns({ name: 'produto A', quantity: 2 });
          next = sinon.stub().returns();
      
          sinon.stub(productsServices, 'create').resolves(null);
        });

        after(() => {
          productsServices.create.restore();
        });

      it('next é chamado', async () => {
        const error = { status: 409, message: 'Product already exists' };
        await productsControllers.create(request, response, next);
        expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('quando produto é criado com sucesso', () => {
      const request = {};
      const response = {};
      const next = () => {};

      const productMock = {
        id: 1,
        name: 'produto A',
        quantity: 10,
      };

      const body = {
        name: productMock.name,
        quantity: productMock.quantity,
      };
  
      const dbSucessResponse = {
        id: 1,
        name: 'produto A',
        quantity: 10,
      };

        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          request.body = sinon.stub().returns(body);
    
          sinon.stub(productsServices, 'create').resolves(dbSucessResponse);
        });
    
        after(() => {
          productsServices.create.restore();
        });

        it('Esperado status 200', async () => {
          await productsControllers.create(request, response, next);
          expect(response.status.calledWith(201)).to.be.true;
        });

        it('Espera retorno de produtos no formato json', async () => {
          await productsControllers.create(request, response, next);
          expect(response.json.calledWith(productMock)).to.be.true;
        });
     });
  });

  describe('Função update', () => {
    describe('Levanta erro se produto não for encontrado', () => { 
      const request = {};
        const response = {};
        let next = () => {};
        const body = {
          name: 'produto Z',
          quantity: 4,
        };
        
        before(() => {
          request.params = sinon.stub().returns(5);
          request.body = sinon.stub().returns(body);
          next = sinon.stub().returns();
      
          sinon.stub(productsServices, 'update').resolves(null);
        });

        after(() => {
          productsServices.update.restore();
        });

      it('next é chamado com erro esperado', async () => {
        const error = { status: 404, message: 'Product not found' };
        await productsControllers.update(request, response, next);
        expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('quando produto é atualizado com sucesso', () => {
      const request = {};
      const response = {};
      const next = () => {};

      const productMock = {
        id: 1,
        name: 'produto A',
        quantity: 15,
      };

      const body = {
        name: productMock.name,
        quantity: productMock.quantity,
      };
  
      const dbSucessResponse = {
        id: 1,
        name: 'produto A',
        quantity: 15,
      };

        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          request.params = sinon.stub().returns(5);
          request.body = sinon.stub().returns(body);
    
          sinon.stub(productsServices, 'update').resolves(dbSucessResponse);
        });
    
        after(() => {
          productsServices.update.restore();
        });

        it('Esperado status 200', async () => {
          await productsControllers.update(request, response, next);
          expect(response.status.calledWith(200)).to.be.true;
        });

        it('Espera retorno de produtos no formato json', async () => {
          await productsControllers.update(request, response, next);
          expect(response.json.calledWith(productMock)).to.be.true;
        });
     });
  });

  describe('Função destroy', () => {
    describe('Levanta erro se produto não for encontrado', () => { 
      const request = {};
        const response = {};
        let next = () => {};
        
        before(() => {
          request.params = sinon.stub().returns(5);
          next = sinon.stub().returns();
      
          sinon.stub(productsServices, 'destroy').resolves(false);
        });

        after(() => {
          productsServices.destroy.restore();
        });

      it('next é chamado com erro esperado', async () => {
        const error = { status: 404, message: 'Product not found' };
        await productsControllers.destroy(request, response, next);
        expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('quando produto é excluido com sucesso', () => {
      const request = {};
      const response = {};
      const next = () => {};
  
      const dbSucessResponse = {
        id: 1,
        name: 'produto A',
        quantity: 15,
      };

        before(() => {
          response.status = sinon.stub().returns(response);
          response.end = sinon.stub().returns();

          request.params = sinon.stub().returns(1);
    
          sinon.stub(productsServices, 'destroy').resolves(dbSucessResponse);
        });
    
        after(() => {
          productsServices.destroy.restore();
        });

        it('Esperado status 200', async () => {
          await productsControllers.destroy(request, response, next);
          expect(response.status.calledWith(204)).to.be.true;
        });

        it('Esperado que end seja chamado', async () => {
          await productsControllers.destroy(request, response, next);
          expect(response.end.calledWith()).to.be.true;
        });
     });
  });
});