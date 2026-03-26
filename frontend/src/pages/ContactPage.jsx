import React from 'react';
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from 'lucide-react';

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-8 py-20">

      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-yellow-600 font-medium mb-3">
          Contact Support
        </p>

        <h1 className="text-6xl font-bold text-black mb-6">
          Let’s Talk
        </h1>

        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-8">
          Reach out for product support, partnerships, or feature suggestions.
        </p>
      </div>

      {/* Main Card */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl border border-yellow-100 overflow-hidden">

        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">

          {/* Left Side */}
          <div className="bg-yellow-100 p-10 relative overflow-hidden">

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
          <div className="p-12">

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

              <button className="bg-black text-white px-10 py-4 rounded-xl text-lg font-medium flex items-center gap-2 hover:bg-gray-900 transition-all">
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