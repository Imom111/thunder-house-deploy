
export const adjustValueBasedOnDay = (value: number): number => {
  const date = new Date();
  const day = date.getDay();
  if (day === 5 || day === 6) {
    return value * 1.4;
  } else {
    return value;
  }
}

export const getPrice = (totalPriceByRooms: number, totalPersonsByRooms: number, is_from_platform_promotion: boolean): number => {
  let total = 0;
  total += adjustValueBasedOnDay(totalPriceByRooms);
  if (is_from_platform_promotion) {
    total = total * 0.7
  }
  if (totalPersonsByRooms > 10) {
    total = total * 0.9
  }
  return total;
}


