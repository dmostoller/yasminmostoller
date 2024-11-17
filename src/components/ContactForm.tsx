// components/ContactForm.tsx
'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import { Send, Loader2 } from 'lucide-react';

interface FormData {
  from_name: string;
  reply_to: string;
  message: string;
}

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
        await emailjs.sendForm('service_jz3d31c', 'template_avspnq3', form.current, '2CBV5usGCJRMr4WbB');

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
    <form ref={form} onSubmit={sendEmail} className="w-full max-w-lg mx-auto space-y-6">
      <div className="space-y-2">
        <label htmlFor="from_name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          name="from_name"
          id="from_name"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="reply_to" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          name="reply_to"
          id="reply_to"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message
        </label>
        <textarea
          name="message"
          id="message"
          required
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
      </button>
    </form>
  );
};

export default ContactForm;
