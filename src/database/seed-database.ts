
import bcryptjs from "bcryptjs";

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
  DetailEquipmentRoomTypeEntity,
  DetailReservationRoomEntity,
  DetailRoleFloorEntity,
  DetailSupplieRoomTypeEntity,
  DetailUserRoleEntity,
} from "../entity";
import {
  equipmentInitInformation,
  employeeInitInformaiton,
  roleInitInformation,
  roomStatusInitInformation,
  supplieInitInformation,
  totalFloors,
  clientInitInformation,
  roomTypeInitInformation,
  roomsInitInformation,
  reservationInitInformation
} from "./init-data";
import {
  COST_EXTRA_PARKING_PASS,
  COST_EXTRA_PARKING_PASS_FORGOT,
  COST_EXTRA_PEOPLE,
  COST_KEY_FORGOT,
  COST_PARKING_PASS_FORGOT
} from "../calculous/get-price-reservation";


const seedDatabase = async () => {
  await truncateTables();
  await fillDatabase();
};

const floorsEntities: CatFloorEntity[] = [];
const rolesEntities: CatRoleEntity[] = [];
const roomStatusEntities: CatRoomStatusEntity[] = [];
const equipmentEntities: CatEquipmentEntity[] = [];
const supplieEntities: CatSupplieEntity[] = [];
const roomTypeEntities: CatRoomTypeEntity[] = [];
const roomEntities: CatRoomEntity[] = [];
const clientEntities: CatClientEntity[] = [];
const reservationEntities: CatReservationEntity[] = [];

const fillDatabase = async () => {
  await generateFloors();
  await generateRoles();
  await assingRolesToFloors();

  await generateEmployees();
  await generateClients();

  await generateRommStatus();
  await generateEquipments();
  await generateSupplies();
  await generateRoomTypes();
  await generateRooms();

  await generateReservationsRegister();
  await generateReservationsArrive();
  await generateReservationsOutput();

  await changeStatuRooms();

}
const changeStatuRooms = async () => {
  for (let i = 0; i < reservationInitInformation.length; i++) {
    const reservation = reservationInitInformation[i];
    for (let j = 0; j < reservation.detail_reservation_room.length; j++) {
      const detail = reservation.detail_reservation_room[j];
      const room = roomEntities[detail.positionRoom];
      if (i === 0 || i === 1) {
        room.cat_room_status = roomStatusEntities[3];
      }
      if (i === 2 || i === 3) {
        room.cat_room_status = roomStatusEntities[1];
      }
      if (i === 4) {
        room.cat_room_status = roomStatusEntities[0];
      }
      await room.save();
    }
  }
}

const generateReservationsOutput = async () => {
  const reservation = reservationEntities[4];
  let subtotalExtra = 0;
  
  for (let i = 0; i < reservation.detail_reservation_room.length; i++) {
    const detail = reservation.detail_reservation_room[i];
    detail.extra_parking_pass_returned = 1;
    detail.parking_pass_returned = false;
    detail.parking_pass_forgot = true;
    detail.key_returned = false;
    detail.key_forgot = true;
    detail.observations = 'broken pillow';
    detail.extra_charges = 100;
    await detail.save();
    if (detail.extra_parking_pass) {
      if (detail.extra_parking_pass_returned < detail.extra_parking_pass) {
        subtotalExtra += (detail.extra_parking_pass - detail.extra_parking_pass_returned) * COST_EXTRA_PARKING_PASS_FORGOT;
      }
    }
    if (!detail.parking_pass_forgot) {
      subtotalExtra += COST_PARKING_PASS_FORGOT;
    }
    if (!detail.key_forgot) {
      subtotalExtra += COST_KEY_FORGOT;
    }
    if (detail.extra_charges) {
      subtotalExtra += Number(detail.extra_charges);
    }
  
  }
  reservation!.subtotal = Number(reservation!.subtotal + subtotalExtra);
  reservation.status_progress = 3;
  await reservation.save();
};

