
import express, { Application } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import * as entities from "../entity/index";

import argv from '../config/yargs';
import {
  ReservationCatalogRoute,
  ClientCatalogRoute,
  EmployeeCatalogRoute,
  EquipmentCatalogRoute,
  UserCatalogRoute,
  RoleCatalogRoute,
  AuthCatalogRoute,
  RoomTypeCatalogRoute,
  SupplieCatalogRoute,
  RoomStatusCatalogRoute,
  RoomCatalogRoute,
  FloorCatalogRoute,
  RoomActionRoute,
  ReservationActionRoute,
} from '../routes';
import AppDataSource from "../database/config";
import seedDatabase from "../database/seed-database";
import { DataSource } from "typeorm";
import { ENV_PORT } from "../config/enviroment";


class Server {
  private app: Application;
  private port: number;
  private pathsCatalogs: {
    reservationCatalog: string;
    clientCatalog: string;
    employeeCatalog: string;
    userCatalog: string;
    roleCatalog: string;
    equipmentCatalog: string;
    roomTypeCatalog: string;
    supplieCatalog: string;
    roomStatusCatalog: string;
    roomCatalog: string;
    floorCatalog: string;
  };
  private pathsActions: {
    roomAction: string;
    searchCatalog: string;
    reservationAction: string;
  };
  private pathsSecurity: {
    authSecurity: string;
  };

  constructor() {
    this.app = express();
    this.port = ENV_PORT;
    this.pathsCatalogs = {
      reservationCatalog: "/api/catalogs/reservation",
      clientCatalog: "/api/catalogs/client",
      employeeCatalog: "/api/catalogs/employee",
      userCatalog: "/api/catalogs/user",
      roleCatalog: "/api/catalogs/role",
      equipmentCatalog: "/api/catalogs/equipment",
      roomTypeCatalog: "/api/catalogs/room-type",
      supplieCatalog: "/api/catalogs/supplie",
      roomStatusCatalog: "/api/catalogs/room-status",
      roomCatalog: "/api/catalogs/room",
      floorCatalog: "/api/catalogs/floor",
    };
    this.pathsActions = {
      roomAction: "/api/actions/room",
      reservationAction: "/api/actions/reservation",
      searchCatalog: "/api/actions/search",
    };
    this.pathsSecurity = {
      authSecurity: "/api/security/auth",
    };
    this.middlewares();
    this.routes();
  }
  
  get getApp() {
    return this.app;
  };

  async connectDB() {
    try {
      await AppDataSource.initialize();
      console.log("Connected to the database successfully");
      if (argv.database) {
        (async ()=> {
          await seedDatabase();
        })();
      }
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  async connectDBTest() {
    try {
      const AppDataSourceTest = new DataSource({
        type: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: 'admin',
        database: 'db_thunder_house',
        synchronize: true,
        entities,
      });
      await AppDataSourceTest.initialize();
      console.log("Connected to the database successfully");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }

  middlewares() {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.static("public"));
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: "/tmp/",
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.pathsCatalogs.reservationCatalog, ReservationCatalogRoute);
    this.app.use(this.pathsCatalogs.clientCatalog, ClientCatalogRoute);
    this.app.use(this.pathsCatalogs.employeeCatalog, EmployeeCatalogRoute);
    this.app.use(this.pathsCatalogs.userCatalog, UserCatalogRoute);
    this.app.use(this.pathsCatalogs.roleCatalog, RoleCatalogRoute);
    this.app.use(this.pathsCatalogs.equipmentCatalog, EquipmentCatalogRoute);
    this.app.use(this.pathsCatalogs.roomTypeCatalog, RoomTypeCatalogRoute);
    this.app.use(this.pathsCatalogs.supplieCatalog, SupplieCatalogRoute);
    this.app.use(this.pathsCatalogs.roomStatusCatalog, RoomStatusCatalogRoute);
    this.app.use(this.pathsCatalogs.roomCatalog, RoomCatalogRoute);
    this.app.use(this.pathsCatalogs.floorCatalog, FloorCatalogRoute);

    this.app.use(this.pathsActions.roomAction, RoomActionRoute);
    this.app.use(this.pathsActions.reservationAction, ReservationActionRoute);
    
    this.app.use(this.pathsSecurity.authSecurity, AuthCatalogRoute);
  }
  
  listen() {
    this.app.listen(this.port, () => {
      console.log("Server is running on port", this.port);
      console.log(`http://localhost:${this.port}/`);
    });
  }

}

export default Server;