// app/page.tsx
'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { Message } from '../types';

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

  // Fetch messages on component mount
  useEffect(() => {
    fetchMessages();
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
        // If we're currently filtering, maintain the filter
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
    <div style={styles.container}>
      <h1 style={styles.title}>Message Board</h1>
      
      {/* Message Form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label htmlFor="name" style={styles.label}>Your Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter your name"
          />
        </div>
        
        <div style={styles.inputGroup}>
          <label htmlFor="message" style={styles.label}>Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={4}
            style={styles.textarea}
            placeholder="Enter your message"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          style={loading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>

      {/* Search Form */}
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <div style={styles.searchInputGroup}>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search messages by name..."
              style={styles.searchInput}
            />
            <button 
              type="submit" 
              disabled={searching}
              style={styles.searchButton}
            >
              {searching ? 'Searching...' : 'Search'}
            </button>
            {searchName && (
              <button 
                type="button" 
                onClick={clearSearch}
                style={styles.clearButton}
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Messages Display */}
      <div style={styles.messagesContainer}>
        <h2 style={styles.messagesTitle}>
          Messages ({messages.length})
          {searchName && (
            <span style={styles.searchIndicator}> - Filtered by "{searchName}"</span>
          )}
        </h2>
        
        {messages.length === 0 ? (
          <p style={styles.noMessages}>
            {searchName ? `No messages found for "${searchName}".` : 'No messages yet. Be the first to post!'}
          </p>
        ) : (
          <div style={styles.messagesList}>
            {messages.map((msg: Message) => (
              <div key={msg.id} style={styles.messageCard}>
                <div style={styles.messageHeader}>
                  <strong style={styles.messageName}>{msg.name}</strong>
                  <span style={styles.messageTime}>
                    {new Date(msg.timestamp).toLocaleDateString()} at{' '}
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div style={styles.messageContent}>{msg.message}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    lineHeight: '1.6',
  },
  title: {
    textAlign: 'center' as const,
    color: '#333',
    marginBottom: '30px',
  },
  form: {
    backgroundColor: '#f9f9f9',
    padding: '20px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ddd',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold' as const,
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    boxSizing: 'border-box' as const,
  },
  textarea: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
    resize: 'vertical' as const,
    boxSizing: 'border-box' as const,
  },
  button: {
    backgroundColor: '#007cba',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer' as const,
    transition: 'background-color 0.3s',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed' as const,
  },
  searchContainer: {
    backgroundColor: '#f0f8ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #b3d9ff',
  },
  searchForm: {
    margin: 0,
  },
  searchInputGroup: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '16px',
  },
  searchButton: {
    backgroundColor: '#28a745',
    color: 'white',
    padding: '10px 20px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer' as const,
    whiteSpace: 'nowrap' as const,
  },
  clearButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer' as const,
    whiteSpace: 'nowrap' as const,
  },
  messagesContainer: {
    marginTop: '20px',
  },
  messagesTitle: {
    color: '#333',
    borderBottom: '2px solid #007cba',
    paddingBottom: '10px',
  },
  searchIndicator: {
    fontSize: '14px',
    fontStyle: 'italic' as const,
    color: '#666',
  },
  noMessages: {
    textAlign: 'center' as const,
    color: '#666',
    fontStyle: 'italic' as const,
    padding: '20px',
  },
  messagesList: {
    marginTop: '20px',
  },
  messageCard: {
    backgroundColor: 'white',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  messageHeader: {
    display: 'flex',
    justifyContent: 'space-between' as const,
    alignItems: 'center' as const,
    marginBottom: '10px',
    borderBottom: '1px solid #eee',
    paddingBottom: '5px',
  },
  messageName: {
    color: '#007cba',
    fontSize: '16px',
  },
  messageTime: {
    color: '#666',
    fontSize: '12px',
  },
  messageContent: {
    color: '#333',
    fontSize: '14px',
    lineHeight: '1.5',
  },
};