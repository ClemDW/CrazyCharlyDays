export const State = {
  N: { name: "Neuf", code: "N" },
  TB: { name: "Très bon état", code: "TB" },
  B: { name: "Bon état", code: "B" }
} as const;

export type StateKey = keyof typeof State;