const generateReservationsArrive = async () => {
  const reservationArrived = [
    reservationEntities[2],
    reservationEntities[3],
    reservationEntities[4],
  ];
  for (let i = 0; i < reservationArrived.length; i++) {
    const reservation = reservationArrived[i];
    let subtotalExtra = 0;
    for (let j = 0; j < reservation.detail_reservation_room.length; j++) {
      const detail = reservation.detail_reservation_room[j];
      detail.total_people_arrived = j === 0 ? detail.total_people_booked : detail.total_people_booked + 2;
      detail.parking_pass_delivered = true;
      detail.extra_parking_pass = j === 0 ? 0 : 2;
      detail.key_delivered = true;
      detail.baggage_claim = j === 0 ? true : false;
      detail.supplies_delivered = j === 0 ? true : false;
      await detail.save();

      if (detail.total_people_arrived > detail.total_people_booked) {
        subtotalExtra += COST_EXTRA_PEOPLE * (detail.total_people_arrived - detail.total_people_booked);
      }
      if (detail.extra_parking_pass > 0) {
        subtotalExtra += COST_EXTRA_PARKING_PASS * detail.extra_parking_pass;
      }
    }
    reservation!.subtotal = Number(reservation!.subtotal + subtotalExtra);
    reservation.status_progress = 2;
    await reservation.save();
  }
};

const generateReservationsRegister = async () => {
  for (let i = 0; i < reservationInitInformation.length; i++) {
    const initReservationInfo = reservationInitInformation[i];
    const newCatReservationEntity = new CatReservationEntity();
    newCatReservationEntity.is_from_platform_promotion = false;
    newCatReservationEntity.group_leader = initReservationInfo.names[0];
    newCatReservationEntity.sub_group_leader = initReservationInfo.names[1];
    newCatReservationEntity.has_breakfast = initReservationInfo.has_breakfast;
    
    const startDate = new Date(initReservationInfo.start_date);
    const fiveDaysEarlier = new Date(startDate);
    fiveDaysEarlier.setDate(startDate.getDate() - 5);

    newCatReservationEntity.start_date = startDate;
    newCatReservationEntity.end_date = new Date(initReservationInfo.end_date);
    newCatReservationEntity.date_reservation = new Date(fiveDaysEarlier);

    newCatReservationEntity.total = 0;
    newCatReservationEntity.status_progress = 1;
    newCatReservationEntity.cat_client = clientEntities[i];

    let subtotal = 0;
    const detailRoomReservation = [];
    for (let j = 0; j < initReservationInfo.detail_reservation_room.length; j++) {
      const detailReservation = initReservationInfo.detail_reservation_room[j];
      const newDetailReservationRoomEntity = new DetailReservationRoomEntity();
      newDetailReservationRoomEntity.total_people_booked = detailReservation.total_people_booked;
      newDetailReservationRoomEntity.cat_reservation = newCatReservationEntity;
      const roomSelected = roomEntities[detailReservation.positionRoom];
      newDetailReservationRoomEntity.cat_room = roomSelected;
      subtotal += Number(roomSelected.cat_room_type.price);
      detailRoomReservation.push(newDetailReservationRoomEntity);
    }
    newCatReservationEntity.subtotal = subtotal;
    newCatReservationEntity.detail_reservation_room = detailRoomReservation;
    await newCatReservationEntity.save();
    reservationEntities.push(newCatReservationEntity);
    for (let j = 0; j < detailRoomReservation.length; j++) {
      const detail = detailRoomReservation[j];
      await detail.save();
    }
  }
}

const generateRooms = async () => {
  for (let i = 0; i < roomsInitInformation.length; i++) {
    const roomInit = roomsInitInformation[i];
    const catTypeRoomSelected = roomTypeEntities[roomInit.roomTypePosition];
    for (let j = 0; j < roomInit.distribution.floors.length; j++) {
      let numberByFlorr = 0;
      const distribution = roomInit.distribution.floors[j];
      const catFloorSelected = floorsEntities[distribution.floorPosition];
      for (let k = 0; k < distribution.total; k++) {
        numberByFlorr++;
        const newCatRoomEntity = new CatRoomEntity();
        newCatRoomEntity.number = numberByFlorr;
        newCatRoomEntity.cat_floor = catFloorSelected;
        newCatRoomEntity.cat_room_status = roomStatusEntities[2];
        newCatRoomEntity.cat_room_type = catTypeRoomSelected;
        await newCatRoomEntity.save();
        roomEntities.push(newCatRoomEntity);
      }
    }
  }
}

