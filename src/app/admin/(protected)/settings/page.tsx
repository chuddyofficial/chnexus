import { prisma } from "@/lib/prisma";
import {
  SITE_SETTING_KEYS,
  DEFAULT_SERVICE_LINKS,
  DEFAULT_SITE_CONTENT,
} from "@/lib/links";
import { SettingField } from "@/components/admin/setting-field";

export default async function SettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const linkFields = [
    {
      key: SITE_SETTING_KEYS.servicesUrl,
      label: "Nexus Services URL",
      default: DEFAULT_SERVICE_LINKS.services,
    },
    {
      key: SITE_SETTING_KEYS.hostingUrl,
      label: "Nexus Hosting URL",
      default: DEFAULT_SERVICE_LINKS.hosting,
    },
    {
      key: SITE_SETTING_KEYS.mabuUrl,
      label: "MABU URL",
      default: DEFAULT_SERVICE_LINKS.mabu,
    },
  ];

  const heroFields = [
    {
      key: SITE_SETTING_KEYS.heroTitle,
      label: "Hero title",
      default: DEFAULT_SITE_CONTENT.heroTitle,
    },
    {
      key: SITE_SETTING_KEYS.heroTagline,
      label: "Hero tagline",
      default: DEFAULT_SITE_CONTENT.heroTagline,
    },
    {
      key: SITE_SETTING_KEYS.heroDescription,
      label: "Hero description",
      default: DEFAULT_SITE_CONTENT.heroDescription,
      multiline: true,
    },
  ];

  const pillarFields = [
    {
      key: SITE_SETTING_KEYS.pillarServicesDescription,
      label: "Nexus Services card text",
      default: DEFAULT_SITE_CONTENT.pillarServicesDescription,
      multiline: true,
    },
    {
      key: SITE_SETTING_KEYS.pillarHostingDescription,
      label: "Nexus Hosting card text",
      default: DEFAULT_SITE_CONTENT.pillarHostingDescription,
      multiline: true,
    },
    {
      key: SITE_SETTING_KEYS.pillarMabuDescription,
      label: "MABU card text",
      default: DEFAULT_SITE_CONTENT.pillarMabuDescription,
      multiline: true,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted">
        These override the public homepage without needing a redeploy. Leave
        a field blank to fall back to its default.
      </p>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Service links
        </h2>
        <div className="mt-4 space-y-3">
          {linkFields.map((field) => (
            <SettingField
              key={field.key}
              settingKey={field.key}
              label={field.label}
              placeholder={field.default}
              initialValue={values[field.key] ?? ""}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Homepage hero
        </h2>
        <div className="mt-4 space-y-3">
          {heroFields.map((field) => (
            <SettingField
              key={field.key}
              settingKey={field.key}
              label={field.label}
              placeholder={field.default}
              initialValue={values[field.key] ?? ""}
              multiline={field.multiline}
            />
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          Homepage pillar cards
        </h2>
        <div className="mt-4 space-y-3">
          {pillarFields.map((field) => (
            <SettingField
              key={field.key}
              settingKey={field.key}
              label={field.label}
              placeholder={field.default}
              initialValue={values[field.key] ?? ""}
              multiline={field.multiline}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
