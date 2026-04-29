'use client';

import { useState, useRef, useEffect } from 'react';

type Message = { role: 'user' | 'bot'; text: string };

// ── Knowledge base ──────────────────────────────────────────────
const KB = {
  services: [
    'Body Building – Specialized hypertrophy programs with expert guidance.',
    'Self Defence – Confidence-building classes for ladies and kids.',
    'Steam Bath – Relax muscles and skin after a workout.',
    'Cardio – Best quality machines for heart health & endurance.',
    'Crossfit – Strength, speed and conditioning workouts.',
    'Strength Training – Improve muscles, strength and endurance.',
    'Personal Training – Certified coaches guiding you 1-on-1.',
    'Yoga – Inner peace and good health with certified teachers.',
    'Diet & Nutrition – Personalised diet plans by certified nutritionists.',
    'Ladies Batch – Special timings and sessions for ladies.',
  ],
  amenities: [
    'Air Conditioned Gym', 'WiFi', 'CCTV Security', 'Music System',
    'Lockers', 'Steam Bath', 'Shower Room', 'Changing Room',
    'Advance Equipment',
  ],
  schedule: [
    'Gym Hours: Monday – Saturday, 6 AM – 9 AM & 5 PM – 9 PM',
    'Yoga Classes: Monday – Saturday, 5 AM – 7 AM',
    'Sunday: Closed (Rest Day)',
  ],
  contact: {
    address: 'Opposite Limbi Lake, Loni Road, Lonar',
    phone: '+91 9527958899 / +91 8308068899',
    email: 'powersoulfitness@gmail.com',
    whatsapp: 'https://api.whatsapp.com/send?phone=919527958899',
  },
  about: [
    'Power Soul Fitness is Lonar\'s premier fitness center.',
    'Founded and led by Mr. Shiv Mapari, with experience from Saish Health & Fitness, Pune and RIO Fitness, Bangalore.',
    'Mission: To make clients fit — physically and mentally.',
    'Vision: Healthy, happy lives through the best fitness services.',
    'We believe fitness is not just a body transformation — it\'s a POWER SOUL.',
  ],
};

// ── Simple intent matcher ────────────────────────────────────────
function getBotResponse(input: string): string {
  const q = input.toLowerCase();

  if (/(hi|hello|hey|helo|namaste|hy)/.test(q)) {
    return "Hello! 👋 Welcome to Power Soul Fitness! I'm your fitness assistant. Ask me about our services, timings, location, membership, or anything else!";
  }
  if (/(service|offer|program|class|training|what do you|do you have)/.test(q)) {
    return `We offer 10 premium services:\n\n${KB.services.map((s, i) => `${i + 1}. ${s}`).join('\n')}`;
  }
  if (/(amenit|facilit|equipment|feature|steam|ac|wifi|locker|shower|cctv)/.test(q)) {
    return `Our world-class amenities include:\n\n${KB.amenities.map(a => `✅ ${a}`).join('\n')}`;
  }
  if (/(time|schedule|hour|open|close|timing|batch|morning|evening|yoga)/.test(q)) {
    return `Our Training Schedule:\n\n${KB.schedule.map(s => `⏰ ${s}`).join('\n')}\n\nNote: Sunday is our rest day.`;
  }
  if (/(location|address|where|find|map|lonar|loni|limbi)/.test(q)) {
    return `📍 We are located at:\n${KB.contact.address}\n\nJust search "Power Soul Fitness Lonar" on Google Maps to find us easily!`;
  }
  if (/(phone|call|number|contact|reach|whatsapp|message)/.test(q)) {
    return `📞 Call us: ${KB.contact.phone}\n📧 Email: ${KB.contact.email}\n💬 WhatsApp: Just click the WhatsApp button on our Contact page!`;
  }
  if (/(about|who|founder|shiv|mapari|mission|vision|team|story|owner)/.test(q)) {
    return KB.about.join('\n\n');
  }
  if (/(fee|price|cost|charge|membership|plan|join|rate|how much)/.test(q)) {
    return "For the latest membership plans and pricing, please 📞 call us at +91 9527958899 or 💬 WhatsApp us directly. We have flexible plans for everyone!";
  }
  if (/(diet|nutrition|food|meal|eat|weight loss|gain)/.test(q)) {
    return "💪 We offer personalized diet plans through our certified nutritionists!\n\nWe design customized meal plans based on your goals — whether it's weight loss, muscle gain, or general wellness.\n\n📞 Contact us to book a nutrition consultation!";
  }
  if (/(ladies|women|female|girl|self.?defence|defence)/.test(q)) {
    return "👩‍🦱 We have special services for ladies:\n\n✅ Ladies Batch – Special timings for convenience\n✅ Self Defence Classes – Confidence-building programs taught by certified experts\n✅ Yoga – Specifically curated for women's wellness\n\nYou're in a safe and supportive environment here!";
  }
  if (/(personal.?train|one.?on.?one|coach|trainer|guided)/.test(q)) {
    return "🏋️ Our Personal Training service pairs you with a certified, experienced coach.\n\nThey'll:\n- Assess your goals\n- Create a custom workout plan\n- Guide you through each session\n- Track your progress\n\n📞 Call +91 9527958899 to book your first session!";
  }
  if (/(yoga|peace|meditat|spiritual|flex|stretch)/.test(q)) {
    return "🧘 Our Yoga Classes run Monday to Saturday, 5 AM – 7 AM.\n\nTaught by certified yoga teachers, these classes improve:\n✅ Flexibility & posture\n✅ Mental peace & focus\n✅ Breathing & stress relief\n\nPerfect for all fitness levels!";
  }
  if (/(crossfit|hiit|functional|conditioning|speed|agility)/.test(q)) {
    return "⚡ Our Crossfit program is designed for high-intensity functional training.\n\nBenefits:\n✅ Improved strength & speed\n✅ Better cardiovascular conditioning\n✅ Full-body functional fitness\n\nIt's challenging, fun, and results-driven!";
  }
  if (/(sunday|holiday|rest|closed|off day)/.test(q)) {
    return "We are CLOSED on Sundays. 😴\n\nSunday is our weekly rest day.\n\nWe're open Monday to Saturday:\n⏰ Morning: 6 AM – 9 AM\n⏰ Evening: 5 PM – 9 PM";
  }
  if (/(thank|thanks|great|awesome|perfect|good|nice|superb|helpful)/.test(q)) {
    return "You're welcome! 😊🙏 We're always here to help. Feel free to ask anything else about Power Soul Fitness!";
  }
  if (/(bye|goodbye|see you|ok|okay|done)/.test(q)) {
    return "Goodbye! 💪 Stay fit, stay strong! See you at Power Soul Fitness, Lonar! 🏋️";
  }

  return "I'm not sure about that specific question 🤔. You can:\n\n📞 Call: +91 9527958899\n💬 WhatsApp: Click 'Contact' in the menu\n📧 Email: powersoulfitness@gmail.com\n\nOr try asking me about: services, timings, location, membership, or our facilities!";
}

