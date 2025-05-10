const connection = require('../db');

// Restituisce tutti i film con callback-style
function index(req, res) {
  const sql = `
    SELECT m.*, AVG(r.vote) AS average_rating
    FROM movies m
    LEFT JOIN reviews r ON m.id = r.movie_id
    GROUP BY m.id
  `;

  connection.query(sql, (err, results) => {
    if (err) {
      console.error('Errore nella query INDEX:', err);
      return res.status(500).json({ error: 'Errore interno al server' });
    }
    res.status(200).json(results);
  });
}

// Restituisce un singolo film con le sue recensioni
function show(req, res) {
  const filmId = req.params.id;
  const sqlFilm = 'SELECT * FROM movies WHERE id = ?';

  connection.query(sqlFilm, [filmId], (err, films) => {
    if (err) {
      console.error('Errore nella query SHOW film:', err);
      return res.status(500).json({ error: 'Errore interno al server' });
    }
    if (films.length === 0) {
      return res.status(404).json({ error: 'Film non trovato' });
    }

    const movie = films[0];
    const sqlReviews = 'SELECT * FROM reviews WHERE movie_id = ?';

    connection.query(sqlReviews, [filmId], (err2, reviews) => {
      if (err2) {
        console.error('Errore nella query SHOW reviews:', err2);
        return res.status(500).json({ error: 'Errore interno al server' });
      }
      res.status(200).json({ ...movie, reviews });
    });
  });
}

module.exports = {
  index,
  show,
};
