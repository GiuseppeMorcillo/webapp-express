const express = require('express');
const moviesRouter = require('./routes/moviesRouter');


const app = express();

app.use(express.static('public'));
app.use('/api/movies', moviesRouter);

app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);
