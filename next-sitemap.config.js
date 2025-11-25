/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://ummanchu.co.kr",
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
    additionalSitemaps: ["https://ummanchu.co.kr/sitemap.xml"],
  },
};