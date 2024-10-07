export const createMapByKey = <T extends Record<PropertyKey, any>>(
  array: T[],
  key: keyof T
) => {
  return array.reduce<Record<PropertyKey, T>>((map, item) => {
    if (isObject(item) && key in item) {
      map[item[key]] = item;
    }

    return map;
  }, {});
};

export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && typeof val === "object";
};
