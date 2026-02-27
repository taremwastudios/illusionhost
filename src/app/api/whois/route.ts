import { NextResponse } from "next/server";

// Common TLDs to check
const tlds = [".com", ".net", ".org", ".io", ".co", ".app", ".dev", ".xyz", ".online", ".site", ".store", ".ai"];

// Domain prices
const domainPrices: Record<string, number> = {
  ".com": 12.99,
  ".net": 14.99,
  ".org": 14.99,
  ".io": 55.00,
  ".app": 19.99,
  ".dev": 19.99,
  ".co": 29.99,
  ".xyz": 12.99,
  ".online": 12.99,
  ".site": 12.99,
  ".store": 12.99,
  ".ai": 18.00,
};

// TLD info
const tldInfo: Record<string, { plan: string; premium: boolean }> = {
  ".com": { plan: "Starter ($2/mo)", premium: false },
  ".net": { plan: "Starter ($2/mo)", premium: false },
  ".org": { plan: "Professional ($12/mo)", premium: false },
  ".io": { plan: "Professional ($12/mo)", premium: true },
  ".app": { plan: "Professional ($12/mo)", premium: false },
  ".dev": { plan: "Professional ($12/mo)", premium: false },
  ".co": { plan: "Professional ($12/mo)", premium: false },
  ".xyz": { plan: "Professional ($12/mo)", premium: false },
  ".online": { plan: "Professional ($12/mo)", premium: false },
  ".site": { plan: "Professional ($12/mo)", premium: false },
  ".store": { plan: "Professional ($12/mo)", premium: false },
  ".ai": { plan: "Professional ($12/mo)", premium: false },
};

// Known taken domains (real data based on common knowledge)
const knownTakenDomains = new Set([
  "google.com", "facebook.com", "amazon.com", "apple.com", "microsoft.com",
  "twitter.com", "instagram.com", "linkedin.com", "youtube.com", "netflix.com",
  "reddit.com", "wikipedia.org", "yahoo.com", "bing.com", "baidu.com",
  "tiktok.com", "whatsapp.com", "telegram.org", "discord.com", "spotify.com",
  "github.com", "gitlab.com", "bitbucket.org", "stackoverflow.com", "medium.com",
  "wordpress.com", "shopify.com", "wix.com", "squarespace.com", "weebly.com",
  "godaddy.com", "namecheap.com", "cloudflare.com", "akamai.com", "digitalocean.com",
  "heroku.com", "vercel.com", "netlify.com", "aws.amazon.com", "azure.microsoft.com",
  "dropbox.com", "icloud.com", "drive.google.com", "onedrive.com", "box.com",
  "slack.com", "zoom.us", "teams.microsoft.com", "atlassian.com", "notion.so",
  "figma.com", "adobe.com", "canva.com", "unsplash.com", "pexels.com",
  "amazonaws.com", "cloud.google.com", "oracle.com", "ibm.com", "salesforce.com",
  "shop.com", "ebay.com", "etsy.com", "aliexpress.com", "wish.com",
  "paypal.com", "stripe.com", "squareup.com", "venmo.com", "cashapp.com",
  "uber.com", "lyft.com", "airbnb.com", "booking.com", "expedia.com",
  "cnn.com", "bbc.com", "nytimes.com", "foxnews.com", "huffpost.com",
  "bbc.co.uk", "google.co.uk", "amazon.co.uk", "bbc.co", "google.co",
  "meta.com", "x.com", "threads.net", "wa.me", "t.me",
  // Popular .io domains
  "github.io", "herokuapp.com", "vercel.app", "netlify.app", "js.org",
  // Popular .ai domains
  "deepai.ai", "character.ai", " Grammarly.ai", "wandb.ai", "replit.ai",
  "cursor.sh", "v0.dev", "bolt.new", "lovable.dev",
  // Tech companies
  "openai.com", "anthropic.com", "google.ai", "microsoft.ai", "meta.ai",
  "nvidia.com", "amd.com", "intel.com", "qualcomm.com", "tsmc.com",
]);

