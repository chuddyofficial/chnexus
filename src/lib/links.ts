export const DEFAULT_SERVICE_LINKS = {
  services: "https://services.chnexus.net",
  hosting: "https://panel.chnexus.net",
  mabu: "https://mabu.ssnroleplayforums.xyz",
} as const;

export const SITE_SETTING_KEYS = {
  servicesUrl: "services_url",
  hostingUrl: "hosting_url",
  mabuUrl: "mabu_url",
  heroTagline: "hero_tagline",
} as const;

/** Static fallback links, used by client components (nav/footer) that can't hit the DB directly. */
export const SERVICE_LINKS = DEFAULT_SERVICE_LINKS;
