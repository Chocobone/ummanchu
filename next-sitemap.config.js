/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ssil.khu.ac.kr",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: "monthly",
  priority: 0.8,
  exclude: ["/admin/*", "/api/*"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      { userAgent: "Googlebot", allow: "/" },
    ],
    additionalSitemaps: ["https://ssil.khu.ac.kr/sitemap.xml"],
  },
};