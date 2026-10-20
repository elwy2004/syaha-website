import type { InterestId } from "./types";

export const interestIds: InterestId[] = ["monuments", "museums", "culture", "nile", "specialist"];

export const interestImages: Record<InterestId, string> = {
  monuments: "karnak",
  museums: "gem",
  culture: "gharb-soheil",
  nile: "aswan-felucca",
  specialist: "dahshur",
};
