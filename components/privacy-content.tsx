export default function PrivacyContent() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>

      <p className="mb-4">
        <span className="text-primary font-medium">DhakaBite</span> is committed to protecting your privacy. This
        Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
        [www.dhakabite.com] and use our food delivery services.
      </p>

      <p className="mb-8">By using our services, you agree to the terms of this Privacy Policy.</p>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
          <p className="mb-3">We collect information in the following ways:</p>

          <div className="mb-3">
            <h3 className="font-medium mb-2">a. Personal Information</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Name</li>
              <li>Email address</li>
              <li>Phone number</li>
              <li>Delivery address</li>
              <li>Payment information (processed via secure third-party payment gateways)</li>
              <li>Account login credentials</li>
            </ul>
          </div>

          <div className="mb-3">
            <h3 className="font-medium mb-2">b. Usage Data</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device information</li>
              <li>Pages visited</li>
              <li>Access times and dates</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-2">c. Location Data</h3>
            <p>If enabled, we may collect GPS location to improve delivery accuracy.</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Process and deliver your food orders</li>
            <li>Manage your account and preferences</li>
            <li>Provide customer support</li>
            <li>Send order status and promotional messages</li>
            <li>Improve and personalize our services</li>
            <li>Detect and prevent fraud and abuse</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. How We Share Your Information</h2>
          <p className="mb-3">We may share your information with:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Restaurants and Delivery Partners:</strong> To fulfill your orders
            </li>
            <li>
              <strong>Service Providers:</strong> For hosting, payment processing, analytics, customer support
            </li>
            <li>
              <strong>Law Enforcement:</strong> When required by law or to protect our rights
            </li>
            <li>
              <strong>Marketing Partners:</strong> Only with your consent, for promotions and ads
            </li>
          </ul>
          <p className="mt-3">We do not sell or rent your personal data.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Cookies and Tracking Technologies</h2>
          <p className="mb-3">We use cookies and similar technologies to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Keep you logged in</li>
            <li>Remember preferences</li>
            <li>Analyze site traffic</li>
            <li>Show relevant ads</li>
          </ul>
          <p className="mt-3">You can manage cookie preferences through your browser settings.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Data Retention</h2>
          <p>
            We retain your personal information for as long as needed to fulfill the purposes outlined in this policy
            unless a longer retention period is required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your data. However, no method of
            transmission over the internet is 100% secure.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Your Privacy Rights</h2>
          <p className="mb-3">Depending on your jurisdiction, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access your personal data</li>
            <li>Correct or delete your data</li>
            <li>Withdraw consent</li>
            <li>Object to processing</li>
            <li>File a complaint with a data protection authority</li>
          </ul>
          <p className="mt-3">
            To exercise these rights, contact us at:{" "}
            <a href="mailto:privacy@dhakabite.com" className="text-primary hover:underline">
              privacy@dhakabite.com
            </a>
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
          <p>
            Our services are not intended for individuals under the age of 13. We do not knowingly collect personal data
            from children.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. International Data Transfers</h2>
          <p>
            If you are accessing our services outside of Bangladesh, your information may be transferred to and
            processed in countries with different data protection laws.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will update the "Last Updated" date and
            notify users as required by law.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Contact Us</h2>
          <p className="mb-3">If you have questions about this Privacy Policy, contact us at:</p>
          <p className="mb-1">
            Email:{" "}
            <a href="mailto:privacy@dhakabite.com" className="text-primary hover:underline">
              privacy@dhakabite.com
            </a>
          </p>
          <p>Address: 123 Food Street, Gulshan, Dhaka, Bangladesh</p>
        </section>

        <p className="mt-8 text-sm text-gray-600">Last Updated: May 22, 2023</p>
      </div>
    </div>
  )
}
