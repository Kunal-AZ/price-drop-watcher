import React from 'react';

const PrivacyPage = () => {
  const items = [
    'We collect only essential account and tracking data.',
    'User information is encrypted and securely stored.',
    'No personal data is sold to third parties.',
    'Marketplace information is used only for service delivery.',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-8 py-20">

      <div className="text-center mb-20">
        <p className="text-yellow-600 font-medium mb-3">Security</p>

        <h1 className="text-6xl font-bold text-black mb-6">
          Privacy Policy
        </h1>

        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          Your privacy and trust are protected by design.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {items.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg border border-yellow-100 p-10"
          >
            <h3 className="text-2xl font-bold mb-4 text-black">
              Policy {index + 1}
            </h3>

            <p className="text-gray-600 text-lg leading-8">
              {item}
            </p>
          </div>
        ))}

      </div>

    </div>
  );
};

export default PrivacyPage;