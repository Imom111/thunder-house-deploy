
import { Request, Response } from "express";

import {
  CatEmployeeEntity,
  CatPersonEntity,
  CatRoleEntity,
  CatUserEntity,
  DetailUserRoleEntity,
} from "../../entity";
import { generatePassword } from "../../helpers";
import { Equal } from "typeorm";


export const employeeGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_employee } = req.params;
    const employeeFound: any = await findExistingEmployee(parseInt(id_cat_employee));
    if (employeeFound && employeeFound.cat_employee && employeeFound.cat_employee.cat_user) {
      const user = { ...employeeFound.cat_employee.cat_user };
      const { password, ...userSafe } = user;
      employeeFound.cat_employee.cat_user = userSafe;
    }
    return res.status(200).json({
      employee: employeeFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const employeeGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let personList: CatPersonEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      personList = await CatPersonEntity.createQueryBuilder('cat_person')
        .leftJoinAndSelect('cat_person.cat_employee', 'cat_employee')
        .leftJoin('cat_employee.cat_user', 'cat_user').addSelect(['cat_user.id_cat_user', 'cat_user.email', 'cat_user.user_name', 'cat_user.status'])
        .leftJoinAndSelect('cat_user.detail_user_role', 'detail_user_role')
        .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
        .limit(parsedLimit)
        .offset(skip)
        .where('cat_person.status = :status AND cat_user.status = :status', { status: true })
        .getMany();
    } else {
      personList = await CatPersonEntity.createQueryBuilder('cat_person')
        .leftJoinAndSelect('cat_person.cat_employee', 'cat_employee')
        .leftJoin('cat_employee.cat_user', 'cat_user').addSelect(['cat_user.id_cat_user', 'cat_user.email', 'cat_user.user_name', 'cat_user.status'])
        .leftJoinAndSelect('cat_user.detail_user_role', 'detail_user_role')
        .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
        .where('cat_person.status = :status AND cat_user.status = :status', { status: true })
        .getMany();
    }
    return res.status(200).json({
      list: personList,
      count: personList.length,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const employeePut = async (req: Request, res: Response) => {
  const { id_cat_employee } = req.params;
  const {
    // person
    name,
    surname_father,
    surname_mother,
    phone_contact,
    email_contact,
    birth,
    gender,
    street_address,
    city,
    state_province,
    zip_code,
    country,
    status_person,
    // user
    password,
    email,
    user_name,
    roles,
    status_user,
  }: {
    // person
    name: string,
    surname_father: string,
    surname_mother: string,
    phone_contact: string,
    email_contact: string,
    birth: string,
    gender: string,
    street_address: string,
    city: string,
    state_province: string,
    zip_code: string,
    country: string,
    status_person: boolean,
    // user
    password: string,
    email: string,
    user_name: string,
    roles: {id_role: string}[],
    status_user: boolean,
  } = req.body;
  try {
    // Find employee
    const employeeUpdating = await CatEmployeeEntity.findOne({
      where: {
        id_cat_employee: parseInt(id_cat_employee),
      },
    });
    // Find employee
    const personUpdating = await CatPersonEntity.createQueryBuilder('cat_person')
      .leftJoin('cat_person.cat_employee', 'cat_employee')
      .where('cat_employee.id_cat_employee = :id_cat_employee', { id_cat_employee })
      .getOne();
    // Find user
    const userUpdating = await CatUserEntity.findOne({
      where: {
        id_cat_user: employeeUpdating?.cat_user?.id_cat_user!,
      },
    });
    // Update user
    if (password != null) {
      userUpdating!.password = generatePassword(password);
    }
    userUpdating!.email = email;
    userUpdating!.user_name = user_name;
    userUpdating!.status = status_user;
    userUpdating!.save();
    const foundDetailUserRoleEntity = await DetailUserRoleEntity.find({
      where: {
        cat_user: Equal(userUpdating!.id_cat_user)
      }
    });
    for (const item of foundDetailUserRoleEntity) {
      await item.remove();
    }
    for (const role of roles) {
      const newDetailUserRoleEntity = new DetailUserRoleEntity();
      const roleFound = await CatRoleEntity.findOne({
        where: {
          id_cat_role: parseInt(role.id_role),
          status: true,
        },
      });
      newDetailUserRoleEntity.cat_role = roleFound!;
      newDetailUserRoleEntity.cat_user = userUpdating!;
      await newDetailUserRoleEntity.save();
    }
    // Update employee
    employeeUpdating!.cat_user = userUpdating!;
    await employeeUpdating!.save();
    // Update person
    personUpdating!.name = name;
    personUpdating!.surname_father = surname_father;
    personUpdating!.surname_mother = surname_mother;
    personUpdating!.phone_contact = phone_contact;
    personUpdating!.email_contact = email_contact;
    personUpdating!.birth = new Date(birth);
    personUpdating!.gender = gender;
    personUpdating!.street_address = street_address;
    personUpdating!.city = city;
    personUpdating!.state_province = state_province;
    personUpdating!.zip_code = zip_code;
    personUpdating!.country = country;
    personUpdating!.status = status_person;
    personUpdating!.cat_employee = employeeUpdating!;
    await personUpdating!.save();

    const employeeFound: any = await findExistingEmployee(employeeUpdating!.id_cat_employee!);
    if (employeeFound && employeeFound.cat_employee && employeeFound.cat_employee.cat_user) {
      const user = { ...employeeFound.cat_employee.cat_user };
      const { password, ...userSafe } = user;
      employeeFound.cat_employee.cat_user = userSafe;
    }
    return res.status(200).json({
      employee: employeeFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const employeePost = async (req: Request, res: Response) => {
  const {
    // person
    name,
    surname_father,
    surname_mother,
    phone_contact,
    email_contact,
    birth,
    gender,
    street_address,
    city,
    state_province,
    zip_code,
    country,
    // user
    password,
    email,
    user_name,
    roles,
  }: {
    // person
    name: string,
    surname_father: string,
    surname_mother: string,
    phone_contact: string,
    email_contact: string,
    birth: string,
    gender: string,
    street_address: string,
    city: string,
    state_province: string,
    zip_code: string,
    country: string,
    // user
    password: string,
    email: string,
    user_name: string,
    roles: {id_role: string}[],
  } = req.body;
  try {
    // Insert user
    const newUser: CatUserEntity = new CatUserEntity();
    newUser.email = email;
    newUser.user_name = user_name;
    newUser.password = generatePassword(password);
    await newUser.save();
    for (const role of roles) {
      const newDetailUserRoleEntity = new DetailUserRoleEntity();
      const roleFound = await CatRoleEntity.findOne({
        where: {
          id_cat_role: parseInt(role.id_role),
          status: true,
        },
      });
      newDetailUserRoleEntity.cat_role = roleFound!;
      newDetailUserRoleEntity.cat_user = newUser;
      await newDetailUserRoleEntity.save();
    }
    // Insert employee
    const newEmployee: CatEmployeeEntity = new CatEmployeeEntity();
    newEmployee.cat_user = newUser;
    await newEmployee.save();
    // Insert person
    const newPerson: CatPersonEntity = new CatPersonEntity();
    newPerson.name = name;
    newPerson.surname_father = surname_father;
    newPerson.surname_mother = surname_mother;
    newPerson.phone_contact = phone_contact;
    newPerson.email_contact = email_contact;
    newPerson!.birth = new Date(birth);
    newPerson.gender = gender;
    newPerson.street_address = street_address;
    newPerson.city = city;
    newPerson.state_province = state_province;
    newPerson.zip_code = zip_code;
    newPerson.country = country;
    newPerson.cat_employee = newEmployee;
    await newPerson.save();
    const employeeFound: any = await findExistingEmployee(newEmployee.id_cat_employee!);
    if (employeeFound && employeeFound.cat_employee && employeeFound.cat_employee.cat_user) {
      const user = { ...employeeFound.cat_employee.cat_user };
      const { password, ...userSafe } = user;
      employeeFound.cat_employee.cat_user = userSafe;
    }
    return res.status(200).json({
      employee: employeeFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const employeeDelete = async (req: Request, res: Response) => {
  const { id_cat_employee } = req.params;
  try {
    const employeeFound = await CatEmployeeEntity.findOne({
      where: {
        id_cat_employee: parseInt(id_cat_employee),
      },
    });
    const personUpdating = await CatPersonEntity.createQueryBuilder('cat_person')
      .leftJoin('cat_person.cat_employee', 'cat_employee')
      .where('cat_employee.id_cat_employee = :id_cat_employee', { id_cat_employee })
      .getOne();
    personUpdating!.status = false;
    await personUpdating!.save();
    const userUpdating = await CatUserEntity.findOne({
      where: {
        id_cat_user: employeeFound?.cat_user?.id_cat_user!,
      },
    });
    await userUpdating!.save();
    return res.status(200).json({
      msg: 'Logically deleted employee',
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const findExistingEmployee = async (id_cat_employee: number): Promise<CatPersonEntity | null> => {
  const employeeFound: CatPersonEntity | null = await CatPersonEntity.createQueryBuilder('cat_person')
    .leftJoinAndSelect('cat_person.cat_employee', 'cat_employee')
    .leftJoinAndSelect('cat_employee.cat_user', 'cat_user')
    .leftJoinAndSelect('cat_user.detail_user_role', 'detail_user_role')
    .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
    .where('cat_employee.id_cat_employee = :id_cat_employee AND cat_person.status = :status AND cat_user.status = :status', { id_cat_employee, status: true })
    .getOne();
  return employeeFound;
};
