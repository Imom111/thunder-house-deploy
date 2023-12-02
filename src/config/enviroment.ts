
export const ENV_PORT: number = Number(process.env.PORT) || 8080;
export const ENV_SECRET_OR_PRIVATE_KEY: string = process.env.SECRET_OR_PRIVATE_KEY || 'aA1sS1aA1s@aA1sS1aA1s';

export const ENV_SERVER_DATABASE: string = process.env.SERVER_DATABASE || 'localhost';
export const ENV_PORT_DATABASE: number = Number(process.env.PORT_DATABASE) || 3306;
export const ENV_NAME_DATABASE: string = process.env.NAME_DATABASE || 'db_thunder_house';
export const ENV_USER_NAME_DATABASE: string = process.env.USER_NAME_DATABASE || 'root';
export const ENV_PASSWORD_DATABASE: string = process.env.PASSWORD_DATABASE || 'admin';

export const ENV_INITIAL_EMAIL: string = process.env.INITIAL_EMAIL || 'testUser@gmail.com';
export const ENV_INITIAL_USER: string = process.env.INITIAL_USER || 'testUser';
export const ENV_INITIAL_PASSWORD: string = process.env.INITIAL_PASSWORD || '12345_abAB';
