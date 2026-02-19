"use client";
import { useState, useRef } from "react";
import { 
  Heart, BadgeDollarSign, Swords, MessageCircleCode, 
  Sparkles, Download, Copy, Check, Briefcase, GraduationCap, 
  BookOpen, Coffee, Quote, ImagePlus, Trophy, Target, RefreshCcw, Languages, Globe2, ChevronDown
} from "lucide-react";

// 语言配置
const LANGUAGES: any = {
  zh: { label: "简体中文", icon: "🇨🇳" },
  en: { label: "English", icon: "🇺🇸" },
  ja: { label: "日本語", icon: "🇯🇵" },
  ko: { label: "한국어", icon: "🇰🇷" },
  ms: { label: "Melayu", icon: "🇲🇾" },
  ru: { label: "Русский", icon: "🇷🇺" }
};

const MODES = {
  work: { label: "职场", icon: <Swords size={18}/>, color: "bg-blue-600", border: "border-blue-500/50", theme: "bg-[#020617] text-blue-50", accent: "text-blue-400" },
  study: { label: "导师", icon: <MessageCircleCode size={18}/>, color: "bg-emerald-600", border: "border-emerald-500/50", theme: "bg-[#fdfbf7] text-stone-900", accent: "text-emerald-700" },
  love: { label: "恋爱", icon: <Heart size={18}/>, color: "bg-pink-500", border: "border-pink-500/50", theme: "bg-[#fff1f2] text-rose-900", accent: "text-rose-500" },
  sales: { label: "客户", icon: <BadgeDollarSign size={18}/>, color: "bg-amber-500", border: "border-amber-500/50", theme: "bg-[#fffbeb] text-amber-900", accent: "text-amber-600" }
};

const MASKS = {
  judge: { label: "毒舌判官", icon: "👺" },
  green: { label: "绿茶艺术", icon: "🍵" },
  elite: { label: "铁血精英", icon: "🗿" },
  fox: { label: "老狐狸", icon: "🦊" }
};

