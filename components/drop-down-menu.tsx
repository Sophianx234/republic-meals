import { AnimatePresence } from "framer-motion"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

function DropdownMenu({mobileMenuOpen, setMobileMenuOpen}: {mobileMenuOpen: boolean, setMobileMenuOpen: (open: boolean) => void }) {
  
  return (
    <AnimatePresence>
  {mobileMenuOpen && (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="md:hidden fixed top-20 inset-x-0 z-40 bg-white border-b border-slate-200 shadow-lg overflow-hidden"
    >
      <div className="px-6 py-6 space-y-6">
        <a
          href="#how-it-works"
          onClick={() => setMobileMenuOpen(false)}
          className="block text-base font-semibold text-slate-700 hover:text-[#0090BF]"
        >
          How it Works
        </a>

        <a
          href="#menu-preview"
          onClick={() => setMobileMenuOpen(false)}
          className="block text-base font-semibold text-slate-700 hover:text-[#0090BF]"
        >
          This Week’s Menu
        </a>

        <a
          href="#faq"
          onClick={() => setMobileMenuOpen(false)}
          className="block text-base font-semibold text-slate-700 hover:text-[#0090BF]"
        >
          FAQ
        </a>

        <Link
          href="/login"
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center justify-center gap-2 bg-[#0090BF] text-white px-6 py-3 rounded-xl font-bold shadow-md"
        >
          Staff Login <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )}
</AnimatePresence>

  )
}

export default DropdownMenu
