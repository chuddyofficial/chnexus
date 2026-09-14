import { prisma } from "@/lib/prisma";
import { DEFAULT_SERVICE_LINKS, SITE_SETTING_KEYS } from "@/lib/links";

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

export async function getHeroTagline(): Promise<string | null> {
  const row = await prisma.siteSetting.findUnique({
    where: { key: SITE_SETTING_KEYS.heroTagline },
  });
  return row?.value ?? null;
}
