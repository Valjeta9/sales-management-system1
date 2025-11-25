import Product from "../../models/Product.js";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching products" });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching product" });
  }
};

export const createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { name, description, price, stock, category_id, status } = req.body;
    const image = req.file ? `uploads/${req.file.filename}` : null;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category_id: category_id || null,
      status,
      image,
    });

    res.status(201).json(newProduct);
  } catch (err) {
    console.error("ERROR CREATE PRODUCT:", err);
    res
      .status(500)
      .json({ message: "Error creating product", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id, status } = req.body;

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const image = req.file ? `uploads/${req.file.filename}` : product.image;

    await product.update({
      name,
      description,
      price,
      stock,
      category_id,
      status,
      image,
    });

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating product" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.destroy({
      where: { product_id: req.params.id },
    });

    if (!deleted) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error deleting product" });
  }
};
