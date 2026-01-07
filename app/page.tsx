'use client';

import React, { useState } from 'react';
import { Utensils, Calendar, CheckCircle2, User, Menu, ChevronRight, AlertCircle } from 'lucide-react';

const LandingPage = () => {
  const [activeDay, setActiveDay] = useState('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* --- NAVIGATION --- */}
      <nav className="fixed w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo Area */}
            <div className="flex items-center gap-3">
              <div className="bg-[#0090BF] p-2 rounded-lg shadow-md">
                <Utensils className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#0090BF] tracking-tight">Republic<span className="text-[#FFB81C]">Lunch</span></h1>
                <p className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">Staff Welfare Portal</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#weekly-menu" className="text-gray-600 hover:text-[#0090BF] font-medium transition">Weekly Menu</a>
              <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-bold text-[#0090BF]">Welcome, Staff Member</p>
                  <p className="text-xs text-green-600">Quota Available</p>
                </div>
                <div className="bg-gray-100 p-2 rounded-full">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>

            {/* Mobile Menu Icon */}
            <div className="md:hidden">
              <Menu className="w-8 h-8 text-[#0090BF]" />
            </div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-16 lg:pt-48 lg:pb-24 overflow-hidden">
        {/* Background shapes */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-white -z-10"></div>
        <div className="absolute right-0 top-20 w-1/3 h-full bg-[#E6EFFC] rounded-l-full opacity-50 -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#E3F2FD] text-[#0090BF] rounded-full text-sm font-bold">
                <CheckCircle2 className="w-4 h-4" />
                Lunch is on us today
              </div>
              <h1 className="text-5xl lg:text-6xl font-extrabold text-[#0090BF] leading-tight">
                Fueling Your Day,<br/>
                <span className="text-[#FFB81C]">The Republic Way.</span>
              </h1>
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                A streamlined lunch reservation system for Republic Bank staff. 
                Select your meals for the week effortlessly. No payments, no hassle.
              </p>
              
              <div className="pt-4">
                <a href="#weekly-menu" className="inline-flex bg-[#0090BF] text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-[#002a85] hover:shadow-blue-200/50 transition items-center gap-2">
                  Reserve Your Lunch <ChevronRight className="w-5 h-5" />
                </a>
              </div>
              
              <div className="pt-6 border-t border-gray-200 mt-6">
                <p className="text-sm text-gray-500 font-medium">Developed internally to enhance staff welfare.</p>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Healthy Lunch" 
                className="rounded-3xl shadow-2xl border-8 border-white w-full object-cover h-[400px]"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 max-w-xs hidden sm:block">
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">100% Subsidized</h4>
                    <p className="text-xs text-gray-500">Costs absorbed by Human Resources/Welfare Dept.</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- WEEKLY MENU SELECTOR --- */}
      <section id="weekly-menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#0090BF]">This Week's Rotation</h2>
            <p className="text-gray-600 mt-2">Select a day to reserve your preferred meal option.</p>
          </div>

          {/* Day Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setActiveDay(day)}
                className={`px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  activeDay === day 
                    ? 'bg-[#0090BF] text-white shadow-lg scale-105' 
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Menu Cards Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Option 1: Local */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 group ring-1 ring-gray-100">
              <div className="h-56 overflow-hidden relative">
                 <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#0090BF] text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                  Option A
                </div>
                <img src="https://images.unsplash.com/photo-1594970921223-289524022bf8?auto=format&fit=crop&q=80&w=800" alt="Jollof" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">Republic Jollof Special</h3>
                </div>
                <p className="text-gray-500 text-sm mb-6">Served with grilled chicken, coleslaw, and fried plantain.</p>
                
                <button className="w-full py-3 bg-gray-50 hover:bg-[#0090BF] text-[#0090BF] hover:text-white rounded-xl font-bold transition border border-[#0090BF]">
                  Reserve for {activeDay}
                </button>
              </div>
            </div>

            {/* Option 2: Continental */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 group ring-1 ring-gray-100">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#0090BF] text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                  Option B
                </div>
                <img src="https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800" alt="Salad" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">Grilled Chicken Salad</h3>
                </div>
                <p className="text-gray-500 text-sm mb-6">Fresh garden salad with vinaigrette dressing and croutons.</p>
                
                <button className="w-full py-3 bg-gray-50 hover:bg-[#0090BF] text-[#0090BF] hover:text-white rounded-xl font-bold transition border border-[#0090BF]">
                  Reserve for {activeDay}
                </button>
              </div>
            </div>

            {/* Option 3: Local 2 */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-xl transition duration-300 group ring-1 ring-gray-100">
              <div className="h-56 overflow-hidden relative">
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur text-[#0090BF] text-xs font-bold px-3 py-1 rounded-full z-10 shadow-sm">
                  Option C
                </div>
                <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800" alt="Banku" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-slate-800">Banku & Tilapia</h3>
                </div>
                <p className="text-gray-500 text-sm mb-6">With hot pepper and diced onions. A friday favorite.</p>
                
                <button className="w-full py-3 bg-gray-50 hover:bg-[#0090BF] text-[#0090BF] hover:text-white rounded-xl font-bold transition border border-[#0090BF]">
                  Reserve for {activeDay}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 bg-blue-50 py-3 px-6 rounded-full w-fit mx-auto">
             <AlertCircle className="w-4 h-4 text-[#0090BF]" />
             <span>Orders for the week close on <strong>Monday at 10:00 AM</strong>.</span>
          </div>

        </div>
      </section>

      {/* --- FOOTER / CREDIT --- */}
      <footer className="bg-[#0090BF] text-white py-12 border-t border-blue-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">Republic<span className="text-[#FFB81C]">Lunch</span></h2>
            <p className="text-blue-200 text-sm mt-1">Staff Welfare Initiative.</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm text-blue-200">
              Developed & Maintained by <span className="text-white font-bold">Sophian Abdul Rahman</span>
            </p>
            <p className="text-xs text-blue-300 mt-1 opacity-75">
               IT Department • National Service Personnel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;