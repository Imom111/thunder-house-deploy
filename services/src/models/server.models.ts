
import express, { Application } from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

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
} from '../routes';
import AppDataSource from "../database/config";
import seedDatabase from "../database/seed-database";


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
  };
  private pathsSecurity: {
    authSecurity: string;
  };

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 8080;
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
      searchCatalog: "/api/actions/search",
    };
    this.pathsSecurity = {
      authSecurity: "/api/security/auth",
    };
    // Connect to the database
    this.connectDB();
    this.middlewares();
    this.routes();
  }

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

  middlewares() {
    // Enable CORS
    this.app.use(cors());
    // Parse request body as JSON
    this.app.use(express.json());
    // Serve static files from the "public" directory
    this.app.use(express.static("public"));
    // Enable file upload
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