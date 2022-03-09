const sinon = require('sinon');
const { expect } = require('chai');

const salesServices = require('../../../services/sales');
const salesControllers = require('../../../controllers/sales');

describe('SALES CONTROLLERS TESTS', () => {
  describe('Testa função getAll', () => {
      describe('Em caso de erro', () => {
        const request = {};
        const response = {};
        let next = () => {};
        
        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          next = sinon.stub().returns();
      
          sinon.stub(salesServices, 'getAll').resolves(null);
        });

        after(() => {
          salesServices.getAll.restore();
        });

        it('next é chamado', async () => {
            const error = { status: 500, message: 'Internal server error' };
            await salesControllers.getAll(request, response, next);
            expect(next.calledWith(error)).to.be.true;
        });
      });

      describe('Em caso de sucesso', () => {
        const request = {};
        const response = {};
        const next = () => {};
        const mockExpected =   [
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
        ]
        
        const mockReturnService = mockExpected;

        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
    
          sinon.stub(salesServices, 'getAll').resolves(mockReturnService);
        });
    
        after(() => {
          salesServices.getAll.restore();
        });

        it('Esperado status 200', async () => {
          await salesControllers.getAll(request, response, next);
          expect(response.status.calledWith(200)).to.be.equal(true);
        });

        it('Espera retorno de produtos no formato json', async () => {
          await salesControllers.getAll(request, response, next);
          expect(response.json.calledWith(mockExpected)).to.be.true;
        });
      });
  });

  describe('Testa função findById', () => {
    describe('Em caso de erro ao encontrar venda pelo ID', () => {
      const request = {};
      const response = {};
      let next = () => {};
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        next = sinon.stub().returns();
        request.params = {};
    
        sinon.stub(salesServices, 'findById').resolves(null);
      });

      after(() => {
        salesServices.findById.restore();
      });

      it('Levantar o erro "Sale not found" que caia no catch', async () => {
          const error = { status: 404, message: 'Sale not found' };
          await salesControllers.findById(request, response, next);
          expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('Em caso de sucesso ao encontrar venda pelo ID', () => {
      const request = {};
      const response = {};
      const next = () => {};
      const mockExpected =    [
        {
          date: "2021-09-09T04:54:29.000Z",
          productId: 1,
          quantity: 2
        },
        {
          date: "2021-09-09T04:54:54.000Z",
          productId: 2,
          quantity: 2
        }
      ]
      
      const mockReturnService = mockExpected;
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
        request.params = { id: 1 };
  
        sinon.stub(salesServices, 'findById').resolves(mockReturnService);
      });
  
      after(() => {
        salesServices.findById.restore();
      });

      it('Esperado status 200', async () => {
        await salesControllers.findById(request, response, next);
        expect(response.status.calledWith(200)).to.be.equal(true);
      });

      it('Espera retorno da venda no formato json esperado', async () => {
        await salesControllers.findById(request, response, next);
        expect(response.json.calledWith(mockExpected)).to.be.true;
      });
    });
  });

  describe('Função create', () => {
    describe('Levanta erro se a quantidade do produto comprado for maior do que tem disponível no estoque', () => { 
      const request = { };
        const response = {};
        let next = () => {};
        const body = {
          productId: 1,
          quantity: 3
        }
        
        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          request.body = sinon.stub().returns(body);
          next = sinon.stub().returns();
      
          sinon.stub(salesServices, 'create').resolves(null);
        });

        after(() => {
          salesServices.create.restore();
        });

      it('next é chamado com erro esperado', async () => {
        const error = { status: 422, message: 'Such amount is not permitted to sell' };
        await salesControllers.create(request, response, next);
        expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('quando a venda é criada com sucesso', () => {
      const request = {};
      const response = {};
      const next = () => {};

      const body = {
        productId: 1,
        quantity: 3
      }

      const mockReturnService = {
        id: 1,
        itemsSold: [
          {
            productId: 1,
            quantity: 3
          }
        ]
      };
      const mockExpected = mockReturnService;
      

        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
          request.body = sinon.stub().returns(body);
    
          sinon.stub(salesServices, 'create').resolves(mockReturnService);
        });
    
        after(() => {
          salesServices.create.restore();
        });

        it('Esperado status 200', async () => {
          await salesControllers.create(request, response, next);
          expect(response.status.calledWith(201)).to.be.true;
        });

        it('Espera retorno da venda no formato json esperado', async () => {
          await salesControllers.create(request, response, next);
          expect(response.json.calledWith(mockExpected)).to.be.true;
        });
     });
  });

  describe('Função update', () => {
    describe('Levanta erro se a venda não for encontrado', () => { 
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
      
          sinon.stub(salesServices, 'update').resolves(null);
        });

        after(() => {
          salesServices.update.restore();
        });

      it('next é chamado com erro "Sale not found" esperado', async () => {
        const error = { status: 404, message: 'Sale not found' };
        await salesControllers.update(request, response, next);
        expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('quando venda é atualizado com sucesso', () => {
      const request = {};
      const response = {};
      const next = () => {};
      const body = [{
        productId: 1,
        quantity: 6
      }]
      const mockReturnService = {
        saleId: 1,
        itemUpdated: [
          {
            productId: 1,
            quantity: 6
        }
      ]};
      const mockExpected = mockReturnService;


        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();

          request.params = sinon.stub().returns({ id: 1 });
          request.body = sinon.stub().returns(body);
    
          sinon.stub(salesServices, 'update').resolves(mockReturnService);
        });
    
        after(() => {
          salesServices.update.restore();
        });

        it('Esperado status 200', async () => {
          await salesControllers.update(request, response, next);
          expect(response.status.calledWith(200)).to.be.true;
        });

        it('Espera retorno de produtos no formato json', async () => {
          await salesControllers.update(request, response, next);
          expect(response.json.calledWith(mockExpected)).to.be.true;
        });
     });
  });

  describe('Função destroy', () => {
    describe('Levanta erro se a venda não for encontrado', () => { 
      const request = {};
        const response = {};
        let next = () => {};
        
        before(() => {
          request.params = sinon.stub().returns({ id: 5 });
          next = sinon.stub().returns();
      
          sinon.stub(salesServices, 'destroy').resolves(null);
        });

        after(() => {
          salesServices.destroy.restore();
        });

      it('next é chamado com erro "Sale not found" esperado', async () => {
        const error = { status: 404, message: 'Sale not found' };
        await salesControllers.destroy(request, response, next);
        expect(next.calledWith(error)).to.be.true;
      });
    });

    describe('quando a venda é excluida com sucesso', () => {
      const request = {};
      const response = {};
      let next = () => {};

      const mockReturnService = {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 0,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      } 
      
      before(() => {
        response.status = sinon.stub().returns(response);
        response.end = sinon.stub().returns();
        request.params = sinon.stub().returns({ id: 1 });
        next = sinon.stub().returns();
    
        sinon.stub(salesServices, 'destroy').resolves(mockReturnService);
      });

      after(() => {
        salesServices.destroy.restore();
      });

        it('Esperado status 200', async () => {
          await salesControllers.destroy(request, response, next);
          expect(response.status.calledWith(204)).to.be.true;
        });

        it('Esperado que end seja chamado', async () => {
          await salesControllers.destroy(request, response, next);
          expect(response.end.calledWith()).to.be.true;
        });
     });
  });
});