export default function SubtextLab() {
  const [lang, setLang] = useState("zh");
  const [mode, setMode] = useState<keyof typeof MODES>("work");
  const [mask, setMask] = useState<keyof typeof MASKS>("fox");
  const [isSimMode, setIsSimMode] = useState(false);
  const [text, setText] = useState("");
  const [simScenario, setSimScenario] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const currentMode = MODES[mode];
  const isDarkInput = mode === 'work' || mode === 'sales';

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ content: text, mode, mask, lang, type: isSimMode ? "evaluate_reply" : "decode", scenario: simScenario }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) { alert("AI 连接失败"); } finally { setLoading(false); }
  };

  const startSimulation = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ mode, type: "generate_scenario", mask, lang }),
      });
      const data = await res.json();
      setSimScenario(data.scenario);
    } catch (e) { setSimScenario("Error fetching scenario"); } finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen transition-all duration-1000 relative p-6 md:p-12 overflow-x-hidden ${currentMode.theme}`}>
      
      {/* --- 🚀 华丽的右上角语言切换器 --- */}
      <div className="fixed top-8 right-8 z-[100] group">
        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 backdrop-blur-2xl transition-all duration-500 shadow-2xl ${
          isDarkInput 
            ? "bg-white/10 border-white/20 text-white hover:border-white/40" 
            : "bg-black/5 border-black/10 text-stone-900 hover:border-black/30"
        } ${currentMode.border}`}>
          <Globe2 size={18} className={`animate-pulse ${currentMode.accent}`} />
          <div className="relative flex items-center">
            <span className="mr-2 text-lg">{LANGUAGES[lang].icon}</span>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent text-sm font-black outline-none cursor-pointer appearance-none pr-6 z-10"
            >
              {Object.entries(LANGUAGES).map(([k, v]: any) => (
                <option key={k} value={k} className="bg-stone-800 text-white">{v.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-0 pointer-events-none opacity-50" />
          </div>
        </div>
        {/* 下方的光晕装饰 */}
        <div className={`absolute -inset-1 blur-xl opacity-20 -z-10 transition-all ${currentMode.color} group-hover:opacity-40`}></div>
      </div>

      {/* 背景插画 (继承之前的逻辑) */}
      <div className="fixed inset-0 pointer-events-none select-none overflow-hidden opacity-[0.08]">
        {mode === 'work' && <><Briefcase className="absolute top-[10%] left-[5%] w-64 h-64 -rotate-12" /><Coffee className="absolute bottom-[10%] left-[20%] w-32 h-32 rotate-12" /></>}
        {mode === 'love' && <><Heart className="absolute top-[15%] left-[10%] w-72 h-72 -rotate-12 fill-rose-400" /><Sparkles className="absolute bottom-[20%] right-[10%] w-56 h-56 rotate-12 fill-rose-300" /></>}
        {mode === 'sales' && <><BadgeDollarSign className="absolute top-[20%] right-[5%] w-80 h-80 rotate-12 fill-amber-400" /><Quote className="absolute bottom-[15%] left-[5%] w-48 h-48 -rotate-12 fill-amber-300" /></>}
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-6xl font-black italic tracking-tighter mb-4">CORE AI</h1>
          <div className="flex justify-center items-center gap-4">
            <div className={`h-[1px] w-12 ${isDarkInput ? 'bg-white/20' : 'bg-black/20'}`}></div>
            <button 
              onClick={() => { setIsSimMode(!isSimMode); setSimScenario(""); setResult(null); }}
              className={`flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black border-2 transition-all hover:scale-105 ${isSimMode ? "bg-white text-black border-white shadow-xl" : "border-gray-500/30 opacity-60 hover:opacity-100"}`}
            >
              {isSimMode ? <Trophy size={14}/> : <Target size={14}/>} 
              {isSimMode ? "TERMINATE SIMULATION" : "INITIATE PRACTICE"}
            </button>
            <div className={`h-[1px] w-12 ${isDarkInput ? 'bg-white/20' : 'bg-black/20'}`}></div>
          </div>
        </header>

        {/* 模式选择器 */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(MODES).map(([k, v]) => (
            <button key={k} onClick={() => setMode(k as any)} className={`flex items-center gap-3 px-8 py-3 rounded-2xl font-black transition-all transform hover:-translate-y-1 ${mode === k ? `${v.color} text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] scale-110` : "bg-black/5 opacity-40 hover:opacity-100"}`}>
              {v.icon} {v.label}
            </button>
          ))}
        </div>

        {/* 性格面具 */}
        <div className="flex justify-center gap-4 mb-12">
          {Object.entries(MASKS).map(([k, v]) => (
            <button key={k} onClick={() => setMask(k as any)} className={`group relative flex flex-col items-center p-4 rounded-[24px] border-2 transition-all duration-500 ${mask === k ? "bg-white/10 border-white/40 shadow-2xl scale-110" : "bg-transparent border-transparent opacity-20 hover:opacity-100"}`}>
              <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">{v.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{v.label}</span>
              {mask === k && <div className={`absolute -bottom-2 w-1 h-1 rounded-full ${currentMode.color} animate-ping`}></div>}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            {isSimMode && (
              <div className={`p-8 rounded-[40px] border-2 border-dashed animate-in slide-in-from-top duration-500 ${isDarkInput ? "bg-white/5 border-white/20" : "bg-white/80 border-black/10 shadow-xl"}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-[10px] font-black uppercase tracking-widest opacity-40 ${currentMode.accent}`}>Mission Scenario</span>
                  <button onClick={startSimulation} className="text-xs font-bold flex items-center gap-2 hover:rotate-180 transition-transform duration-700"><RefreshCcw size={14}/></button>
                </div>
                <p className="text-2xl font-medium italic leading-snug">{simScenario || "Standing by for scenario generation..."}</p>
                {!simScenario && <button onClick={startSimulation} className={`mt-6 px-8 py-3 rounded-2xl text-xs font-black text-white shadow-xl ${currentMode.color} hover:brightness-125`}>GENERATE</button>}
              </div>
            )}
            <div className={`p-10 rounded-[50px] border-2 h-[400px] flex flex-col transition-all duration-500 ${isDarkInput ? "bg-slate-900/90 border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]" : "bg-white border-black/5 shadow-2xl"}`}>
              <textarea 
                className={`w-full flex-1 bg-transparent outline-none resize-none text-2xl font-medium ${isDarkInput ? "placeholder:text-white/10 text-white" : "placeholder:text-black/10 text-stone-900"}`}
                placeholder="INPUT DATA..." 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
              />
            </div>
            <button onClick={handleAnalyze} className={`w-full py-8 rounded-[30px] text-2xl font-black text-white shadow-2xl transition-all active:scale-95 ${currentMode.color} hover:brightness-110 tracking-widest`}>
              {loading ? "PROCESSING..." : "ANALYZE INTENT"}
            </button>
          </div>

          <div className={`p-12 rounded-[50px] min-h-[500px] border-2 shadow-2xl relative transition-all duration-500 ${isDarkInput ? "bg-slate-950 border-white/5" : "bg-white border-stone-100"}`}>
            {result ? (
              <div className="animate-in fade-in zoom-in-95 duration-500">
                <div className="flex justify-between items-start mb-10">
                  <div className="space-y-1">
                    <p className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase italic">Decoded Output</p>
                    <h2 className={`text-sm font-black ${currentMode.accent}`}>MASK: {mask.toUpperCase()} / LANG: {lang.toUpperCase()}</h2>
                  </div>
                  {isSimMode && (
                    <div className="text-right">
                      <div className="text-6xl font-black text-orange-500 leading-none">{result.score}</div>
                      <div className="text-[10px] font-bold opacity-30 mt-1">EQ SCORE</div>
                    </div>
                  )}
                </div>
                <p className="text-2xl font-medium italic leading-relaxed mb-12 border-l-4 pl-6 border-white/10">
                  {isSimMode ? result.feedback : result.subtext}
                </p>
                <div className="space-y-4">
                  {result.sentences?.map((s: any, i: number) => (
                    <div key={i} className={`p-6 rounded-[24px] border transition-all hover:scale-[1.03] group relative ${isDarkInput ? "bg-white/5 border-white/10" : "bg-gray-50 border-black/5"}`}>
                      <span className="text-[9px] font-black opacity-30 uppercase mb-2 block tracking-widest">{s.label || "Recommended Reply"}</span>
                      <p className="text-lg font-medium pr-10">{s.text}</p>
                      <button onClick={() => {navigator.clipboard.writeText(s.text); setCopiedIndex(i); setTimeout(()=>setCopiedIndex(null),2000)}} className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all">
                        {copiedIndex === i ? <Check size={20} className="text-green-400"/> : <Copy size={20} className="opacity-40 hover:opacity-100"/>}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-10">
                <Globe2 size={100} className="animate-spin-slow" />
                <p className="text-2xl font-black tracking-[0.5em] italic">CORE ENGINE IDLE</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
