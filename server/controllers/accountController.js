const bcrypt = require('bcryptjs');
const db = require('../db/database');

const accountController = {
    // Register a new user
    async signup(req, res) {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                error: 'Password must be at least 6 characters long'
            });
        }

        try {
            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);

            // Insert new user into database
            const sql = 'INSERT INTO accounts (email, password_hash) VALUES (?, ?)';
            
            db.run(sql, [email, passwordHash], function(err) {
                if (err) {
                    // Check for duplicate email
                    if (err.message.includes('UNIQUE constraint failed')) {
                        return res.status(400).json({
                            success: false,
                            error: 'Email already registered'
                        });
                    }
                    
                    console.error('Database error during signup:', err);
                    return res.status(500).json({
                        success: false,
                        error: 'Error creating account'
                    });
                }

                res.json({
                    success: true,
                    message: 'Account created successfully',
                    userId: this.lastID
                });
            });
        } catch (error) {
            console.error('Error in signup:', error);
            res.status(500).json({
                success: false,
                error: 'Server error during signup'
            });
        }
    },

    // Login existing user
    async login(req, res) {
        const { email, password } = req.body;

        // Basic validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: 'Email and password are required'
            });
        }

        try {
            // Find user by email
            const sql = 'SELECT * FROM accounts WHERE email = ?';
            
            db.get(sql, [email], async (err, user) => {
                if (err) {
                    console.error('Database error during login:', err);
                    return res.status(500).json({
                        success: false,
                        error: 'Error during login'
                    });
                }

                if (!user) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid credentials'
                    });
                }

                // Compare password with hash
                const isMatch = await bcrypt.compare(password, user.password_hash);
                
                if (!isMatch) {
                    return res.status(400).json({
                        success: false,
                        error: 'Invalid credentials'
                    });
                }

                // Successfully authenticated
                res.json({
                    success: true,
                    message: 'Login successful',
                    userId: user.id
                });
            });
        } catch (error) {
            console.error('Error in login:', error);
            res.status(500).json({
                success: false,
                error: 'Server error during login'
            });
        }
    },

    // Get user profile
    async getProfile(req, res) {
        const userId = req.params.id;

        if (!userId) {
            return res.status(400).json({
                success: false,
                error: 'User ID is required'
            });
        }

        try {
            const sql = 'SELECT id, email, created_at FROM accounts WHERE id = ?';
            
            db.get(sql, [userId], (err, user) => {
                if (err) {
                    console.error('Database error fetching profile:', err);
                    return res.status(500).json({
                        success: false,
                        error: 'Error fetching profile'
                    });
                }

                if (!user) {
                    return res.status(404).json({
                        success: false,
                        error: 'User not found'
                    });
                }

                res.json({
                    success: true,
                    data: user
                });
            });
        } catch (error) {
            console.error('Error in getProfile:', error);
            res.status(500).json({
                success: false,
                error: 'Server error fetching profile'
            });
        }
    }
};

module.exports = accountController;