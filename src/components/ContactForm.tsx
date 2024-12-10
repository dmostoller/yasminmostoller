// components/ContactForm.tsx
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import { Send, Loader2 } from 'lucide-react';
import { PrimaryButton } from './buttons/PrimaryButton';

const ContactForm = () => {
  const form = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!form.current) return;

    if (window.confirm('Are you sure you want to send this email?')) {
      setIsLoading(true);

      try {
        await emailjs.sendForm(
          'service_jz3d31c',
          'template_avspnq3',
          form.current,
          '2CBV5usGCJRMr4WbB'
        );

        alert('Your Message Has Been Sent');
        router.push('/');
      } catch (error) {
        console.error('Email error:', error);
        alert('Your Message Cannot Be Sent');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <form ref={form} onSubmit={sendEmail} className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <label htmlFor="from_name" className="block text-sm font-medium text-[var(--text-primary)]">
          Name
        </label>
        <input
          type="text"
          name="from_name"
          id="from_name"
          required
          className="w-full px-3 py-2 border border-[var(--text-secondary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-[var(--background-secondary)] text-[var(--text-primary)]"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="reply_to" className="block text-sm font-medium text-[var(--text-primary)]">
          Email
        </label>
        <input
          type="email"
          name="reply_to"
          id="reply_to"
          required
          className="w-full px-3 py-2 border border-[var(--text-secondary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-[var(--background-secondary)] text-[var(--text-primary)]"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-[var(--text-primary)]">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          required
          rows={4}
          className="w-full px-3 py-2 border border-[var(--text-secondary)] rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-[var(--background-secondary)] text-[var(--text-primary)]"
        />
      </div>
      <PrimaryButton
        type="submit"
        disabled={isLoading}
        className="w-full rounded-md"
        isLoading={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
            Sending...
          </>
        ) : (
          <>
            <Send className="-ml-1 mr-2 h-4 w-4" />
            Submit
          </>
        )}
      </PrimaryButton>
    </form>
  );
};

export default ContactForm;
