'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'motion/react';
import { Menu, X, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { properties, Property, PropertyType, ListingType } from '../data/properties';
import { PropertyCard, PropertyModal } from '../components/property-gallery';
import { HunterWidget, HunterCommand } from '../components/hunter-widget';

export default function Home() {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isHunterOpen, setIsHunterOpen] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>(properties);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter state
  const [activeFilter, setActiveFilter] = useState<'All' | PropertyType>('All');

  // Refs for scrolling
  const propertiesRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Show Hunter widget a few seconds after loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsHunterOpen(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleCommand = (cmd: HunterCommand) => {
    switch (cmd.type) {
      case 'SCROLL_TO':
        if (cmd.target === 'properties') propertiesRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (cmd.target === 'services' || cmd.target === 'about') servicesRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (cmd.target === 'demo') demoRef.current?.scrollIntoView({ behavior: 'smooth' });
        if (cmd.target === 'contact') contactRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'FILTER':
        let filtered = properties;
        if (cmd.filterType) {
          filtered = filtered.filter(p => p.type === cmd.filterType);
          setActiveFilter(cmd.filterType);
        }
        if (cmd.minBeds) {
          filtered = filtered.filter(p => p.beds >= cmd.minBeds!);
        }
        setFilteredProperties(filtered);
        propertiesRef.current?.scrollIntoView({ behavior: 'smooth' });
        break;
      case 'CLOSE':
        // Handled in widget
        break;
      case 'MUTE':
        // Handled in widget
        break;
    }
  };

  const handleManualFilter = (type: 'All' | PropertyType) => {
    setActiveFilter(type);
    if (type === 'All') {
      setFilteredProperties(properties);
    } else {
      setFilteredProperties(properties.filter(p => p.type === type));
    }
  };

  return (
    <div className="min-h-screen bg-[#F9F7F2] font-sans text-[#1A1A1A] selection:bg-black/10">
      
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-40 bg-[#F9F7F2]/90 backdrop-blur-md border-b border-black/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-serif text-2xl tracking-tight font-semibold italic text-[#1A1A1A]">
            HUNTER <span className="font-light text-[#1A1A1A]/60 text-xl not-italic">Estates</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 text-[11px] uppercase tracking-[0.2em] font-medium text-[#1A1A1A]/60">
            <button onClick={() => propertiesRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1A1A1A] transition-colors">Properties</button>
            <button onClick={() => servicesRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1A1A1A] transition-colors">Services</button>
            <button onClick={() => demoRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1A1A1A] transition-colors">AI Demo</button>
            <button onClick={() => contactRef.current?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#1A1A1A] transition-colors">Contact</button>
            <button className="bg-black text-white px-5 py-2 text-[11px] uppercase tracking-widest hover:bg-[#333] transition-colors rounded-none">
              Client Login
            </button>
          </div>

          <button className="md:hidden p-2 text-[#1A1A1A]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <X/> : <Menu/>}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-neutral-100 p-6 flex flex-col gap-4 shadow-xl">
             <button onClick={() => { setIsMobileMenuOpen(false); propertiesRef.current?.scrollIntoView({ behavior: 'smooth' });}} className="text-left py-2 font-medium">Properties</button>
             <button onClick={() => { setIsMobileMenuOpen(false); servicesRef.current?.scrollIntoView({ behavior: 'smooth' });}} className="text-left py-2 font-medium">Services</button>
             <button onClick={() => { setIsMobileMenuOpen(false); demoRef.current?.scrollIntoView({ behavior: 'smooth' });}} className="text-left py-2 font-medium">AI Demo</button>
             <button onClick={() => { setIsMobileMenuOpen(false); contactRef.current?.scrollIntoView({ behavior: 'smooth' });}} className="text-left py-2 font-medium">Contact</button>
          </div>
        )}
      </nav>

      <main className="pt-20">
        
        {/* Hero Section */}
        <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center px-6 overflow-hidden">
          <div className="absolute inset-0 z-0">
             <Image 
                src="https://picsum.photos/seed/luxuryhousehero/1920/1080"
                alt="Luxury Real Estate"
                fill
                className="object-cover"
                priority
                referrerPolicy="no-referrer"
             />
             <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/30 via-neutral-900/40 to-neutral-900/80" />
          </div>
          
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-serif text-white italic font-semibold tracking-tight mb-6"
            >
              Extraordinary Homes.<br/>Intelligent Guidance.
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-lg md:text-xl text-neutral-200 max-w-2xl mx-auto mb-10 font-sans"
            >
              Discover the world&apos;s most prestigious properties with Hunter, your premium AI Property Guide.
            </motion.p>
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, delay: 0.6 }}
               className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
               <button onClick={() => propertiesRef.current?.scrollIntoView({ behavior: 'smooth' })} className="w-full sm:w-auto bg-white text-[#1A1A1A] px-5 py-3 text-[11px] uppercase tracking-widest hover:bg-neutral-100 transition-colors flex items-center justify-center gap-2">
                 Explore Portfolio
               </button>
               <button onClick={() => setIsHunterOpen(true)} className="w-full sm:w-auto bg-transparent border border-white text-white px-5 py-3 text-[11px] uppercase tracking-widest hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                 Talk to Hunter <Play className="w-4 h-4 fill-current"/>
               </button>
            </motion.div>
          </div>
        </section>

        {/* Live AI Demo Section */}
        <section ref={demoRef} className="py-24 bg-[#FCFBF9] border-y border-black/5 px-6">
           <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                 <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-3 block">Innovation</div>
                 <h2 className="text-3xl md:text-5xl font-serif italic mb-6 leading-tight">Meet Hunter, Your AI Property Guide.</h2>
                 <p className="text-sm opacity-60 leading-relaxed font-light mb-8">
                   Experience the future of real estate discovery. Hunter isn&apos;t a simple chatbot—it&apos;s an intelligent concierge designed to understand your lifestyle needs, filter sophisticated portfolios, and arrange private viewings.
                 </p>
                 
                 <div className="space-y-6 mb-10">
                    <div className="flex items-start gap-4">
                       <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]"/>
                       </div>
                       <div>
                          <h4 className="font-medium">Natural Voice Interaction</h4>
                          <p className="text-sm opacity-60 font-light mt-1">Speak naturally. Say &quot;Show me 3-bedroom penthouses under $5M&quot; and watch the portfolio filter instantly.</p>
                       </div>
                    </div>
                    <div className="flex items-start gap-4">
                       <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center flex-shrink-0 mt-1">
                          <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]"/>
                       </div>
                       <div>
                          <h4 className="font-medium">Contextual Recommendations</h4>
                          <p className="text-sm opacity-60 font-light mt-1">Hunter curates properties based on your unique preferences, from waterfront access to school districts.</p>
                       </div>
                    </div>
                 </div>

                 <button onClick={() => setIsHunterOpen(true)} className="bg-black text-white px-5 py-3 text-[11px] uppercase tracking-widest hover:bg-[#333] transition-colors flex items-center gap-2">
                    Try the Demo Now <ArrowRight className="w-4 h-4"/>
                 </button>
              </div>

              {/* Demo Visual Component */}
              <div className="bg-white p-6 border border-black/5 shadow-sm rounded-sm flex flex-col gap-6 relative">
                 <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-50 rounded-full blur-3xl rounded-full pointer-events-none opacity-50"></div>
                 
                 {/* Fake Chat bubbles for visual */}
                 <div className="flex justify-end">
                    <div className="bg-black text-white p-3 rounded-2xl rounded-tr-none text-xs font-light max-w-[80%]">
                       &quot;I need a 2 bedroom apartment in New York under $4M.&quot;
                    </div>
                 </div>
                 <div className="flex justify-start items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center flex-shrink-0 mb-1">
                      <span className="text-white font-serif text-xs">H</span>
                    </div>
                    <div className="bg-slate-50 text-[#1A1A1A] p-3 text-[11px] font-light leading-relaxed max-w-[80%] border border-black/5 rounded-2xl rounded-tl-none shadow-sm">
                       Certainly. I&apos;ve found 2 exclusive listings matching your criteria. The Astor Luxury Suite offers exceptional Central Park views. Shall I schedule a private viewing?
                    </div>
                 </div>

                 {/* Fake UI Card response inside demo */}
                 <div className="pl-11 pr-4">
                    <div className="bg-white border border-black/5 p-4 rounded-sm flex gap-4 items-center">
                       <div className="w-20 h-20 bg-neutral-200 rounded-none relative overflow-hidden flex-shrink-0">
                          <Image src="https://picsum.photos/seed/p1a/200/200" alt="demo" fill className="object-cover" referrerPolicy="no-referrer" />
                       </div>
                       <div>
                          <div className="font-serif italic font-medium">The Astor Luxury Suite</div>
                          <div className="text-[10px] uppercase tracking-tighter opacity-50 mt-1">Upper East Side, NY</div>
                          <div className="text-sm font-medium mt-2">$3,200,000</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Properties Portfolio */}
        <section ref={propertiesRef} className="py-24 px-6">
           <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
                 <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-3 block">Portfolio</div>
                    <h2 className="text-3xl md:text-5xl font-serif italic mb-6 leading-tight">Exclusive Listings</h2>
                 </div>
                 
                 {/* Filters */}
                 <div className="flex flex-wrap gap-4">
                    {['All', 'House', 'Apartment', 'Villa', 'Bungalow', 'Flat', 'Plot'].map(type => (
                       <button 
                         key={type}
                         onClick={() => handleManualFilter(type as 'All' | PropertyType)}
                         className={`pb-1 text-[11px] uppercase tracking-widest border-b transition-colors ${activeFilter === type ? 'border-black font-semibold' : 'border-transparent opacity-60 hover:opacity-100'}`}
                       >
                         {type}
                       </button>
                    ))}
                 </div>
              </div>

              {filteredProperties.length === 0 ? (
                 <div className="py-20 text-center text-neutral-500">
                    No properties match this criteria. Ask Hunter to refine your search.
                 </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                   {filteredProperties.map(prop => (
                      <PropertyCard key={prop.id} property={prop} onClick={() => setSelectedProperty(prop)} />
                   ))}
                </div>
              )}
           </div>
        </section>

        {/* Services & About */}
        <section ref={servicesRef} className="py-24 bg-[#1A1A1A] text-[#F9F7F2] px-6">
           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
              <div className="md:col-span-1">
                 <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-40 mb-3 block">Our Services</div>
                 <h2 className="text-3xl md:text-5xl font-serif italic mb-6 leading-tight">Elevating the Real Estate Experience.</h2>
                 <p className="text-sm opacity-60 leading-relaxed font-light">
                   We combine deep market expertise with cutting-edge artificial intelligence to provide an unparalleled advisory service for buyers, sellers, and investors.
                 </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-12">
                 <div>
                    <h3 className="text-lg font-serif italic mb-2">Private Brokerage</h3>
                    <p className="text-xs leading-relaxed opacity-60 font-light">Discreet representation for ultra-high-net-worth individuals, ensuring seamless transactions and privacy.</p>
                 </div>
                 <div>
                    <h3 className="text-lg font-serif italic mb-2">AI Market Analysis</h3>
                    <p className="text-xs leading-relaxed opacity-60 font-light">Proprietary algorithms provide predictive modeling on property appreciation and neighborhood dynamics.</p>
                 </div>
                 <div>
                    <h3 className="text-lg font-serif italic mb-2">Global Network</h3>
                    <p className="text-xs leading-relaxed opacity-60 font-light">Access to off-market listings and international buyers through our exclusive global partnerships.</p>
                 </div>
                 <div>
                    <h3 className="text-lg font-serif italic mb-2">Concierge Services</h3>
                    <p className="text-xs leading-relaxed opacity-60 font-light">From interior design consulting to relocation assistance, we manage every detail post-purchase.</p>
                 </div>
              </div>
           </div>
        </section>

        {/* Contact Strip */}
        <section ref={contactRef} className="py-24 bg-[#FCFBF9] px-6 border-t border-black/5 text-center">
           <div className="max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-serif italic mb-6 leading-tight">Ready to find your extraordinary?</h2>
              <p className="text-sm opacity-60 leading-relaxed font-light mb-10">Connect with our senior advisory team or let Hunter schedule a private consultation.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                 <button className="w-full sm:w-auto bg-black text-white px-5 py-3 text-[11px] uppercase tracking-widest hover:bg-[#333] transition-colors rounded-none">
                    Contact an Advisor
                 </button>
                 <button className="w-full sm:w-auto bg-white text-[#1A1A1A] border border-black/5 px-5 py-3 text-[11px] uppercase tracking-widest hover:bg-neutral-50 transition-colors rounded-none flex items-center justify-center gap-2">
                    WhatsApp Us
                 </button>
              </div>
           </div>
        </section>

      </main>

      <footer className="py-12 px-6 border-t border-black/5 text-center text-[10px] uppercase tracking-widest opacity-60">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="font-serif text-xl tracking-tight italic not-uppercase font-semibold">HUNTER Estates</div>
            <div className="not-italic">&copy; {new Date().getFullYear()} Hunter Real Estate. All rights reserved.</div>
         </div>
      </footer>

      {/* Floating Hunter Widget */}
      <HunterWidget isOpen={isHunterOpen} setIsOpen={setIsHunterOpen} onCommand={handleCommand} />

      {/* Modal overlays */}
      {selectedProperty && (
        <PropertyModal property={selectedProperty} onClose={() => setSelectedProperty(null)} />
      )}

    </div>
  );
}