const SUGGESTIONS = [
  'What services do you offer?',
  'What are your gym timings?',
  'Where are you located?',
  'Tell me about membership fees',
  'Do you have ladies batch?',
  'What amenities do you have?',
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'bot', text: "Hey there! 💪 I'm the Power Soul Fitness assistant.\n\nAsk me anything — services, timings, location, membership, or facilities!" }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    setShowSuggestions(false);
    setMessages(prev => [...prev, { role: 'user', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, { role: 'bot', text: getBotResponse(text) }]);
    }, 700 + Math.random() * 500);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open fitness assistant"
        className="chatbot-popup"
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '62px',
          height: '62px',
          borderRadius: '50%',
          background: open ? '#555' : 'linear-gradient(135deg, var(--primary), #6a0dad)',
          border: 'none',
          cursor: 'pointer',
          zIndex: 9999,
          boxShadow: open ? '0 4px 20px rgba(0,0,0,0.4)' : '0 0 0 0 rgba(168,98,237,0.7)',
          animation: open ? 'none' : 'chatPulse 2.5s infinite',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.3s ease',
          fontSize: '1.6rem',
          color: 'white',
        }}
      >
        {open ? <i className="fas fa-times"></i> : <i className="fas fa-comment-dots"></i>}
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="chatbot-popup"
          style={{
            position: 'fixed',
            bottom: '105px',
            right: '30px',
            width: '370px',
            maxWidth: 'calc(100vw - 40px)',
            height: '540px',
            maxHeight: 'calc(100vh - 130px)',
            background: '#111',
            border: '1px solid rgba(168,98,237,0.3)',
            borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(168,98,237,0.15)',
            zIndex: 9998,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'chatSlideUp 0.3s ease-out',
          }}
        >
          {/* Header */}
          <div style={{ padding: '16px 20px', background: 'linear-gradient(135deg, #1a0a2e, #2d0a5c)', borderBottom: '1px solid rgba(168,98,237,0.2)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), #6a0dad)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>
              🤖
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>PSF Assistant</div>
              <div style={{ color: '#25D366', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#25D366', display: 'inline-block', animation: 'blink 1.4s infinite' }} />
                Online · Power Soul Fitness
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', scrollbarWidth: 'thin', scrollbarColor: 'rgba(168,98,237,0.3) transparent' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary), #6a0dad)' : 'rgba(255,255,255,0.07)',
                    color: '#fff',
                    fontSize: '0.87rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    border: msg.role === 'bot' ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {typing && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '12px 16px', background: 'rgba(255,255,255,0.07)', borderRadius: '18px 18px 18px 4px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                  {[0, 1, 2].map(j => (
                    <span key={j} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block', animation: `bounce 1s ${j * 0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}

            {showSuggestions && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => sendMessage(s)}
                    style={{ background: 'rgba(168,98,237,0.12)', border: '1px solid rgba(168,98,237,0.3)', color: '#c9a0f7', padding: '7px 12px', borderRadius: '20px', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,98,237,0.25)'; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(168,98,237,0.12)'; }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
              placeholder="Ask about services, timings..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '25px', padding: '10px 16px', color: '#fff', fontSize: '0.87rem', outline: 'none', fontFamily: 'inherit' }}
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || typing}
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: input.trim() ? 'var(--primary)' : 'rgba(255,255,255,0.1)', border: 'none', cursor: input.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', flexShrink: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M2 21L23 12 2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes chatPulse {
          0% { box-shadow: 0 0 0 0 rgba(168,98,237,0.7); }
          70% { box-shadow: 0 0 0 14px rgba(168,98,237,0); }
          100% { box-shadow: 0 0 0 0 rgba(168,98,237,0); }
        }
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </>
  );
}
