const db = require('../config/db');

exports.addFieldType = async (req, res) => {
    try {
        const { type, status } = req.body;
        const [result] = await db.execute('INSERT INTO field_types (type, status) VALUES (?, ?)', [type, status]);
        res.status(200).json({ id: result.insertId, type, status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding field type' });
    }
};

exports.updateFieldType = async (req, res) => {
    try {
        const { type, status } = req.body;
        const id = req.params.id;
        await db.execute('UPDATE field_types SET type = ?, status = ? WHERE id = ?', [type, status, id]);
        res.status(200).json({ id, type, status });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating field type' });
    }
};

exports.deleteFieldType = async (req, res) => {
    try {
        const id = req.params.id;
        await db.execute('DELETE FROM field_types WHERE id = ?', [id]);
        res.status(200).json({ message: 'Field type deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting field type' });
    }
};

exports.getFieldTypeById = async (req, res) => {
    try {
        const id = req.params.id;
        const [rows] = await db.execute('SELECT * FROM field_types WHERE id = ?', [id]);
        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Field type not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting field type' });
    }
};

exports.getAllFieldTypes = async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM field_types');
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error getting field types' });
    }
};

exports.searchFieldTypes = async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const [rows] = await db.execute('SELECT * FROM field_types WHERE type LIKE ?', [`%${keyword}%`]);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching field types' });
    }
};
