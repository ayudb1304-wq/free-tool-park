import type { Metadata } from "next"
import { breadcrumbSchema, SITE_URL } from "@/lib/schema"
import { JsonLd } from "@/components/seo/json-ld"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "FreeToolPark terms of service. Usage rules, disclaimers, and limitations of liability.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
}

export default function TermsPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Terms of Service", url: `${SITE_URL}/terms` },
        ])}
      />
      <div className="mx-auto max-w-3xl px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Terms of Service" },
          ]}
        />

      <h1 className="font-heading mb-6 text-3xl font-bold">
        Terms of Service
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Last updated: April 9, 2026
      </p>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6 text-muted-foreground">
        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Acceptance of Terms
          </h2>
          <p>
            By accessing and using FreeToolPark (www.freetoolpark.com), you agree
            to be bound by these Terms of Service. If you do not agree with any
            part of these terms, you should not use this website.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Description of Service
          </h2>
          <p>
            FreeToolPark provides free, browser-based utility tools for text
            processing, development, calculations, conversions, and generation.
            All tools run entirely in your browser using client-side JavaScript.
            No account registration is required.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Free Use
          </h2>
          <p>
            All tools on FreeToolPark are provided free of charge for personal
            and commercial use. We reserve the right to introduce premium
            features or paid plans in the future, but existing free tools will
            remain free.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Accuracy and Disclaimer
          </h2>
          <p>
            While we strive to provide accurate and reliable tools, FreeToolPark
            makes no warranties or guarantees regarding the accuracy,
            completeness, or reliability of any tool output. Specifically:
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              Financial calculators (mortgage, EMI, tip) provide estimates for
              informational purposes only. Do not rely solely on these results
              for financial decisions. Consult a qualified financial advisor.
            </li>
            <li>
              Health calculators (BMI) are screening tools and should not replace
              professional medical advice, diagnosis, or treatment.
            </li>
            <li>
              Developer tools (formatters, encoders, hash generators) use
              standard algorithms but should be verified in your specific
              environment before production use.
            </li>
            <li>
              Cryptographic tools (MD5, SHA-256) implement standard algorithms
              but are not audited for security-critical applications. Use
              dedicated security libraries for production cryptography.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            User Responsibilities
          </h2>
          <p>You agree to use FreeToolPark responsibly and not to:</p>
          <ul className="mt-2 list-inside list-disc space-y-1">
            <li>
              Use the tools for any unlawful purpose or in violation of any
              applicable laws
            </li>
            <li>
              Attempt to disrupt, overload, or interfere with the operation of
              the website
            </li>
            <li>
              Scrape, crawl, or use automated systems to access the site in a
              manner that exceeds reasonable use
            </li>
            <li>
              Remove, alter, or obscure any copyright or attribution notices
            </li>
          </ul>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Intellectual Property
          </h2>
          <p>
            The FreeToolPark name, logo, website design, and underlying source
            code are the intellectual property of FreeToolPark. You may not
            reproduce, distribute, or create derivative works from the website
            design or code without permission. The output generated by our tools
            belongs to you.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, FreeToolPark and its
            operators shall not be liable for any direct, indirect, incidental,
            consequential, or special damages arising from your use of or
            inability to use the website or its tools. This includes but is not
            limited to damages for loss of profits, data, or other intangible
            losses.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Third-Party Services
          </h2>
          <p>
            FreeToolPark may display advertisements from third-party ad networks.
            These services operate under their own terms and privacy policies. We
            are not responsible for the content, practices, or availability of
            third-party services.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Availability
          </h2>
          <p>
            We aim to keep FreeToolPark available at all times but do not
            guarantee uninterrupted access. The website may be temporarily
            unavailable due to maintenance, updates, or circumstances beyond our
            control.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Changes to Terms
          </h2>
          <p>
            We may update these Terms of Service at any time. Changes will be
            posted on this page with an updated revision date. Your continued use
            of the site after changes constitutes acceptance of the updated
            terms.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Governing Law
          </h2>
          <p>
            These terms are governed by and construed in accordance with the laws
            of India. Any disputes arising from these terms will be subject to
            the exclusive jurisdiction of the courts in India.
          </p>
        </section>

        <section>
          <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
            Contact
          </h2>
          <p>
            If you have questions about these terms, you can reach us through the
            contact information provided on our website.
          </p>
        </section>
      </div>
    </div>
    </>
  )
}
