import React from 'react';
import {
  Mail,
  Phone,
  ArrowRight,
  Clock,
} from 'lucide-react';

const HelpPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-8 py-20">

      <div className="text-center mb-20">
        <p className="text-yellow-600 font-medium mb-3">Support Center</p>

        <h1 className="text-6xl font-bold text-black mb-6">
          Help & Support
        </h1>

        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          We’re here to help you with product tracking and account support.
        </p>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl border border-yellow-100 p-14">

        <div className="grid md:grid-cols-2 gap-10">

          <div className="space-y-8">

            <div className="flex items-center gap-4">
              <Mail className="h-6 w-6 text-yellow-600" />
              <span className="text-lg text-gray-700">
                support@bargainit.com
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Phone className="h-6 w-6 text-yellow-600" />
              <span className="text-lg text-gray-700">
                +91 8767528776
              </span>
            </div>

            <div className="flex items-center gap-4">
              <Clock className="h-6 w-6 text-yellow-600" />
              <span className="text-lg text-gray-700">
                Mon - Sat, 9AM - 6PM
              </span>
            </div>

          </div>

          <div className="flex items-center justify-center">
            <button className="bg-black text-white px-10 py-4 rounded-xl text-lg flex items-center gap-2 hover:bg-gray-900">
              Contact Support <ArrowRight className="h-5 w-5" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};

export default HelpPage;