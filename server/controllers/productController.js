import Product from "../models/Product.js";
import Category from "../models/Category.js";
import logAction from "../middlewares/loggerMiddleware.js";

// 🟢 Créer un produit (entrée en stock)
export const createProduct = async (req, res) => {
  try {
    const { title, description, price, quantity, CategoryId } = req.body;
    const image = req.file ? req.file.filename : null;

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
      CategoryId,
      lastModifiedBy: req.user.id
    });

    // Logger l’entrée en stock
    await logAction("Entrée de stock")(req, res, () => {});
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 🟡 Mettre à jour un produit (modification ou sortie de stock)
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    if (product.UserId !== req.user.id) return res.status(403).json({ error: "Accès refusé" });

    const { title, description, price, quantity, CategoryId } = req.body;
    const image = req.file ? req.file.filename : product.image;

    // Détection d'une sortie de stock
    const isStockOut = quantity < product.quantity;

    await product.update({
      title,
      description,
      price,
      quantity,
      CategoryId,
      image,
      lastModifiedBy: req.user.id,
      lastModifiedAt: new Date()
    });

    await logAction(isStockOut ? "Sortie de stock" : "Modification produit")(req, res, () => {});

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔴 Supprimer un produit
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    if (product.UserId !== req.user.id) return res.status(403).json({ error: "Accès refusé" });

    await product.destroy();
    await logAction("Suppression produit")(req, res, () => {});
    res.json({ message: "Produit supprimé" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🔵 Récupérer tous les produits
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      where: { UserId: req.user.id },
      include: [{ model: Category, attributes: ["name"] }]
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟣 Récupérer un produit par ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [{ model: Category, attributes: ["name"] }]
    });
    if (!product) return res.status(404).json({ error: "Produit introuvable" });
    if (product.UserId !== req.user.id) return res.status(403).json({ error: "Accès refusé" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Export global
const productController = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProducts,
  getProductById
};

export default productController;
