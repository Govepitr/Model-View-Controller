const path = require('path');
const express = require('express');
const routes = require('./controllers/');
const sequelize = require('./config/connection');
const session = require('express-session');


const exphbs = require('express-handlebars'); 

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const helpers = require('./utils/helpers');

const app = express();
const PORT = process.env.PORT || 3001;

const hbs = exphbs.create({helpers});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// maxAge allows for timeout of session if idle for 30 seconds
const sess = {
  secret: 'I will take this secret to the grave.',
  cookie: {
    maxAge: 120000
  },
  resave: false,
  saveUninitialized: true,
  rolling: true,

  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// bring in front end
app.use(express.static(path.join(__dirname, 'public')));

// turn on routes
app.use(routes);


// If you update ({force: false}) to ({force: true}) it will drop and re-create all of the database tables/associations on startup.
sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`Now listening to ${PORT}, ooh that is my JAM!`));  
});