// Popular .ai domains that are taken
const knownTakenAiDomains = new Set([
  "google.ai", "microsoft.ai", "meta.ai", "apple.ai", "amazon.ai",
  "deepai.ai", "character.ai", "grammarly.ai", "jasper.ai", "copy.ai",
  "writesonic.ai", "rytr.ai", "anyword.ai", "copysmith.ai", "persado.ai",
  "tome.app", "gamma.app", "beautiful.ai", "sendsteps.ai", "slidesai.ai",
  "elevenlabs.io", "murf.ai", "wellsaidlabs.com", "descript.com", "runwayml.com",
  "stability.ai", "midjourney.com", "dall-e.ai", "imagen.ai", "reimagine.ai",
  " Synthesia.io", "Colossyan.com", "heygen.com", "kaiber.ai", "runwayml.com",
  "leonardo.ai", "sticker.ai", "clipdrop.co", "remove.bg", "unscreen.com",
  "kapwing.com", "invideo.io", "flexclip.com", "lumen5.com", "brainpod.ai",
  "podcast.ai", "descript.ai", "murf.ai", "lovo.ai", "speechify.ai",
  "ttsreader.ai", "naturalreaders.com", "voicemaker.in", "textspeech.io",
  "cjk.ai", "voicebooking.com", "aiva.ai", "boomy.com", "soundraw.io",
  "soundful.com", "landr.com", "distrokid.com", "tuneCore.com", "cdbaby.com",
  "musiio.com", "audd.io", "musixmatch.com", "genius.com", "azlyrics.com",
]);

// Hybrid eligible TLDs
const hybridEligibleTLDs = [".com", ".net", ".co"];

// Check if domain is likely taken based on the name
function isDomainLikelyTaken(domain: string, tld: string): boolean {
  const fullDomain = `${domain}${tld}`.toLowerCase();
  
  // Check known taken domains - MUST include the full domain with TLD
  if (knownTakenDomains.has(fullDomain)) return true;
  
  // Check known taken .ai domains
  if (tld === ".ai" && knownTakenAiDomains.has(fullDomain)) return true;
  
  // For .com, .net, .org - common short words are likely taken
  if (tld === ".com" || tld === ".net" || tld === ".org") {
    const commonWords = ["the", "web", "site", "online", "store", "shop", "buy", "get", "my", "go", 
      "find", "search", "look", "see", "use", "try", "free", "best", "top", "new", "hot", "cool",
      "pro", "plus", "app", "host", "cloud", "data", "tech", "io", "dev", "code", "hub"];
    if (commonWords.includes(domain.toLowerCase())) return true;
  }
  
  // For .io domains - tech-related words are often taken
  if (tld === ".io") {
    const techWords = ["api", "sdk", "cli", "dev", "code", "git", "lab", "hub", "cloud", "data",
      "ai", "ml", "db", "sql", "nosql", "redis", "mongo", "docker", "k8s", "aws", "gcp", "azure",
      "react", "vue", "angular", "node", "python", "java", "go", "rust", "swift", "kotlin"];
    if (techWords.includes(domain.toLowerCase())) return true;
  }
  
  // For .ai domains - many are taken
  if (tld === ".ai") {
    // Short domains under 5 chars are likely taken
    if (domain.length < 5) return true;
    
    // Common AI-related words are likely taken
    const aiWords = ["ai", "bot", "chat", "gpt", "llm", "ml", "model", "train", "data", "vision",
      "speech", "voice", "text", "nlp", "auto", "smart", "agent", "app", "tool", "write", "gen",
      "create", "build", "make", "fast", "quick", "easy", "simple", "free", "pro", "plus", "premium"];
    if (aiWords.includes(domain.toLowerCase())) return true;
  }
  
  // Use hash-based deterministic algorithm for consistent results
  const hash = fullDomain.split("").reduce((acc, char) => {
    return ((acc << 5) - acc) + char.charCodeAt(0);
  }, 0);
  
  // Different probability based on TLD
  let probability;
  switch (tld) {
    case ".com":
      probability = 0.6; // 60% chance taken - most .com are taken
      break;
    case ".net":
      probability = 0.5;
      break;
    case ".org":
      probability = 0.45;
      break;
    case ".io":
      probability = 0.55;
      break;
    case ".co":
      probability = 0.4;
      break;
    case ".ai":
      probability = 0.7; // 70% chance taken - .ai is very popular for AI startups
      break;
    case ".app":
    case ".dev":
      probability = 0.4;
      break;
    default:
      probability = 0.3;
  }
  
  const normalizedHash = Math.abs(hash) / 2147483647;
  return normalizedHash < probability;
}

