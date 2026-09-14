import { prisma } from "@/lib/prisma";
import { SITE_SETTING_KEYS, DEFAULT_SERVICE_LINKS } from "@/lib/links";
import { SettingField } from "@/components/admin/setting-field";

export default async function SettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const values = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  const fields = [
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
    {
      key: SITE_SETTING_KEYS.heroTagline,
      label: "Homepage tagline",
      default: "Security. Infrastructure. Research. Community.",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Site Settings</h1>
      <p className="mt-1 text-sm text-muted">
        These override the homepage without needing a redeploy. Leave blank
        to use the default.
      </p>

      <div className="mt-8 space-y-4">
        {fields.map((field) => (
          <SettingField
            key={field.key}
            settingKey={field.key}
            label={field.label}
            placeholder={field.default}
            initialValue={values[field.key] ?? ""}
          />
        ))}
      </div>
    </div>
  );
}
