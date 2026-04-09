import type { Metadata } from "next"
import Link from "next/link"
import { SITE_URL } from "@/lib/schema"
import { Breadcrumb } from "@/components/layout/breadcrumb"

export const metadata: Metadata = {
  title: "Privacy Policy — How We Protect Your Data",
  description:
    "Learn why FreeToolPark is the most privacy-focused tool site online. 100% client-side processing, no tracking, no data collection. Your data never leaves your browser.",
  keywords: [
    "privacy-focused online tools",
    "no tracking calculator",
    "client-side tools",
    "private online converter",
    "GDPR compliant tools",
  ],
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Privacy Policy" },
        ]}
      />

      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1 className="font-heading mb-6 text-3xl font-bold">
          Privacy Policy — How We Protect Your Data
        </h1>

        <p className="text-lg leading-relaxed">
          <strong>TL;DR:</strong> We don&apos;t collect your data. Period. Every
          tool on this site runs entirely in your browser. Your inputs,
          calculations, and results never touch our servers.
        </p>

        {/* Quick Trust Summary */}
        <div className="not-prose my-8 rounded-lg border border-green-200 bg-green-50 p-6 dark:border-green-800 dark:bg-green-950">
          <h2 className="mb-4 text-xl font-bold text-green-800 dark:text-green-200">
            Our Privacy Promise
          </h2>
          <ul className="space-y-2 text-green-700 dark:text-green-300">
            <li className="flex items-center gap-2">
              <span>&#10003;</span> No tracking cookies
            </li>
            <li className="flex items-center gap-2">
              <span>&#10003;</span> No analytics on tool inputs
            </li>
            <li className="flex items-center gap-2">
              <span>&#10003;</span> No data sent to servers
            </li>
            <li className="flex items-center gap-2">
              <span>&#10003;</span> No user accounts required
            </li>
            <li className="flex items-center gap-2">
              <span>&#10003;</span> Works offline after first load
            </li>
          </ul>
        </div>

        <p className="mb-8 text-sm text-muted-foreground">
          Last updated: April 9, 2026
        </p>

        <div className="space-y-6 text-muted-foreground">
          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              Why We Built Privacy-First Tools
            </h2>
            <p>
              Most online tool sites are surveillance machines. They log your IP
              address, track your inputs, sell your data to advertisers, and
              require accounts for basic functionality.
            </p>
            <p className="mt-2">
              We built FreeToolPark because we were tired of that. When you use a
              mortgage calculator, no one needs to know your income. When you
              format JSON, no one needs to see your API keys. When you generate a
              password, definitely no one should be storing that.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              How Our Tools Work (Technical Explanation)
            </h2>
            <p>
              Every tool on this site uses{" "}
              <strong>client-side JavaScript</strong>. This means the code runs
              in your web browser, not on our servers.
            </p>
            <p className="mt-2">When you type into a calculator or formatter:</p>
            <ol className="mt-2 list-inside list-decimal space-y-1">
              <li>Your browser executes the JavaScript code locally</li>
              <li>Calculations happen on your device&apos;s CPU</li>
              <li>Results display in your browser</li>
              <li>No network requests are made with your data</li>
            </ol>
            <p className="mt-2">
              You can verify this yourself: open your browser&apos;s Developer
              Tools (F12), go to the Network tab, and use any tool. You&apos;ll
              see no requests containing your input data.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              Data We Do Not Collect
            </h2>
            <p>
              All tools on FreeToolPark run entirely in your browser using
              client-side JavaScript. We do not collect, store, transmit, or log
              any data you enter into our tools. This includes but is not limited
              to:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Text you paste into formatters, converters, or counters</li>
              <li>Passwords generated by the password generator</li>
              <li>JSON, Base64, or any encoded/decoded data</li>
              <li>Financial information entered into calculators</li>
              <li>QR code content or any file uploads</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              What We Do Collect
            </h2>
            <p>
              To be completely transparent, here is what we do collect:
            </p>

            <h3 className="mt-4 mb-2 text-lg font-medium text-foreground">
              Analytics
            </h3>
            <p>
              We may use privacy-friendly analytics services to understand how
              visitors use our site. This data is aggregated and does not
              identify individual users. It may include page views, referral
              sources, browser type, device type, and approximate geographic
              region.
            </p>

            <h3 className="mt-4 mb-2 text-lg font-medium text-foreground">
              Advertising
            </h3>
            <p>
              We display advertisements from third-party ad networks to support
              the free operation of this site. These networks may use cookies and
              similar technologies to serve ads based on your browsing activity.
              Importantly: <strong>ad networks never see your tool inputs</strong>
              . They only know you visited a page, not what you typed into it.
            </p>
            <p className="mt-2">
              You can opt out of personalized advertising through your browser
              settings or through industry opt-out pages such as:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Google Ad Settings (adssettings.google.com)</li>
              <li>
                Network Advertising Initiative (optout.networkadvertising.org)
              </li>
              <li>Digital Advertising Alliance (optout.aboutads.info)</li>
            </ul>

            <h3 className="mt-4 mb-2 text-lg font-medium text-foreground">
              Cookies
            </h3>
            <p>
              FreeToolPark itself does not set cookies. However, third-party ad
              networks and analytics services may set cookies on your device.
              These cookies are governed by the respective third party&apos;s
              privacy policy. You can manage or block cookies through your
              browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              Hosting and Infrastructure
            </h2>
            <p>
              This website is hosted on Vercel. Vercel may collect server logs
              including IP addresses, request timestamps, and user agent strings
              as part of their infrastructure. This data is subject to
              Vercel&apos;s privacy policy at vercel.com/legal/privacy-policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              GDPR Compliance
            </h2>
            <p>
              Because we don&apos;t collect personal data from tool usage, most
              GDPR requirements don&apos;t apply to our tools. For the limited
              data we do handle (analytics, contact forms), we comply with GDPR:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>Right to access: Contact us to see any data we have</li>
              <li>Right to deletion: Contact us to delete your data</li>
              <li>Data minimization: We collect only what&apos;s necessary</li>
            </ul>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              Open Source Verification
            </h2>
            <p>
              Don&apos;t trust us? Verify yourself. You can inspect the source
              code of any tool using your browser&apos;s Developer Tools and
              confirm no data is transmitted.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              Children&apos;s Privacy
            </h2>
            <p>
              FreeToolPark does not knowingly collect personal information from
              children under 13. Our tools do not require any personal
              information to use.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              Changes to This Policy
            </h2>
            <p>
              We may update this privacy policy from time to time. Changes will
              be posted on this page with an updated revision date. Your
              continued use of the site after changes constitutes acceptance of
              the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading mb-3 text-xl font-semibold text-foreground">
              Contact
            </h2>
            <p>
              If you have questions about this privacy policy, you can reach us
              through the contact information provided on our website.
            </p>
          </section>

          <p className="mt-4 text-center text-sm">
            <Link
              href="/tools"
              className="font-medium text-primary hover:underline"
            >
              &larr; Back to all tools
            </Link>
          </p>
        </div>
      </article>
    </div>
  )
}
