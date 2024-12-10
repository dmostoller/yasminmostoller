export const metadata = {
  title: 'Yasmin Mostoller | Terms & Conditions',
  description: 'Terms and Conditions for yasminmostoller.com',
};

export default function TermsPage() {
  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 bg-[var(--background-primary)]">
      <div className="w-full max-w-screen-xl mx-auto mt-4 p-6 bg-[var(--background-secondary)] rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-6">Terms and Conditions</h1>
        <div className="space-y-4 text-[var(--text-secondary)]">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p>
              By accessing and using yasminmostoller.com, you accept and agree to be bound by these Terms and
              Conditions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. User Comments</h2>
            <p>
              Users may post comments on blog posts after authentication through Google. You agree that your
              comments will not contain harmful, offensive, or inappropriate content.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">3. Intellectual Property</h2>
            <p>
              All artwork, images, and content on this website are the property of Yasmin Mostoller and are
              protected by copyright laws. They may not be reproduced without explicit permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">4. Account Termination</h2>
            <p>
              We reserve the right to terminate or suspend access to our service immediately, without prior
              notice, for any breach of these Terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">5. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the site after changes
              constitutes acceptance of the modified terms.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
