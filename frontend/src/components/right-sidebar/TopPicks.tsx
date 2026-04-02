"use client";

import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import api from "@/lib/api";

interface TopPickProperty {
  _id: string;
  title: string;
  priceUSD: number;
  priceETH: number;
}

export default function TopPicks() {
  const [selected, setSelected] = useState<string | null>(null);
  const [picks, setPicks] = useState<TopPickProperty[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPicks() {
      try {
        const { data } = await api.get('/properties/top-picks');
        setPicks(data);
      } catch (error) {
        console.error("Top picks fetch error:", error);
      }
    }
    fetchPicks();
  }, []);

  const handleBid = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      setLoading(true);
      await api.post('/user/bid', { propertyId: id });
      alert('Bid successful! Tranasction mock complete.');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full mt-2">
      {picks.map((item, idx) => (
        <div
          key={item._id}
          onClick={() => setSelected(selected === item._id ? null : item._id)}
          className={`flex justify-between items-center group cursor-pointer p-3 -mx-3 rounded-[20px] transition-all duration-300 ${
            selected === item._id ? "bg-[#8A74F9]/10 scale-[1.01]" : "hover:bg-white hover:shadow-sm"
          }`}
        >
          <div className="flex items-center gap-5">
            <div className={`w-1 h-7 rounded-full shrink-0 ${idx % 2 === 0 ? "bg-[#8A74F9]" : "bg-[#00D3A2]"} transition-all ${selected === item._id ? "h-10" : ""}`} />
            <div className="flex flex-col gap-0.5">
              <p className={`font-bold text-[15px] tracking-tight transition-colors ${selected === item._id ? "text-[#8A74F9]" : "text-slate-800 group-hover:text-[#8A74F9]"}`}>
                {item.title}
              </p>
              <p className="text-[13px] text-slate-400 font-medium">$ {(item.priceUSD || 0).toLocaleString()}</p>
              {selected === item._id && (
                <div className="flex items-center gap-3 mt-2 animate-fade-in">
                  <p className="text-[12px] text-[#8A74F9] font-semibold">{item.priceETH} Ether</p>
                  <button
                    disabled={loading}
                    onClick={(e) => handleBid(item._id, e)}
                    className="bg-[#00D3A2] hover:bg-emerald-500 text-white text-xs font-bold py-1 px-3 rounded-full transition-all"
                  >
                    Bid
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-5">
            {selected !== item._id && <p className="text-[12px] font-medium text-slate-400">{item.priceETH} Ether</p>}
            <ChevronRight
              size={18}
              className={`transition-transform duration-300 ${selected === item._id ? "rotate-90 text-[#8A74F9]" : "text-slate-300 group-hover:text-[#8A74F9]"}`}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
