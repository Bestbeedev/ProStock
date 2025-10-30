import Product from "../models/Product.js";
import Category from "../models/Category.js";

export const createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, CategoryId } = req.body;
    const image = req.file ? req.file.filename : null;

    // Vérifie que la catégorie appartient à l'utilisateur
    const category = await Category.findByPk(CategoryId);
    if (!category) return res.status(404).json({ error: "Catégorie introuvable" });
    if (category.UserId !== req.user.id) return res.status(403).json({ error: "Accès refusé" });

    const product = await Product.create({
      title,
      description,
      price,
      quantity,
      image,
      UserId: req.user.id,
      CategoryId
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({ include: ["User", "Category"] });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, { include: ["User", "Category"] });
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    if (product.UserId !== req.user.id) return res.status(403).json({ error: "Accès refusé" });

    const { title, description, price, quantity, CategoryId } = req.body;
    const image = req.file ? req.file.filename : product.image;

    await product.update({ title, description, price, quantity, CategoryId, image });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    if (product.UserId !== req.user.id) return res.status(403).json({ error: "Accès refusé" });

    await product.destroy();
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const productController = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct
  };

export default productController;
