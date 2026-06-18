import bcrypt from 'bcrypt';
import { createUser, authenticateUser, getAllUsers } from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    const title = 'Register';
    res.render('register', { title });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    await createUser(name, email, passwordHash);

    req.flash('success', 'Registration successful! Welcome, ' + name + '.');
    res.redirect('/');
};

const showLoginForm = (req, res) => {
    const title = 'Login';
    res.render('login', { title });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    const user = await authenticateUser(email, password);

    if (user) {
        req.session.user = user;
        req.flash('success', 'Login successful! Welcome, ' + user.name + '.');
        console.log('Logged in user:', user);
        res.redirect('/dashboard');
    } else {
        req.flash('error', 'Login failed. Invalid email or password.');
        res.redirect('/login');
    }
};

const processLogout = (req, res) => {
    req.flash('success', 'You have been logged out.');
    req.session.destroy();
    res.redirect('/login');
};

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

const requireRole = (role) => {
    return (req, res, next) => {
        if (req.session.user && req.session.user.role_name === role) {
            return next();
        }
        req.flash('error', 'You do not have permission to access that page.');
        res.redirect('/');
    };
};

const showDashboard = (req, res) => {
    const { name, email } = req.session.user;
    res.render('dashboard', { title: 'Dashboard', name, email });
};

const showUsersPage = async (req, res) => {
    const users = await getAllUsers();
    res.render('users', { title: 'All Users', users });
};

export { showUserRegistrationForm, processUserRegistrationForm, showLoginForm, processLoginForm, processLogout, requireLogin, requireRole, showDashboard, showUsersPage };
