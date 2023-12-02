
import { DataSource } from "typeorm";

import * as entities from "../entity/index";
import { 
  ENV_NAME_DATABASE,
  ENV_PASSWORD_DATABASE,
  ENV_PORT_DATABASE,
  ENV_SERVER_DATABASE,
  ENV_USER_NAME_DATABASE,
} from "../config/enviroment";


export const AppDataSource = new DataSource({
  type: "mysql",
  host: ENV_SERVER_DATABASE,
  port: ENV_PORT_DATABASE,
  username: ENV_USER_NAME_DATABASE,
  password: ENV_PASSWORD_DATABASE,
  database: ENV_NAME_DATABASE,
  synchronize: true,
  // logging: true,
  entities,
});

export default AppDataSource;
