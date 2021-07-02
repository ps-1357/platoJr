const express = require('express');
const userRoutes = require('./routes/userRoutes');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const AppError = require('./utils/appError')
const {requireAuth, checkUser} = require('./middleware/authMiddleware');

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
if(process.env.NODE_ENV === 'development'){
  app.use(morgan('dev'));
}
app.use(express.static(`${__dirname}/public`));

// view engine
app.set('view engine', 'ejs');

// database connection
//const dbURI = 'mongodb+srv://platoJr:sVTrNt68SmybwNTo@cluster0.hecxn.mongodb.net/platoJr??retryWrites=true&w=majority';
//mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
//  .then((con) => {
//    
//    console.log('DB connection successful');
//  })
//  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
//app.get('/', (req, res) => res.render('home'));
//
//app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));
app.use('/api/v1/users', userRoutes);
app.all('*', (req,res,next) =>{
  next(new AppError(`Can't find ${req.originalUrl} on this server!, 404`));
})


module.exports = app;