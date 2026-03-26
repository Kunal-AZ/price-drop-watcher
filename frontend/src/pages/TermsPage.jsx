import React from 'react';

const TermsPage = () => {
  const terms = [
    'Users must use BargainIt responsibly and comply with platform policies.',
    'Price information depends on marketplace updates and may change anytime.',
    'Alerts are informational and do not guarantee product availability.',
    'Unauthorized automation or scraping is prohibited.',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-8 py-20">

      <div className="text-center mb-20">
        <p className="text-yellow-600 font-medium mb-3">Legal</p>

        <h1 className="text-6xl font-bold text-black mb-6">
          Terms of Service
        </h1>

        <p className="text-gray-600 text-xl max-w-3xl mx-auto">
          Clear rules for using BargainIt safely and responsibly.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid gap-6">

        {terms.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-lg border border-yellow-100 p-8"
          >
            <h3 className="text-2xl font-bold text-black mb-3">
              Clause {index + 1}
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

export default TermsPage;