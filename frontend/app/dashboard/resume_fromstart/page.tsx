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

      const newData = await response.json();
      setResumeData(newData);
      setMessages(prev => [...prev, { role: 'ai', text: "Done! I've updated your resume." }]);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: 'ai', text: "Sorry, something went wrong with the AI." }]);
    } finally {
      setLoading(false);
    }
  };

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
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'sans-serif', background: '#fff' }}>
      {/* LEFT: Chat Panel */}
      <div style={{
        width: '35%',
        background: '#fff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '2px solid #e9d5ff',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          padding: '20px',
          borderBottom: '2px solid #e9d5ff',
          background: 'linear-gradient(135deg, #faf5ff 0%, #f3f0ff 100%)'
        }}>
          <button 
            onClick={() => setStep('selection')}
            style={{
              cursor: 'pointer',
              padding: '8px 12px',
              background: 'transparent',
              border: '2px solid #e9d5ff',
              borderRadius: '6px',
              color: '#7c3aed',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f3f0ff';
              e.currentTarget.style.borderColor = '#c4b5fd';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.borderColor = '#e9d5ff';
            }}
          >
            <ArrowLeft size={18} />
            Back
          </button>
          <h2 style={{ margin: 0, color: '#1e1b4b', fontSize: '20px', fontWeight: 'bold' }}>AI Editor</h2>
        </div>

        {/* Chat Window */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          background: '#faf5ff',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              alignSelf: msg.role === 'ai' ? 'flex-start' : 'flex-end',
              background: msg.role === 'ai' ? '#f3f0ff' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: msg.role === 'ai' ? '#1e1b4b' : '#fff',
              padding: '12px 16px',
              borderRadius: '12px',
              maxWidth: '85%',
              wordWrap: 'break-word',
              fontSize: '14px',
              lineHeight: '1.5',
              border: msg.role === 'ai' ? '1px solid #e9d5ff' : 'none'
            }}>
              {msg.text}
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div style={{
          display: 'flex',
          gap: '10px',
          padding: '20px',
          borderTop: '2px solid #e9d5ff',
          background: '#fff'
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ex: 'Add SQL to skills' or 'Update my experience at Tech Corp'"
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #e9d5ff',
              height: '60px',
              resize: 'none',
              fontFamily: 'inherit',
              fontSize: '14px',
              color: '#1e1b4b',
              background: '#faf5ff',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#7c3aed'}
            onBlur={(e) => e.target.style.borderColor = '#e9d5ff'}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleChatSend())}
          />
          <button 
            onClick={handleChatSend}
            disabled={loading}
            style={{
              width: '50px',
              background: loading ? 'rgba(124, 58, 237, 0.5)' : 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(124, 58, 237, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {loading ? '...' : <Send size={20} />}
          </button>
        </div>
      </div>

      {/* RIGHT: Preview Panel */}
      <div style={{
        width: '65%',
        background: 'linear-gradient(135deg, #2d1b4e 0%, #3d2463 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        overflow: 'hidden'
      }}>
        {/* Preview Header */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          maxWidth: '210mm'
        }}>
          <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '18px' }}>Live Preview</div>
          <button 
            onClick={handleDownload}
            disabled={downloading}
            style={{
              background: downloading ? 'rgba(255, 152, 0, 0.5)' : 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
              color: '#fff',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: downloading ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!downloading) {
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 152, 0, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <Download size={18} />
            {downloading ? 'Generating...' : 'Download PDF'}
          </button>
        </div>

        {/* Paper Wrapper */}
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'auto',
          paddingTop: '10px',
          paddingBottom: '10px'
        }}>
          <iframe 
            srcDoc={previewHtml}
            style={{
              width: '210mm',
              height: '297mm',
              minHeight: '297mm',
              background: '#fff',
              border: 'none',
              boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
              borderRadius: '4px',
              flexShrink: 0
            }}
            title="Live Preview"
          />
        </div>
      </div>
    </div>
  );
}