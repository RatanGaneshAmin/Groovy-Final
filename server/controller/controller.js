var { Userdb} = require('../model/model');
const Review = require('../model/review');
const axios = require('axios');
const bcrypt = require("bcrypt");

exports.createUser = async (req, res) => {
  try {
    if (!req.body) return res.status(400).send({ message: "Content cannot be empty" });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new Userdb({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword
    });

    await user.save();
    res.redirect("/login-user");
  } catch (err) {
    res.status(500).send({ message: "Error creating user" });
  }
};

exports.createLogin = async (req, res) => {
  try {
    const user = await Userdb.findOne({ email: req.body.email });
    if (!user) return res.redirect("/login-user");

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) return res.redirect("/login-user");

    // Save login state in session
    req.session.userId = user._id;
    res.redirect("/movie");
  } catch (err) {
    res.status(500).send({ message: "Error logging in" });
  }
};


exports.createReview = (req, res) => {
    if (!req.body.text || !req.body.movieId) {
        return res.status(400).send({ message: "Review content missing" });
    }
    const review = new Review({
        user: req.body.user || "Anonymous",
        movieId: req.body.movieId,
        text: req.body.text,
        rating: req.body.rating || 0
    });

    review.save()
        .then(() => {
            res.redirect(`/movie/${req.body.movieId}`);
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.getAllMovies = async (req, res) => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
    );

    const movies = response.data.results.map(m => ({
      id: m.id,
      title: m.title,
      poster: "https://image.tmdb.org/t/p/w500" + m.poster_path,
      description: m.overview
    }));

    console.log("Fetched movies from TMDB:", movies.length);
    res.render("movie", { movies }); // uses movie.ejs
  } catch (err) {
    console.error("Error fetching movies from TMDB:", err);
    res.status(500).send("Error fetching movies");
  }
};


exports.getMoviePage = async (req, res) => {
  try {
    const movieId = req.params.id;

    // Fetch movie details + credits + reviews together
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${process.env.TMDB_API_KEY}&language=en-US&append_to_response=credits,reviews`
    );

    const movieData = response.data;

    const movie = {
      id: movieData.id,
      title: movieData.title,
      poster: movieData.poster_path
        ? "https://image.tmdb.org/t/p/w500" + movieData.poster_path
        : "/img/no-poster.png",
      description: movieData.overview,
      rating: movieData.vote_average,
      releaseDate: movieData.release_date,
      runtime: movieData.runtime,
      genres: movieData.genres.map(g => g.name),
      cast: movieData.credits?.cast
        ? movieData.credits.cast.slice(0, 6).map(c => c.name) // first 6 cast members
        : []
    };

    // Local reviews from MongoDB
    const localReviews = await Review.find({ movieId }).sort({ _id: -1 });

    // TMDB reviews
    const tmdbReviews = (movieData.reviews?.results || []).map(r => ({
      user: r.author,
      text: r.content,
      rating:
        r.author_details && r.author_details.rating != null
          ? r.author_details.rating
          : "No rating",
      source: "TMDB"
    }));

    // Normalize local reviews
    const formattedLocalReviews = localReviews.map(r => ({
      user: r.user,
      text: r.text,
      rating: r.rating,
      source: "User"
    }));

    // Combine reviews
    const allReviews = [...tmdbReviews, ...formattedLocalReviews];

    res.render("moviedetail", { movie, reviews: allReviews });
  } catch (err) {
    console.error("Error fetching movie details:", err);
    res.status(500).send({ message: "Error fetching movie details" });
  }
};



exports.searchMovies = async (req, res) => {
  const query = req.query.q;
  if (!query) {
    return res.redirect('/movie'); // no search, show popular movies
  }

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/search/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1`
    );

    const movies = response.data.results.map(m => ({
      id: m.id,
      title: m.title,
      poster: m.poster_path ? "https://image.tmdb.org/t/p/w500" + m.poster_path : "/img/no-poster.png"
    }));

    res.render('movie', { movies });
  } catch (err) {
    console.error("Error searching movies:", err);
    res.status(500).send("Error searching movies");
  }
};


