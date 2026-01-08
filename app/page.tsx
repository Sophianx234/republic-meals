'use client';

import React, { useState } from 'react';
import { 
  Utensils, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ArrowRight,
  Smartphone,
  ClipboardList,
  HelpCircle,
  Plus,
  UtensilsCrossed,
  ChefHat
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  // Simple state for FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0090BF] selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                 {/* Placeholder for Logo */}
                 
                   <Image
                     src="/rb.png"
                     alt="RepublicLunch Logo"
                     width={40}
                     height={40}
                   />

              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#0090BF] transition">
                  Republic<span className="text-[#0090BF]">Lunch</span>
                </h1>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">Staff Welfare Portal</span>
              </div>
            </div>

            {/* Desktop Links */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0090BF] transition">How it Works</a>
              <a href="#menu-preview" className="text-sm font-medium text-slate-600 hover:text-[#0090BF] transition">This Week's Menu</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-[#0090BF] transition">FAQ</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden md:flex items-center gap-2 bg-[#0090BF] hover:bg-[#007EA8] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 hover:-translate-y-0.5">
                Staff Login <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION (Corporate Style) --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
        {/* Subtle Grid Background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-[#0090BF] text-xs font-bold uppercase tracking-wide mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0090BF]"></span>
              </span>
              Official Internal Tool
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Fueling the <br className="hidden md:block" />
              <span className="text-[#0090BF]">Republic Workforce.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Skip the queues and uncertainty. Select your subsidized meals for the entire week 
              in under 2 minutes. Designed exclusively for Republic Bank staff.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0090BF] hover:bg-[#007EA8] text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-blue-900/10">
                Access Dashboard
              </Link>
              <a href="#how-it-works" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-8 py-4 rounded-xl font-bold text-lg transition">
                View Menu Rotation
              </a>
            </div>
          </div>

          {/* Hero Visual - Dashboard Preview */}
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-2xl bg-white p-2 shadow-2xl border border-slate-200/60">
               <div className="rounded-xl overflow-hidden bg-slate-100 relative aspect-[16/9] md:aspect-[21/9]">
                  {/* Abstract Representation of the App Interface */}
                  <img 
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2000" 
                    alt="Food Spread" 
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                     <div className="text-white">
                        <p className="font-bold text-lg">Weekly Menu: Week 42</p>
                        <p className="text-slate-300 text-sm">Featuring: Jollof Special, Banku & Tilapia</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS / TRUST BAR --- */}
      <div className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Active Users", value: "500+", icon: <CheckCircle2 className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Subsidized Cost", value: "100%", icon: <ShieldCheck className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Daily Orders", value: "350+", icon: <Utensils className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Waste Reduction", value: "98%", icon: <Clock className="w-5 h-5 text-[#FFB81C]" /> },
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-3xl">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  {stat.icon}
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* --- FEATURES (The Standard Z-Layout) --- */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold text-slate-900">Designed for Banking Professionals</h2>
             <p className="text-slate-500 mt-4 text-lg">We've optimized the process to respect your time and ensure you get exactly what you want.</p>
          </div>

          {/* Block 1 */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-50 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=1200&q=80"
                alt="Planning"
                className="rounded-lg shadow-xl border border-slate-100 h-[400px] w-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-[#0090BF] text-xs font-bold uppercase tracking-wider rounded-md">
                <ClipboardList className="w-4 h-4" />
                Efficiency
              </div>
              <h3 className="text-4xl font-extrabold text-[#0090BF] tracking-tight">
                Plan Your Week.<br />
                <span className="text-slate-900">Eliminate the Queue.</span>
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                RepublicLunch allows staff to view the complete weekly menu in advance. 
                Make meal selections for all working days at once to remove daily uncertainty.
              </p>
            </div>
          </div>

          {/* Block 2 (Reverse) */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-md">
                <Clock className="w-4 h-4" />
                Flexibility
              </div>
              <h3 className="text-4xl font-extrabold text-[#0090BF] tracking-tight">
                Plans Changed?<br />
                <span className="text-slate-900">Adjust on the Fly.</span>
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Banking schedules are dynamic. Meal selections can be modified 
                before <strong className="text-slate-900 bg-orange-100 px-1 rounded">9:00 AM</strong> on the day of service, giving you flexibility while allowing the kitchen to plan.
              </p>
            </div>
            <div className="relative group order-1 lg:order-2">
              <div className="absolute -inset-4 bg-orange-50 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=1200&q=80"
                alt="Flexibility"
                className="rounded-lg shadow-xl border border-slate-100 h-[400px] w-full object-cover"
              />
            </div>
          </div>

           {/* Block 3 */}
           <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-blue-50 rounded-xl -z-10 opacity-0 group-hover:opacity-100 transition duration-500"></div>
              <img
                src="https://images.unsplash.com/photo-1512428559087-560fa5ce7d02?auto=format&fit=crop&w=1200&q=80"
                alt="Mobile"
                className="rounded-lg shadow-xl border border-slate-100 h-[400px] w-full object-cover"
              />
            </div>
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-100 text-[#0090BF] text-xs font-bold uppercase tracking-wider rounded-md">
                <Smartphone className="w-4 h-4" />
                Accessibility
              </div>
              <h3 className="text-4xl font-extrabold text-[#0090BF] tracking-tight">
                From Your Desk<br />
                <span className="text-slate-900">Or On The Go.</span>
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Whether you are at your workstation at the Ebankese Head Office or on mobile while 
                commuting to a branch, RepublicLunch is optimized for speed and clarity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- MENU SNEAK PEEK (Visual Only) --- */}
      <section id="menu-preview" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <span className="text-[#FFB81C] font-bold tracking-wider text-sm uppercase">Weekly Rotation</span>
                <h2 className="text-3xl font-bold text-slate-900 mt-2">What's Cooking This Week?</h2>
              </div>
              <Link href="/login" className="text-[#0090BF] font-bold hover:underline flex items-center gap-2">
                 Log in to reserve your plate <ArrowRight className="w-4 h-4"/>
              </Link>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
             {/* Card 1 */}
             <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group cursor-default">
               <div className="h-56 overflow-hidden relative">
                 <div className="absolute top-4 left-4 bg-[#FFB81C] text-white text-xs font-bold px-3 py-1 rounded-full z-10">MONDAY SPECIAL</div>
                 <img src="https://images.unsplash.com/photo-1594970921223-289524022bf8?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Jollof" />
               </div>
               <div className="p-6">
                 <h3 className="text-lg font-bold text-slate-900">Republic Jollof</h3>
                 <p className="text-slate-500 text-sm mt-1">With grilled chicken & plantain.</p>
               </div>
             </div>

             {/* Card 2 */}
             <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group cursor-default">
               <div className="h-56 overflow-hidden relative">
                 <div className="absolute top-4 left-4 bg-[#0090BF] text-white text-xs font-bold px-3 py-1 rounded-full z-10">HEALTHY CHOICE</div>
                 <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Salad" />
               </div>
               <div className="p-6">
                 <h3 className="text-lg font-bold text-slate-900">Grilled Chicken Salad</h3>
                 <p className="text-slate-500 text-sm mt-1">Fresh garden greens & vinaigrette.</p>
               </div>
             </div>

             {/* Card 3 */}
             <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group cursor-default">
               <div className="h-56 overflow-hidden relative">
                 <div className="absolute top-4 left-4 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full z-10">FRIDAY FAVORITE</div>
                 <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" alt="Banku" />
               </div>
               <div className="p-6">
                 <h3 className="text-lg font-bold text-slate-900">Banku & Tilapia</h3>
                 <p className="text-slate-500 text-sm mt-1">Served with hot pepper & onions.</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            {/* Left Side: Image */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 h-full min-h-[500px] hidden lg:block group">
              {/* Overlay Gradient for text readability if needed */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0090BF]/80 to-transparent z-10 opacity-60"></div>
              
              <img 
                src="/happy-2.jpg" 
                alt="Fresh Ingredients" 
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
              
              <div className="absolute bottom-8 left-8 z-20 text-white max-w-xs">
                <div className="bg-[#FFB81C] text-[#0033A1] text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                  Support
                </div>
                <h3 className="text-2xl font-bold mb-2">Have more questions?</h3>
                <p className="text-blue-50 text-sm">
                  Contact the Welfare Department directly on <span className="font-bold text-white">Ext 4050</span>.
                </p>
              </div>
            </div>

            {/* Right Side: FAQ Content */}
            <div className="pt-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                Frequently Asked <br />
                <span className="text-[#0090BF]">Questions</span>
              </h2>
              <p className="text-slate-500 mb-10 text-lg">
                Everything you need to know about the new lunch reservation system.
              </p>
              
              <div className="space-y-4">
                {[
                  { q: "Is the food really free?", a: "Yes. The Republic Bank Welfare Department subsidizes 100% of the cost for one meal per staff member per working day." },
                  { q: "What happens if I miss the 9:00 AM cutoff?", a: "To ensure our kitchen partners have accurate numbers and reduce waste, orders lock at 9:00 AM sharp. You will not be able to place or change an order after this time." },
                  { q: "Can I order for the whole week at once?", a: "Absolutely. In fact, we encourage it. The menu for the upcoming week is released every Sunday evening." },
                  { q: "I have a food allergy. Where can I see ingredients?", a: "Clicking on any menu item in the dashboard reveals a detailed description including common allergens." }
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center p-5 text-left bg-slate-50 hover:bg-slate-100 transition group"
                    >
                      <span className="font-bold text-slate-800 group-hover:text-[#0090BF] transition-colors">{item.q}</span>
                      {/* Note: Ensure 'Plus' is imported from lucide-react */}
                      <Plus className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === idx ? 'rotate-45 text-[#0090BF]' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="p-5 pt-0">
                        <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      <section className="relative w-full py-24 lg:py-32 overflow-hidden bg-slate-900">
      
      {/* --- BACKGROUND LAYER --- */}
      {/* We use a high-quality image of a corporate/social setting to imply community. 
          The overlay ensures text contrast is always AA accessible. */}
      <div className="absolute inset-0 z-0">
        <image
          src="happy-1.jpg"
          alt="Republic Bank Staff Dining"
          
          className="object-cover opacity-40"
          priority
        />
        {/* The Republic Blue Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0090BF]/95 to-[#002a85]/90 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Left Column: Typography & Value Props */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white/90 text-sm font-medium">
              <ChefHat className="w-4 h-4 text-[#FFB81C]" />
              <span>Premium Staff Welfare</span>
            </div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              Lunch is served. <br />
              <span className="text-blue-200">Are you on the list?</span>
            </h2>

            <p className="text-lg md:text-xl text-blue-50/90 max-w-lg leading-relaxed font-light">
              Join your colleagues in the new digital cafeteria. Experience the convenience of planning your weekly nutrition with zero friction.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <Clock className="w-5 h-5 text-[#FFB81C]" />
                </div>
                <span className="text-sm font-medium">Book in seconds</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                  <UtensilsCrossed className="w-5 h-5 text-[#FFB81C]" />
                </div>
                <span className="text-sm font-medium">Curated Local & Continental</span>
              </div>
            </div>
            
            <div className="pt-4">
              <Link 
                href="/login" 
                className="group relative inline-flex items-center justify-center gap-3 bg-white text-[#0090BF] px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 hover:bg-[#FFB81C] hover:text-[#002a85] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:-translate-y-1"
              >
                <span>Log in with Staff ID</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="mt-4 text-sm text-blue-200/60 font-medium">
                Protected by Republic Bank Internal Systems
              </p>
            </div>
          </div>

          {/* Right Column: Visual Element / Glass Card */}
          {/* This represents the "System" - clean, organized, secure */}
          <div className="hidden lg:block relative">
            {/* Decorative background blur circle */}
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#FFB81C] rounded-full mix-blend-overlay filter blur-[100px] opacity-20 animate-pulse"></div>

            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                 <div>
                    <h3 className="text-white font-bold text-xl">My Reservation</h3>
                    <p className="text-blue-200 text-sm">Upcoming Week</p>
                 </div>
                 <ShieldCheck className="w-8 h-8 text-[#FFB81C]" />
              </div>

              <div className="space-y-4">
                 {/* Mock UI Item 1 */}
                 <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-white font-bold text-xs">MON</div>
                    <div className="flex-1">
                        <div className="h-2 w-24 bg-white/40 rounded-full mb-2"></div>
                        <div className="h-2 w-16 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="h-6 w-6 rounded-full border-2 border-[#FFB81C] bg-[#FFB81C] flex items-center justify-center">
                        <div className="w-2 h-2 bg-[#002a85] rounded-full"></div>
                    </div>
                 </div>
                 {/* Mock UI Item 2 */}
                 <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-white font-bold text-xs">TUE</div>
                    <div className="flex-1">
                        <div className="h-2 w-32 bg-white/40 rounded-full mb-2"></div>
                        <div className="h-2 w-20 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="h-6 w-6 rounded-full border-2 border-white/30"></div>
                 </div>
                 {/* Mock UI Item 3 */}
                 <div className="flex items-center gap-4 p-3 rounded-xl bg-white/5 border border-white/5 opacity-50">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-white font-bold text-xs">WED</div>
                    <div className="flex-1">
                        <div className="h-2 w-20 bg-white/40 rounded-full mb-2"></div>
                        <div className="h-2 w-12 bg-white/20 rounded-full"></div>
                    </div>
                    <div className="h-6 w-6 rounded-full border-2 border-white/30"></div>
                 </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 text-center">
                 <p className="text-xs text-blue-200 tracking-widest uppercase font-semibold">100% Subsidized by Welfare</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-4">
                  <Image
                     src="/rb.png"
                     alt="RepublicLunch Logo"
                     width={40}
                     height={40}
                   />
                 <span className="font-bold text-xl">Republic<span className="text-[#0090BF]">Lunch</span></span>
               </div>
               <p className="text-slate-400 max-w-sm leading-relaxed">
                 The official staff welfare application for Republic Bank Ghana. 
                 Dedicated to nourishing the people who serve our nation.
               </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-[#0090BF]">Weekly Menu</a></li>
                <li><a href="#" className="hover:text-[#0090BF]">Welfare Policy</a></li>
                <li><a href="#" className="hover:text-[#0090BF]">Report Issue</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Internal Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Help Desk Ext: 4050</li>
                <li>support@republic.gh</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} Republic Bank Ghana. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
               <span>Developed by</span>
               <span className="text-white font-bold">Sophian Abdul Rahman</span>
               <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
               <span>NSS IT Dept</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}