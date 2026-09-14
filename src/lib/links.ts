export const DEFAULT_SERVICE_LINKS = {
  services: "https://services.chnexus.net",
  hosting: "https://panel.chnexus.net",
  mabu: "https://mabu.ssnroleplayforums.xyz",
} as const;

export const SITE_SETTING_KEYS = {
  servicesUrl: "services_url",
  hostingUrl: "hosting_url",
  mabuUrl: "mabu_url",
  heroTitle: "hero_title",
  heroTagline: "hero_tagline",
  heroDescription: "hero_description",
  pillarServicesDescription: "pillar_services_description",
  pillarHostingDescription: "pillar_hosting_description",
  pillarMabuDescription: "pillar_mabu_description",
} as const;

export const DEFAULT_SITE_CONTENT = {
  heroTitle: "CH NEXUS",
  heroTagline: "Security. Infrastructure. Research. Community.",
  heroDescription:
    "CH Nexus is a connected technology ecosystem — far more than a single Discord bot. It brings together community protection, private infrastructure, and a dedicated cyber security team under one platform.",
  pillarServicesDescription:
    "Protect and manage your Discord community — AutoMod, anti-raid, moderation, verification, tickets, logging, leveling, and more.",
  pillarHostingDescription:
    "Private infrastructure and hosting built for the Nexus ecosystem, managed through a dedicated control panel.",
  pillarMabuDescription:
    "The CH Nexus cyber security team — protecting the ecosystem behind the scenes. Private access for authorized personnel.",
} as const;

/** Static fallback links, used by client components (nav/footer) that can't hit the DB directly. */
export const SERVICE_LINKS = DEFAULT_SERVICE_LINKS;
