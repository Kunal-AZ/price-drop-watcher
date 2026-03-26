import React from 'react';
import { TrendingDown, Shield, Bell, LineChart } from 'lucide-react';
import logo from '../assets/logo.jpg';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 text-black">

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

        <div className="text-center mb-20">
          <div className="flex justify-center items-center gap-3 mb-6">
            <img src={logo} alt="logo" className="h-14 w-14 object-contain" />
            <h1 className="text-3xl font-bold sm:text-4xl">About BargainIt</h1>
          </div>

          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-gray-600 sm:text-xl">
            BargainIt helps users track product prices across multiple online stores
            and receive instant alerts when prices drop below target values.
          </p>
        </div>

        <div className="mb-20 grid items-center gap-10 lg:mb-24 lg:grid-cols-2 lg:gap-20">

          <div>
            <h2 className="mb-8 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              Smart shopping built for modern buyers.
            </h2>

            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              Our mission is to make online shopping smarter by helping users
              avoid overpaying and never miss genuine discounts.
            </p>

            <p className="text-lg text-gray-600 leading-relaxed">
              BargainIt tracks price history, predicts drops, and helps users
              buy at the right moment.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-yellow-100 p-10">
            <div className="space-y-6">
              {[
                ['Amazon Tracking', 'Monitor prices across products'],
                ['Price Alerts', 'Instant notifications when target price hits'],
                ['Price Analytics', 'Understand price trends clearly'],
              ].map(([title, desc], i) => (
                <div
                  key={i}
                  className="bg-yellow-50 rounded-2xl p-5 border border-yellow-100"
                >
                  <h3 className="font-semibold text-lg mb-2">{title}</h3>
                  <p className="text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4 lg:gap-8">

          {[
            [TrendingDown, 'Track Products'],
            [Bell, 'Price Alerts'],
            [LineChart, 'Price History'],
            [Shield, 'Secure Platform'],
          ].map(([icon, title], i) => {
            const Icon = icon;

            return (
              <div
                key={i}
                className="bg-white rounded-3xl p-8 border border-yellow-100 shadow-sm hover:shadow-xl transition"
              >
                <Icon className="h-10 w-10 text-yellow-500 mb-5" />
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
            );
          })}

        </div>

      </section>

    </div>
  );
};

export default AboutPage;
