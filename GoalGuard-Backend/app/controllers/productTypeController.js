const db = require('../config/db');

// Thêm loại hàng hóa mới
exports.addProductType = async (req, res) => {
    try {
        const { name, status } = req.body;
        const [result] = await db.execute('INSERT INTO product_types (name, status) VALUES (?, ?)', [name, status]);
        res.status(200).json({ id: result.insertId, name, status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding product type' });
    }
};

// Sửa thông tin loại hàng hóa
exports.updateProductType = async (req, res) => {
    try {
        const { name, status } = req.body;
        const id = req.params.id;
        await db.execute('UPDATE product_types SET name = ?, status = ? WHERE id = ?', [name, status, id]);
        res.status(200).json({ id, name, status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating product type' });
    }
};

// Xóa loại hàng hóa
exports.deleteProductType = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM product_types WHERE id = ?', [id]);
        res.status(200).json({ message: 'Product type deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting product type' });
    }
};

// Lấy thông tin loại hàng hóa theo ID
exports.getProductTypeById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM product_types WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Product type not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting product type' });
    }
};

// Lấy tất cả loại hàng hóa
exports.getAllProductTypes = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM product_types');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting product types' });
    }
};

// Tìm kiếm loại hàng hóa
exports.searchProductTypes = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM product_types WHERE name LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching product types' });
    }
};
