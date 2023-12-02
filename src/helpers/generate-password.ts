
import bcryptjs from "bcryptjs";

export const generatePassword = (password: string) => {
  const salt = bcryptjs.genSaltSync();
  return bcryptjs.hashSync(password, salt);
}