export type Album = {
  id: string;
  title: string;
  year: number;
  cover: string;
  criticScore: number;
};

export const ALBUMS: Album[] = [
  { id: "so-far-gone", title: "So Far Gone", year: 2009, cover: "covers/sofargone.png", criticScore: 72 },
  { id: "thank-me-later", title: "Thank Me Later", year: 2010, cover: "covers/thankmelater.jpg", criticScore: 71 },
  { id: "take-care", title: "Take Care", year: 2011, cover: "covers/takecare.jpg", criticScore: 76 },
  { id: "nothing-was-the-same", title: "Nothing Was the Same", year: 2013, cover: "covers/nwts.png", criticScore: 77 },
  {
    id: "if-youre-reading-this-its-too-late",
    title: "If You're Reading This It's Too Late",
    year: 2015,
    cover: "covers/iyrtitl.jpg",
    criticScore: 76,
  },
  { id: "what-a-time-to-be-alive", title: "What a Time to Be Alive", year: 2015, cover: "covers/wattba.jpg", criticScore: 70 },
  { id: "views", title: "Views", year: 2016, cover: "covers/views.jpg", criticScore: 66 },
  { id: "more-life", title: "More Life", year: 2017, cover: "covers/morelife.jpg", criticScore: 76 },
  { id: "scorpion", title: "Scorpion", year: 2018, cover: "covers/scorpion.jpg", criticScore: 64 },
  { id: "dark-lane-demo-tapes", title: "Dark Lane Demo Tapes", year: 2018, cover: "covers/dldt.jpg", criticScore: 52 },
  { id: "certified-lover-boy", title: "Certified Lover Boy", year: 2021, cover: "covers/clb.jpg", criticScore: 56 },
  { id: "honestly-nevermind", title: "Honestly Nevermind", year: 2022, cover: "covers/honestlynevermind.jpg", criticScore: 63 },
  { id: "her-loss", title: "Her Loss", year: 2022, cover: "covers/herloss.jpg", criticScore: 61 },
  { id: "for-all-the-dogs", title: "For All the Dogs", year: 2023, cover: "covers/fatd.jpg", criticScore: 48 },
  { id: "some-sexy-songs-4-u", title: "$ome $exy $ongs 4 U", year: 2025, cover: "covers/sss.jpg", criticScore: 47 },
  { id: "iceman", title: "Iceman", year: 2026, cover: "covers/iceman.jpg", criticScore: 47 },
  { id: "habibti", title: "Habibti", year: 2026, cover: "covers/habibti.jpg", criticScore: 46 },
  { id: "maid-of-honour", title: "Maid of Honour", year: 2026, cover: "covers/maidofhonour.jpg", criticScore: 61 },
];
