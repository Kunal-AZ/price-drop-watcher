import React from 'react';
import { CalendarDays, ArrowRight } from 'lucide-react';
import image1 from '../assets/image2.png';
import image3 from '../assets/image3.png';
import image4 from '../assets/image4.png';
import image5 from '../assets/image5.png';
import logo from '../assets/logo.jpg';

const BlogPage = () => {
  const blogImages = [image3, image4, image5];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-yellow-50 px-8 py-20">

      {/* Hero Section */}
      <div className="text-center mb-24">

        <p className="text-yellow-600 font-medium mb-3">
          Insights & Updates
        </p>

        <div className="flex items-center justify-center gap-4 mb-6">
          <img
            src={logo}
            alt="logo"
            className="h-14 w-14 object-contain"
          />

          <h1 className="text-6xl font-bold text-black">
            BargainIt Blog
          </h1>
        </div>

        <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-8">
          Discover smart shopping strategies, real saving techniques,
          and product tracking insights used by experienced buyers.
        </p>

      </div>

      {/* Featured Article */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-yellow-100 overflow-hidden mb-20">

        <div className="grid lg:grid-cols-2 items-center">

          <img
            src={image1}
            alt="Featured"
            className="w-full h-full object-cover min-h-[420px]"
          />

          <div className="p-12">

            <div className="inline-block px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium mb-6">
              Featured Article
            </div>

            <h2 className="text-4xl font-bold text-black mb-5 leading-tight">
              How to save more using price tracking automation
            </h2>

            <p className="text-gray-600 text-lg leading-8 mb-6">
              Learn how advanced price monitoring helps buyers identify
              true discounts and avoid fake offers.
            </p>

            <div className="flex items-center gap-3 text-gray-500 mb-6">
              <CalendarDays className="h-5 w-5" />
              March 2026
            </div>

            <button className="text-yellow-600 font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              Read Article <ArrowRight className="h-4 w-4" />
            </button>

          </div>

        </div>
      </div>

      {/* Blog Cards */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">

        {blogImages.map((img, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl shadow-lg border border-yellow-100 overflow-hidden hover:shadow-xl hover:-translate-y-2 transition-all"
          >

            <img
              src={img}
              alt="Blog"
              className="h-44 w-full object-cover"
            />

            <div className="p-8">

              <div className="text-sm text-yellow-600 font-medium mb-3">
                Price Strategy
              </div>

              <h3 className="text-2xl font-bold text-black mb-3">
                Smart buying tip #{index + 1}
              </h3>

              <p className="text-gray-600 leading-7 mb-5">
                Understand product pricing trends before making purchases.
              </p>

              <button className="text-yellow-600 font-semibold hover:underline">
                Read More →
              </button>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
};

export default BlogPage;