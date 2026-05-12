export const JOB_CATEGORIES = [
  "Barber",
  "Waiter",
  "Busboy",
  "Cleaner",
  "Delivery Driver",
  "Security Guard",
  "Cook",
  "Butcher",
  "Driver",
  "Shop Assistant",
] as const;

export type JobCategory = (typeof JOB_CATEGORIES)[number];
