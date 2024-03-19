const db = require('../config/db');

// Thêm hàng hóa mới
exports.addProduct = async (req, res) => {
    try {
        const { name, price, quantity, status, itemStatus, id_product_type, id_user, image } = req.body;
        const [result] = await db.execute(
            'INSERT INTO products (name, price, quantity, status, item_status, id_product_type, id_user, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, price, quantity, status, itemStatus, id_product_type, id_user, image]
        );
        res.status(200).json({ id: result.insertId, name, price, quantity, status, itemStatus, id_product_type, id_user, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product' });
    }
};

// Sửa thông tin hàng hóa
exports.updateProduct = async (req, res) => {
    try {
        const { name, price, quantity, status, itemStatus, id_product_type, id_user, image } = req.body;
        const id = req.params.id;
        await db.execute(
            'UPDATE products SET name = ?, price = ?, quantity = ?, status = ?, item_status = ?, id_product_type = ?, id_user = ?, image = ? WHERE id = ?',
            [name, price, quantity, status, itemStatus, id_product_type, id_user, image, id]
        );
        res.status(200).json({ id, name, price, quantity, status, itemStatus, id_product_type, id_user, image });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product' });
    }
};

// Xóa hàng hóa
exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM products WHERE id = ?', [id]);
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product' });
    }
};

// Lấy thông tin hàng hóa theo ID
exports.getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Product not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting product' });
    }
};

// Lấy tất cả hàng hóa
exports.getAllProducts = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM products');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting products' });
    }
};

// Tìm kiếm hàng hóa
exports.searchProducts = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM products WHERE name LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching products' });
    }
};
