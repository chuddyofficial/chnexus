import { prisma } from "@/lib/prisma";
import {
  DEFAULT_SERVICE_LINKS,
  DEFAULT_SITE_CONTENT,
  SITE_SETTING_KEYS,
} from "@/lib/links";

export async function getServiceLinks() {
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          SITE_SETTING_KEYS.servicesUrl,
          SITE_SETTING_KEYS.hostingUrl,
          SITE_SETTING_KEYS.mabuUrl,
        ],
      },
    },
  });
  const overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return {
    services: overrides[SITE_SETTING_KEYS.servicesUrl] ?? DEFAULT_SERVICE_LINKS.services,
    hosting: overrides[SITE_SETTING_KEYS.hostingUrl] ?? DEFAULT_SERVICE_LINKS.hosting,
    mabu: overrides[SITE_SETTING_KEYS.mabuUrl] ?? DEFAULT_SERVICE_LINKS.mabu,
  };
}

export async function getSiteContent() {
  const rows = await prisma.siteSetting.findMany({
    where: {
      key: {
        in: [
          SITE_SETTING_KEYS.heroTitle,
          SITE_SETTING_KEYS.heroTagline,
          SITE_SETTING_KEYS.heroDescription,
          SITE_SETTING_KEYS.pillarServicesDescription,
          SITE_SETTING_KEYS.pillarHostingDescription,
          SITE_SETTING_KEYS.pillarMabuDescription,
        ],
      },
    },
  });
  const overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return {
    heroTitle: overrides[SITE_SETTING_KEYS.heroTitle] ?? DEFAULT_SITE_CONTENT.heroTitle,
    heroTagline: overrides[SITE_SETTING_KEYS.heroTagline] ?? DEFAULT_SITE_CONTENT.heroTagline,
    heroDescription:
      overrides[SITE_SETTING_KEYS.heroDescription] ?? DEFAULT_SITE_CONTENT.heroDescription,
    pillarServicesDescription:
      overrides[SITE_SETTING_KEYS.pillarServicesDescription] ??
      DEFAULT_SITE_CONTENT.pillarServicesDescription,
    pillarHostingDescription:
      overrides[SITE_SETTING_KEYS.pillarHostingDescription] ??
      DEFAULT_SITE_CONTENT.pillarHostingDescription,
    pillarMabuDescription:
      overrides[SITE_SETTING_KEYS.pillarMabuDescription] ??
      DEFAULT_SITE_CONTENT.pillarMabuDescription,
  };
}
