// CONFIGURACIÓN DE BASE DE DATOS SQL SERVER
require('dotenv').config();
const sql = require('mssql');

const config = {
  server: 'LubricadorasDiana.mssql.somee.com',
  port: 1433, // Puerto estándar para SQL Server
  database: process.env.DB_NAME || 'LubricadorasDiana',
  user: process.env.DB_USER || 'admin-ug',
  // Se usan comillas dobles externas para que la comilla simple interna no rompa el string
  password: process.env.DB_PASSWORD || "!k2#JhD_&eHce;'",
  options: {
    // Se eliminó instanceName: 'SQLEXPRESS' porque Somee usa la instancia predeterminada
    encrypt: false, // Algunos servidores externos requieren false para conexiones no Azure
    trustServerCertificate: true,
    connectionTimeout: 30000,
    requestTimeout: 30000
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

class Database {
  constructor() {
    this.pool = null;
  }

  async connect() {
    try {
      // Usamos Singleton para no crear múltiples pools innecesariamente
      if (!this.pool) {
        this.pool = await sql.connect(config);
        console.log('✅ Conectado a SQL Server (Somee)');
      }
      return this.pool;
    } catch (err) {
      console.error('❌ Error de conexión:', err.message);
      throw err;
    }
  }

  async query(queryString, params = {}) {
    try {
      const pool = await this.connect();
      const request = pool.request();
      
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
      
      const result = await request.query(queryString);
      return result.recordset;
    } catch (err) {
      console.error('❌ Error en query:', err.message);
      throw err;
    }
  }

  async execute(procName, params = {}) {
    try {
      const pool = await this.connect();
      const request = pool.request();
      
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value);
      }
      
      const result = await request.execute(procName);
      return result.recordset;
    } catch (err) {
      console.error('❌ Error en execute:', err.message);
      throw err;
    }
  }

  async close() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }
}

module.exports = new Database();