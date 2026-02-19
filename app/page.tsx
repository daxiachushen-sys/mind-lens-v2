"use client";
import { useState } from "react";
import { 
  Heart, BadgeDollarSign, Swords, MessageCircleCode, 
  Sparkles, Copy, Check, Briefcase, GraduationCap, 
  Trophy, Target, Globe2, ChevronDown, Loader2, ArrowRight
} from "lucide-react";

const DICT: any = {
  zh: {
    titleMain: "MIND", titleSub: "LENS",
    subtitle: "洞察言外之意 · 掌控社交博弈",
    modes: { work: "职场", study: "学术", love: "恋爱", sales: "客户" },
    masks: { judge: "毒舌判官", green: "绿茶艺术", elite: "铁血精英", fox: "老狐狸" },
    initiate: "启动演练", exitSim: "退出模拟",
    placeholder: "在此输入对方发来的内容...",
    placeholderSim: "输入你的高情商回复...",
    analyze: "开始解码真相", processing: "引擎解析中...", idle: "引擎待机中",
    report: "分析报告", suggestionTitle: "人格面具建议回复"
  },
  en: {
    titleMain: "MIND", titleSub: "LENS",
    subtitle: "SEE THE UNSPOKEN · MASTER THE GAME",
    modes: { work: "Professional", study: "Academic", love: "Romance", sales: "Business" },
    masks: { judge: "The Judge", green: "The Softener", elite: "The Elite", fox: "The Fox" },
    initiate: "PRACTICE", exitSim: "EXIT",
    placeholder: "Input the received message...",
    placeholderSim: "Type your reply...",
    analyze: "DECODE INTENT", processing: "PROCESSING...", idle: "ENGINE IDLE",
    report: "ANALYSIS REPORT", suggestionTitle: "MASK SUGGESTIONS"
  }
  // ... ja, ko, ms 等其他语言可按此结构补全
};

const MODES: any = {
  work: { icon: <Swords size={18}/>, color: "bg-blue-600", border: "border-blue-500/50", theme: "bg-[#020617] text-blue-50", accent: "text-blue-400" },
  study: { icon: <GraduationCap size={18}/>, color: "bg-emerald-600", border: "border-emerald-500/50", theme: "bg-[#fdfbf7] text-stone-900", accent: "text-emerald-700" },
  love: { icon: <Heart size={18}/>, color: "bg-pink-500", border: "border-pink-500/50", theme: "bg-[#fff1f2] text-rose-900", accent: "text-rose-500" },
  sales: { icon: <BadgeDollarSign size={18}/>, color: "bg-amber-500", border: "border-amber-500/50", theme: "bg-[#fffbeb] text-amber-900", accent: "text-amber-600" }
};

const MASKS: any = {
  judge: { icon: "👺" }, green: { icon: "🍵" }, elite: { icon: "🗿" }, fox: { icon: "🦊" }
};

const LANGUAGES: any = {
  zh: { label: "简体中文", icon: "🇨🇳" },
  en: { label: "English", icon: "🇺🇸" }
};

