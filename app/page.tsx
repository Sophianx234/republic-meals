'use client';

import { Menu, X, Zap } from "lucide-react";
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
  , Flame, Leaf, Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Professional Animation Variants


// Map icons to tags for a professional touch
const getTagIcon = (tag: string) => {
  if (tag.includes('LOCAL')) return <Flame className="w-3 h-3" />;
  if (tag.includes('CONTINENTAL')) return <Leaf className="w-3 h-3" />;
  return <Star className="w-3 h-3" />;
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// Parent container variants to stagger the text and buttons
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Item variants for the text elements
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  },
};

const steps = [
  {
    step: "01",
    title: "Menu Intelligence",
    description:
      "Staff access a rotating menu system engineered around availability, nutrition balance, and cost efficiency.",
    icon: ClipboardList,
  },
  {
    step: "02",
    title: "Cut-Off Enforcement",
    description:
      "Orders lock automatically at 9:00 AM daily, enabling predictable prep cycles and zero operational drift.",
    icon: Clock,
  },
  {
    step: "03",
    title: "Secure Fulfilment",
    description:
      "Meals are prepared and distributed under a controlled, auditable workflow across all branches.",
    icon: ShieldCheck,
  },
];

const fade = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
  viewport: { once: true },
};

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="scroll-smooth min-h-screen bg-white font-sans text-slate-900 selection:bg-[#0090BF] selection:text-white">
      
      {/* --- NAVIGATION --- */}
      <DropdownMenu mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3 group cursor-pointer"
            >
              <div className="relative">
                <Image src="/images/rb.png" alt="RepublicLunch Logo" width={40} height={40} />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight leading-none group-hover:text-[#0090BF] transition">
                  Republic<span className="text-[#0090BF]">Lunch</span>
                </h1>
                <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mt-0.5">Staff Welfare Portal</span>
              </div>
            </motion.div>

            <div className="hidden md:flex items-center gap-8">
              {['Guidelines', 'Weekly Menu', 'Support'].map((item, i) => (
                <motion.a 
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                  className="text-sm font-medium text-slate-600 hover:text-[#0090BF] transition"
                >
                  {item}
                </motion.a>
              ))}
            </div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <Link
                href="/login"
                className="hidden md:flex items-center gap-2 bg-[#0090BF] hover:bg-[#007EA8] text-white px-5 py-2.5 rounded-lg font-bold text-sm transition shadow-lg"
              >
                Staff Login <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="md:hidden inline-flex items-center justify-center rounded-lg border border-slate-200 p-2 text-slate-700 hover:bg-slate-100 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f8fafc] via-white to-[#eef6fb]">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#0090BF]/20 blur-3xl" 
        />
        
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-36 pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            <motion.div 
              initial="initial"
              animate="animate"
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur border border-slate-200 text-xs font-semibold tracking-wide text-[#0090BF] mb-6">
                <span className="w-2 h-2 rounded-full bg-[#0090BF] animate-pulse" />
                Internal Staff Platform
              </motion.div>

              <motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.05] mb-6">
                Lunch, <br />
                <span className="text-[#0090BF]">organized.</span>
                <br />
                <span className="text-slate-400 font-bold">Effortless.</span>
              </motion.h1>

              <motion.p variants={fadeInUp} className="max-w-xl text-lg text-slate-600 leading-relaxed mb-10">
                A smarter way to manage staff meals. Choose weekly subsidized lunches, streamline welfare operations, and cut food waste — all from one portal.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-[#0090BF] px-8 py-4 text-white font-semibold text-lg shadow-xl shadow-blue-900/15 hover:bg-[#007EA8] transition active:scale-95"
                >
                  Enter Portal
                </Link>
                <span className="text-sm text-slate-400">Secure • Internal Use Only</span>
              </motion.div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/60">
                <img src="/images/food-11.jpg" alt="Staff Lunch" className="w-full h-[420px] object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="font-semibold text-lg">Today’s Kitchen Selection</p>
                  <p className="text-sm text-slate-200">Welfare Department • Ebankese Kitchen</p>
                </div>
              </div>

              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="absolute -bottom-10 -left-10 bg-white/80 backdrop-blur-lg border border-slate-200 rounded-2xl shadow-xl p-5 w-64"
              >
                <p className="text-sm font-semibold text-slate-900 mb-1">Weekly Meal Cycle</p>
                <p className="text-xs text-slate-500 mb-3">Pre-selected & subsidized</p>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "75%" }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className="h-full bg-[#0090BF]" 
                  />
                </div>
                <p className="mt-2 text-xs text-slate-400">75% meals confirmed</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- STATS BAR --- */}
      <div className="border-y border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "Onboarded Staff", value: "800+", icon: <CheckCircle2 className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Welfare Subsidy", value: "100%", icon: <ShieldCheck className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Order Accuracy", value: "99%", icon: <Utensils className="w-5 h-5 text-[#FFB81C]" /> },
              { label: "Time Saved", value: "Hrs/Wk", icon: <Clock className="w-5 h-5 text-[#FFB81C]" /> },
            ].map((stat, idx) => (
              <motion.div key={idx} variants={fadeInUp} className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="flex items-center gap-2 text-slate-900 font-extrabold text-3xl">{stat.value}</div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                  {stat.icon}
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- FEATURES --- */}
      <section
      id="how-it-works"
      className="relative py-40 bg-gradient-to-b from-white to-[#F8FAFC]"
    >
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div {...fade} className="max-w-3xl mb-24">
          <span className="text-xs font-black tracking-[0.25em] uppercase text-[#0090BF]">
            How It Works
          </span>
          <h2 className="mt-6 text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">
            A predictable system.
            <br />
            <span className="text-slate-400">
              Designed for operational calm.
            </span>
          </h2>
          <p className="mt-6 text-lg text-slate-500 leading-relaxed">
            We replaced guesswork with structure — a controlled flow that keeps
            kitchens fast and teams fed without friction.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative space-y-20">
          {/* Vertical Line */}
          <div className="absolute left-5 top-0 h-full w-px bg-slate-200 hidden sm:block" />

          {steps.map((item, index) => (
            <motion.div
              key={item.step}
              {...fade}
              transition={{ delay: index * 0.15 }}
              className="relative flex gap-8"
            >
              {/* Step Indicator */}
              <div className="relative z-10 flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-[#0090BF] text-white flex items-center justify-center font-bold">
                  {item.step}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 grid gap-4">
                <div className="flex items-center gap-3 text-[#0090BF]">
                  <item.icon className="w-5 h-5" />
                  <h3 className="text-2xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                </div>
                <p className="text-slate-500 text-lg leading-relaxed max-w-xl">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Highlights */}
        <motion.div
          {...fade}
          className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-slate-200 pt-16"
        >
          {[
            {
              icon: Zap,
              title: "Real-Time Sync",
              desc: "Live kitchen availability updates across locations.",
            },
            {
              icon: ShieldCheck,
              title: "Enterprise Security",
              desc: "SSO-based access control with audit visibility.",
            },
            {
              icon: ArrowRight,
              title: "Location Agnostic",
              desc: "Employees move freely between branches.",
            },
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <item.icon className="w-6 h-6 text-[#0090BF]" />
              <h4 className="font-bold text-slate-900 text-lg">
                {item.title}
              </h4>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>

      {/* --- MENU SNEAK PEEK --- */}
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

          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              { title: "Republic Jollof", sub: "Garnished with choice proteins.", img: "https://images.unsplash.com/photo-1594970921223-289524022bf8?auto=format&fit=crop&q=80&w=800", tag: "LOCAL SPECIAL", color: "bg-[#FFB81C]" },
              { title: "Grilled Choice", sub: "Healthy greens and lean protein.", img: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&q=80&w=800", tag: "CONTINENTAL", color: "bg-[#0090BF]" },
              { title: "Traditional Banku", sub: "Freshly served with Tilapia.", img: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=800", tag: "WEEKEND FAVORITE", color: "bg-slate-800" },
            ].map((item, idx) => (
             <motion.div 
  key={idx} 
  variants={fadeInUp} 
  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
>
  {/* Image Container */}
  <div className="h-60 overflow-hidden relative">
    {/* Dynamic Tag with Icon */}
    <div className={`absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 rounded-full z-20 flex items-center gap-1.5 backdrop-blur-md shadow-lg ${item.color} border border-white/20`}>
      {getTagIcon(item.tag)}
      {item.tag}
    </div>

    {/* Hover Overlay - Professional "Hook" */}
    <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/20 transition-colors duration-500 z-10 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 flex items-center gap-2 text-[#0090BF] font-bold text-xs shadow-xl">
           Reserve Spot <ArrowRight className="w-3.5 h-3.5" />
        </div>
    </div>

    <img 
      src={item.img} 
      className="w-full h-full object-cover group-hover:scale-105 transition duration-700 ease-out" 
      alt={item.title} 
    />
  </div>

  {/* Content Area */}
  <div className="p-6">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#0090BF] transition-colors">
        {item.title}
      </h3>
      <div className="flex items-center gap-1 text-orange-400 bg-orange-50 px-2 py-0.5 rounded-md">
        <Star className="w-3 h-3 fill-current" />
        <span className="text-[10px] font-bold">4.9</span>
      </div>
    </div>
    
    <p className="text-slate-500 text-sm leading-relaxed mb-4">
      {item.sub}
    </p>

    <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-400">
        <ChefHat className="w-4 h-4" />
        <span className="text-[10px] font-medium uppercase tracking-wider">Certified Kitchen</span>
      </div>
      <div className="w-2 h-2 rounded-full bg-[#0090BF] animate-pulse" title="Available Today" />
    </div>
  </div>
</motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- FAQ SECTION --- */}
      <section id="faq" className="scroll-mt-20 py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 h-full min-h-[500px] hidden lg:block group"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#0090BF]/80 to-transparent z-10 opacity-60"></div>
              <img src="/images/happy-2.jpg" alt="Welfare Support" className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105" />
              <div className="absolute bottom-8 left-8 z-20 text-white max-w-xs">
                <div className="bg-[#FFB81C] text-[#0033A1] text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">Internal Support</div>
                <h3 className="text-2xl font-bold mb-2">Need Assistance?</h3>
                <p className="text-blue-50 text-sm">Contact the Welfare Unit via <span className="font-bold text-white">Ext 4050</span> for login issues.</p>
              </div>
            </motion.div>

            <div className="pt-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-8">Portal <span className="text-[#0090BF]">Guidelines</span></h2>
              <div className="space-y-4">
                {[
                  { q: "Who is eligible for this service?", a: "This portal is strictly for active Republic Bank Ghana staff members. Your Staff ID is required for access." },
                  { q: "How is the subsidy applied?", a: "The subsidy is automatically applied to one meal per day as part of the bank's welfare package. No manual payment is required on the app." },
                  { q: "Can I change my order on the day?", a: "Yes, but only before the 9:00 AM cutoff time. After this, all orders are sent to vendors for final preparation." },
                  { q: "What if I'm working from a different branch?", a: "The system allows you to select your current location for the day to ensure your meal is delivered to the correct office." }
                ].map((item, idx) => (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button onClick={() => toggleFaq(idx)} className="w-full flex justify-between items-center p-5 text-left bg-slate-50 hover:bg-slate-100 transition group">
                      <span className="font-bold text-slate-800 group-hover:text-[#0090BF]">{item.q}</span>
                      <Plus className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-45 text-[#0090BF]' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {openFaq === idx && (
                        <motion.div 
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0">
                            <p className="text-slate-600 leading-relaxed border-t border-slate-100 pt-4">{item.a}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
  

<section className="relative w-full py-24 overflow-hidden bg-[#0090BF] ">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="relative overflow-hidden rounded-3xl bg-slate-900 shadow-2xl"
    >
      
      {/* Decorative Background Elements - Subtle Pulse */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-[#FFB81C] rounded-full mix-blend-multiply filter blur-[100px]"
      />

      <div className="relative grid lg:grid-cols-2 items-center">
        
        {/* Left Side: Content */}
        <div className="p-8 md:p-16 lg:p-20 space-y-8">
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-blue-200 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-[#FFB81C]" />
            Secure Staff Access
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight">
            Nourishing Our <br />
            <span className="text-[#0090BF]">Republic Family.</span>
          </motion.h2>
          
          <motion.p variants={itemVariants} className="text-blue-100/80 text-lg leading-relaxed max-w-md">
            Your subsidized weekly meal is just a click away. Use your standard Staff ID to access the dashboard and reserve your plate.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link 
              href="/login" 
              className="group flex items-center justify-center gap-3 bg-[#0090BF] hover:bg-white text-white hover:text-[#0090BF] px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg shadow-blue-500/20 active:scale-95"
            >
              Portal Login
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
          
          <motion.p variants={itemVariants} className="text-xs text-slate-500 font-medium">
            *Orders must be placed before 9:00 AM daily.
          </motion.p>
        </div>

        {/* Right Side: Professional Image with Gradient Overlay */}
        <div className="relative h-64 lg:h-full min-h-[400px] overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            src="/images/happy-9.jpg" 
            alt="Corporate Dining" 
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent lg:hidden" />
          
          {/* Floating Stat Card - Slides in from right */}
          <motion.div 
            initial={{ x: 40, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl hidden sm:block"
          >
            <div className="flex items-center gap-3">
              <div className="bg-[#FFB81C] p-2 rounded-lg">
                <UtensilsCrossed className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Freshly Prepped</p>
                <p className="text-blue-200 text-xs">Daily by Certified Vendors</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  </div>
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
            <p className="text-slate-500 text-xs">&copy; {new Date().getFullYear()} Republic Bank Ghana. Internal Systems.</p>
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