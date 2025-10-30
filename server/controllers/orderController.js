import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sendMail from "../utils/mailer.js";
import logAction from "../middlewares/loggerMiddleware.js";

export const createOrder = async (req, res) => {
  try {
    const { productIds, deliveryAddress, paymentMethod } = req.body;
    if (!productIds || productIds.length === 0)
      return res.status(400).json({ error: "Aucun produit sélectionné" });

    const products = await Product.findAll({ where: { id: productIds } });

    // Vérification stock et décrémentation
    for (let product of products) {
      if (product.quantity <= 0)
        return res.status(400).json({ error: `Produit ${product.title} en rupture de stock` });

      product.quantity -= 1;
      product.lastModifiedBy = req.user.id;
      product.lastModifiedAt = new Date();
      await product.save();

      await logAction(`Sortie stock produit ${product.title}`)(req, res, () => {});
    }

    const totalAmount = products.reduce((sum, p) => sum + p.price, 0);

    const order = await Order.create({
      buyerId: req.user.id,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: "en attente"
    });

    await order.addProducts(products);

    // Envoyer email de confirmation à l’acheteur
    await sendMail(
      req.user.email,
      "Confirmation de commande ProStock",
      `Votre commande a été reçue. Total : ${totalAmount} €`,
      `<p>Votre commande a été reçue.<br>Total : ${totalAmount} €</p>`
    );

    // Logger la création de la commande
    await logAction(`Commande créée, total ${totalAmount} €`)(req, res, () => {});

    res.status(201).json({ message: "Commande créée", orderId: order.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { buyerId: req.user.id },
      include: [Product],
      order: [["createdAt", "DESC"]]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [Product],
      order: [["createdAt", "DESC"]]
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const orderController = {
    createOrder,
    getUserOrders,
    getAllOrders,
    getUserOrders,
  };

export default orderController;
