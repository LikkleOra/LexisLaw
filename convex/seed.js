// LexisLaw Seed Data for Convex
// Run this to populate initial attorneys

import { insertMany } from "./_generated/server";

export async function seed(ctx) {
  // Seed attorneys
  const attorneys = [
    {
      name: "Adv. T. Nkosi",
      email: "tnkosi@lexislaw.co.za",
      specializations: ["Criminal Defence", "Family Law"],
    },
    {
      name: "Adv. S. Mokoena",
      email: "smokoena@lexislaw.co.za",
      specializations: ["Commercial Law", "Civil Litigation"],
    },
    {
      name: "Adv. N. Pillay",
      email: "npillay@lexislaw.co.za",
      specializations: ["Estate Planning", "Property Law"],
    },
    {
      name: "Adv. L. van der Merwe",
      email: "lvdm@lexislaw.co.za",
      specializations: ["Labour Law", "Contract Law"],
    },
  ];

  for (const attorney of attorneys) {
    await ctx.db.insert("attorneys", attorney);
  }

  console.log("✓ Seeded attorneys");
}
