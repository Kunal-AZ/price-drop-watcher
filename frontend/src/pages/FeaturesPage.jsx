import React from 'react';
import {
  TrendingDown,
  Bell,
  LineChart,
  Clock,
  BarChart3,
  Zap,
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: TrendingDown,
      title: 'Track Products',
      desc: 'Monitor products automatically and detect price drops instantly.',
    },
    {
      icon: LineChart,
      title: 'Price Analytics',
      desc: 'Analyze historical trends and understand pricing patterns.',
    },
    {
      icon: Bell,
      title: 'Instant Alerts',
      desc: 'Receive alerts immediately when target prices are reached.',
    },
    {
      icon: Clock,
      title: '24/7 Monitoring',
      desc: 'Our engine tracks prices continuously across multiple stores.',
    },
    {
      icon: BarChart3,
      title: 'Market Insights',
      desc: 'Understand product movement before making purchases.',
    },
    {
      icon: Zap,
      title: 'Fast Decisions',
      desc: 'Buy at the perfect moment with real-time pricing intelligence.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-4 py-16 sm:px-6 lg:px-8 lg:py-20">

      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-yellow-600 font-medium mb-3">
          Powerful Platform
        </p>

        <h1 className="mb-6 text-4xl font-bold text-black sm:text-5xl lg:text-6xl">
          Features Built for Smart Buyers
        </h1>

        <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-600 sm:text-xl">
          BargainIt helps users make confident buying decisions using
          automation, analytics, and real-time alerts.
        </p>
      </div>

      {/* Premium Cards */}
      <div className="mx-auto mb-20 grid max-w-7xl gap-6 md:grid-cols-2 xl:grid-cols-3 lg:mb-24 lg:gap-8">

        {features.map((feature, index) => {
          const Icon = feature.icon;

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-10 border border-yellow-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 flex items-center justify-center mb-6">
                <Icon className="h-7 w-7 text-yellow-600" />
              </div>

              <h3 className="mb-4 text-2xl font-bold text-black lg:text-3xl">
                {feature.title}
              </h3>

              <p className="text-base leading-8 text-gray-600 lg:text-lg">
                {feature.desc}
              </p>
            </div>
          );
        })}

      </div>

      {/* Stats Section */}
      <div className="mx-auto mb-20 max-w-6xl rounded-3xl border border-yellow-100 bg-white p-8 shadow-xl sm:p-10 lg:mb-24 lg:p-14">

        <div className="grid gap-8 text-center sm:grid-cols-2 md:grid-cols-4 md:gap-10">

          <div>
            <h2 className="text-4xl font-bold text-yellow-600">10K+</h2>
            <p className="text-gray-600 mt-2">Tracked Products</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-yellow-600">500+</h2>
            <p className="text-gray-600 mt-2">Daily Alerts</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-yellow-600">98%</h2>
            <p className="text-gray-600 mt-2">Price Accuracy</p>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-yellow-600">24/7</h2>
            <p className="text-gray-600 mt-2">Monitoring</p>
          </div>

        </div>

      </div>

      </div>
  );
};

export default FeaturesPage;
