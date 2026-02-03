'use client';
import { useEffect, useState } from 'react';

// Types
interface Template {
  id: string;
  name: string;
}

export default function ResumeForm() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch templates
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const res = await fetch('http://localhost:8000/templates');
        if (!res.ok) throw new Error('Failed to fetch templates');

        const data = await res.json();
        setTemplates(data);
      } catch (err) {
        console.error('Template API error:', err);
      }
    };

    fetchTemplates();
  }, []);

  // Generate & download PDF
  const handleGenerate = async () => {
    if (!selectedTemplate || !description) return;

    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          template_name: selectedTemplate,
          user_description: description,
        }),
      });

      if (!res.ok) throw new Error('PDF generation failed');

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert('Error generating resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>📄 AI Resume Builder</h1>

      <h3>1. Select a Template</h3>
      <div style={styles.grid}>
        {templates.map((t) => (
          <div
            key={t.id}
            style={styles.card(selectedTemplate === t.id)}
            onClick={() => setSelectedTemplate(t.id)}
          >
            <div style={{ fontSize: 30 }}>📝</div>
            <strong>{t.name}</strong>
          </div>
        ))}
      </div>

      {selectedTemplate && (
        <>
          <h3>2. Describe Yourself</h3>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. AI engineer with strong CV + backend skills..."
            style={styles.textarea}
          />

          <br /><br />

          <button
            onClick={handleGenerate}
            disabled={loading || !description}
            style={styles.button(loading)}
          >
            {loading ? '🤖 Generating...' : '⬇️ Download Resume'}
          </button>
        </>
      )}
    </div>
  );
}

// Inline styles (clean & centralized)
const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center' as const,
  },
  grid: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    margin: '20px 0',
  },
  card: (active: boolean) => ({
    border: active ? '3px solid #007bff' : '1px solid #ccc',
    padding: '20px',
    borderRadius: '8px',
    cursor: 'pointer',
    background: active ? '#eef' : '#fff',
    width: '150px',
  }),
  textarea: {
    width: '100%',
    height: '120px',
    padding: '10px',
    fontSize: '14px',
  },
  button: (loading: boolean) => ({
    padding: '15px 30px',
    fontSize: '16px',
    background: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: loading ? 'not-allowed' : 'pointer',
  }),
};
