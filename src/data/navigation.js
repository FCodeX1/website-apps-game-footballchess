export const NAV_GROUPS = [
  { key: "utama", label: "Utama", icon: "🏠", items: [["dashboard", "Home"], ["inbox", "Inbox"], ["career", "Career"], ["calendar", "Calendar"], ["news", "Berita"]] },
  { key: "match", label: "Match", icon: "⚽", items: [["match", "Match"], ["schedule", "Jadwal"], ["tactics", "Taktik"], ["training", "Latihan"], ["competitions", "Kompetisi"]] },
  { key: "club", label: "Klub", icon: "🏟️", items: [["squad", "Skuad"], ["transfer", "Transfer"], ["youth", "Youth"], ["facilities", "Fasilitas"], ["objectives", "Target"]] },
  { key: "world", label: "Dunia", icon: "🌍", items: [["table", "Klasemen"], ["champions", "Champions"], ["clubs", "Klub"], ["aiGrowth", "AI Growth"], ["story", "Story"]] },
  { key: "qa", label: "Tools", icon: "🧪", items: [["debug", "QA"]] },
];

export const FLAT_TABS = NAV_GROUPS.flatMap((group) => group.items);
