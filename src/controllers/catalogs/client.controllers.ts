
import { Request, Response } from "express";

import {
  CatClientEntity,
  CatPersonEntity,
  CatUserEntity,
} from "../../entity";
import { generatePassword } from "../../helpers";


export const clientGet = async (req: Request, res: Response) => {
  try {
    const { id_cat_client } = req.params;
    const clientFound: any = await findExistingClient(parseInt(id_cat_client));
    if (clientFound && clientFound.cat_client && clientFound.cat_client.cat_user) {
      const user = { ...clientFound.cat_client.cat_user };
      const { password, ...userSafe } = user;
      clientFound.cat_client.cat_user = userSafe;
    }
    return res.status(200).json({
      client: clientFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const clientGetAll = async (req: Request, res: Response) => {
  const { limit = 10, page = 1, pagination } = req.query;
  try {
    let personList: CatPersonEntity[] = [];
    if (pagination) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);
      const skip = (parsedPage - 1) * parsedLimit;
      personList = await CatPersonEntity.createQueryBuilder('cat_person')
        .leftJoinAndSelect('cat_person.cat_client', 'cat_client')
        .leftJoin('cat_client.cat_user', 'cat_user').addSelect(['cat_user.id_cat_user', 'cat_user.email', 'cat_user.user_name', 'cat_user.status'])
        .leftJoinAndSelect('cat_user.detail_user_role', 'detail_user_role')
        .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
        .limit(parsedLimit)
        .offset(skip)
        .where('cat_person.status = :status AND cat_user.status = :status', { status: true })
        .getMany();
    } else {
      personList = await CatPersonEntity.createQueryBuilder('cat_person')
        .leftJoinAndSelect('cat_person.cat_client', 'cat_client')
        .leftJoin('cat_client.cat_user', 'cat_user').addSelect(['cat_user.id_cat_user', 'cat_user.email', 'cat_user.user_name', 'cat_user.status'])
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

export const clientPut = async (req: Request, res: Response) => {
  const { id_cat_client } = req.params;
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
    status_user: boolean,
  } = req.body;
  try {
    // Find client
    const clientUpdating = await CatClientEntity.findOne({
      where: {
        id_cat_client: parseInt(id_cat_client),
      },
    });
    // Find client
    const personUpdating = await CatPersonEntity.createQueryBuilder('cat_person')
      .leftJoin('cat_person.cat_client', 'cat_client')
      .where('cat_client.id_cat_client = :id_cat_client', { id_cat_client })
      .getOne();
    // Find user
    const userUpdating = await CatUserEntity.findOne({
      where: {
        id_cat_user: clientUpdating?.cat_user?.id_cat_user!,
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
    // Update client
    clientUpdating!.cat_user = userUpdating!;
    await clientUpdating!.save();
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
    personUpdating!.cat_client = clientUpdating!;
    await personUpdating!.save();

    const clientFound: any = await findExistingClient(clientUpdating!.id_cat_client!);
    if (clientFound && clientFound.cat_client && clientFound.cat_client.cat_user) {
      const user = { ...clientFound.cat_client.cat_user };
      const { password, ...userSafe } = user;
      clientFound.cat_client.cat_user = userSafe;
    }
    return res.status(200).json({
      client: clientFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const clientPost = async (req: Request, res: Response) => {
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
  } = req.body;
  try {
    // Insert user
    const newUser: CatUserEntity = new CatUserEntity();
    newUser.email = email;
    newUser.user_name = user_name;
    newUser.password = generatePassword(password);
    await newUser.save();
    // Insert client
    const newClient: CatClientEntity = new CatClientEntity();
    newClient.cat_user = newUser;
    await newClient.save();
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
    newPerson.cat_client = newClient;
    await newPerson.save();
    const clientFound: any = await findExistingClient(newClient.id_cat_client!);
    if (clientFound && clientFound.cat_client && clientFound.cat_client.cat_user) {
      const user = { ...clientFound.cat_client.cat_user };
      const { password, ...userSafe } = user;
      clientFound.cat_client.cat_user = userSafe;
    }
    return res.status(200).json({
      client: clientFound,
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const clientDelete = async (req: Request, res: Response) => {
  const { id_cat_client } = req.params;
  try {
    const clientFound = await CatClientEntity.findOne({
      where: {
        id_cat_client: parseInt(id_cat_client),
      },
    });
    const personUpdating = await CatPersonEntity.createQueryBuilder('cat_person')
      .leftJoin('cat_person.cat_client', 'cat_client')
      .where('cat_client.id_cat_client = :id_cat_client', { id_cat_client })
      .getOne();
    personUpdating!.status = false;
    await personUpdating!.save();
    const userUpdating = await CatUserEntity.findOne({
      where: {
        id_cat_user: clientFound?.cat_user?.id_cat_user!,
      },
    });
    await userUpdating!.save();
    return res.status(200).json({
      msg: 'Logically deleted client',
    });
  } catch (error) {
    console.error("Internal server error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

const findExistingClient = async (id_cat_client: number): Promise<CatPersonEntity | null> => {
  const clientFound: CatPersonEntity | null = await CatPersonEntity.createQueryBuilder('cat_person')
    .leftJoinAndSelect('cat_person.cat_client', 'cat_client')
    .leftJoinAndSelect('cat_client.cat_user', 'cat_user')
    .leftJoinAndSelect('cat_user.detail_user_role', 'detail_user_role')
    .leftJoinAndSelect('detail_user_role.cat_role', 'cat_role')
    .where('cat_client.id_cat_client = :id_cat_client AND cat_person.status = :status AND cat_user.status = :status', { id_cat_client, status: true })
    .getOne();
  return clientFound;
};
