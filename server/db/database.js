const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Create a database connection
const db = new sqlite3.Database(path.join(__dirname, 'crypto_app.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to SQLite database');
});

// Initialize the database schema
const initDb = () => {
    const createAccountsTable = `
        CREATE TABLE IF NOT EXISTS accounts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.run(createAccountsTable, (err) => {
        if (err) {
            console.error('Error creating accounts table:', err);
            return;
        }
        console.log('Accounts table initialized successfully');
    });
};

// Initialize tables when the module is imported
initDb();

module.exports = db;