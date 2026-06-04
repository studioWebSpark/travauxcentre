/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://travauxcentre.fr",
  generateRobotsTxt: true,
  sitemapSize: 1000,
  changefreq: "weekly",
  priority: 0.7,
  additionalPaths: async () => [
    { loc: "/",                                  priority: 1.0,  changefreq: "weekly" },
    { loc: "/services",                          priority: 0.9,  changefreq: "monthly" },
    { loc: "/services/renovation-interieure",   priority: 0.9,  changefreq: "monthly" },
    { loc: "/services/gros-oeuvre",             priority: 0.9,  changefreq: "monthly" },
    { loc: "/services/amenagement-exterieur",   priority: 0.9,  changefreq: "monthly" },
    { loc: "/services/second-oeuvre",           priority: 0.9,  changefreq: "monthly" },
    { loc: "/realisations",                     priority: 0.8,  changefreq: "weekly" },
    { loc: "/a-propos",                         priority: 0.7,  changefreq: "monthly" },
    { loc: "/contact",                          priority: 0.8,  changefreq: "monthly" },
    { loc: "/devis",                            priority: 0.95, changefreq: "monthly" },
    { loc: "/rendez-vous",                      priority: 0.85, changefreq: "monthly" },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "*", disallow: ["/api/", "/dashboard/", "/auth/", "/onboarding/"] },
    ],
  },
}
