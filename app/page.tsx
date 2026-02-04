'use client';

import { 
  Menu, X, ArrowRight, ChefHat, Clock, HelpCircle, Plus, 
  ShieldCheck, Smartphone, Utensils, Heart, Star, 
  Calendar, Coffee, MapPin, Check 
} from "lucide-react";
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ProfessionalLandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans text-[#2D2926] selection:bg-[#0090BF] selection:text-white">
      
      {/* --- NAVIGATION: Floating Minimalist --- */}
      <nav className="fixed w-full z-50 pt-6 px-4">
        <div className="max-w-6xl mx-auto bg-white/80 backdrop-blur-md border border-white/40 rounded-full shadow-sm px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
               <div className="bg-[#0090BF] p-1.5 rounded-lg">
                  <Utensils className="w-5 h-5 text-white" />
               </div>
               <h1 className="text-xl font-serif italic font-semibold tracking-tight">
                 Republic<span className="text-[#0090BF] font-sans not-italic">Lunch</span>
               </h1>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium">
              <a href="#process" className="hover:text-[#0090BF] transition">How it Works</a>
              <a href="#menu" className="hover:text-[#0090BF] transition">The Table</a>
              <a href="#faq" className="hover:text-[#0090BF] transition">Questions</a>
              <Link href="/login" className="bg-[#0090BF] text-white px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all active:scale-95">
                Staff Login
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative z-10 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 text-[#0090BF] text-xs font-bold uppercase tracking-widest border border-blue-100">
              <Heart className="w-3 h-3 fill-current" /> Nourishing the Republic Family
            </div>
            <h1 className="text-6xl lg:text-8xl font-serif italic leading-[0.95] tracking-tight">
              A balanced meal, <br />
              <span className="text-[#0090BF] not-italic">served daily.</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed max-w-md font-light">
              Skip the rush and focus on what you do best. We handle the cooking, you handle the banking. 100% subsidized, 100% fresh.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-4">
               <Link href="/login" className="group bg-[#2D2926] text-white px-10 py-5 rounded-full font-bold text-lg flex items-center gap-3 hover:bg-black transition-all">
                 Order My Lunch <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
               </Link>
               <div className="flex -space-x-3 items-center ml-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Staff" />
                    </div>
                  ))}
                  <span className="pl-6 text-sm text-slate-400 italic">500+ staff members on board</span>
               </div>
            </div>
          </div>

          {/* Pinterest Visual Grid */}
          <div className="relative grid grid-cols-12 gap-4 h-[600px]">
            <div className="col-span-7 h-full">
              <img src="https://images.unsplash.com/photo-1543332164-6e82f355badc?q=80&w=1000" 
                className="w-full h-full object-cover rounded-[3rem] shadow-2xl" alt="Fresh salad" />
            </div>
            <div className="col-span-5 space-y-4 h-full">
              <img src="https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800" 
                className="w-full h-2/3 object-cover rounded-[3rem] shadow-xl" alt="Chef cooking" />
              <div className="h-1/3 bg-[#FFB81C] rounded-[3rem] p-8 flex flex-col justify-center">
                <p className="text-[#2D2926] font-serif text-xl italic leading-tight">“The easiest part of my workday.”</p>
                <p className="text-[#2D2926]/60 text-xs font-bold uppercase mt-4 tracking-widest">— Ama, Operations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- PROCESS SECTION: The "3-Step" Professional Look --- */}
      <section id="process" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                icon: <Calendar className="w-8 h-8 text-[#0090BF]" />, 
                title: "View the Menu", 
                desc: "Every Sunday, we release the upcoming week's rotation of local and continental dishes." 
              },
              { 
                icon: <Check className="w-8 h-8 text-[#FFB81C]" />, 
                title: "Claim Your Plate", 
                desc: "Select your favorites before 9:00 AM daily. It takes less than 30 seconds." 
              },
              { 
                icon: <Coffee className="w-8 h-8 text-[#0090BF]" />, 
                title: "Enjoy & Connect", 
                desc: "Pick up your meal at the canteen and enjoy a well-deserved break with your colleagues." 
              }
            ].map((step, i) => (
              <div key={i} className="group p-8 rounded-[2.5rem] bg-[#FDFCF9] border border-transparent hover:border-blue-100 hover:shadow-xl transition-all">
                <div className="mb-6">{step.icon}</div>
                <h3 className="text-2xl font-serif font-bold mb-4">{step.title}</h3>
                <p className="text-slate-500 font-light leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MENU SECTION (Pinterest Masonry) --- */}
      <section id="menu" className="py-24 px-6 bg-[#F7F5F0]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="space-y-4">
              <h2 className="text-5xl font-serif italic">What's on the table?</h2>
              <p className="text-slate-500 italic">Chef-curated meals, balanced for a productive afternoon.</p>
            </div>
            <Link href="/menu" className="text-sm font-bold uppercase tracking-[0.2em] text-[#0090BF] border-b-2 border-[#0090BF] pb-1">
              Full Weekly Rotation
            </Link>
          </div>

          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {/* Card 1 */}
            <div className="break-inside-avoid bg-white p-4 rounded-[2.5rem] shadow-sm group cursor-pointer hover:shadow-2xl transition-all duration-500">
              <div className="rounded-[2rem] overflow-hidden mb-6 aspect-square">
                <img src="https://images.unsplash.com/photo-1594970921223-289524022bf8?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Jollof" />
              </div>
              <div className="px-4 pb-4">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#0090BF] uppercase">Monday Special</span>
                <h3 className="text-2xl font-serif font-bold mt-1">Republic Jollof</h3>
                <p className="text-sm text-slate-400 mt-2 font-light">Char-grilled chicken, golden plantain, and our signature spicy shito.</p>
              </div>
            </div>

            {/* Card 2 - Info Card */}
            <div className="break-inside-avoid bg-[#2D2926] p-10 rounded-[2.5rem] text-white">
               <ChefHat className="w-10 h-10 text-[#FFB81C] mb-6" />
               <h3 className="text-3xl font-serif italic mb-4 leading-tight">Quality is our <br />first ingredient.</h3>
               <p className="opacity-70 font-light leading-relaxed mb-6 text-sm">We partner only with certified kitchens that meet Republic Bank's strict health and safety standards.</p>
               <div className="flex items-center gap-2 text-[#FFB81C] text-xs font-bold uppercase tracking-widest">
                 <ShieldCheck className="w-4 h-4" /> 100% Health Certified
               </div>
            </div>

            {/* Card 3 */}
            <div className="break-inside-avoid bg-white p-4 rounded-[2.5rem] shadow-sm group">
              <div className="rounded-[2rem] overflow-hidden mb-6 aspect-[4/5]">
                <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?q=80&w=800" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt="Salad" />
              </div>
              <div className="px-4 pb-4">
                <span className="text-[10px] font-black tracking-[0.2em] text-[#0090BF] uppercase">Healthy Choice</span>
                <h3 className="text-2xl font-serif font-bold mt-1">Grilled Chicken Salad</h3>
                <p className="text-sm text-slate-400 mt-2 font-light">Fresh greens, avocado slices, and honey mustard dressing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS / VALUES --- */}
      <section className="py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Staff Served Daily", val: "500+" },
            { label: "Food Waste Reduction", val: "94%" },
            { label: "Partner Kitchens", val: "06" },
            { label: "Subsidized Cost", val: "100%" },
          ].map((stat, i) => (
            <div key={i} className="text-center space-y-2">
              <p className="text-4xl font-serif italic font-bold text-[#0090BF]">{stat.val}</p>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="py-24 bg-white px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16 space-y-4">
             <h2 className="text-4xl font-serif italic">Common Questions</h2>
             <p className="text-slate-400 font-light">Everything you need to know about the welfare lunch portal.</p>
          </div>
          <div className="space-y-4">
            {[
              { q: "What is the daily cutoff time?", a: "Orders must be placed or modified before 9:00 AM on the day of service to allow our catering partners to prepare fresh meals." },
              { q: "Is the menu the same for every branch?", a: "Currently, this service is available for staff at the Ebankese Head Office. We are working on expanding to our regional branches soon." },
              { q: "How do I report an issue with my meal?", a: "Quality is our priority. You can use the 'Feedback' tab inside the dashboard to report any concerns directly to the Welfare Dept." }
            ].map((item, idx) => (
              <div key={idx} className="bg-[#FDFCF9] rounded-[2rem] overflow-hidden border border-transparent hover:border-blue-50 transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full flex justify-between items-center p-8 text-left"
                >
                  <span className="text-lg font-medium">{item.q}</span>
                  <div className={`p-2 rounded-full bg-white transition-transform ${openFaq === idx ? 'rotate-45' : ''}`}>
                    <Plus className="w-4 h-4" />
                  </div>
                </button>
                {openFaq === idx && (
                  <div className="px-8 pb-8 text-slate-500 leading-relaxed font-light italic">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PRE-FOOTER CTA --- */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto bg-[#0090BF] rounded-[3.5rem] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
           {/* Decorative background element */}
           <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
           
           <div className="relative z-10 max-w-2xl mx-auto space-y-8">
             <h2 className="text-4xl lg:text-6xl font-serif italic leading-tight">Ready to enjoy your next meal?</h2>
             <p className="text-blue-50/80 text-lg font-light">Join your colleagues and start planning your week today. It’s simple, fast, and exclusive to you.</p>
             <Link href="/login" className="inline-flex items-center gap-3 bg-white text-[#0090BF] px-12 py-5 rounded-full font-bold text-lg hover:bg-[#FFB81C] hover:text-[#2D2926] transition-all hover:scale-105 active:scale-95">
               Log in with Staff ID <ArrowRight className="w-5 h-5" />
             </Link>
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-[#2D2926] text-[#FDFCF9] py-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <h2 className="text-3xl font-serif italic tracking-tight">Republic<span className="text-[#0090BF] not-italic">Lunch</span></h2>
            <p className="text-slate-400 font-light max-w-sm leading-relaxed">
              The official staff welfare application for Republic Bank Ghana. Supporting our team through quality nutrition and seamless technology.
            </p>
            <div className="flex gap-4">
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0090BF] transition cursor-pointer">
                 <Smartphone className="w-5 h-5" />
               </div>
               <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#0090BF] transition cursor-pointer">
                 <HelpCircle className="w-5 h-5" />
               </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#FFB81C]">Navigation</h4>
            <ul className="space-y-4 text-sm font-light text-slate-400">
              <li><a href="#" className="hover:text-white transition">Weekly Menu</a></li>
              <li><a href="#" className="hover:text-white transition">How to Order</a></li>
              <li><a href="#" className="hover:text-white transition">Welfare Policy</a></li>
              <li><a href="#" className="hover:text-white transition">Help Desk</a></li>
            </ul>
          </div>

          <div className="bg-white/5 p-8 rounded-[2rem] border border-white/10 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0090BF] mb-2">Developed by</p>
              <p className="text-xl font-serif italic">Sophian Abdul Rahman</p>
              <p className="text-slate-500 text-xs mt-1">Software Engineer | NSS IT Dept</p>
            </div>
            <div className="mt-8 pt-4 border-t border-white/5 text-[10px] text-slate-500 uppercase tracking-widest flex justify-between">
              <span>© 2026</span>
              <span>Republic Bank GH</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}