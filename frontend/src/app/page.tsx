"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import NFTMarketplaceCard from "@/components/dashboard/NFTMarketplaceCard";
import InvestmentStats from "@/components/dashboard/InvestmentStats";
import NFTsOwnedList from "@/components/dashboard/NFTsOwnedList";
import MyPortfolio from "@/components/dashboard/MyPortfolio";
import TotalDistributionsChart from "@/components/dashboard/TotalDistributionsChart";
import ActivityHeatmap from "@/components/dashboard/ActivityHeatmap";
import TopPicks from "@/components/right-sidebar/TopPicks";
import CreditCardUI from "@/components/dashboard/CreditCardUI";
import { motion, Variants } from "framer-motion";
import { usePreferences } from "@/context/PreferencesContext";

const containerVars: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } }
};

const itemVars: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const { t } = usePreferences();
  return (
    <DashboardLayout>
      <div className="pb-20 md:pb-0">
        <motion.div 
          className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10"
          variants={containerVars}
          initial="hidden"
          animate="show"
        >
          {/* ── MAIN CONTENT ──────────────────────── */}
          <div className="xl:col-span-8 2xl:col-span-9">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
              
              {/* Left Column */}
              <div className="flex flex-col gap-8 lg:gap-10">
                <motion.div variants={itemVars}><NFTMarketplaceCard /></motion.div>
                <motion.div variants={itemVars}><NFTsOwnedList /></motion.div>
                <motion.div variants={itemVars}><ActivityHeatmap /></motion.div>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-8 lg:gap-10">
                <motion.div variants={itemVars}><InvestmentStats /></motion.div>
                <motion.div variants={itemVars}><MyPortfolio /></motion.div>
                <motion.div variants={itemVars} className="min-h-[300px]">
                  <TotalDistributionsChart />
                </motion.div>
              </div>

            </div>
          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────── */}
          <motion.div 
            variants={itemVars}
            className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-10"
          >
            {/* My Cards */}
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-slate-800 dark:text-white px-1 tracking-tight">{t("my_cards_title" as any)}</h2>
              <CreditCardUI />
            </div>

            {/* Top Picks */}
            <div className="flex flex-col gap-6 mt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight">{t("top_picks_title" as any)}</h2>
                <button className="text-slate-400 font-bold hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-lg leading-none tracking-widest -mt-2">...</button>
              </div>
              <TopPicks />
            </div>
          </motion.div>

        </motion.div>
      </div>
    </DashboardLayout>
  );
}
