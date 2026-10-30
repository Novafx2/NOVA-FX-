import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Play, Eye, Clock, Youtube, ExternalLink, X } from 'lucide-react';

export const YouTubeSection: React.FC = () => {
  const { config } = useApp();
  const { youtube } = config;
  const [selectedVideo, setSelectedVideo] = useState<{ title: string; youtubeId: string } | null>(null);

  const handleSubscribe = () => {
    if (youtube.channelUrl) {
      window.open(youtube.channelUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 mb-3">
              <Youtube className="w-4 h-4 text-red-500" />
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                NOVA FX YouTube Academy
              </span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-heading text-white tracking-tight">
              LEARN. ANALYZE. IMPROVE.
            </h2>
            <p className="text-base text-[#AAB5C5] mt-2 max-w-xl">
              {youtube.description}
            </p>
          </div>

          {/* Channel Subscribe Box */}
          <div className="p-4 rounded-2xl bg-[#0A1224] border border-gray-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-lg shadow-red-600/30 shrink-0">
              <Youtube className="w-7 h-7" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{youtube.channelTitle}</div>
              <div className="text-xs text-gray-400 font-mono">{youtube.subscribers}</div>
            </div>
            <button
              onClick={handleSubscribe}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ml-2"
            >
              <span>Subscribe</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Featured Videos Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {youtube.featuredVideos.map((video) => (
            <div
              key={video.id}
              onClick={() => setSelectedVideo({ title: video.title, youtubeId: video.youtubeId })}
              className="group rounded-2xl bg-[#0A1224] border border-[#087BFF]/20 hover:border-[#00D9FF]/50 transition-all duration-300 overflow-hidden cursor-pointer flex flex-col justify-between"
            >
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>
                <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[11px] font-mono text-white">
                  {video.duration}
                </div>
                <div className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-[#087BFF]/80 backdrop-blur-md text-[10px] font-mono font-semibold text-white">
                  {video.category}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <h3 className="font-heading font-bold text-white text-base group-hover:text-[#00D9FF] transition-colors line-clamp-2">
                  {video.title}
                </h3>

                <div className="mt-4 pt-3 border-t border-gray-800 flex items-center justify-between text-xs text-gray-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#00D9FF]" />
                    {video.views}
                  </span>
                  <span className="text-[#00E59B]">Watch Free</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Player */}
      {selectedVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-[#0A1224] border border-[#087BFF]/40 rounded-3xl p-4 sm:p-6 space-y-4 relative">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-heading text-white truncate max-w-xl">
                {selectedVideo.title}
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black border border-gray-800">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?autoplay=1`}
                title={selectedVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
