import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Quote, CheckCircle, TrendingUp } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { config } = useApp();
  const { testimonials } = config;

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#00D9FF]/15 border border-[#00D9FF]/30 mb-3">
            <TrendingUp className="w-4 h-4 text-[#00D9FF]" />
            <span className="text-xs font-mono font-bold text-[#00D9FF] uppercase tracking-wider">
              Trader Success Stories
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
            Verified Trader Testimonials
          </h2>
          <p className="text-base text-[#AAB5C5] mt-2">
            Real reviews from our global community of funded traders, day traders, and swing analysts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="p-8 rounded-3xl bg-[#0A1224] border border-[#087BFF]/20 hover:border-[#00D9FF]/40 transition-all duration-300 flex flex-col justify-between shadow-xl relative"
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-[#087BFF]/20" />

              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>

                <p className="text-sm text-[#AAB5C5] leading-relaxed italic">
                  "{test.review}"
                </p>

                {/* Profit / Milestone Highlight */}
                <div className="mt-4 px-3 py-1.5 rounded-xl bg-[#00E59B]/10 border border-[#00E59B]/30 text-[#00E59B] text-xs font-mono font-bold inline-flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>{test.profitHighlight}</span>
                </div>
              </div>

              {/* Author Info */}
              <div className="pt-6 mt-6 border-t border-gray-800 flex items-center gap-3">
                <img
                  src={test.avatar}
                  alt={test.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#087BFF]"
                />
                <div>
                  <div className="font-heading font-bold text-white text-sm">{test.name}</div>
                  <div className="text-xs text-gray-400">{test.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
