export const AGE_RANGES = [
  { code: "BB", label: "0-3 ans (bébé)" },
  { code: "PE", label: "3-6 ans (petit enfant)" },
  { code: "EN", label: "6-10 ans (enfant)" },
  { code: "AD", label: "10+ ans (adolescent)" },
] as const;

export const DEFAULT_CATEGORIES = [
  { code: "SOC", label: "Jeux de société" },
  { code: "FIG", label: "Figurines et poupées" },
  { code: "CON", label: "Jeux de construction" },
  { code: "EXT", label: "Jeux d'extérieur" },
  { code: "EVL", label: "Jeux d'éveil et éducatifs" },
  { code: "LIV", label: "Livres jeunesse" },
] as const;

export interface Category {
  code: string;
  label: string;
}

export interface Child {
  name?: string;
  ageRange: string;
  categories: Category[];
}
