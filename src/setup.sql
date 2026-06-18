-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
    ('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
    ('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
    ('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- ========================================
-- Verify the data
-- ========================================
SELECT * FROM organization;

-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(255) NOT NULL,
    project_date DATE NOT NULL,
    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization(organization_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Service Projects
-- ========================================

-- Projects for BrightFuture Builders (organization_id = 1)
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
    (1, 'Community Center Renovation', 'Renovating the local community center with sustainable materials and energy-efficient systems.', '123 Main St, Springfield', '2026-06-15'),
    (1, 'Solar Panel Installation', 'Installing solar panels on low-income housing units to reduce energy costs for families.', '456 Oak Ave, Springfield', '2026-07-10'),
    (1, 'Playground Construction', 'Building an inclusive playground accessible to children of all abilities.', 'Lincoln Park, Springfield', '2026-08-05'),
    (1, 'Senior Home Repairs', 'Providing free home repairs and safety upgrades for elderly residents.', 'Various locations, Springfield', '2026-09-20'),
    (1, 'Rainwater Harvesting System', 'Installing rainwater collection systems for community gardens.', '789 Elm St, Springfield', '2026-10-12');

-- Projects for GreenHarvest Growers (organization_id = 2)
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
    (2, 'Rooftop Garden Initiative', 'Converting unused rooftops into productive vegetable gardens for local food banks.', 'Downtown District', '2026-06-01'),
    (2, 'School Garden Program', 'Teaching elementary students how to grow their own vegetables in school gardens.', 'Jefferson Elementary School', '2026-07-22'),
    (2, 'Farmers Market Setup', 'Organizing a weekly farmers market featuring local urban farmers and producers.', 'Central Plaza', '2026-08-14'),
    (2, 'Composting Workshop', 'Free community workshops on home composting and waste reduction.', 'Community Hall, 200 Park Rd', '2026-09-08'),
    (2, 'Seed Library Launch', 'Establishing a public seed library at the city library for community sharing.', 'Main Public Library', '2026-10-30');

-- Projects for UnityServe Volunteers (organization_id = 3)
INSERT INTO service_project (organization_id, title, description, location, project_date)
VALUES
    (3, 'Food Bank Drive', 'Organizing volunteers to collect and distribute food to families in need.', 'St. Mary Food Bank', '2026-06-25'),
    (3, 'Homeless Shelter Support', 'Coordinating volunteers to serve meals and provide hygiene kits at shelters.', 'Hope Shelter, 300 5th Ave', '2026-07-18'),
    (3, 'Park Cleanup Day', 'Community-wide effort to clean and beautify local parks and trails.', 'Riverside Park', '2026-08-22'),
    (3, 'Tutoring Program', 'Recruiting volunteer tutors for after-school programs at local schools.', 'Various schools', '2026-09-15'),
    (3, 'Holiday Gift Drive', 'Collecting and distributing gifts to underprivileged children during the holidays.', 'UnityServe HQ, 100 Center St', '2026-12-05');

-- ========================================
-- Verify the data
-- ========================================
SELECT * FROM service_project;

-- Bonus: see projects with their organization names
SELECT sp.project_id, o.name AS organization, sp.title, sp.location, sp.project_date
FROM service_project sp
JOIN organization o ON sp.organization_id = o.organization_id
ORDER BY o.name, sp.project_date;


-- ========================================
-- Category Table
-- ========================================
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ========================================
-- Project-Category Junction Table (many-to-many)
-- ========================================
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project
        FOREIGN KEY (project_id)
        REFERENCES service_project(project_id)
        ON DELETE CASCADE,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES category(category_id)
        ON DELETE CASCADE
);

-- ========================================
-- Insert sample data: Categories
-- ========================================
INSERT INTO category (name)
VALUES
    ('Construction'),
    ('Environment'),
    ('Education'),
    ('Food Security'),
    ('Community Support');

-- ========================================
-- Associate Projects with Categories
-- ========================================
-- BrightFuture Builders projects (1-5)
INSERT INTO project_category (project_id, category_id) VALUES
    (1, 1),                  -- Community Center Renovation -> Construction
    (1, 5),                  -- Community Center Renovation -> Community Support
    (2, 1),                  -- Solar Panel Installation -> Construction
    (2, 2),                  -- Solar Panel Installation -> Environment
    (3, 1),                  -- Playground Construction -> Construction
    (3, 5),                  -- Playground Construction -> Community Support
    (4, 1),                  -- Senior Home Repairs -> Construction
    (4, 5),                  -- Senior Home Repairs -> Community Support
    (5, 2),                  -- Rainwater Harvesting -> Environment
    (5, 1);                  -- Rainwater Harvesting -> Construction

-- GreenHarvest Growers projects (6-10)
INSERT INTO project_category (project_id, category_id) VALUES
    (6, 2),                  -- Rooftop Garden -> Environment
    (6, 4),                  -- Rooftop Garden -> Food Security
    (7, 3),                  -- School Garden Program -> Education
    (7, 4),                  -- School Garden Program -> Food Security
    (8, 4),                  -- Farmers Market -> Food Security
    (8, 5),                  -- Farmers Market -> Community Support
    (9, 2),                  -- Composting Workshop -> Environment
    (9, 3),                  -- Composting Workshop -> Education
    (10, 3),                 -- Seed Library -> Education
    (10, 2);                 -- Seed Library -> Environment

-- UnityServe Volunteers projects (11-15)
INSERT INTO project_category (project_id, category_id) VALUES
    (11, 4),                 -- Food Bank Drive -> Food Security
    (11, 5),                 -- Food Bank Drive -> Community Support
    (12, 5),                 -- Homeless Shelter Support -> Community Support
    (12, 4),                 -- Homeless Shelter Support -> Food Security
    (13, 2),                 -- Park Cleanup -> Environment
    (13, 5),                 -- Park Cleanup -> Community Support
    (14, 3),                 -- Tutoring Program -> Education
    (14, 5),                 -- Tutoring Program -> Community Support
    (15, 5);                 -- Holiday Gift Drive -> Community Support

-- ========================================
-- Verify the data
-- ========================================
SELECT * FROM category;
SELECT * FROM project_category;

-- See everything joined together
SELECT
    sp.title AS project,
    o.name AS organization,
    c.name AS category
FROM service_project sp
JOIN organization o ON sp.organization_id = o.organization_id
JOIN project_category pc ON sp.project_id = pc.project_id
JOIN category c ON pc.category_id = c.category_id
ORDER BY o.name, sp.title, c.name;

-- Roles table defines available roles
CREATE TABLE roles (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50) UNIQUE NOT NULL,
    role_description TEXT
);

-- Users table references roles
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role_id INTEGER REFERENCES roles(role_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Seed with basic roles
INSERT INTO roles (role_name, role_description) VALUES 
    ('user', 'Standard user with basic access'),
    ('admin', 'Administrator with full system access');