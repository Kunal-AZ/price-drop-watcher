import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-yellow-600 font-medium mb-3">
          Contact Support
        </p>

        <h1 className="mb-6 text-4xl font-bold text-black sm:text-5xl lg:text-6xl">
          Let’s Talk
        </h1>

        <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
          Reach out for product support, partnerships, or feature suggestions.
        </p>
      </div>

      {/* Main Card */}
      <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl border border-yellow-100 bg-white shadow-2xl">

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

          {/* Left Side */}
          <div className="relative overflow-hidden bg-yellow-100 p-8 sm:p-10">

            <div className="absolute right-4 top-6 opacity-10">
              <ArrowRight className="w-28 h-28 text-black" />
            </div>

            <h2 className="text-3xl font-bold text-black mb-8">
              Contact Information
            </h2>

            <div className="space-y-6">

              <div className="flex items-center gap-4">
                <Mail className="h-5 w-5 text-black" />
                <span className="text-black text-base">
                  support@bargainit.com
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Phone className="h-5 w-5 text-black" />
                <span className="text-black text-base">
                  +91 8767528776
                </span>
              </div>

              <div className="flex items-center gap-4">
                <MapPin className="h-5 w-5 text-black" />
                <span className="text-black text-base">
                  Pune, India
                </span>
              </div>

            </div>

          </div>

          {/* Right Side */}
          <div className="p-6 sm:p-8 lg:p-12">

            <div className="space-y-6">

              <input
                type="text"
                placeholder="Your Name"
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400"
              />

              <textarea
                rows="6"
                placeholder="Your Message"
                className="w-full px-6 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-yellow-400"
              />

              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-black px-8 py-4 text-base font-medium text-white transition-all hover:bg-gray-900 sm:w-auto sm:px-10 sm:text-lg">
                Send Message <ArrowRight className="h-5 w-5" />
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default ContactPage;
