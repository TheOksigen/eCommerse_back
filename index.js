const express = require("express")
const productsRouter = require('./src/routes/products.route');
const loginRouter = require('./src/routes/login.route');
const categoriesRouter = require('./src/routes/category.route');
const cors = require('cors');
const { setupSwagger } = require('./src/swagger');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use("/docs", express.static('/docs'));

app.use('/', loginRouter);
app.use('/products', productsRouter);
app.use('/categories', categoriesRouter);

setupSwagger(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


