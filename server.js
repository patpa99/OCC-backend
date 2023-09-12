const express = require('express');
const dotenv = require('dotenv');
var cors = require('cors');


dotenv.config({path: '.env-local'});

const PORT = process.env.PORT || '3001';

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());


// Routes
app.get('/', (request, response) => {
  response.status(200).send("Wrong place, complete the URL...")
})

const appsRouter = require('./routes/apps');
app.use('/apps', appsRouter);

const layoutsRouter = require('./routes/layouts');
app.use('/layouts', layoutsRouter);

const pagesRouter = require('./routes/pages');
app.use('/pages', pagesRouter);

const routesAppsInPages = require('./routes/appsInPages');
app.use('/appsInPages', routesAppsInPages);

const sidebarSections = require('./routes/sidebarSections');
app.use('/sidebarSections', sidebarSections);

const languages = require('./routes/languages');
app.use('/languages', languages);

const users = require('./routes/users');
app.use('/users', users);

const alarms = require('./routes/alarms');
app.use('/alarms', alarms);

const routesConfig = require('./routes/configuration');
app.use('/configuration', routesConfig);


// Start listening
app.listen(PORT, () => {
  console.log(`Listening for requests on port ${PORT}...`)
})