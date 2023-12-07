import {Movie, Rating, User, db} from '../src/model.js';
import movieData from './data/movies.json' assert {type: 'json'};
import lodash from 'lodash';

console.log('Syncing database...');
await db.sync ({force: true});

console.log('Seeding database...');

const moviesInDB = await Promise.all(
    movieData.map(async(movie) => {
    let releaseDate = Date.parse(movie.releaseDate)

    const newMovie = Movie.create({
        title: movie.title,
        overview: movie.overview,
        posterPath: movie.posterPath,
        releaseDate,
    });
    return newMovie
})
);

console.log(moviesInDB)

let usersToCreate = [];
for(let i=0; i<10; i++) {
   let newUser = User.create({
        email: `test${i}@test.com`,
        password: "test"
    })

    usersToCreate.push(newUser)
}

const usersInDB = await Promise.all(usersToCreate);

console.log(usersInDB);

const ratingsInDB = await Promise.all(
    usersInDB.flatMap((user) => {
      const randomMovies = lodash.sampleSize (moviesInDB, 10)

    const movieRatings = randomMovies.map((movie)=>{
        return Rating.create({
            score: lodash.random(1,5),
            userId: user.userId,
            movieId: movie.movieId,
        });
    });
    return movieRatings;
}),
);

console.log(ratingsInDB);

await db.close()


