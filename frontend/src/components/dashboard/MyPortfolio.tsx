"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function MyPortfolio() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "right" ? amount : -amount, behavior: "smooth" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  const portfolio = [
    { name: "Mandragora Mansion", price: "0.005 Ether", image: "https://images.unsplash.com/photo-1628611225249-6c11760eba71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60" },
    { name: "Halbert Avenue", price: "0.076 Ether", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60" },
    { name: "Pomec Mansions", price: "0.052 Ether", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60" },
    { name: "Silver Heights", price: "0.034 Ether", image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=60" },
  ];

  return (
    <div className="w-full h-full flex flex-col gap-5 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">My Portfolio</h2>
        <div className="flex gap-2.5">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="w-8 h-8 rounded-full bg-white text-slate-400 hover:text-slate-800 flex items-center justify-center shadow-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="w-8 h-8 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-sm hover:bg-[#7c3aed] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable List */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar flex-1 items-start"
      >
        {portfolio.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-[24px] p-5 shadow-sm flex items-center min-w-[290px] gap-5 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
          >
            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-[16px] object-cover" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[15px] font-bold text-slate-800 truncate block w-36 tracking-tight">{item.name}</span>
              <span className="text-slate-500 font-medium text-[13px] flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 text-slate-400">
                  <path d="M11.944 17.97L4.58 13.62 11.943 24l7.37-10.38-7.372 4.35h.003zM12.056 0L4.69 12.223l7.365 4.354 7.365-4.35L12.056 0z"/>
                </svg>
                {item.price}
              </span>
            </div>
          </div>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `.hide-scrollbar::-webkit-scrollbar{display:none}.hide-scrollbar{-ms-overflow-style:none;scrollbar-width:none}`}} />
    </div>
  );
}
