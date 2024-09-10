const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const prisma = require('../utils/prismaClient');
dotenv.config();

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Operations related to user management
 */

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *       - User
 *     summary: Login a user
 *     description: Authenticates a user and returns a JWT token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await prisma.user.findUnique({ where: { username }, include: { cart: true } });

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = jwt.sign({ userid: user.id }, process.env.JWT_SECRET, { expiresIn: '999999999h' });

        res.status(200).json({ token, user });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: 'Failed to login' });
    }
};

/**
 * @swagger
 * /add-to-cart:
 *   post:
 *     tags:
 *       - User
 *     summary: Add product to cart
 *     description: Adds a product to the authenticated user's cart. Requires a valid JWT token.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added to cart
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Product ID is required' });
        }

        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({ where: { id: decoded.userid } });

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized: Invalid user' });
        }

        const product = await prisma.product.findUnique({ where: { id: productId } });

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        await prisma.user.update({
            where: { id: user.id },
            data: { cart: { connect: { id: productId } } },
        });

        res.status(200).json({ message: 'Product added to cart', product: product });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
};

/**
 * @swagger
 * /delete-cart:
 *   post:
 *     tags:
 *       - User
 *     summary: Remove item from cart
 *     description: Removes an item from the authenticated user's cart. Requires a valid JWT token.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item removed from cart
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       500:
 *         description: Internal server error
 */
const deleteCart = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        const userId = Number(req.user.id);
        const { itemId } = req.body;

        if (!itemId) {
            return res.status(400).json({ error: 'Item ID is required' });
        }

        await prisma.user.update({
            where: { id: userId },
            data: {
                cart: {
                    disconnect: { id: itemId },
                },
            },
        });

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

/**
 * @swagger
 * /register:
 *   post:
 *     tags:
 *       - User
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               username:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *               dob:
 *                 type: string
 *                 format: date
 *               gender:
 *                 type: string
 *                 enum: [MALE, FEMALE, OTHER, GAY, TRANS]
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
const register = async (req, res) => {
    try {
        const { name, username, phone, address, dob, gender, email, password } = req.body;

        if (!name || !username || !phone || !address || !dob || !gender || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                phone,
                address,
                dob: new Date(dob),
                gender,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userid: newUser.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token, message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};


module.exports = {
    login,
    addToCart,
    deleteCart,
    register
};
