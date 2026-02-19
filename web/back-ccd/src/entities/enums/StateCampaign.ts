export const StateCampaign = {
  IN_PROGRESS: { name: "En cours", code: "IN_PROGRESS" },
  VALIDATED: { name: "Validée", code: "VALIDATED" },
  FINISHED: { name: "Terminée", code: "FINISHED" }
} as const;

export type StateCampaignKey = keyof typeof StateCampaign;