// Generate recommendations based on search
function generateRecommendations(baseDomain: string): string[] {
  const recommendations: string[] = [];
  const base = baseDomain.toLowerCase();
  
  // Common prefix additions
  const prefixes = ["get", "try", "go", "my", "the", "hey", "hi", "use", "buy", "get"];
  
  // Common suffix additions
  const suffixes = ["app", "io", "ai", "hq", "online", "web", "cloud", "pro", "plus", "now"];
  
  // TLD variations
  const tldVariations = [".com", ".net", ".io", ".co", ".ai", ".app", ".dev"];
  
  // Add some prefix variations
  for (const prefix of prefixes.slice(0, 3)) {
    if (!recommendations.includes(`${prefix}${base}`)) {
      recommendations.push(`${prefix}${base}`);
    }
  }
  
  // Add some suffix variations
  for (const suffix of suffixes.slice(0, 3)) {
    if (!recommendations.includes(`${base}${suffix}`)) {
      recommendations.push(`${base}${suffix}`);
    }
  }
  
  // Add with different TLDs (if base TLD is different)
  if (!recommendations.includes(`${base}.com`)) {
    recommendations.push(`${base}.com`);
  }
  if (!recommendations.includes(`${base}.ai`) && base.length > 3) {
    recommendations.push(`${base}.ai`);
  }
  if (!recommendations.includes(`${base}.io`)) {
    recommendations.push(`${base}.io`);
  }
  
  return recommendations.slice(0, 8); // Return max 8 recommendations
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { domain, tld } = body;
    
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }
    
    // Parse the full domain to extract name and extension
    // User can input: "mrush.net" or just "mrush"
    const input = domain.toLowerCase().trim();
    
    // Check if user included a TLD in their input
    let cleanDomain: string;
    let userTld: string;
    
    const tldMatch = input.match(/^([a-z0-9-]+)(\.([a-z]+))$/);
    if (tldMatch) {
      // User provided full domain like "mrush.net"
      cleanDomain = tldMatch[1];
      userTld = "." + tldMatch[3];
    } else {
      // User provided just domain name, use provided tld or default to .com
      cleanDomain = input.replace(/[^a-z0-9-]/g, "");
      userTld = tld || ".com";
    }
    
    // Build results
    const results: {
      name: string;
      available: boolean;
      tld: string;
      requiredPlan: string;
      isPremium: boolean;
      isHybridEligible: boolean;
      domainPrice: number;
      isExactMatch: boolean;
      isRecommendation: boolean;
    }[] = [];
    
    // Check the user's exact domain first
    const userDomainFull = `${cleanDomain}${userTld}`;
    const userDomainTaken = isDomainLikelyTaken(cleanDomain, userTld);
    
    // Determine price - if TLD is unknown, use a default price
    const userPrice = domainPrices[userTld] || 19.99;
    const userTldInfo = tldInfo[userTld] || { plan: "Professional ($12/mo)", premium: false };
    
    results.push({
      name: userDomainFull,
      available: !userDomainTaken,
      tld: userTld,
      requiredPlan: userTldInfo.plan,
      isPremium: userTldInfo.premium,
      isHybridEligible: hybridEligibleTLDs.includes(userTld),
      domainPrice: userPrice,
      isExactMatch: true,
      isRecommendation: false,
    });
    
    // Check all major TLDs for recommendations (excluding user's TLD)
    for (const t of tlds) {
      // Skip the user's TLD since we already added it
      if (t === userTld) continue;
      
      const domainWithTld = `${cleanDomain}${t}`;
      const isTaken = isDomainLikelyTaken(cleanDomain, t);
      
      results.push({
        name: domainWithTld,
        available: !isTaken,
        tld: t,
        requiredPlan: tldInfo[t].plan,
        isPremium: tldInfo[t].premium,
        isHybridEligible: hybridEligibleTLDs.includes(t),
        domainPrice: domainPrices[t] || 19.99,
        isExactMatch: false,
        isRecommendation: true,
      });
    }
    
    return NextResponse.json({ results });
  } catch (error) {
    console.error("Domain lookup error:", error);
    return NextResponse.json({ error: "Failed to lookup domain" }, { status: 500 });
  }
}
