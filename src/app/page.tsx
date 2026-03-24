import DashboardLayout from "@/components/layout/DashboardLayout";
import NFTMarketplaceCard from "@/components/dashboard/NFTMarketplaceCard";
import InvestmentStats from "@/components/dashboard/InvestmentStats";
import NFTsOwnedList from "@/components/dashboard/NFTsOwnedList";
import MyPortfolio from "@/components/dashboard/MyPortfolio";
import TotalDistributionsChart from "@/components/dashboard/TotalDistributionsChart";
import TopPicks from "@/components/right-sidebar/TopPicks";
import CreditCardUI from "@/components/dashboard/CreditCardUI";

export default function Home() {
  return (
    <DashboardLayout>
      {/* Extra bottom padding for mobile bottom nav */}
      <div className="pb-20 md:pb-0">
        
        {/* Outer 3-column grid: main content + right sidebar */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">

          {/* ── MAIN CONTENT ──────────────────────── */}
          <div className="xl:col-span-8 2xl:col-span-9">
            
            {/*
              On mobile  → all cards stack vertically (single column)
              On desktop → 2-column layout inside main content:
                Left:  NFT Marketplace  +  NFTs Owned
                Right: Investment Stats +  My Portfolio  +  Total Distributions
            */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">

              {/* Left Column */}
              <div className="flex flex-col gap-8 lg:gap-10">
                <NFTMarketplaceCard />
                <NFTsOwnedList />
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-8 lg:gap-10">
                <InvestmentStats />
                <MyPortfolio />
                <div className="min-h-[300px]">
                  <TotalDistributionsChart />
                </div>
              </div>

            </div>
          </div>

          {/* ── RIGHT SIDEBAR ─────────────────────── */}
          {/*
            On mobile  → stacks after main content (full width)
            On desktop → fixed right column
          */}
          <div className="xl:col-span-4 2xl:col-span-3 flex flex-col gap-10">

            {/* My Cards */}
            <div className="flex flex-col gap-5">
              <h2 className="text-xl font-bold text-slate-800 px-1 tracking-tight">My Cards</h2>
              <CreditCardUI />
            </div>

            {/* Top Picks */}
            <div className="flex flex-col gap-6 mt-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-xl font-bold text-slate-800 tracking-tight">Top Picks</h2>
                <button className="text-slate-400 font-bold hover:text-slate-600 transition-colors text-lg leading-none tracking-widest -mt-2">...</button>
              </div>
              <TopPicks />
            </div>

          </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