export default function MindLensLab() {
  const [lang, setLang] = useState("zh");
  const [mode, setMode] = useState<keyof typeof MODES>("work");
  const [mask, setMask] = useState<keyof typeof MASKS>("fox");
  const [isSimMode, setIsSimMode] = useState(false);
  const [text, setText] = useState("");
  const [simScenario, setSimScenario] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const t = DICT[lang] || DICT.en;
  const currentMode = MODES[mode];
  const isDark = mode === 'work' || mode === 'sales';

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ content: text, mode, mask, lang, type: isSimMode ? "evaluate" : "decode", scenario: simScenario }),
      });
      const data = await res.json();
      setResult(data);
    } catch (e) { alert("Link Error"); } finally { setLoading(false); }
  };

  const copyToClipboard = (txt: string, idx: number) => {
    navigator.clipboard.writeText(txt);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className={`min-h-screen transition-all duration-700 p-6 md:p-12 relative ${currentMode.theme}`}>
      {/* 语言切换 */}
      <div className="fixed top-8 right-8 z-[100]">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border-2 backdrop-blur-xl ${isDark ? "bg-white/5 border-white/10" : "bg-black/5 border-black/5"}`}>
          <Globe2 size={16} className={currentMode.accent} />
          <select value={lang} onChange={(e) => setLang(e.target.value)} className="bg-transparent text-[10px] font-black outline-none appearance-none cursor-pointer">
            {Object.entries(LANGUAGES).map(([k, v]: any) => <option key={k} value={k} className="text-black">{v.icon} {v.label}</option>)}
          </select>
        </div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-12">
          <h1 className="text-7xl italic tracking-tighter mb-4 leading-none">
            <span className="font-black">{t.titleMain}</span>
            <span className="font-extralight opacity-30 ml-1">{t.titleSub}</span>
          </h1>
          <button 
            onClick={() => { setIsSimMode(!isSimMode); setResult(null); }}
            className={`px-6 py-2 rounded-full text-[10px] font-black border-2 transition-all ${isSimMode ? "bg-white text-black border-white" : "opacity-40 border-gray-500/30"}`}
          >
            {isSimMode ? <Trophy className="inline mr-2" size={14}/> : <Target className="inline mr-2" size={14}/>}
            {isSimMode ? t.exitSim : t.initiate}
          </button>
          <p className={`mt-6 text-[10px] font-black tracking-[0.5em] uppercase opacity-50 ${currentMode.accent}`}>{t.subtitle}</p>
        </header>

        {/* 模式选择 */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {Object.entries(MODES).map(([k, v]: any) => (
            <button key={k} onClick={() => setMode(k as any)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs transition-all ${mode === k ? `${v.color} text-white scale-110 shadow-xl` : "bg-black/5 opacity-40 hover:opacity-100"}`}>
              {v.icon} {t.modes[k]}
            </button>
          ))}
        </div>

        {/* 面具选择 */}
        <div className="flex justify-center gap-6 mb-12">
          {Object.entries(MASKS).map(([k, v]: any) => (
            <button key={k} onClick={() => setMask(k as any)} className={`flex flex-col items-center group transition-all ${mask === k ? "scale-125 opacity-100" : "opacity-20 hover:opacity-50"}`}>
              <span className="text-4xl mb-1">{v.icon}</span>
              <span className="text-[9px] font-black uppercase tracking-tighter">{t.masks[k]}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* 输入区 */}
          <div className="space-y-6">
            <div className={`p-8 rounded-[40px] border-2 h-[450px] flex flex-col transition-all ${isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5 shadow-2xl"}`}>
              <textarea 
                className="w-full flex-1 bg-transparent outline-none resize-none text-2xl font-light italic"
                placeholder={isSimMode ? t.placeholderSim : t.placeholder}
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <button onClick={handleAnalyze} className={`w-full py-6 rounded-[25px] text-xl font-black text-white ${currentMode.color} transition-transform active:scale-95`}>
                {loading ? <Loader2 className="animate-spin mx-auto"/> : t.analyze}
              </button>
            </div>
          </div>

          {/* 结果区 */}
          <div className={`p-10 rounded-[40px] min-h-[500px] border-2 transition-all ${isDark ? "bg-black/40 border-white/5" : "bg-white border-stone-100 shadow-xl"}`}>
            {result ? (
              <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <p className="text-[10px] font-black opacity-30 tracking-[0.3em] uppercase mb-8 italic">{t.report}</p>
                <h3 className="text-3xl font-bold italic mb-10 leading-tight">{isSimMode ? result.feedback : result.subtext}</h3>
                
                {/* 动态生成的句子拆解 */}
                <div className="space-y-3 mb-10">
                  {result.sentences?.map((s: any, i: number) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm opacity-80 italic">
                      {s.text}
                    </div>
                  ))}
                </div>

                {/* 🚀 核心新增：建议回复区域 */}
                {result.suggestions && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-black opacity-30 tracking-[0.2em] uppercase flex items-center gap-2">
                      <MessageCircleCode size={14}/> {t.suggestionTitle}
                    </p>
                    <div className="grid grid-cols-1 gap-3">
                      {result.suggestions.map((item: any, idx: number) => (
                        <button 
                          key={idx}
                          onClick={() => copyToClipboard(item.content, idx)}
                          className={`group relative p-5 rounded-3xl border-2 text-left transition-all ${isDark ? "bg-white/5 border-white/5 hover:border-white/20" : "bg-stone-50 border-stone-100 hover:border-emerald-200"}`}
                        >
                          <span className={`absolute -top-2.5 left-5 px-2 py-0.5 rounded-md text-[8px] font-black text-white ${currentMode.color}`}>
                            {item.label}
                          </span>
                          <div className="flex justify-between items-center gap-4">
                            <p className="text-md font-medium leading-relaxed">{item.content}</p>
                            <div className={copiedIdx === idx ? "text-green-500" : "opacity-0 group-hover:opacity-100 transition-opacity"}>
                              {copiedIdx === idx ? <Check size={18}/> : <Copy size={16}/>}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center opacity-10 font-black italic text-4xl">{t.idle}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}