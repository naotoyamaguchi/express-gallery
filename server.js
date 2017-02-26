const express = require('express');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const indexRouter = require('./routes/index');
const galleryRouter = require('./routes/gallery');
const passport = require('passport');
const CONFIG = require('./config/config.json');
const LocalStrategy = require('passport-local').Strategy;
const PORT = process.env.PORT || 3000;
const RedisStore = require('connect-redis')(session);
const bcrypt = require('bcrypt');
const saltRounds = 10;

let db = require('./models');
let User = db.User;

let app = express();
app.use(express.static('public'));
app.use(cookieParser());
// app.use(session({secret: "Something"}));

app.use(session({
  store: new RedisStore(),
  secret: 'keyboard cat',
  resave: false,
  saveUnitialized: true
}));

app.use(require('connect-flash')());
app.use(function (req,res,next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(methodOverride('_method'));
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

app.use(session({
  secret: CONFIG.SESSION_SECRET
}));

app.use(passport.initialize());
app.use(passport.session());
// const authenticate = (username, password) => {
//   // get user data from the DB
//   const { USERNAME } = username;
//   const { PASSWORD } = password;

//   // check if the user is authenticated or not
//   return ( username === USERNAME && password === PASSWORD );
// };


passport.use(new LocalStrategy(
  function (username, password, done) {
    console.log('username, password: ', username, password);
    // check if the user is authenticated or not
    User.findOne({
     where: {
      'user': username,
      // 'password': password
    }
  })
    .then(user => {
      bcrypt.compare(password, user.password).then(res => {
        if(res){
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    })
    .catch(err => {
      console.log("ERRRORRRRRRRR", err);
      return done(null, false);
    });
    // return done(null, false); // error and authenticted = false
  }
));


// passport.use(new LocalStrategy(
//   function (username, password, done) {
//     console.log('username, password: ', username, password);
//     // check if the user is authenticated or not
//     User.findOne({
//      where: {
//       'user': username,
//       'password': password
//     }
//   })
//     .then(user => {
//       console.log("USER", user);
//       return done(null, user);
//     })
//     .catch(err => {
//       console.log("ERRRORRRRRRRR", err);
//       return done(null, false);
//     });
//     // return done(null, false); // error and authenticted = false
//   }
// ));

passport.serializeUser(function(user, done) {
  return done(null, user);
});

passport.deserializeUser(function(user, done) {
  return done(null, user);
});

function isAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    next();
  } else {
    console.log("Nope!")
    res.redirect('/gallery/login');
  }
}

const hbs = handlebars.create(
  {
    extname: '.hbs',
    defaultLayout: 'app'
  }
);

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use('/', indexRouter);
app.use('/gallery', galleryRouter);


app.listen(PORT, function() {
  db.sequelize.sync();
});