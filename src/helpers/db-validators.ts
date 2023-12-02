
import { In } from "typeorm";
import {
  CatClientEntity,
  CatEmployeeEntity,
  CatEquipmentEntity,
  CatFloorEntity,
  CatPersonEntity,
  CatReservationEntity,
  CatRoleEntity,
  CatRoomEntity,
  CatRoomStatusEntity,
  CatRoomTypeEntity,
  CatSupplieEntity,
  CatUserEntity,
} from "../entity";


// export const isUniqueUser = (fieldName: string, isSelf: boolean = false) => {
//   return async (value: any, { req }: any) => {
//     try {
//       if (value === null) {
//         return true;
//       }
//       const query: any = {};
//       query[fieldName] = value;
//       const existingUser = await CatUserEntity.findOneBy(query);
//       if (existingUser) {
//         if (isSelf) {
//           const { id_cat_user } = req.params;
//           if (existingUser.id_cat_user === id_cat_user) return true;
//         }
//         throw new Error(`${fieldName} is already in use`);
//       }
//       return true;
//     } catch (error) {
//       throw error;
//     }
//   };
// };

export const isUniqueUser = (fieldName: string, isSelf: boolean = false) => {
    return async (value: any, { req }: any) => {
      return true;
    };
};

export const allowedCollections = (
  collection = "",
  collections: string[] = []
) => {
  const isAllowed = collections.includes(collection);
  if (!isAllowed) {
    throw new Error(
      `The collection ${collection} is not allowed, allowed collections: ${collections}`
    );
  }
  return true;
};

