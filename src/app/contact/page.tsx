// app/contact/page.tsx
import { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';
import { MessageSquare } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact - Get In Touch',
  description: 'Contact us to purchase a painting or commission a custom work'
};

export default function ContactPage() {
  return (
    <div className="min-h-screen py-24">
      <div className="container mx-auto px-4 max-w-2xl text-center space-y-6">
        <div className="flex items-center justify-center mb-6">
          <MessageSquare className="w-8 h-8 text-teal-600 mr-2" />
          <h1 className="text-4xl font-bold text-gray-900">Get In Touch</h1>
        </div>

        <h2 className="text-2xl font-semibold text-gray-700">
          Purchase a painting or commission a custom work.
        </h2>

        <p className="text-gray-600 leading-relaxed">
          If you are interested in purchasing any of the paintings shown here, or if you would like to
          commission a custom work, I would be happy to discuss this with you. Please fill out the form below
          with as much information as possible, and I will get back to you as soon as I can. Thank you very
          much.
        </p>
      </div>

      <div className="container mx-auto px-4 max-w-2xl mt-12">
        <ContactForm />
      </div>
    </div>
  );
}
