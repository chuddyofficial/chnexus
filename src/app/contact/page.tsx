import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";

export const metadata: Metadata = {
  title: "Contact — CH Nexus",
  description: "Get in touch with the CH Nexus team.",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
        Get in touch
      </h1>
      <p className="mt-4 text-sm text-muted sm:text-base">
        Questions about the ecosystem? Send us a message and the team will
        follow up.
      </p>

      <div className="mt-10">
        <ContactForm />
      </div>
    </div>
  );
}
