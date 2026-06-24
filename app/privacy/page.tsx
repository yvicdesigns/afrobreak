export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
        <p className="text-text-muted text-sm mb-12">Last updated: June 2025</p>

        <div className="prose prose-invert max-w-none space-y-10">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Who We Are</h2>
            <p className="text-text-secondary leading-relaxed">
              AfroBreak Ltd is a dance education platform based in Accra, Ghana. We operate the AfroBreak website and mobile experience. For any privacy concerns, contact us at{' '}
              <a href="mailto:privacy@afrobreak.com" className="text-primary-400 hover:text-primary-300 transition-colors">
                privacy@afrobreak.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Information We Collect</h2>
            <p className="text-text-secondary leading-relaxed mb-3">We collect the following types of information:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li><strong className="text-white">Account data:</strong> Name, email address, and password (hashed) when you register</li>
              <li><strong className="text-white">Payment data:</strong> Transaction reference and amount via Paystack (we never store your card details)</li>
              <li><strong className="text-white">Usage data:</strong> Videos watched, events registered for, content interactions</li>
              <li><strong className="text-white">Device data:</strong> Browser type, IP address, and general location for security purposes</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li>To create and manage your account</li>
              <li>To process payments and confirm event registrations</li>
              <li>To personalise your experience (recommended videos, saved favourites)</li>
              <li>To send transactional emails (receipts, event confirmations)</li>
              <li>To improve the Platform through aggregated analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data Sharing</h2>
            <p className="text-text-secondary leading-relaxed">
              We do not sell your personal data. We share data only with trusted service providers necessary to operate the Platform:
            </p>
            <ul className="list-disc list-inside text-text-secondary space-y-1 mt-3">
              <li><strong className="text-white">Supabase</strong> — database and authentication infrastructure</li>
              <li><strong className="text-white">Paystack</strong> — payment processing</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Data Retention</h2>
            <p className="text-text-secondary leading-relaxed">
              We retain your account data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law (e.g. payment records for tax purposes, retained for 7 years).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Your Rights</h2>
            <p className="text-text-secondary leading-relaxed mb-3">Under applicable data protection law, you have the right to:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li>Access the personal data we hold about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for marketing communications</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mt-3">
              To exercise these rights, email{' '}
              <a href="mailto:privacy@afrobreak.com" className="text-primary-400 hover:text-primary-300 transition-colors">
                privacy@afrobreak.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Cookies</h2>
            <p className="text-text-secondary leading-relaxed">
              We use essential cookies only — to maintain your session and authentication state. We do not use third-party advertising or tracking cookies.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Security</h2>
            <p className="text-text-secondary leading-relaxed">
              We use industry-standard security measures including encrypted connections (HTTPS), hashed passwords, and row-level security on our database. No system is completely secure; please protect your password and notify us immediately of any suspected breach.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Changes to This Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify registered users of significant changes by email. The "Last updated" date at the top of this page reflects the most recent revision.
            </p>
          </section>

        </div>
      </div>
    </div>
  )
}
