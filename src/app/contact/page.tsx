// app/contact/page.tsx
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact - Inquire About Artwork',
  description: 'Get in touch about available paintings and art opportunities',
};

export default function ContactPage() {
  return (
    <div className="min-h-[90vh] flex md:items-center mt-16 md:mt-0 px-4">
      <div className="container mx-auto px-4 max-w-6xl md:py-12">
        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Left column - Text content */}
          <div className="text-center md:text-left space-y-6">
            <div className="flex items-center md:justify-start justify-center mb-6">
              <h1 className="text-4xl font-bold text-[var(--text-primary)]">Interested in a Piece?</h1>
            </div>

            <h2 className="text-2xl font-semibold text-[var(--text-secondary)]">
              Let&apos;s discuss available artwork
            </h2>

            <div className="text-[var(--text-secondary)] leading-relaxed space-y-4">
              <p>
                I&apos;m happy to provide more details about any paintings you&apos;ve seen in my gallery,
                including size, medium, and shipping options.
              </p>

              <p>
                Whether you&apos;re interested in a specific piece, have questions about my work, or would
                like to discuss other opportunities, I look forward to connecting with you.
              </p>

              <p className="font-medium">
                Please share your inquiry using the form, and I&apos;ll get back to you within 24-48 hours.
              </p>
            </div>
          </div>

          {/* Right column - Contact form */}
          <div className="mt-12 md:mt-0">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
