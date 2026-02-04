'use client';
import { useEffect, useState, useRef } from 'react';
import { Download, ArrowLeft, Send } from 'lucide-react';

// --- Types ---
interface Template {
  id: string;
  name: string;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

// Default Data
// --- Types ---
interface Experience {
  role: string;
  company: string;
  date: string;
  description: string;
}

interface Education {
  school: string;
  degree: string;
  date: string;
}

interface Project {
  name: string;
  technologies: string;
  description: string;
}

// Updated Resume Data Structure
const INITIAL_DATA = {
  name: localStorage.getItem("user_name") || "Alex Morgan",
  email: localStorage.getItem("user_email") || "alex@example.com",
  phone: localStorage.getItem("user_phone") || "+1 (555) 010-9988",
  linkedin: localStorage.getItem("user_linkedin") || "linkedin.com/in/alexmorgan",
  
  // 1. Professional Summary
  summary: "Senior Software Engineer with 6+ years of experience specializing in Full Stack development. Proven track record of leading teams and delivering scalable web solutions.",
  
  // 2. Technical Skills
  skills: ["Python", "FastAPI", "React", "TypeScript", "Docker", "PostgreSQL", "AWS"],
  
  // 3. Experience
  experience: [
    { 
      role: "Senior Developer", 
      company: "Tech Corp", 
      date: "2021 - Present", 
      description: "Led backend development for a high-traffic SaaS platform. Optimized database queries reducing load times by 40%." 
    },
    { 
      role: "Software Engineer", 
      company: "Startup Inc", 
      date: "2018 - 2021", 
      description: "Developed RESTful APIs and integrated third-party payment gateways." 
    }
  ],

  // 4. Key Projects (New)
  projects: [
    {
      name: "AI Resume Builder",
      technologies: "Python, FastAPI, React",
      description: "Built an automated resume tailoring tool using LLMs to generate PDF documents."
    },
    {
      name: "E-Commerce Dashboard",
      technologies: "React, Redux, Node.js",
      description: "Created a real-time analytics dashboard for merchant sales data."
    }
  ],

  // 5. Education
  education: [
    { school: "State University", degree: "B.S. Computer Science", date: "2018" }
  ],

  // 6. Achievements (New)
  achievements: [
    "Awarded 'Employee of the Month' twice in 2022.",
    "Winner of the 2021 Global Hackathon."
  ]
};

export default function ResumeApp() {
  const [step, setStep] = useState<'selection' | 'editor'>('selection');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const [resumeData, setResumeData] = useState(INITIAL_DATA);
  const [previewHtml, setPreviewHtml] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: 'Hello! I am your AI Resume Editor. What should we change?' }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Templates on Load
  useEffect(() => {
    fetch('http://127.0.0.1:8000/templates')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error("Error loading templates:", err));
  }, []);

  // 2. Update Preview when data or template changes
  useEffect(() => {
    if (step === 'editor' && selectedTemplate) {
      updatePreview();
    }
  }, [resumeData, selectedTemplate, step]);

  // 3. Scroll Chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const selectTemplate = (id: string) => {
    setSelectedTemplate(id);
    setStep('editor');
  };

  const updatePreview = async () => {
    try {
      const res = await fetch('http://127.0.0.1:8000/templates/render-preview', {
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

  // --- DOWNLOAD PDF FUNCTION ---
  const handleDownload = async () => {
    setDownloading(true);
    try {
      const response = await fetch('http://127.0.0.1:8000/download-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate,
          resume_data: resumeData
        })
      });

      if (!response.ok) throw new Error("Download failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `resume_${resumeData.name.replace(/\s+/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error(error);
      alert("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  // --- CORE: AI HANDLER ---
  const handleChatSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput("");
    setLoading(true);

    try {
     const response = await fetch('http://127.0.0.1:8000/ai/edit-resume', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    current_data: resumeData,
    user_input: userMsg
  })
});

if (!response.ok) throw new Error("AI Request Failed");

const result = await response.json();

// 🔹 If it's a QUESTION → show AI message in chat
if (result.type === "question") {
  setMessages(prev => [
    ...prev,
    { role: 'ai', text: result.message }
  ]);
}

// 🔹 If it's an EDIT → update resume + confirmation
if (result.type === "edit") {
  setResumeData(result.updated_data);
  setMessages(prev => [
    ...prev,
    { role: 'ai', text: "Done. Resume updated." }
  ]);
}
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [
        ...prev,
        { role: 'ai', text: "Sorry, something went wrong processing your request." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (step === 'selection') {
    return (
      <div style={{ fontFamily: 'sans-serif', background: 'linear-gradient(135deg, #f8f7ff 0%, #f3f0ff 50%, #faf8ff 100%)', minHeight: '100vh', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: '42px', fontWeight: 'bold', color: '#1e1b4b', marginBottom: '10px' }}>
              Choose Your Resume Template
            </h1>
            <p style={{ fontSize: '16px', color: '#6b7280' }}>
              Select a professional template to get started
            </p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
            {templates.map(t => (
              <div 
                key={t.id} 
                onClick={() => selectTemplate(t.id)}
                style={{
                  width: '260px',
                  height: '380px',
                  background: '#fff',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(124, 58, 237, 0.1)',
                  border: '2px solid #e9d5ff',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 12px 20px rgba(124, 58, 237, 0.2)';
                  e.currentTarget.style.borderColor = '#c4b5fd';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(124, 58, 237, 0.1)';
                  e.currentTarget.style.borderColor = '#e9d5ff';
                }}
              >
                <div style={{ height: '330px', position: 'relative', background: '#fff', overflow: 'hidden' }}>
                  <iframe 
                    src={`http://127.0.0.1:8000/templates/${t.id}/raw`} 
                    style={{
                      width: '210mm',
                      height: '297mm',
                      transform: 'scale(0.3)',
                      transformOrigin: 'top left',
                      border: 'none',
                      pointerEvents: 'none'
                    }}
                    scrolling="no"
                    tabIndex={-1}
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    zIndex: 10,
                    cursor: 'pointer'
                  }}></div>
                </div>
                <div style={{
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderTop: '2px solid #e9d5ff',
                  background: '#faf5ff'
                }}>
                  <strong style={{ color: '#1e1b4b' }}>{t.name}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
   <div style={{
  display: 'flex',
  height: '100vh',
  background: '#f1f5f9',
  fontFamily: 'Inter, system-ui, sans-serif',
  overflow: 'hidden'
}}>
  
  {/* LEFT: Slim Sidebar (Control Panel) */}
  <div style={{
    width: '320px', // Fixed small width
    display: 'flex',
    flexDirection: 'column',
    background: '#ffffff',
    borderRight: '1px solid #e2e8f0',
    zIndex: 10
  }}>
    <div style={{ padding: '20px 16px', borderBottom: '1px solid #f1f5f9' }}>
      <h2 style={{ margin: 0, fontSize: '16px', color: '#1e293b', fontWeight: '600' }}>Editor</h2>
    </div>

    {/* Compact Chat Window */}
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      background: '#fafafa'
    }}>
      {messages.map((msg, i) => (
        <div key={i} style={{
          alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
          background: msg.role === 'ai' ? '#fff' : '#7c3aed',
          color: msg.role === 'ai' ? '#475569' : '#fff',
          padding: '10px 12px',
          borderRadius: '12px',
          maxWidth: '90%',
          fontSize: '13px',
          lineHeight: '1.4',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          border: msg.role === 'ai' ? '1px solid #e2e8f0' : 'none'
        }}>
          {msg.text}
        </div>
      ))}
      <div ref={chatEndRef} />
    </div>

    {/* Compact Input Area */}
    <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9' }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask AI to edit..."
          style={{
            width: '100%',
            height: '80px',
            padding: '10px',
            borderRadius: '8px',
            color: '#1e293b',
            border: '1px solid #e2e8f0',
            fontSize: '13px',
            resize: 'none',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />
        <button 
          onClick={handleChatSend}
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            background: '#7c3aed',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '13px'
          }}
        >
          {loading ? 'Processing...' : 'Update Resume'}
        </button>
      </div>
    </div>
  </div>

  {/* RIGHT: Dominant Preview Panel */}
  <div style={{
    flex: 1,
    background: '#1e293b', 
    backgroundImage: 'radial-gradient(circle at center, #334155 0%, #0f172a 100%)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  }}>
    
    {/* Floating Header Actions */}
    <div style={{
      padding: '15px 30px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>LIVE A4 PREVIEW</span>
      <button 
        onClick={handleDownload}
        style={{
          background: '#f59e0b',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <Download size={16} /> Export PDF
      </button>
    </div>

    {/* Scrollable Canvas Area */}
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      scrollbarWidth: 'thin',
      scrollbarColor: '#475569 transparent'
    }}>
      <div style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
        borderRadius: '2px',
        background: '#fff',
        lineHeight: 0 // Removes ghost whitespace
      }}>
        <iframe 
          srcDoc={previewHtml}
          style={{
            width: '210mm',
            height: '297mm',
            border: 'none',
            display: 'block'
          }}
          title="Live Preview"
        />
      </div>
    </div>
  </div>
</div>
  );
}
