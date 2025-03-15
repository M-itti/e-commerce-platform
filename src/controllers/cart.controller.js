const cartService = require('../services/cart.service.js');

const getCart = async (req, res) => {
    try {
        const cart = await cartService.getUserCart(req.user.id);
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const addToCart = async (req, res) => {
    try {
        const { productId } = req.body;
        const cart = await cartService.addProductToCart(req.user.id, productId);
        res.json(cart);
    } catch (error) {
        if (error.message === 'Product not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const cart = await cartService.updateCartItemQuantity(req.user.id, productId, quantity);
        res.json(cart);
    } catch (error) {
        if (error.message === 'Cart not found' || error.message === 'Product not in cart') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const decreaseCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await cartService.decreaseCartItemQuantity(req.user.id, productId);
        res.json(cart);
    } catch (error) {
        if (error.message === 'Cart not found' || error.message === 'Product not in cart') {
            return res.status(404).json({ message: error.message });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const clearCart = async (req, res) => {
    try {
        await cartService.clearUserCart(req.user.id);
        res.json({ message: 'Cart cleared successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    decreaseCartItem,
    clearCart
};