export const rolesExist = (isUpdate: boolean = false) => {
  return async (value: any, { req }: any) => {
    try {
      const { roles } = req.body;
      if (isUpdate && (roles === null)) {
        return true;
      }
      const existingRoles = await CatRoleEntity.findBy({
        id_cat_role: In(value)
      });
      if (existingRoles.length !== value.length) {
        throw new Error('Not all role uuids exist in the database');
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
};


export const isValidArraySupplies = async (arr: {
    id_supplie: number,
    total_supplies: number,
  }[]
) => {
  if (arr.length === 0) {
    throw new Error(`The ArraySupplies can not be empty`);
  }
  arr.forEach(item => {
    if (item.total_supplies <= 0 || (!Number.isInteger(item.total_supplies))) {
      throw new Error(`All total_supplies should be integer and greater than 0`);
    }
  });
  const promises = arr.map(item => supplieExistsById(false)(item.id_supplie));
  try {
    await Promise.all(promises);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const isValidArrayFloors = async (arr: {
  id_floor: number,
}[]
) => {
if (arr.length === 0) {
  throw new Error(`The ArrayFloors can not be empty`);
}
const promises = arr.map(item => floorExistsById(false)(item.id_floor));
try {
  await Promise.all(promises);
  return true;
} catch (error: any) {
    throw new Error(error.message);
}
return true;
}

export const isValidArrayRoles = async (arr: {
  id_role: number,
}[]
) => {
  if (arr.length === 0) {
    throw new Error(`The ArrayRoles can not be empty`);
  }
  const promises = arr.map(item => roleExistsById(false)(item.id_role));
  try {
    await Promise.all(promises);
    return true;
  } catch (error: any) {
      throw new Error(error.message);
  }
}


export const isValidArrayEquipments = async (arr: {
  id_equipment: number,
  total_equipments: number,
}[]
) => {
  if (arr.length === 0) {
    throw new Error(`The ArrayEquipments can not be empty`);
  }
  arr.forEach(item => {
    if (item.total_equipments <= 0 || (!Number.isInteger(item.total_equipments))) {
      throw new Error(`All total_equipments should be integer and greater than 0`);
    }
  });
  const promises = arr.map(item => equipmentExistsById(false)(item.id_equipment));
  try {
    await Promise.all(promises);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export const userExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_user: number) => {
    try {
      const userExists = await CatUserEntity.findOneBy({
        id_cat_user,
      });
      if (!userExists) {
        throw new Error(`The User ID ${id_cat_user} does not exist in the database`);
      }
      if (checkEnable) {
        if (userExists!.status === false) {
          throw new Error(`The User ID ${id_cat_user} is disabled`);
        }
      }
    } catch (error) {
      throw error;
    }
  };
};

export const roleExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_role: number) => {
    try {
      const roleFound = await CatRoleEntity.findOneBy({
        id_cat_role,
      });
      if (!roleFound) {
        throw new Error(`The Role ID ${id_cat_role} does not exist in the database`);
      }
      if (checkEnable) {
        if (roleFound!.status === false) {
          throw new Error(`The Role ID ${id_cat_role} is disabled`);
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
};

export const equipmentExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_equipment: number) => {
    try {
      const equipmentFound = await CatEquipmentEntity.findOneBy({
        id_cat_equipment,
      });
      if (!equipmentFound) {
        throw new Error(`The Equipment ID ${id_cat_equipment} does not exist in the database`);
      }
      if (checkEnable) {
        if (equipmentFound!.status === false) {
          throw new Error(`The Equipment ID ${id_cat_equipment} is disabled`);
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
};

export const floorExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_floor: number) => {
    try {
      const floorFound = await CatFloorEntity.findOneBy({
        id_cat_floor,
      });
      if (!floorFound) {
        throw new Error(`The Floor ID ${id_cat_floor} does not exist in the database`);
      }
      if (checkEnable) {
        if (floorFound!.status === false) {
          throw new Error(`The Floor ID ${id_cat_floor} is disabled`);
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
};

export const roomTypeExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_room_type: number) => {
    try {
      const roomTypeFound = await CatRoomTypeEntity.findOneBy({
        id_cat_room_type,
      });
      if (!roomTypeFound) {
        throw new Error(`The RoomType ID ${id_cat_room_type} does not exist in the database`);
      }
      if (checkEnable) {
        if (roomTypeFound!.status === false) {
          throw new Error(`The RoomType ID ${id_cat_room_type} is disabled`);
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
};

export const supplieExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_supplie: number) => {
    try {
      const supplieFound = await CatSupplieEntity.findOneBy({
        id_cat_supplie,
      });
      if (!supplieFound) {
        throw new Error(`The Supplie ID ${id_cat_supplie} does not exist in the database`);
      }
      if (checkEnable) {
        if (supplieFound!.status === false) {
          throw new Error(`The Supplie ID ${id_cat_supplie} is disabled`);
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
};

export const roomStatusExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_room_status: number) => {
    try {
      const roomStatusFound = await CatRoomStatusEntity.findOneBy({
        id_cat_room_status,
      });
      if (!roomStatusFound) {
        throw new Error(`The RoomStatus ID ${id_cat_room_status} does not exist in the database`);
      }
      if (checkEnable) {
        if (roomStatusFound!.status === false) {
          throw new Error(`The RoomStatus ID ${id_cat_room_status} is disabled`);
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
};

export const roomExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_room: number) => {
    try {
      const roomFound = await CatRoomEntity.findOneBy({
        id_cat_room,
      });
      if (!roomFound) {
        throw new Error(`The Room ID ${id_cat_room} does not exist in the database`);
      }
      if (checkEnable) {
        if (roomFound!.status === false) {
          throw new Error(`The Room ID ${id_cat_room} is disabled`);
        }
      }
      return true;
    } catch (error) {
      throw error;
    }
  };
};

export const employeeExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_employee: number) => {
    try {
      const employeePersonExists: CatPersonEntity | null = await CatPersonEntity.createQueryBuilder('cat_person')
        .leftJoinAndSelect('cat_person.cat_employee', 'cat_employee')
        .leftJoinAndSelect('cat_employee.cat_user', 'cat_user')
        .leftJoinAndSelect('cat_user.detail_user_role', 'detail_user_role')
        .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
        .where('cat_employee.id_cat_employee = :id_cat_employee AND cat_person.status = :status AND cat_user.status = :status', { id_cat_employee, status: true })
        .getOne();
      if (!employeePersonExists) {
        throw new Error(`The Employee ID ${id_cat_employee} does not exist in the database`);
      }
      if (checkEnable) {
        if (employeePersonExists!.status === false) {
          throw new Error(`The person with the Employee ID ${id_cat_employee} is disabled`);
        }
        if (employeePersonExists!.cat_employee?.cat_user.status === false) {
          throw new Error(`The user with the Employee ID ${id_cat_employee} is disabled`);
        }
      }
    } catch (error) {
      throw error;
    }
  };
};

export const clientExistsById = (checkEnable: boolean = true) => {
  return async (id_cat_client: number) => {
    try {
      const clientPersonExists: CatPersonEntity | null = await CatPersonEntity.createQueryBuilder('cat_person')
        .leftJoinAndSelect('cat_person.cat_client', 'cat_client')
        .leftJoinAndSelect('cat_client.cat_user', 'cat_user')
        .leftJoinAndSelect('cat_user.detail_user_role', 'detail_user_role')
        .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
        .where('cat_client.id_cat_client = :id_cat_client AND cat_person.status = :status AND cat_user.status = :status', { id_cat_client, status: true })
        .getOne();
      if (!clientPersonExists) {
        throw new Error(`The Client ID ${id_cat_client} does not exist in the database`);
      }
      if (checkEnable) {
        if (clientPersonExists!.status === false) {
          throw new Error(`The person with the Client ID ${id_cat_client} is disabled`);
        }
        if (clientPersonExists!.cat_employee?.cat_user.status === false) {
          throw new Error(`The user with the Client ID ${id_cat_client} is disabled`);
        }
      }
    } catch (error) {
      throw error;
    }
  };
};

export const reservationExistsById = async (id_cat_reservation: number) => {
  try {
    const reservationFound = await CatReservationEntity.findOneBy({
      id_cat_reservation,
    });
    if (!reservationFound) {
      throw new Error(`The Reservation ID ${id_cat_reservation} does not exist in the database`);
    }
    return true;
  } catch (error) {
    throw error;
  }
};