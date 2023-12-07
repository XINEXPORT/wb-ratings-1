import express from 'express';
import session from 'express-session';
import morgan from 'morgan';
import ViteExpress from 'vite-express';
import {Rating, User, Movie} from './src/model.js';

const app = express();
const port = '8000';
ViteExpress.config({ printViteDevServerHost: true });

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: false }));

ViteExpress.listen(app, port, () => console.log(`Server is listening on http://localhost:${port}`));

//FETCH ALL MOVIES
app.get('/api/movies/:movieId', async(req,res)=>{
const {movieId} = req.params;
const movie = await Movie.findByPk(movieId);
res.json(movie);
});

//USERNAME AUTH
app.post('/api/auth', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email: email } });

    if (user && user.password === password) {
      req.session.userId = user.userId;
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });


app.post('/api/logout', (req,res) =>{
    if (!req.session.userId){
        res.status(401).json ({error: 'Unauthorized'});
    } else{
        req.session.destroy();
        res.json({success:true});
    }
})

/////Ratings
app.get('/api/ratings', async (req,res)=>{
const {userId} = req.session;
console.log(req.session);
if(!userId){
    res.status(401).json ({error: 'Unauthorized'});
} else {
    const user = await User.findByPk(userId);
    console.log(user);
    const ratings = await user.getRatings({
        include: {
            model: Movie,
            attributes: ['title'],
        },
    });
    res.json(ratings);
}
});


