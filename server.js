const express = require('express');
const methodOverride = require('method-override');
const handlebars = require('express-handlebars');
const bodyparser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const indexRouter = require('./routes/index');
const galleryRouter = require('./routes/gallery');
const PORT = process.env.PORT || 3000;

let db = require('./models');

let app = express();
app.use(express.static('public'));
app.use(cookieParser());
app.use(session({secret: "Something"}));

app.use(require('connect-flash')());
app.use(function (req,res,next){
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use(methodOverride('_method'));
app.use(bodyparser.urlencoded({extended : true}));
app.use(bodyparser.json());

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