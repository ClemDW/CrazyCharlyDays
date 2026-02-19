export const AgeRange = {
  BB: { name: "0-3 ans (bébé)", code: "BB" },
  PE: { name: "3-6 ans (petite enfant)", code: "PE" },
  EN: { name: "6-10 ans (enfant)", code: "EN" },
  AD: { name: "10+ ans (adolescent)", code: "AD" }
} as const;

export type AgeRangeKey = keyof typeof AgeRange;