import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define the the application environment
const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const port = process.env.PORT || 3000;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// app.get('/', (req, res) => {
//   res.send('Hello from Express!');
// });

/**
  * Routes
  */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

// app.get('/organizations', async (req, res) => {
//     const title = 'Organizations';
//     res.render('organizations', { title });
// });

app.get('/organizations', async (req, res) => {
    try {
        const organizations = await getAllOrganizations();
        const title = 'Our Partner Organizations';
        res.render('organizations', { title, organizations });
    } catch (error) {
        console.error('Error fetching organizations:', error.message);
        res.status(500).send(`Error: ${error.message}`);
    }
});

app.get('/projects', async (req, res) => {
    try {
        const projects = await getAllProjects();
        console.log(projects);
        const title = 'Service Projects';
        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).send(`Error: ${error.message || String(error)}`);
    }
});

app.get('/categories', async (req, res) => {
    const title = 'Categories';
    res.render('categories', { title });
});

app.listen(port, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Environment: ${nodeEnv}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});