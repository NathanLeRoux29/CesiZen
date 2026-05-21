const db = require('../config/db');

class ReportDAO {
    static async create({ category, description, email, page_url }) {
        const [result] = await db.query(
            'INSERT INTO reports (category, description, email, page_url) VALUES (?, ?, ?, ?)',
            [category, description, email || null, page_url || null]
        );
        return result.insertId;
    }

    static async findAll({ status, category, page = 1, limit = 10 }) {
        const offset = (page - 1) * limit;
        const where = [];
        const params = [];
        if (status) { where.push('status = ?'); params.push(status); }
        if (category) { where.push('category = ?'); params.push(category); }
        const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
        const [rows] = await db.query(
            `SELECT * FROM reports ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );
        return rows;
    }

    static async count({ status, category } = {}) {
        const where = [];
        const params = [];
        if (status) { where.push('status = ?'); params.push(status); }
        if (category) { where.push('category = ?'); params.push(category); }
        const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';
        const [[row]] = await db.query(
            `SELECT COUNT(*) as total FROM reports ${whereClause}`,
            params
        );
        return row.total;
    }

    static async updateStatus(id, status) {
        const [result] = await db.query('UPDATE reports SET status = ? WHERE id = ?', [status, id]);
        return result.affectedRows;
    }

    static async delete(id) {
        const [result] = await db.query('DELETE FROM reports WHERE id = ?', [id]);
        return result.affectedRows;
    }
}

module.exports = ReportDAO;
