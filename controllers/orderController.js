import Order from "../models/Order.js";
import Product from "../models/Product.js";
import sendMail from "../utils/mailer.js";

export const createOrder = async (req, res) => {
  try {
    const { productIds, deliveryAddress, paymentMethod } = req.body;

    if (!productIds || productIds.length === 0)
      return res.status(400).json({ error: "Aucun produit sélectionné" });

    // Récupérer les produits
    const products = await Product.findAll({ where: { id: productIds } });

    const totalAmount = products.reduce((sum, p) => sum + p.price, 0);

    // Créer la commande
    const order = await Order.create({
      buyerId: req.user.id,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      status: "en attente"
    });

    await order.addProducts(products);

    // Envoyer email de confirmation
    await sendMail(
      req.user.email,
      "Confirmation de commande ProStock",
      `Votre commande a été reçue. Total : ${totalAmount} €`,
      `<p>Votre commande a été reçue.<br>Total : ${totalAmount} €</p>`
    );

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
  // Optionnel : pour stats ou superadmin si jamais
};

const orderController = {
    createOrder,
    getUserOrders,
    getAllOrders
  };

export default orderController;
