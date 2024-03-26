export const getOffset = (value: number) => {
  if (value < 100) {
    return 3;
  } else if (value < 150) {
    return 1;
  }
  return 0;
};
