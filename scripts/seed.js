const mysql = require('mysql2/promise');
const {
  invoices,
  customers,
  revenue,
  users,
} = require('../src/lib/placeholder-data.js');
const bcrypt = require('bcrypt');

async function seedUsers(client) {
  try {
    const createTable = await client.execute(`
      CREATE TABLE IF NOT EXISTS users(
        id CHAR(100) NOT NULL DEFAULT (UUID()),
        name VARCHAR(20) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password TEXT NOT NULL,
        PRIMARY KEY (id)
      )
    `)

    const insertedUsers = await Promise.all(
      users.map(async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 10);
        const query = `
           INSERT IGNORE INTO users (id, name, email, password)
           VALUES (?, ?, ?, ?)
          `;
        const statement = await client.prepare(query);
        return await statement.execute([user.id, user.name, user.email, hashedPassword]);
      }),
    );

    return {
      createTable,
      users: insertedUsers,
    };
  } catch (error) {
    console.error('Error seeding users:', error);
    throw error;
  }
}

async function seedCustomers(client) {
  const createTable = await client.execute(`
    CREATE TABLE IF NOT EXISTS customers(
      id CHAR(100) NOT NULL DEFAULT (UUID()),
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      PRIMARY KEY (id)
    )
  `);

  const insertedCustomers = await Promise.all(customers.map(async (customer) => {
      const query = `
            INSERT IGNORE INTO customers (id, name, email, image_url)
            VALUES (?, ?, ?, ?)
          `;
      const statement = await client.prepare(query);
      return await statement.execute([customer.id, customer.name, customer.email, customer.image_url]);
    }),
  );

  return {
    createTable,
    customers: insertedCustomers,
  };
}

async function seedInvoices(client) {
  try {
    const createTable = await client.execute(`
      CREATE TABLE IF NOT EXISTS invoices (
        id CHAR(100) NOT NULL DEFAULT (UUID()) PRIMARY KEY,
        customer_id CHAR(100) NOT NULL,
        amount INT NOT NULL,
        status VARCHAR(255) NOT NULL,
        date DATE NOT NULL
      );
    `);
    const insertedInvoices = await Promise.all(invoices.map(async (invoice) => {
        const query = `
                  INSERT IGNORE INTO invoices (customer_id, amount, status, date)
                  VALUES (?,?,?,?)
                `;
        const statement = await client.prepare(query);
        return await statement.execute([invoice.customer_id, invoice.amount, invoice.status, invoice.date]);
      }),
    );
    return {
      createTable,
      invoices: insertedInvoices,
    };
  } catch (error) {
    console.error('Error seeding invoices:', error);
    throw error;
  }
}

async function seedRevenue(client) {
  try {
    const createTable = await client.execute(`
      CREATE TABLE IF NOT EXISTS revenue (
        month VARCHAR(4) NOT NULL UNIQUE,
        revenue INT NOT NULL
      );
    `);
    const insertedRevenue = await Promise.all(revenue.map(async (rev) => {
        const query = `
                  INSERT IGNORE INTO revenue (month, revenue)
                  VALUES (?,?)
                `;
        const statement = await client.prepare(query);
        return await statement.execute([rev.month, rev.revenue]);
      }),
    );

    return {
      createTable,
      revenue: insertedRevenue,
    };
  } catch (error) {
    console.error('Error seeding revenue:', error);
    throw error;
  }
}

async function main() {
  const connection = await mysql.createConnection({
    host: '192.168.102.35',
    port: '6040',
    user: 'root',
    password: 'UxUuK83ouaE'
  });

  await connection.query('CREATE DATABASE IF NOT EXISTS arvinzhwt');
  await connection.query('USE arvinzhwt');

  await seedUsers(connection);
  await seedCustomers(connection);
  await seedInvoices(connection);
  await seedRevenue(connection);

  await connection.end();
}

main().then(() => {
  console.log('done')
}).catch(err => {
  console.error('An error occurred while attempting to seed the database:', err);
})
