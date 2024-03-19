const db = require('../config/db');

const createTables = async () => {
    try {
        // Tạo bảng "users" nếu chưa tồn tại
        await db.execute(`
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(255),
                username VARCHAR(255),
                password VARCHAR(255) NOT NULL,
                role VARCHAR(255),
                status VARCHAR(255) DEFAULT 'noactive',
                image VARCHAR(255) DEFAULT 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);

        console.log('Table "users" created or already exists.');

        // Tạo bảng "password_reset_tokens" nếu chưa tồn tại
        await db.execute(`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            token VARCHAR(255) NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
        `);

        console.log('Table "password_reset_tokens" created or already exists.');

        // Tạo bảng field_types nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS field_types (
             id INT AUTO_INCREMENT PRIMARY KEY,
             type VARCHAR(255) NOT NULL,
             status VARCHAR(255) DEFAULT 'active'
         )
     `);

        console.log('Table "field_types" created or already exists.');

        // Tạo bảng "areas" nếu chưa tồn tại
        await db.execute(`
                CREATE TABLE IF NOT EXISTS areas (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    status VARCHAR(255) DEFAULT 'active'
                )
            `);

        console.log('Table "areas" created or already exists.');

        // Tạo bảng "courts" nếu chưa tồn tại
        await db.execute(`
         CREATE TABLE IF NOT EXISTS courts (
             id INT AUTO_INCREMENT PRIMARY KEY,
             name VARCHAR(255) NOT NULL,
             id_areas INT NOT NULL,
             id_field_types INT NOT NULL,
             status VARCHAR(255) DEFAULT 'active',
             price DECIMAL(10, 2) DEFAULT 0,
             image VARCHAR(255),
             description TEXT,
             FOREIGN KEY (id_areas) REFERENCES areas(id),
             FOREIGN KEY (id_field_types) REFERENCES field_types(id)
         )
     `);

        console.log('Table "courts" created or already exists.');

    } catch (error) {
        console.error('Error creating tables:', error);
    } finally {
    }
};

createTables();
