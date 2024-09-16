const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const prisma = require('../utils/prismaClient');

const sendWelcomeEmail = require('../email/email');
dotenv.config();


const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password are required' });
        }

        const user = await prisma.user.findFirst({ where: { username: username }, include: { cart: true } });

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

const addToCart = async (req, res) => {
    try {
        const { productId, count = 1 } = req.body;

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

        const cartItem = await prisma.cart.findFirst({
            where: {
                userId: user.id,
                productId: product.id,
            },
        });

        if (cartItem) {
            await prisma.cart.update({
                where: { id: cartItem.id },
                data: { count: cartItem.count + count },
            });
        } else {
            // Add new product to cart
            await prisma.cart.create({
                data: {
                    userId: user.id,
                    productId: product.id,
                    count: count,
                },
            });
        }

        res.status(200).json({ message: 'Product added to cart', product });
    } catch (error) {
        console.error("Add to cart error:", error);
        res.status(500).json({ error: 'Failed to add product to cart' });
    }
};

const deleteCart = async (req, res) => {
    try {
        const { itemId } = req.params;

        if (!itemId) {
            return res.status(400).json({ error: 'Item ID is required' });
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

        const cartItem = await prisma.cart.findFirst({
            where: {
                userId: user.id,
                productId: +itemId,
            },
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        await prisma.cart.delete({
            where: { id: cartItem.id },
        });

        res.status(200).json({ message: 'Item removed from cart successfully' });
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ error: 'Failed to remove item from cart' });
    }
};

const register = async (req, res) => {
    try {
        const { name, user_img, username, phone, address, dob, gender, email, password } = req.body;

        if (!name || !username || !phone || !gender || !email || !password) {
            return res.status(400).json({ error: 'All required fields must be filled' });
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] },
        });

        if (existingUser) {
            return res.status(400).json({ error: 'Username or email is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                username,
                user_img: user_img || 'https://i.pinimg.com/originals/1f/28/c6/1f28c68d2c35f389966b5a363b992d06.png',
                phone,
                address: address || null,
                dob: dob ? new Date(dob) : null,
                gender: gender.toUpperCase(),
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign({ userid: newUser.id }, process.env.JWT_SECRET, { expiresIn: '99999999h' });

        await sendWelcomeEmail(newUser.email, newUser.name);

        res.status(201).json({ token, message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

const getAllCart = async (req, res) => {
    try {

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


        const cart = await prisma.cart.findMany({
            where: {
                userId: user.id,
            },
            include: {
                product_id: true,

            },
        });
        res.status(200).json(cart);

    } catch (error) {
        console.error("Error getting all cart:", error);
        res.status(500).json({ error: 'Failed to get all cart' });

    }
}

module.exports = {
    login,
    addToCart,
    deleteCart,
    register,
    getAllCart
};
