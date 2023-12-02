
import { roomExistsById } from "./db-validators";

export const validateExistingArrayRooms = async (arr: {
  fk_cat_room: number,
}[]
) => {
  const promises = arr.map((item) => roomExistsById(false)(item.fk_cat_room));
  try {
    await Promise.all(promises);
    return true;
  } catch (error: any) {
    throw new Error(error.message);
  }
}


