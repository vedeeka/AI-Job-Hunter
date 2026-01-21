'use client'
import { useState } from 'react';
import { Send } from 'lucide-react';

const InterviewCoach = () => {
  const [messages, setMessages] = useState([
    { role: 'ai', text: "I've analyzed Google's engineering blog. Ready to practice System Design?" }
  ]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    // Add User Message
    const newMsgs = [...messages, { role: 'user', text: input }];
    setMessages(newMsgs);
    setInput("");

    // Simulate AI typing (In real app, fetch from Backend)
    setTimeout(() => {
      setMessages([...newMsgs, { role: 'ai', text: "Great question. Google emphasizes scalability. Here is how you should answer..." }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-50 border rounded-xl overflow-hidden">
      <div className="bg-indigo-600 p-4 text-white font-bold">
        🤖 AI Interview Coach
      </div>
      
      {/* Chat History */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white shadow-sm text-gray-800'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about the company culture..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button onClick={sendMessage} className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default InterviewCoach;