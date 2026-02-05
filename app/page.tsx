'use client';

import { Menu, X } from "lucide-react";
import { useState } from 'react';

import DropdownMenu from '@/components/drop-down-menu';
import {
  ArrowRight,
  CheckCircle2,
  ChefHat,
  ClipboardList,
  Clock,
  HelpCircle,
  Plus,
  ShieldCheck,
  Smartphone,
  Utensils,
  UtensilsCrossed
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    // Added scroll-smooth here
    <div className="scroll-smooth min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0090BF] selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <DropdownMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Brand */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div className="relative">
                   <Image
                     src="/images/rb.png"
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
              <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-[#0090BF] transition">Guidelines</a>
              <a href="#menu-preview" className="text-sm font-medium text-slate-600 hover:text-[#0090BF] transition">Weekly Menu</a>
              <a href="#faq" className="text-sm font-medium text-slate-600 hover:text-[#0090BF] transition">Support</a>
            </div>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 bg-[#0090BF] hover:bg-[#007EA8] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-lg"
              >
                Staff Login <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 transition"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/50 border border-blue-200 text-[#0090BF] text-xs font-bold uppercase tracking-wide mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0090BF]"></span>
              </span>
              Internal Access Only
            </div>
            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-6 leading-[1.1]">
              Simplified Lunch <br className="hidden md:block" />
              <span className="text-[#0090BF]">For Every Staff.</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Automating staff welfare for efficiency. Select your weekly subsidized meals 
              seamlessly and help us reduce food waste across our offices.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0090BF] hover:bg-[#007EA8] text-white px-8 py-4 rounded-xl font-bold text-lg transition shadow-xl shadow-blue-900/10">
                Enter Portal
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto max-w-5xl">
            <div className="rounded-2xl bg-white p-2 shadow-2xl border border-slate-200/60">
               <div className="rounded-xl overflow-hidden bg-slate-100 relative aspect-[16/9] md:aspect-[21/9]">
                  <img 
                    src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&q=80&w=2000" 
                    alt="Food Spread" 
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-8">
                     <div className="text-white">
                        <p className="font-bold text-lg">Ebankese Kitchen Specials</p>
                        <p className="text-slate-300 text-sm">Managed by the Welfare Department</p>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: "Onboarded Staff", value: "800+", icon: <CheckCircle2 className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Welfare Subsidy", value: "100%", icon: <ShieldCheck className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Order Accuracy", value: "99%", icon: <Utensils className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Time Saved", value: "Hrs/Wk", icon: <Clock className="w-5 h-5 text-[#FFB81C]" /> },
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

      {/* --- FEATURES --- */}
      {/* Added scroll-mt-20 to prevent header overlap */}
      <section id="how-it-works" className="scroll-mt-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-32">
          
          <div className="text-center max-w-2xl mx-auto">
             <h2 className="text-3xl font-bold text-slate-900">Standardized Meal Reservations</h2>
             <p className="text-slate-500 mt-4 text-lg">Our internal protocol ensures every staff member receives their choice of meal without delays.</p>
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
                Protocol
              </div>
              <h3 className="text-4xl font-extrabold text-[#0090BF] tracking-tight">
                Weekly Pre-Selection.<br />
                <span className="text-slate-900">Automated Logistics.</span>
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                Log in every Sunday to view the upcoming menu. Select your meals for the 
                entire business week to ensure the kitchen captures your preference.
              </p>
            </div>
          </div>

          {/* Block 2 (Reverse) */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 border border-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider rounded-md">
                <Clock className="w-4 h-4" />
                Deadlines
              </div>
              <h3 className="text-4xl font-extrabold text-[#0090BF] tracking-tight">
                9:00 AM Cutoff.<br />
                <span className="text-slate-900">Reduced Food Waste.</span>
              </h3>
              <p className="text-slate-600 text-lg leading-relaxed">
                To maintain operational efficiency, all daily modifications must be completed 
                before the morning cutoff. This allows our vendors to prep with precision.
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
        </div>
      </section>

      {/* --- MENU SNEAK PEEK --- */}
      {/* Added scroll-mt-20 to prevent header overlap */}
      <section id="menu-preview" className="scroll-mt-20 py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
             <div>
               <span className="text-[#FFB81C] font-bold tracking-wider text-sm uppercase">Kitchen Rotation</span>
               <h2 className="text-3xl font-bold text-slate-900 mt-2">Standard Menu Preview</h2>
             </div>
             <Link href="/login" className="text-[#0090BF] font-bold hover:underline flex items-center gap-2">
                Login to book <ArrowRight className="w-4 h-4"/>
             </Link>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
             <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group cursor-default">
               <div className="h-56 overflow-hidden relative">
                 <div className="absolute top-4 left-4 bg-[#FFB81C] text-white text-xs font-bold px-3 py-1 rounded-full z-10">LOCAL SPECIAL</div>
                 <img src="https://images.unsplash.com/photo-1594970921223-289524022bf8?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Jollof" />
               </div>
               <div className="p-6">
                 <h3 className="text-lg font-bold text-slate-900">Republic Jollof</h3>
                 <p className="text-slate-500 text-sm mt-1">Garnished with choice proteins.</p>
               </div>
             </div>

             <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group cursor-default">
               <div className="h-56 overflow-hidden relative">
                 <div className="absolute top-4 left-4 bg-[#0090BF] text-white text-xs font-bold px-3 py-1 rounded-full z-10">CONTINENTAL</div>
                 <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Salad" />
               </div>
               <div className="p-6">
                 <h3 className="text-lg font-bold text-slate-900">Grilled Choice</h3>
                 <p className="text-slate-500 text-sm mt-1">Healthy greens and lean protein.</p>
               </div>
             </div>

             <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 group cursor-default">
               <div className="h-56 overflow-hidden relative">
                 <div className="absolute top-4 left-4 bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full z-10">WEEKEND FAVORITE</div>
                 <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="Banku" />
               </div>
               <div className="p-6">
                 <h3 className="text-lg font-bold text-slate-900">Traditional Banku</h3>
                 <p className="text-slate-500 text-sm mt-1">Freshly served with Tilapia.</p>
               </div>
             </div>
           </div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      {/* Added scroll-mt-20 to prevent header overlap */}
      <section id="faq" className="scroll-mt-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 h-full min-h-[500px] hidden lg:block group">
              <div className="absolute inset-0 bg-gradient-to-t from-[#0090BF]/80 to-transparent z-10 opacity-60"></div>
              <img 
                src="/images/happy-2.jpg" 
                alt="Welfare Support" 
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute bottom-8 left-8 z-20 text-white max-w-xs">
                <div className="bg-[#FFB81C] text-[#0033A1] text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                  Internal Support
                </div>
                <h3 className="text-2xl font-bold mb-2">Need Assistance?</h3>
                <p className="text-blue-50 text-sm">
                  Contact the Welfare Unit via <span className="font-bold text-white">Ext 4050</span> for login issues.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">
                Portal <span className="text-[#0090BF]">Guidelines</span>
              </h2>
              
              <div className="space-y-4">
                {[
                  { q: "Who is eligible for this service?", a: "This portal is strictly for active Republic Bank Ghana staff members. Your Staff ID is required for access." },
                  { q: "How is the subsidy applied?", a: "The subsidy is automatically applied to one meal per day as part of the bank's welfare package. No manual payment is required on the app." },
                  { q: "Can I change my order on the day?", a: "Yes, but only before the 9:00 AM cutoff time. After this, all orders are sent to vendors for final preparation." },
                  { q: "What if I'm working from a different branch?", a: "The system allows you to select your current location for the day to ensure your meal is delivered to the correct office." }
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button 
                      onClick={() => toggleFaq(idx)}
                      className="w-full flex justify-between items-center p-5 text-left bg-slate-50 hover:bg-slate-100 transition group"
                    >
                      <span className="font-bold text-slate-800 group-hover:text-[#0090BF]">{item.q}</span>
                      <Plus className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-45 text-[#0090BF]' : ''}`} />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${openFaq === idx ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
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

      {/* --- CTA SECTION --- */}
      <section className="relative w-full py-24 overflow-hidden bg-slate-900">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#0090BF]/95 to-[#002a85]/90" />
        </div>

        <section className=" bg-white">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl">
      
      {/* Decorative Background Elements */}
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-[#FFB81C] rounded-full mix-blend-multiply filter blur-[100px] opacity-10"></div>

      <div className="relative grid lg:grid-cols-2 items-center">
        
        {/* Left Side: Content */}
        <div className="p-8 md:p-16 lg:p-20 space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#FFB81C]" />
            Secure Staff Access
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Nourishing Our <br />
            <span className="text-[#0090BF]">Republic Family.</span>
          </h2>
          
          <p className="text-blue-100/80 text-lg leading-relaxed max-w-md">
            Your subsidized weekly meal is just a click away. Use your standard Staff ID to access the dashboard and reserve your plate.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/login" 
              className="group flex items-center justify-center gap-3 bg-[#0090BF] hover:bg-white text-white hover:text-[#0090BF] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/20"
            >
              Portal Login
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          <p className="text-xs text-slate-500 font-medium">
            *Orders must be placed before 9:00 AM daily.
          </p>
        </div>

        {/* Right Side: Professional Image with Gradient Overlay */}
        <div className="relative h-64 lg:h-full min-h-[400px] overflow-hidden">
          <img 
            src="/images/happy-9.jpg" 
            alt="Corporate Dining" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle gradient overlay to blend image into the dark card */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:hidden" />
          
          {/* Floating Stat Card */}
          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl hidden sm:block">
            <div className="flex items-center gap-3">
              <div className="bg-[#FFB81C] p-2 rounded-lg">
                <UtensilsCrossed className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Freshly Prepped</p>
                <p className="text-blue-200 text-xs">Daily by Certified Vendors</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</section>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 text-white border-t border-slate-800 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
               <div className="flex items-center gap-2 mb-4">
                  <Image src="/images/rb.png" alt="Logo" width={40} height={40}/>
                  <span className="font-bold text-xl">Republic<span className="text-[#0090BF]">Lunch</span></span>
               </div>
               <p className="text-slate-400 max-w-sm leading-relaxed">
                 Internal Staff Welfare Portal. Dedicated to the health and productivity of the Republic Bank workforce.
               </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Resources</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-[#0090BF]">Welfare Guidelines</a></li>
                <li><a href="#" className="hover:text-[#0090BF]">Kitchen Hygiene Standards</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li className="flex items-center gap-2"><HelpCircle className="w-4 h-4"/> Help Desk Ext: 4050</li>
                <li>welfare@republicghana.com</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs">
              &copy; {new Date().getFullYear()} Republic Bank Ghana. Internal Systems.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
               <span>Developed by</span>
               <span className="text-white font-bold">Sophian Abdul Rahman</span>
               <span className="w-1 h-1 bg-slate-500 rounded-full"></span>
               <span>IT NSS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}