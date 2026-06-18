import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import router from './src/routes.js';
import session from 'express-session';
import flash from './src/middleware/flash.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Define the the application environment
const nodeEnv = process.env.NODE_ENV?.toLowerCase() || 'production';
const SESSION_SECRET = process.env.SESSION_SECRET;

// Define the port number the server will listen on
const port = process.env.PORT || 3000;

const app = express();

// Set up session management
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // Session expires after 1 hour of inactivity
}));

// Use flash message middleware
app.use(flash);

app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Allow Express to receive and process common POST data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (nodeEnv === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.isLoggedIn = false;
    if (req.session && req.session.user) {
        res.locals.isLoggedIn = true;
    }

    res.locals.user = req.session?.user || null;
    res.locals.nodeEnv = nodeEnv;
    next();
});

app.use(router);

// Catch-all route for 404 errors
app.use((req, res, next) => {
    const err = new Error('Page Not Found');
    err.status = 404;
    next(err);
});

// Global error handler
app.use((err, req, res, next) => {
    // Log error details for debugging
    console.error('Error occurred:', err.message);
    console.error('Stack trace:', err.stack);
    
    // Determine status and template
    const status = err.status || 500;
    const template = status === 404 ? '404' : '500';
    
    // Prepare data for the template
    const context = {
        title: status === 404 ? 'Page Not Found' : 'Server Error',
        error: err.message,
        stack: err.stack
    };
    
    // Render the appropriate error template
    res.status(status).render(`errors/${template}`, context);
});

// Middleware to require specific role
function requireRole(roleName) {
    return (req, res, next) => {
        // Assumes user object is attached to req by authentication middleware
        if (!req.user) {
            return res.status(401).send('Not authenticated');
        }

        if (req.user.role_name !== roleName) {
            return res.status(403).send('Insufficient permissions');
        }

        // User has required role, allow request to proceed
        next();
    };
}

// Controller with role-specific logic
async function editUserProfile(req, res) {
    const targetUserId = req.params.userId;
    const currentUser = req.user;

    // Admins can edit anyone, users can only edit themselves
    const canEdit = currentUser.role_name === 'admin' || 
                   currentUser.user_id === parseInt(targetUserId);

    if (!canEdit) {
        return res.status(403).send('You cannot edit this profile');
    }

    // Proceed with editing logic
    // ...
}

// Using the middleware on routes
app.get('/admin/dashboard', requireRole('admin'), (req, res) => {
    res.render('admin/dashboard');
});

app.post('/admin/users/:id/edit', requireRole('admin'), (req, res) => {
    // Only admins can reach this code
    // Handle user editing logic
});

// app.get('/', (req, res) => {
//   res.send('Hello from Express!');
// });

/**
  * Routes
  */


app.listen(port, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Environment: ${nodeEnv}`);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});