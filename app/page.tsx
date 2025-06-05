'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Message } from '../types';
import { Button } from '@/components/button';

interface FormData {
  name: string;
  message: string;
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [formData, setFormData] = useState<FormData>({ name: '', message: '' });
  const [searchName, setSearchName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [searching, setSearching] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    fetchMessages();
    setIsVisible(true);
  }, []);

  const fetchMessages = async (nameFilter?: string): Promise<void> => {
    try {
      setSearching(true);
      const url = nameFilter 
        ? `/api/messages?name=${encodeURIComponent(nameFilter)}`
        : '/api/messages';
      
      const response = await fetch(url);
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({ name: '', message: '' });
        fetchMessages(searchName || undefined);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    fetchMessages(searchName);
  };

  const clearSearch = (): void => {
    setSearchName('');
    fetchMessages();
  };

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        body {
          font-family: 'Poppins', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%);
          background-size: 400% 400%;
          animation: gradientShift 15s ease infinite;
          min-height: 100vh;
          overflow-x: hidden;
        }

        /* Animated background particles */
        .bg-particles {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          z-index: -1;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }

        .particle:nth-child(1) { width: 80px; height: 80px; left: 10%; animation-delay: 0s; }
        .particle:nth-child(2) { width: 20px; height: 20px; left: 20%; animation-delay: 2s; }
        .particle:nth-child(3) { width: 60px; height: 60px; left: 30%; animation-delay: 4s; }
        .particle:nth-child(4) { width: 40px; height: 40px; left: 40%; animation-delay: 1s; }
        .particle:nth-child(5) { width: 100px; height: 100px; left: 50%; animation-delay: 3s; }
        .particle:nth-child(6) { width: 30px; height: 30px; left: 60%; animation-delay: 5s; }
        .particle:nth-child(7) { width: 70px; height: 70px; left: 70%; animation-delay: 1.5s; }
        .particle:nth-child(8) { width: 50px; height: 50px; left: 80%; animation-delay: 3.5s; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.8; }
        }

        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        @keyframes titleReveal {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes cardSlideIn {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes messageSlideIn {
          from {
            transform: translateX(-100px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }

        @keyframes buttonGlow {
          0%, 100% { box-shadow: 0 0 20px rgba(255, 107, 107, 0.3); }
          50% { box-shadow: 0 0 40px rgba(255, 107, 107, 0.6); }
        }

        @keyframes shimmer {
          0% { background-position: -200px 0; }
          100% { background-position: calc(200px + 100%) 0; }
        }

        /* Mobile responsive breakpoints */
        @media (max-width: 768px) {
          .container {
            padding: 1rem !important;
          }
          
          .main-title {
            font-size: 2.5rem !important;
          }
          
          .glass-card {
            padding: 1.5rem !important;
          }
          
          .search-input-group {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          
          .search-input-group button {
            width: 100% !important;
          }
        }

        @media (max-width: 480px) {
          .main-title {
            font-size: 2rem !important;
          }
          
          .glass-card {
            padding: 1rem !important;
          }
        }
      `}</style>

      {/* Animated background particles */}
      
      <div className="bg-particles">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="particle"></div>
        ))}
      </div>

      <div style={styles.container}>
        {/* Main title with glowing effect */}
        <h1 style={{
          ...styles.mainTitle,
          animation: isVisible ? 'titleReveal 1s ease-out 0.5s forwards, gradientShift 3s ease-in-out infinite' : 'none'
        }}>
          Unsent Letters
        </h1>
        
        {/* Message Form */}
        <div style={{
          ...styles.glassCard,
          ...styles.formCard,
          animation: isVisible ? 'cardSlideIn 0.8s ease-out 0.2s forwards' : 'none'
        }}>
          <h2 style={styles.cardTitle}>
            Send heartfelt letters to those who matter ✨
          </h2>
          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.inputGroup}>
              <label htmlFor="name" style={styles.label}>To Someone Special</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                style={styles.input}
                placeholder="Enter a Name....."
              />
            </div>
            
            <div style={styles.inputGroup}>
              <label htmlFor="message" style={styles.label}>Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={4}
                style={styles.textarea}
                placeholder="Pour your heart out.."
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            >
              <span style={styles.buttonContent}>
                {loading ? (
                  <>
                    <div style={styles.spinner}></div>
                    Sending...
                  </>
                ) : (
                  <>
                   Send Message
                  </>
                )}
              </span>
            </button>
          </form>
        </div>

        {/* Search Form */}
        <div style={{
          ...styles.glassCard,
          ...styles.searchCard,
          animation: isVisible ? 'cardSlideIn 0.8s ease-out 0.4s forwards' : 'none'
        }}>
          <h2 style={styles.cardTitle}>
            Search for letters sent to you....
          </h2>
          <form onSubmit={handleSearch} style={styles.searchForm}>
            <div style={styles.searchInputGroup} className="search-input-group">
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Search your Name..."
                style={styles.searchInput}
              />
              <button 
                type="submit" 
                disabled={searching}
                style={styles.searchButton}
              >
                {searching ? '🔄' : '🔍'} {searching ? 'Searching...' : 'Search'}
              </button>
              {searchName && (
                <button 
                  type="button" 
                  onClick={clearSearch}
                  style={styles.clearButton}
                >
                  ❌ Clear
                </button>
                
              )}
            </div>
          </form>
        </div>

        {/* Messages Display - Only show when searching */}
        {searchName && (
          <div style={{
            ...styles.glassCard,
            ...styles.messagesCard,
            animation: isVisible ? 'cardSlideIn 0.8s ease-out 0.6s forwards' : 'none'
          }}>
            <h2 style={styles.messagesTitle}>
             💌 Unsent Letters ({messages.length})
              <span style={styles.searchIndicator}> - "{searchName}"</span>
            </h2>
            
            {messages.length === 0 ? (
              <div style={styles.noMessages}>
                <div style={styles.emptyIcon}>📭</div>
                <p>
                  No messages found for "{searchName}".
                </p>
              </div>
            ) : (
              <div style={styles.messagesList}>
                {messages.map((msg: Message, index: number) => (
                  <div 
                    key={msg.id} 
                    style={{
                      ...styles.messageCard,
                      animation: `messageSlideIn 0.6s ease-out ${index * 0.1}s forwards`
                    }}
                  >
                    <div style={styles.messageHeader}>
                      <div style={styles.messageInfo}>
                        <strong style={styles.messageName}>For {msg.name}</strong>
                        <span style={styles.messageTime}>
                          {new Date(msg.timestamp).toLocaleDateString()} • {' '}
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span> 
                      </div>
                    </div>
                    <div style={styles.messageContent}>{msg.message}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </>
    
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    position: 'relative' as const,
    zIndex: 1,
  },
  mainTitle: {
    textAlign: 'center' as const,
    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
    fontWeight: 800,
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)',
    backgroundSize: '300% 300%',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '3rem',
    textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
    transform: 'translateY(-20px)',
    opacity: 0,
  },
  glassCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    marginBottom: '2rem',
    transform: 'translateY(50px)',
    opacity: 0,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  },
  formCard: {
    animationDelay: '0.2s',
  },
  searchCard: {
    animationDelay: '0.4s',
  },
  messagesCard: {
    animationDelay: '0.6s',
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: 'rgba(255, 255, 255, 0.9)',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  input: {
    padding: '1rem',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    fontSize: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  textarea: {
    padding: '1rem',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    fontSize: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    outline: 'none',
    resize: 'vertical' as const,
    fontFamily: 'inherit',
  },
  button: {
    padding: '1rem 2rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    background: 'linear-gradient(45deg, #ff6b6b, #ff8e8e)',
    color: 'white',
    cursor: 'pointer' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  },
  buttonDisabled: {
    background: 'rgba(255, 255, 255, 0.2)',
    cursor: 'not-allowed' as const,
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  },
  spinner: {
    width: '16px',
    height: '16px',
    border: '2px solid rgba(255, 255, 255, 0.3)',
    borderTop: '2px solid white',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  searchForm: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  searchInputGroup: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap' as const,
  },
  searchInput: {
    flex: 1,
    minWidth: '200px',
    padding: '1rem',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    fontSize: '1rem',
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.3s ease',
    outline: 'none',
  },
  searchButton: {
    padding: '1rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: 600,
    background: 'linear-gradient(45deg, #4ecdc4, #44a08d)',
    color: 'white',
    cursor: 'pointer' as const,
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
  },
  clearButton: {
    padding: '1rem 1.5rem',
    border: 'none',
    borderRadius: '12px',
    fontSize: '0.9rem',
    fontWeight: 600,
    background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
    color: 'white',
    cursor: 'pointer' as const,
    transition: 'all 0.3s ease',
    whiteSpace: 'nowrap' as const,
  },
  messagesTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: 'white',
    marginBottom: '1.5rem',
    textAlign: 'center' as const,
  },
  searchIndicator: {
    fontSize: '1rem',
    fontStyle: 'italic' as const,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  noMessages: {
    textAlign: 'center' as const,
    color: 'rgba(255, 255, 255, 0.8)',
    padding: '3rem 1rem',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  messagesList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
  },
  messageCard: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '1.5rem',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'translateX(-100px)',
    opacity: 0,
  },
  messageHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  messageAvatar: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'white',
    flexShrink: 0,
  },
  messageInfo: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.25rem',
  },
  messageName: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'white',
  },
  messageTime: {
    fontSize: '0.85rem',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  messageContent: {
    fontSize: '1rem',
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: '1.6',
  },
};