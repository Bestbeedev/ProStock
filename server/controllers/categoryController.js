import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
  try {
    const { title, description, isPublic } = req.body;
    const image = req.file ? req.file.filename : null;

    const category = await Category.create({
      title,
      description,
      isPublic: isPublic || false,
      image,
      UserId: req.user.id
    });

    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({ include: ["User"] });
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Catégorie non trouvée" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Catégorie non trouvée" });
    if (category.UserId !== req.user.id) return res.status(403).json({ error: "Accès refusé" });

    const { title, description, isPublic } = req.body;
    const image = req.file ? req.file.filename : category.image;

    await category.update({ title, description, isPublic, image });
    res.json(category);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);
    if (!category) return res.status(404).json({ error: "Catégorie non trouvée" });
    if (category.UserId !== req.user.id) return res.status(403).json({ error: "Accès refusé" });

    await category.destroy();
    res.json({ message: "Catégorie supprimée" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const categoryController = {
    createCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory
  };

export default categoryController;
