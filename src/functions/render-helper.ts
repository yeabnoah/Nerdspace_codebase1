const trimLimits = {
  sm: 15,
  md: 12,
  lg: 25,
};

export const getTrimLimit = () => {
  if (window.innerWidth < 640) {
    return trimLimits.sm;
  } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
    return trimLimits.md;
  } else {
    return trimLimits.lg;
  }
};
