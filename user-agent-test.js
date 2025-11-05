const tryFetchUrl = async (url, userAgent) => {
  const a = await fetch(url, {
    headers: {
      accept: "application/json, text/plain, */*",
      ...(userAgent && { "user-agent": userAgent }),
    },
  })

  return a.ok
}

const userAgents = [
  {
    source: "None",
    user_agent: "",
  },
  {
    source: "Google Search",
    user_agent: "Googlebot/2.1 (+http://www.google.com/bot.html)",
  },
  {
    source: "Google Images",
    user_agent: "Googlebot-Image/1.0",
  },
  {
    source: "Google Ads",
    user_agent: "AdsBot-Google (+http://www.google.com/adsbot.html)",
  },
  {
    source: "Bing",
    user_agent: "Bingbot/2.0 (+http://www.bing.com/bingbot.htm)",
  },
  {
    source: "DuckDuckGo",
    user_agent: "DuckDuckBot/1.0; (+http://duckduckgo.com/duckduckbot.html)",
  },
  {
    source: "Yahoo",
    user_agent: "Slurp/3.0",
  },
  {
    source: "Baidu",
    user_agent: "Baiduspider (+http://www.baidu.com/search/spider.htm)",
  },
  {
    source: "Yandex",
    user_agent: "YandexBot/3.0 (+http://yandex.com/bots)",
  },
  {
    source: "Sogou",
    user_agent:
      "Sogou web spider/4.0 (+http://www.sogou.com/docs/help/webmasters.htm#07)",
  },
  {
    source: "Exabot",
    user_agent: "Exabot/3.0",
  },
  {
    source: "Facebook Preview",
    user_agent:
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  },
  {
    source: "Facebook (Facebot)",
    user_agent: "Facebot",
  },
  {
    source: "Twitter",
    user_agent: "Twitterbot/1.0",
  },
  {
    source: "LinkedIn",
    user_agent: "LinkedInBot/1.0 (+http://www.linkedin.com)",
  },
  {
    source: "Pinterest",
    user_agent: "Pinterestbot/1.0 (+http://www.pinterest.com/bot.html)",
  },
  {
    source: "Apple",
    user_agent: "Applebot/0.1 (http://www.apple.com/go/applebot)",
  },
  {
    source: "Ahrefs",
    user_agent: "AhrefsBot/7.0 (+http://ahrefs.com/robot/)",
  },
  {
    source: "Semrush",
    user_agent: "SemrushBot/1.0 (http://www.semrush.com/bot.html)",
  },
  {
    source: "Majestic / MJ12",
    user_agent: "MJ12bot/v1.4.8 (http://mj12bot.com/)",
  },
  {
    source: "Screaming Frog",
    user_agent: "Screaming Frog SEO Spider/17.0",
  },
  {
    source: "Sitebulb",
    user_agent: "Sitebulb/2.7.4",
  },
  {
    source: "curl",
    user_agent: "curl/7.64.1",
  },
  {
    source: "Wget",
    user_agent: "Wget/1.20.3 (linux-gnu)",
  },
  {
    source: "python-requests",
    user_agent: "python-requests/2.25.1",
  },
  {
    source: "Java HTTP Client",
    user_agent: "Java/1.8.0_231",
  },
  {
    source: "Apache HttpClient",
    user_agent: "Apache-HttpClient/4.5.2 (Java/1.8.0_251)",
  },
  {
    source: "BingPreview",
    user_agent: "msnbot/2.0b",
  },
  {
    source: "Sitecore",
    user_agent: "Sitecore Search/1.0",
  },
  {
    source: "Botify",
    user_agent: "Botifybot/3.0",
  },
  {
    source: "OpenGraph Debugger",
    user_agent: "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)",
  },
]

const runTests = async () => {
  for (const agent of userAgents) {
    const result = await tryFetchUrl(
      "https://www.pathe.fr/api/events?language=fr",
      agent.user_agent
    )
    console.log(`${result ? "✅" : "❌"} ${agent.source} - ${agent.user_agent}`)

    const random = Math.floor(Math.random() * 2000) + 1000

    await new Promise((resolve) => setTimeout(resolve, random))
  }
}

runTests()
