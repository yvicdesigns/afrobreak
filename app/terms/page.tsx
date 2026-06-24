export default function TermsPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 bg-background">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
        <p className="text-text-muted text-sm mb-12">Last updated: June 2025</p>

        <div className="prose prose-invert max-w-none space-y-10">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              By accessing or using AfroBreak ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree, please do not use the Platform. AfroBreak is operated by AfroBreak Ltd, registered in Ghana.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Use of the Platform</h2>
            <p className="text-text-secondary leading-relaxed">
              AfroBreak grants you a limited, non-exclusive, non-transferable licence to access and use the Platform for personal, non-commercial purposes. You may not reproduce, distribute, or create derivative works from any content without prior written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Accounts</h2>
            <p className="text-text-secondary leading-relaxed">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information when registering. AfroBreak reserves the right to terminate accounts that violate these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Subscriptions & Payments</h2>
            <p className="text-text-secondary leading-relaxed">
              Premium subscriptions are billed in advance on a monthly or annual basis. All prices are displayed in Ghanaian Cedi (₵) unless otherwise stated. Payments are processed securely via Paystack. Subscriptions auto-renew unless cancelled before the renewal date.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Refund Policy</h2>
            <p className="text-text-secondary leading-relaxed">
              Digital content (video lessons, music downloads) is non-refundable once accessed or downloaded. For subscription billing errors, please contact us within 14 days at contact@afrobreak.com and we will review your case.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">6. Intellectual Property</h2>
            <p className="text-text-secondary leading-relaxed">
              All content on the Platform — including videos, music, text, graphics, and logos — is owned by AfroBreak or its instructors and is protected by copyright law. Purchasing or subscribing does not transfer ownership of any content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">7. Prohibited Conduct</h2>
            <p className="text-text-secondary leading-relaxed mb-3">You agree not to:</p>
            <ul className="list-disc list-inside text-text-secondary space-y-1">
              <li>Share your account credentials with others</li>
              <li>Download, record, or redistribute premium content</li>
              <li>Use the Platform for any illegal purpose</li>
              <li>Harass or harm other users or instructors</li>
              <li>Attempt to reverse-engineer any part of the Platform</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">8. Limitation of Liability</h2>
            <p className="text-text-secondary leading-relaxed">
              AfroBreak is provided "as is." To the maximum extent permitted by law, AfroBreak shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Platform.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">9. Changes to Terms</h2>
            <p className="text-text-secondary leading-relaxed">
              We may update these Terms at any time. Continued use of the Platform after changes constitutes acceptance of the new Terms. We will notify registered users of material changes by email.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">10. Contact</h2>
            <p className="text-text-secondary leading-relaxed">
              For questions about these Terms, contact us at{' '}
              <a href="mailto:legal@afrobreak.com" className="text-primary-400 hover:text-primary-300 transition-colors">
                legal@afrobreak.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
