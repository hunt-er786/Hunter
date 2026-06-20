'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { MapPin, Bed, Bath, Square, X, Calendar, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Property, properties } from '../data/properties';
import { motion, AnimatePresence } from 'motion/react';

export function PropertyCard({ property, onClick }: { property: Property; onClick: () => void }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group cursor-pointer flex flex-col"
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-[#FCFBF9] border border-black/5 overflow-hidden mb-4 relative">
        <Image
          src={property.images[0]}
          alt={property.title}
          fill
          className="object-cover mix-blend-multiply opacity-90 transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 text-[9px] uppercase tracking-widest text-[#1A1A1A]">
          {property.listingType} {property.status !== 'Available' ? `• ${property.status}` : ''}
        </div>
      </div>
      <div className="flex justify-between items-start pt-1">
        <div className="space-y-1">
          <h3 className="text-lg font-serif italic font-medium text-[#1A1A1A]">{property.title}</h3>
          <p className="text-[10px] uppercase tracking-tighter opacity-50 text-[#1A1A1A]">
            {property.location.split(',')[0]} • {property.beds} Bed • {property.baths} Bath • {property.area.toLocaleString()} sqft
          </p>
        </div>
        <span className="text-sm font-medium text-[#1A1A1A] whitespace-nowrap ml-4">
          ${property.price.toLocaleString()}
          {property.listingType === 'Rent' && <span className="text-[10px] uppercase tracking-widest opacity-60"> /mo</span>}
        </span>
      </div>
    </motion.div>
  );
}

export function PropertyModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => setCurrentImageIndex((p) => (p + 1) % property.images.length);
  const prevImage = () => setCurrentImageIndex((p) => (p - 1 + property.images.length) % property.images.length);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm sm:p-6"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-sm shadow-2xl ring-1 ring-black/5 w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 sm:p-6 border-b border-black/5 shrink-0">
            <div>
              <h2 className="text-2xl font-serif italic text-[#1A1A1A]">{property.title}</h2>
              <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold flex items-center mt-1">
                <MapPin className="w-3 h-3 mr-1" /> {property.location}
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-100 transition-colors">
              <X className="w-6 h-6 opacity-60" />
            </button>
          </div>

          <div className="overflow-y-auto overflow-x-hidden flex-grow p-4 sm:p-6 relative text-[#1A1A1A]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Images and Details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Image Gallery */}
                <div className="relative h-[400px] w-full border border-black/5 overflow-hidden group">
                  <Image
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    fill
                    className="object-cover transition-opacity duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {property.images.length > 1 && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-neutral-800">
                        <ChevronLeft className="w-6 h-6" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-neutral-800">
                        <ChevronRight className="w-6 h-6" />
                      </button>
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {property.images.map((_, idx) => (
                          <div key={idx} className={`w-2 h-2 rounded-full ${idx === currentImageIndex ? 'bg-white' : 'bg-white/50'}`} />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="flex flex-wrap gap-8 py-6 border-y border-black/5">
                  {property.beds > 0 && (
                    <div className="flex flex-col">
                      <span className="text-[10px] opacity-40 mb-1 uppercase tracking-[0.2em] font-bold">Bedrooms</span>
                      <span className="text-2xl font-serif italic text-[#1A1A1A] flex items-center gap-2"><Bed className="w-5 h-5 text-[#1A1A1A] opacity-40"/> {property.beds}</span>
                    </div>
                  )}
                  {property.baths > 0 && (
                    <div className="flex flex-col">
                      <span className="text-[10px] opacity-40 mb-1 uppercase tracking-[0.2em] font-bold">Bathrooms</span>
                      <span className="text-2xl font-serif italic text-[#1A1A1A] flex items-center gap-2"><Bath className="w-5 h-5 text-[#1A1A1A] opacity-40"/> {property.baths}</span>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <span className="text-[10px] opacity-40 mb-1 uppercase tracking-[0.2em] font-bold">Area</span>
                    <span className="text-2xl font-serif italic text-[#1A1A1A] flex items-center gap-2"><Square className="w-5 h-5 text-[#1A1A1A] opacity-40"/> {property.area.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] opacity-40 mb-1 uppercase tracking-[0.2em] font-bold">Type</span>
                    <span className="text-xl font-serif italic text-[#1A1A1A] pt-1">{property.type}</span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h3 className="text-lg font-serif italic mb-4">About this property</h3>
                  <p className="text-sm opacity-60 leading-relaxed font-light">{property.description}</p>
                </div>

                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-serif italic mb-4">Amenities</h3>
                  <ul className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {property.amenities.map((amenity, idx) => (
                      <li key={idx} className="flex items-center text-sm opacity-60 font-light">
                        <span className="w-1 h-1 rounded-full bg-[#1A1A1A] mr-3"></span>
                        {amenity}
                      </li>
                    ))}
                  </ul>
                </div>

                 {/* Neighborhood Highlight */}
                 <div>
                  <h3 className="text-lg font-serif italic mb-4">Neighborhood Highlights</h3>
                  <ul className="grid grid-cols-2 gap-y-3 gap-x-6">
                    {property.neighborhoodHighlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-center text-sm opacity-60 font-light">
                        <span className="w-1 h-1 rounded-full bg-[#1A1A1A] mr-3"></span>
                        {highlight}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Right Column: CTA and Agent */}
              <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-black/5 lg:pl-8 pt-8 lg:pt-0 space-y-8">
                
                {/* Price Block */}
                <div className="bg-[#FCFBF9] p-6 border border-black/5">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-2 block">{property.listingType}</div>
                  <div className="text-4xl font-serif italic text-[#1A1A1A] mb-6 whitespace-nowrap">
                     ${property.price.toLocaleString()}
                     {property.listingType === 'Rent' && <span className="text-lg text-[#1A1A1A] opacity-60 not-italic">/mo</span>}
                  </div>
                  
                  <div className="space-y-4">
                    <button className="w-full bg-black text-white px-5 py-3 text-[11px] uppercase tracking-widest hover:bg-[#333] transition-colors rounded-none flex items-center justify-center gap-2">
                       <Calendar className="w-4 h-4"/> Schedule a Visit
                    </button>
                    <button className="w-full bg-white border border-black/10 text-[11px] uppercase tracking-widest text-[#1A1A1A] rounded-none py-3 px-5 hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2">
                       <MessageCircle className="w-4 h-4"/> WhatsApp Inquiry
                    </button>
                  </div>
                </div>

                {/* Agent Block */}
                <div>
                  <h3 className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-4 block">Listed Exclusively By</h3>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-neutral-200 overflow-hidden relative border border-black/5">
                      <Image src={`https://picsum.photos/seed/${property.agentName.replace(' ', '')}/100/100`} alt={property.agentName} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <div className="font-serif italic text-lg">{property.agentName}</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold mt-1">Senior Real Estate Advisor</div>
                    </div>
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
