import moment from "moment";

export const validateRealDate = (value: string) => {
  if (!moment(value, 'YYYY-MM-DD', true).isValid()) {
      throw new Error('It is not a real date');
  }
  return true;
};