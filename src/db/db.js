import {Sequelize} from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// initialization of seqaulize with credentials from .env

const sequelize =new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST|| 'localhost',
        dialect:'postgres',
        logging:false,
    }
);

export default sequelize ;
