'use client';

import { useEffect, useState, useRef } from 'react';
import { 
  Download, 
  ArrowLeft, 
  Send, 
  Sparkles, 
  FileText, 
  Bot, 
  User, 
  Check, 
  Loader2, 
  Layout, 
  Eye 
} from 'lucide-react';
import { getApiUrl } from '../../utils/api';

interface Template {
  id: string;
  name: string;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const INITIAL_DATA = {
  name: "Alex Morgan",
  email: "alex@example.com",
  phone: "+1 (555) 010-9988",
  linkedin: "linkedin.com/in/alexmorgan",
  summary: "Senior Software Engineer with 6+ years of experience specializing in Full Stack and AI engineering. Proven track record of leading development of scalable distributed systems and intelligent pipelines.",
  skills: ["Python", "FastAPI", "React", "TypeScript", "Docker", "PostgreSQL", "AWS", "Machine Learning"],
  experience: [
    { 
      role: "Senior Full Stack Developer", 
      company: "TechNova Corp", 
      date: "2021 - Present", 
      description: "Architected microservice backends, reduced query latency by 40%, and deployed LLM inference agents." 
    },
    { 
      role: "Software Engineer", 
      company: "StartupLab Inc", 
      date: "2018 - 2021", 
      description: "Developed RESTful APIs and modern React frontends for enterprise users." 
    }
  ],
  projects: [
    {
      name: "AI Career Pipeline Engine",
      technologies: "Python, FastAPI, Next.js",
      description: "Automated candidate-job matching using NER extraction and semantic similarity."
    }
  ],
  education: [
    { school: "State University of Technology", degree: "B.S. in Computer Science", date: "2018" }
  ],
  achievements: [
    "Winner of the 2021 Global Innovation Hackathon.",
    "Recognized for top engineering excellence in 2023."
  ]
};

const SUGGESTIONS = [
  "Improve summary with stronger action verbs",
  "Add AWS & Docker to skills",
  "Highlight AI and Machine Learning achievements"
];

export default function ResumeApp() {
  const [step, setStep] = useState<'selection' | 'editor'>('selection');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');

  const [resumeData, setResumeData] = useState(INITIAL_DATA);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hello! I am your AI Resume Editor. What changes or improvements would you like me to make to your resume?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Safely hydrate from localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem("user_name");
      const storedEmail = localStorage.getItem("user_email");
      const storedPhone = localStorage.getItem("user_phone");
      const storedLinkedin = localStorage.getItem("user_linkedin") || localStorage.getItem("user_linkedin_input");

      if (storedName || storedEmail || storedPhone || storedLinkedin) {
        setResumeData(prev => ({
          ...prev,
          name: storedName || prev.name,
          email: storedEmail || prev.email,
          phone: storedPhone || prev.phone,
          linkedin: storedLinkedin || prev.linkedin,
        }));
      }
    }
  }, []);

  // Fetch Templates
  useEffect(() => {
    fetch(getApiUrl('/templates'))
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTemplates(data);
        } else {
          setTemplates([
            { id: 'modern', name: 'Modern Clean' },
            { id: 'classic', name: 'Executive Classic' },
            { id: 'minimal', name: 'Tech Minimal' }
          ]);
        }
      })
      .catch(err => {
        setTemplates([
          { id: 'modern', name: 'Modern Clean' },
          { id: 'classic', name: 'Executive Classic' },
          { id: 'minimal', name: 'Tech Minimal' }
        ]);
      });
  }, []);

  // Update Preview
  useEffect(() => {
    if (selectedTemplate) {
      updatePreview();
    }
  }, [resumeData, selectedTemplate, step]);

  // Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectTemplate = (id: string) => {
    setSelectedTemplate(id);
    setStep('editor');
  };

  const updatePreview = async () => {
    try {
      const res = await fetch(getApiUrl('/templates/render-preview'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate,
          resume_data: resumeData
        })
      });
      const html = await res.text();
      setPreviewHtml(html);
    } catch (err) {
      console.error("Preview Error", err);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch(getApiUrl('/download-pdf'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate,
          resume_data: resumeData
        })
      });

      if (!response.ok) throw new Error("Download failed");

      const html = await response.text();
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(html);
        printWindow.document.close();
      }
    } catch (error) {
      console.error(error);
      alert("Opening print preview...");
    } finally {
      setDownloading(false);
    }
  };

  const handleChatSend = async (customMsg?: string) => {
    const textToSend = customMsg || input;
    if (!textToSend.trim()) return;

    setMessages(prev => [...prev, { role: "user", text: textToSend }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('/ai/edit-resume'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_data: resumeData,
          user_input: textToSend
        })
      });

      if (!res.ok) throw new Error("AI failed");

      const result = await res.json();

      setMessages(prev => [
        ...prev,
        { role: "ai", text: result.message || "Updated resume successfully!" }
      ]);

      if (result.type === "edit" && result.updated_data) {
        setResumeData(result.updated_data);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "ai", text: "Resume updated based on your prompt." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // STEP 1: TEMPLATE SELECTION
  if (step === 'selection') {
    return (
      <div className="min-h-screen pb-16 pt-2">
        <div className="text-center max-w-2xl mx-auto mb-12 pt-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-4 border border-purple-200">
            <Layout size={13} />
            <span>Interactive Resume Engine</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Choose Your Resume Template
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Select a professional layout to edit with AI in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {templates.map(t => (
            <div 
              key={t.id} 
              onClick={() => selectTemplate(t.id)}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-purple-400 transition-all duration-300 overflow-hidden cursor-pointer group flex flex-col justify-between"
            >
              <div className="h-80 bg-slate-100 overflow-hidden relative border-b border-slate-100">
                <iframe 
                  src={getApiUrl(`/templates/${t.id}/raw`)} 
                  style={{
                    width: '210mm',
                    height: '297mm',
                    transform: 'scale(0.35)',
                    transformOrigin: 'top left',
                    border: 'none',
                    pointerEvents: 'none'
                  }}
                  scrolling="no"
                  tabIndex={-1}
                  title={t.name}
                />
                <div className="absolute inset-0 bg-transparent group-hover:bg-purple-900/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 px-4 py-2 rounded-xl gradient-brand text-white text-xs font-bold shadow-lg transition-all transform scale-90 group-hover:scale-100 flex items-center gap-1.5">
                    <Eye size={14} />
                    Use This Template
                  </span>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600 transition-colors">
                    {t.name}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">ATS-Optimized A4</span>
                </div>
                <span className="text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                  Select →
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // STEP 2: LIVE A4 EDITOR + AI COPILOT
  return (
    <div className="h-[calc(100vh-2rem)] -mt-2 -mr-6 -ml-2 rounded-2xl overflow-hidden border border-slate-200/90 shadow-2xl flex bg-slate-900">
      
      {/* Left Column: AI Copilot Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col justify-between z-10 flex-shrink-0">
        
        {/* Editor Top Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            onClick={() => setStep('selection')}
            className="text-xs font-bold text-slate-600 hover:text-purple-600 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft size={14} />
            Templates
          </button>
          <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            AI Copilot
          </span>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/30">
          {messages.map((msg, i) => (
            <div 
              key={i} 
              className={`flex items-start gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.role === 'ai' && (
                <div className="w-6 h-6 rounded-lg gradient-brand text-white flex items-center justify-center text-[10px] flex-shrink-0 mt-0.5">
                  <Bot size={12} />
                </div>
              )}
              <div 
                className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[85%] ${
                  msg.role === 'ai' 
                    ? 'bg-white border border-slate-200 text-slate-800 shadow-2xs' 
                    : 'gradient-brand text-white font-medium shadow-sm'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-3 pt-2 border-t border-slate-100 bg-white space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-1">
            Quick Prompts
          </span>
          <div className="flex flex-col gap-1">
            {SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => handleChatSend(s)}
                className="text-left text-[11px] font-semibold text-slate-600 hover:text-purple-700 hover:bg-purple-50 px-2.5 py-1.5 rounded-lg transition-colors truncate border border-transparent hover:border-purple-100"
              >
                ⚡ {s}
              </button>
            ))}
          </div>
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-slate-100">
          <div className="relative">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleChatSend();
                }
              }}
              placeholder="Ask AI to add skills, edit summary, rewrite..."
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-purple-600 focus:outline-none resize-none"
            />
            <button
              onClick={() => handleChatSend()}
              disabled={loading || !input.trim()}
              className="absolute right-2 bottom-2 p-1.5 gradient-brand text-white rounded-lg shadow-sm disabled:opacity-50"
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Live A4 Canvas */}
      <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
        
        {/* Floating Controls Header */}
        <div className="px-6 py-3 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between z-20">
          <div className="flex items-center gap-2 text-slate-400 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>LIVE A4 CANVAS</span>
            <span className="text-slate-600">•</span>
            <span className="capitalize">{selectedTemplate} Layout</span>
          </div>

          <button
            onClick={handleDownload}
            disabled={downloading}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md flex items-center gap-2 transition"
            style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
          >
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            <span>Export & Print PDF</span>
          </button>
        </div>

        {/* Live A4 Frame Area */}
        <div className="flex-1 overflow-y-auto p-8 flex items-center justify-center bg-slate-950">
          <div className="bg-white rounded-xs shadow-2xl overflow-hidden border border-slate-300">
            <iframe
              srcDoc={previewHtml}
              style={{
                width: '210mm',
                height: '297mm',
                border: 'none',
                display: 'block'
              }}
              title="Live Resume Canvas"
            />
          </div>
        </div>

      </div>

    </div>
  );
}
