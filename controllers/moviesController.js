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
        res.json(results.map(result => ({
            ...result,
            image: process.env.PUBLIC_PATH + "movies_cover/" + result.title.toLowerCase().replaceAll(' ', '_') + ".jpg"
        })))

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
        const imgMovie = {
            ...movie,
            image: process.env.PUBLIC_PATH + "movies_cover/" + movie.title.toLowerCase().replaceAll(' ', '_') + ".jpg"
        }
        connection.query(sqlReviews, [filmId], (err2, reviews) => {
            if (err2) {
                console.error('Errore nella query SHOW reviews:', err2);
                return res.status(500).json({ error: 'Errore interno al server' });
            }
            res.status(200).json({ ...imgMovie, reviews });
        });
    });
}
function addReview(req, res) {
    const filmId = req.params.id;
    const { name, vote, text } = req.body;
    console.log(req.body)
    if (!name || !text || !vote) {
        return res.status(400).json({ error: 'Dati mancanti per la recensione' });
    }

    const sql = `
      INSERT INTO reviews (movie_id, name, vote, text)
      VALUES (?, ?, ?, ?)
    `;

    connection.query(sql, [filmId, name, vote, text], (err, result) => {
        if (err) {
            console.error('Errore inserimento recensione:', err);
            return res.status(500).json({ error: 'Errore del server' });
        }

        res.status(201).json({ message: 'Recensione aggiunta con successo', name: name });
    });
}
module.exports = {
    index,
    show,
    addReview,
};
