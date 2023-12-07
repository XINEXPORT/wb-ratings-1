
import { Model, DataTypes } from 'sequelize';
import util from 'util';
import connectToDB from './db.js';

//EXPORTS
export const db = await connectToDB('postgresql:///ratings');

export class User extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

export class Movie extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}

export class Rating extends Model {
  [util.inspect.custom]() {
    return this.toJSON();
  }
}
///////////

User.init(
  {
    userId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    email: {type: DataTypes.STRING,
            unique: true,
            notNULL: true
    },
    password: {type: DataTypes.STRING,
              allowNull: false,
  },
},

  {
    modelName: 'user',
    sequelize: db,
    timestamps: false,
  },
);


Movie.init({
  movieID:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNULL: false,
  },
  overview: {
    type: DataTypes.TEXT,
  },
  releases: {
    type: DataTypes.DATE,
  },
  poster_path:{
    type: DataTypes.TEXT,
  }
},
{
  modelName: 'movie',
  sequelize: db
},
);

Rating.init(
{
  ratingId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  score: {
    type: DataTypes.INTEGER,
    allowNULL: false,
  },
},
{
  modelName: 'rating',
  sequelize: db,
  timestamps: true,
  updatedAt: false
},
)
//TABLE ASSOCIATION
Movie.hasMany(Rating, {foreignKey: 'movieId'});
Rating.belongsTo(Movie, {foreignKey: 'movieId'});
User.hasMany(Rating, {foreignKey: 'userID'});
Rating.belongsTo(User, {foreignKey: 'userID'});




