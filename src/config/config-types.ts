
export type ConfigType = {
  [key: string]: {
    dialect: string;
    dialectModulePath: string;
    dialectOptions: {
      trustedConnection: boolean;
    };
    server: string;
    database: string;
    options: {
      encrypt: boolean;
      trustServerCertificate: boolean;
    };
  };
};
