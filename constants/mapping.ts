export const VERSION_TYPE = {
  VO: "Version Originale",
  VOST: "Version Originale Sous-titrée",
  VF: "Version Française",
} as const

export const EARLY_TYPE = {
  AVANT_PREMIERE: "Avant Première",
  AVANT_PREMIERE_WITH_CREW: "Avant Première en présence de l'équipe",
} as const

export const SOURCE_PROVIDER = {
  ugc: "UGC",
  pathe: "Pathé",
  rex: "Le Grand Rex",
  mk2: "MK2",
  cgr: "CGR",
} as const

export const mk2Cinemas = [
  {
    id: "mk2-1",
    name: "Bibliothèque",
  },
  {
    id: "mk2-2",
    name: "Nation",
  },
  {
    id: "mk2-3",
    name: "Quai de Loire",
  },
  {
    id: "mk2-4",
    name: "Bastille (côté Beaumarchais)",
  },
  {
    id: "mk2-5",
    name: "Odéon (côté St Michel)",
  },
  {
    id: "mk2-6",
    name: "Beaubourg",
  },
  {
    id: "mk2-7",
    name: "Parnasse",
  },
  {
    id: "mk2-8",
    name: "Gambetta",
  },
  {
    id: "mk2-9",
    name: "Odéon (côté St Germain)",
  },
  {
    id: "mk2-10",
    name: "Quai de Seine",
  },
  {
    id: "mk2-11",
    name: "Bastille (côté Fg St Antoine)",
  },
] as const

export const ugcCinemas = [
  {
    id: "ugc-1",
    name: "UGC Ciné Cité Les Halles",
  },
  {
    id: "ugc-2",
    name: "UGC Ciné Cité Maillot",
  },
  {
    id: "ugc-3",
    name: "UGC Montparnasse",
  },
  {
    id: "ugc-4",
    name: "UGC Rotonde",
  },
  {
    id: "ugc-5",
    name: "UGC Odéon",
  },
  {
    id: "ugc-6",
    name: "UGC Danton",
  },
  {
    id: "ugc-7",
    name: "UGC Ciné Cité Bercy",
  },
  {
    id: "ugc-8",
    name: "UGC Lyon Bastille",
  },
  {
    id: "ugc-9",
    name: "UGC Gobelins",
  },
  {
    id: "ugc-10",
    name: "UGC Opéra",
  },
  {
    id: "ugc-11",
    name: "UGC Ciné Cité Paris 19",
  },
] as const

export const patheCinemas = [
  {
    id: "pathe-28",
    name: "Pathé Alésia",
  },
  {
    id: "pathe-29",
    name: "Pathé Aquaboulevard",
  },
  {
    id: "pathe-27",
    name: "Pathé BNP Paribas",
  },
  {
    id: "pathe-30",
    name: "Pathé Convention",
  },
  {
    id: "pathe-31",
    name: "Pathé Les Fauvettes",
  },
  {
    id: "pathe-50",
    name: "Pathé Beaugrenelle",
  },
  {
    id: "pathe-51",
    name: "Pathé Parnasse",
  },
  {
    id: "pathe-54",
    name: "Pathé Wepler",
  },
  {
    id: "pathe-55",
    name: "Pathé La Villette",
  },
  {
    id: "pathe-67",
    name: "Pathé Montparnos",
  },
  {
    id: "pathe-69",
    name: "Les 7 Batignolles",
  },
  {
    id: "pathe-73",
    name: "Le Miramar",
  },
  {
    id: "pathe-74",
    name: "Pathé Palace",
  },
  {
    id: "pathe-75",
    name: "La Géode",
  },
] as const

export const multiplex = {
  pathe: "pathe",
  ugc: "ugc",
  mk2: "mk2",
  rex: "rex",
  cgr: "cgr",
} as const

export const LIST_MULTIPLEX = [multiplex.pathe, multiplex.ugc, multiplex.mk2]

export const providers = [
  { value: "pathe", label: "Pathé", cinemas: patheCinemas },
  { value: "ugc", label: "UGC", cinemas: ugcCinemas },
  { value: "mk2", label: "MK2", cinemas: mk2Cinemas },
  // { value: "indy", label: "Indépendant", cinemas: [] },
] as const
