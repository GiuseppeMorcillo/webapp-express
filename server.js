const express    = require('express');
const moviesRouter = require('./routes/moviesRouter');
const notFound   = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(express.static('public'));
app.use('/api/movies', moviesRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