const generateRoomTypes = async () => {
  for (const roomType of roomTypeInitInformation) {
    const newCatRoomTypeEntity = new CatRoomTypeEntity();
    newCatRoomTypeEntity.room_type = roomType.room_type;
    newCatRoomTypeEntity.price = roomType.price;
    await newCatRoomTypeEntity.save();
    for (let i = 0; i < roomType.equipments.length; i++) {
      if (roomType.equipments[i].equipmentTotal > 0) {
        const newDetailEquipmentRoomTypeEntity = new DetailEquipmentRoomTypeEntity();
        newDetailEquipmentRoomTypeEntity.total_equipments = roomType.equipments[i].equipmentTotal;
        newDetailEquipmentRoomTypeEntity.cat_equipment = equipmentEntities[i];
        newDetailEquipmentRoomTypeEntity.cat_room_type = newCatRoomTypeEntity;
        await newDetailEquipmentRoomTypeEntity.save();
      }
    }
    for (let i = 0; i < roomType.supplies.length; i++) {
      if (roomType.supplies[i].supplieTotal > 0) {
        const newDetailSupplieRoomTypeEntity = new DetailSupplieRoomTypeEntity();
        newDetailSupplieRoomTypeEntity.total_supplies = roomType.supplies[i].supplieTotal;
        newDetailSupplieRoomTypeEntity.cat_supplie = supplieEntities[i];
        newDetailSupplieRoomTypeEntity.cat_room_type = newCatRoomTypeEntity;
        await newDetailSupplieRoomTypeEntity.save();
      }
    }
    roomTypeEntities.push(newCatRoomTypeEntity);
  }
}

const generateEquipments = async () => {
  for (const equipment of equipmentInitInformation) {
    const newCatEquipmentEntity = new CatEquipmentEntity();
    newCatEquipmentEntity.equipment = equipment.equipment;
    newCatEquipmentEntity.total_number_people = equipment.total_number_people;
    await newCatEquipmentEntity.save();
    equipmentEntities.push(newCatEquipmentEntity);
  }
}

const generateSupplies = async () => {
  for (const supplie of supplieInitInformation) {
    const newCatSupplieEntity = new CatSupplieEntity();
    newCatSupplieEntity.supplie = supplie.supplie;
    await newCatSupplieEntity.save();
    supplieEntities.push(newCatSupplieEntity);
  }
}

const generateRommStatus = async () => {
  for (const roomStatus of roomStatusInitInformation) {
    const newCatRoomStatusEntity = new CatRoomStatusEntity();
    newCatRoomStatusEntity.dirty = roomStatus.dirty;
    newCatRoomStatusEntity.busy = roomStatus.busy;
    await newCatRoomStatusEntity.save();
    roomStatusEntities.push(newCatRoomStatusEntity);
  }
}

const generateFloors = async () => {
  for (let i = 0; i < totalFloors; i++) {
    const catFloor = new CatFloorEntity();
    catFloor.number = i + 1;
    catFloor.name = `Floor ${i + 1}`;
    await catFloor.save();
    floorsEntities.push(catFloor);
  }
}

const generateRoles = async () => {
  for (let i = 0; i < roleInitInformation.length; i++) {
    const role = roleInitInformation[i];
    const newRole = new CatRoleEntity();
    newRole.role = role;
    await newRole.save();
    rolesEntities.push(newRole);
  }
  for (let i = 0; i < floorsEntities.length; i++) {
    const newRole = new CatRoleEntity();
    newRole.role = `Floor ${i + 1} manager`;
    await newRole.save();
    rolesEntities.push(newRole);
  }
}

const assingRolesToFloors = async () => {
  let consecutiveFloor = 0;
  for (let i = 0; i < rolesEntities.length; i++) {
    const role: CatRoleEntity = rolesEntities[i];
    if (role.role === 'Administrator' || role.role === 'Receptionist') {
      const arrDetailFloors = [];
      for (let j = 0; j < floorsEntities.length; j++) {
        const newDetailRoleFlor = new DetailRoleFloorEntity();
        const floor = floorsEntities[j];
        newDetailRoleFlor.cat_floor = floor;
        newDetailRoleFlor.cat_role = role;
        await newDetailRoleFlor.save();
        arrDetailFloors.push(newDetailRoleFlor);
      }
      role.detail_role_floor = arrDetailFloors;
      await role.save();
    } else {
      const newDetailRoleFlor = new DetailRoleFloorEntity();
      const floor = floorsEntities[consecutiveFloor];
      consecutiveFloor++;
      newDetailRoleFlor.cat_floor = floor;
      newDetailRoleFlor.cat_role = role;
      await newDetailRoleFlor.save();
      role.detail_role_floor = [newDetailRoleFlor];
      await role.save();
    }
  }
}

