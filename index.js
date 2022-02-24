require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const route = require('./routes');
const middlewares = require('./middlewares');

const app = express();

app.use(bodyParser.json());

app.use('/products', route.products);
app.use('/sales', route.sales);

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.send();
});

app.use(middlewares.errorHandle);

app.listen(process.env.PORT, () => {
  console.log(`Escutando na porta ${process.env.PORT}`);
});
