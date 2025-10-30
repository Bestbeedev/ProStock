import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCart = async (req, res) => {
  try {
    const { ProductId, quantity } = req.body;

    const product = await Product.findByPk(ProductId);
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    if (product.UserId === req.user.id) return res.status(403).json({ error: "Vous ne pouvez pas ajouter vos propres produits" });

    const cartItem = await Cart.create({
      UserId: req.user.id,
      ProductId,
      quantity: quantity || 1
    });

    res.json(cartItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({ where: { UserId: req.user.id }, include: ["Product"] });
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const checkout = async (req, res) => {
  try {
    const cartItems = await Cart.findAll({ where: { UserId: req.user.id }, include: ["Product"] });
    if (cartItems.length === 0) return res.status(400).json({ error: "Panier vide" });

    for (let item of cartItems) {
      const product = item.Product;
      if (product.quantity < item.quantity) return res.status(400).json({ error: `Stock insuffisant pour ${product.title}` });

      await product.update({ quantity: product.quantity - item.quantity });
      await item.destroy();
    }

    res.json({ message: "Commande validée !" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const cartController = {
    addToCart,
    getCart,
    checkout
  };

export default cartController;