const generateEmployees = async () => {
  for (let i = 0; i < employeeInitInformaiton.length; i++) {
    const personInit = employeeInitInformaiton[i];
    const newUser = new CatUserEntity();
    newUser.email = personInit.cat_employee.cat_user.email;
    newUser.user_name = personInit.cat_employee.cat_user.user_name;
    newUser.password = bcryptjs.hashSync(personInit.cat_employee.cat_user.password, bcryptjs.genSaltSync());
    const newDetailUserRole = new DetailUserRoleEntity();
    newDetailUserRole.cat_user = newUser;
    newDetailUserRole.cat_role = rolesEntities[i];
    await newUser.save();
    await newDetailUserRole.save();
    
    const newEmployee = new CatEmployeeEntity();
    newEmployee.cat_user = newUser;
    await newEmployee.save();
    generatePersons({
      personInit,
      cat_employee: newEmployee,
    })
  }
}


const generateClients = async () => {
  for (let i = 0; i < clientInitInformation.length; i++) {
    const personInit = clientInitInformation[i];

    const newUser = new CatUserEntity();
    newUser.email = personInit.cat_client.cat_user.email;
    newUser.user_name = personInit.cat_client.cat_user.user_name;
    newUser.password = bcryptjs.hashSync(personInit.cat_client.cat_user.user_name, bcryptjs.genSaltSync());
    await newUser.save();
    
    const newClient = new CatClientEntity();
    newClient.cat_user = newUser;
    await newClient.save();
    clientEntities.push(newClient);
    generatePersons({
      personInit,
      cat_client: newClient,
    })
  }
}

interface objPerson {
  personInit: any,
  cat_employee?: any,
  cat_client?: any,
}

const generatePersons = async ({
  personInit,
  cat_employee,
  cat_client,
}: objPerson) => {
  const newPerson = new CatPersonEntity();
  newPerson.name = personInit.name;
  newPerson.surname_father = personInit.surname_father;
  newPerson.surname_mother = personInit.surname_mother;
  newPerson.phone_contact = personInit.phone_contact;
  newPerson.email_contact = personInit.email_contact;
  newPerson.birth = new Date(personInit.birth);
  newPerson.gender = personInit.gender;
  newPerson.street_address = personInit.street_address;
  newPerson.city = personInit.city;
  newPerson.state_province = personInit.state_province;
  newPerson.zip_code = personInit.zip_code;
  newPerson.country = personInit.country;
  if (cat_employee) {
    newPerson.cat_employee = cat_employee;
  }
  if (cat_client) {
    newPerson.cat_client = cat_client;
  }
  await newPerson.save();
}


const truncateTables = async () => {
  await executeTruncate(DetailReservationRoomEntity, 'detail_reservation_room');
  await executeTruncate(CatReservationEntity, 'cat_reservation');
  await executeTruncate(CatPersonEntity, 'cat_person');
  await executeTruncate(CatClientEntity, 'cat_client');
  await executeTruncate(CatEmployeeEntity, 'cat_employee');
  await executeTruncate(DetailUserRoleEntity, 'detail_user_role');
  await executeTruncate(DetailRoleFloorEntity, 'detail_role_floor');
  await executeTruncate(CatRoomEntity, 'cat_room');
  await executeTruncate(CatRoleEntity, 'cat_role');
  await executeTruncate(CatUserEntity, 'cat_user');
  await executeTruncate(CatFloorEntity, 'cat_floor');
  await executeTruncate(CatRoomStatusEntity, 'cat_room_status');
  await executeTruncate(DetailEquipmentRoomTypeEntity, 'detail_equipment_room_type');
  await executeTruncate(DetailSupplieRoomTypeEntity, 'detail_supplie_room_type');
  await executeTruncate(CatEquipmentEntity, 'cat_equipment');
  await executeTruncate(CatSupplieEntity, 'cat_supplie');
  await executeTruncate(CatRoomTypeEntity, 'cat_room_type');
}

const executeTruncate = async (Enity: any, tableName: string): Promise<void> => {
  await Enity
    .createQueryBuilder()
    .delete()
    .from(Enity)
    .execute();
  await Enity
    .query(`ALTER TABLE ${tableName} AUTO_INCREMENT = 1;`);
}

export default seedDatabase;


