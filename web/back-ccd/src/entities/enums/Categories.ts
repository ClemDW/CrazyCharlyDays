export const Categories = {
  SOC: { name: "Jeux de société", code: "SOC" },
  FIG: { name: "Figurines et poupées", code: "FIG" },
  CON: { name: "Jeux de construction", code: "CON" },
  EXT: { name: "Jeux d'extérieur", code: "EXT" },
  EVL: { name: "Jeux d'éveil et éducatifs", code: "EVL" },
  LIV: { name: "Livres jeunesse", code: "LIV" }
} as const;

export type CategoryKey = keyof typeof Categories;