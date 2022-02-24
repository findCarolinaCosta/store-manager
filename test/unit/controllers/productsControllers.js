const sinon = require('sinon');
const { expect } = require('chai');

const productsServices = require('../../../services/products');
const productsControllers = require('../../../controllers/products');

describe('CONTROLLERS TESTS', () => {
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

      // describe('Erro no catch', () => {
      //   const request = {};
      //   const response = {};
      //   let next = () => {};
      //   before(() => {
      //     response.status = sinon.stub().returns(response);
      //     response.json = sinon.stub().returns()
      //     next = sinon.stub().returns();
      
      //     sinon.stub(productsServices, 'getAll').resolves(false);
      //   });
  
      //   after(() => {
      //     productsServices.getAll.restore();
      //   })

      //   it('erro status 500', async () => {
      //     await productsControllers.getAll(request, response, next);
  
      //     expect(response.status.calledWith('500')).to.be.true;
      //     expect(response.json.calledWith('')).to.be.true;
      //   })
      // })

      describe('Em caso de sucesso', () => {
        const request = {};
        const response = {};
        let next = () => {};
        before(() => {
          response.status = sinon.stub().returns(response);
          response.json = sinon.stub().returns();
    
          sinon.stub(productsServices, "getAll").resolves(dbSucessResponse);
        });
    
        after(() => {
          productsServices.getAll.restore();
        });

        it('Esperado status 200', async () => {
          await productsControllers.getAll(request, response, next);
          expect(response.status.calledWith(200)).to.be.equal(true);
        })

        it('Espera retorno de produtos no formato json', async () => {
          await productsControllers.getAll(request, response, next);
          expect(response.json.calledWith(productsMock)).to.be.true;
        })
      })

  })

  describe('Testa função findById', () => {
    const productMock =  {
      id: 1,
      name: "produto A",
      quantity: 10
    }

    const dbSucessResponse = {
      id: 1,
      name: "produto A",
      quantity: 10
    };

    // describe('Erro no catch', () => {
    //   const request = {};
    //   const response = {};
    //   let next = () => {};
    //   before(() => {
    //     response.status = sinon.stub().returns(response);
    //     response.json = sinon.stub().returns()
    //     next = sinon.stub().returns();
    
    //     sinon.stub(productsServices, 'getAll').resolves(false);
    //   });

    //   after(() => {
    //     productsServices.getAll.restore();
    //   })

    //   it('erro status 500', async () => {
    //     await productsControllers.getAll(request, response, next);

    //     expect(response.status.calledWith('500')).to.be.true;
    //     expect(response.json.calledWith('')).to.be.true;
    //   })
    // })

    describe('Produto não encontrado', () => {
      const request = {};
      const response = {};
      let next = () => {};

      const dbFailResponse = [[], []];
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
  
        sinon.stub(productsServices, "findById").resolves(dbFailResponse);
      });
  
      after(() => {
        productsServices.findById.restore();
      });

      // it('Status 404', async () => {
      //   request.params = 2;
      //   await productsControllers.findById(request, response, next);
      //   expect(response.status.calledWith(404)).to.be.true;
      // })

      // it('retorno de produtos no formato json', async () => {
      //   request.params = 50;
      //   await productsControllers.findById(request, response, next);
      //   expect(response.json.calledWith('Product not found')).to.be.true;
      // })
    })

    describe('Em caso de sucesso', () => {
      const request = {};
      const response = {};
      let next = () => {};
      before(() => {
        response.status = sinon.stub().returns(response);
        response.json = sinon.stub().returns();
  
        sinon.stub(productsServices, "findById").resolves(dbSucessResponse);
      });
  
      after(() => {
        productsServices.findById.restore();
      });

      it('Esperado status 200', async () => {
        request.params = 1;
        await productsControllers.findById(request, response, next);
        expect(response.status.calledWith(200)).to.be.equal(true);
      })

      it('Espera retorno de produtos no formato json', async () => {
        await productsControllers.findById(request, response, next);
        expect(response.json.calledWith(productMock)).to.be.true;
      })
    })
  })
});