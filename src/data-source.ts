import { DataSource } from 'typeorm';
import 'dotenv/config';

const AppDataSource = new DataSource({
  type: 'mssql',
  host: process.env.DATABASE_HOST,
  port: Number.parseInt(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_USER_PASSWORD,
  database: 'chatbot',
  synchronize: true,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  extra: {
    validateConnection: false,
    trustServerCertificate: true,
  },
});

export default AppDataSource;
