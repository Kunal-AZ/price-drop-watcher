import React from 'react';
import {
  TrendingDown,
  Bell,
  LineChart,
  Shield,
  ArrowRight,
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
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-8 py-20">

      {/* Hero */}
      <div className="text-center mb-20">
        <p className="text-yellow-600 font-medium mb-3">
          Powerful Platform
        </p>

        <h1 className="text-6xl font-bold text-black mb-6">
          Features Built for Smart Buyers
        </h1>

        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-8">
          BargainIt helps users make confident buying decisions using
          automation, analytics, and real-time alerts.
        </p>
      </div>

      {/* Premium Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8 mb-24">

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

              <h3 className="text-3xl font-bold mb-4 text-black">
                {feature.title}
              </h3>

              <p className="text-gray-600 text-lg leading-8">
                {feature.desc}
              </p>
            </div>
          );
        })}

      </div>

      {/* Stats Section */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-yellow-100 p-14 mb-24">

        <div className="grid md:grid-cols-4 gap-10 text-center">

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