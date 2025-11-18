import Product from "../models/Product.js";

// GET all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// GET single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// CREATE product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    const image = req.file ? req.file.filename : null;

    const newProduct = await Product.create({
      name,
      description,
      price,
      stock,
      category_id,
      image,
    });

    res.json(newProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error creating product" });
  }
};

// UPDATE product
// UPDATE product
export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id, status } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    // Përditëso produktin
    product.name = name;
    product.description = description;
    product.price = price;
    product.stock = stock;
    product.category_id = category_id;
    product.status = status;
    if (image) product.image = image;

    await product.save(); // ruan ndryshimet

    res.json(product); // kthen produktin e përditësuar
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error updating product" });
  }
};


// DELETE product
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
