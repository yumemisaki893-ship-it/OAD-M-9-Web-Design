import React, { useState, useEffect, useRef } from 'react';
import { 
  listenToChats, 
  listenToMessages, 
  sendMessage, 
  markChatAsRead, 
  getOrCreateChat, 
  blockUser,
  getStudentById,
  getStudents
} from '../utils/storage';
import { AvatarImage } from './AvatarPicker';

export const ChatBox = ({ currentUser, activeChatTrigger, clearActiveChatTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [recipient, setRecipient] = useState(null);
  const [friendsList, setFriendsList] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'chat'
  const [totalUnread, setTotalUnread] = useState(0);

  const messagesEndRef = useRef(null);

  // If there's an external trigger (e.g. from ProfileDetail "Send Message")
  useEffect(() => {
    if (activeChatTrigger && currentUser) {
      const startTriggerChat = async () => {
        const chat = await getOrCreateChat(currentUser.studentId, activeChatTrigger);
        const peer = await getStudentById(activeChatTrigger);
        setRecipient(peer);
        setActiveChat(chat);
        setView('chat');
        setIsOpen(true);
        clearActiveChatTrigger();
      };
      startTriggerChat();
    }
  }, [activeChatTrigger, currentUser]);

  // Load active chats list in real-time
  useEffect(() => {
    if (!currentUser) return;
    
    const unsubscribe = listenToChats(currentUser.studentId, async (chatList) => {
      // Resolve participants' student profiles
      const resolvedChats = await Promise.all(
        chatList.map(async (chat) => {
          const otherId = chat.participants.find(id => id !== currentUser.studentId);
          const peer = await getStudentById(otherId);
          return { ...chat, peer };
        })
      );
      
      // Filter out chats with users who blocked us or whom we blocked
      const cleanChats = resolvedChats.filter(chat => {
        if (!chat.peer) return false;
        const blockedByMe = currentUser.student?.blockedUsers?.includes(chat.peer.id);
        const blockedByThem = chat.peer.blockedUsers?.includes(currentUser.studentId);
        return !blockedByMe && !blockedByThem;
      });

      setChats(cleanChats);

      // Compute total unread count
      const unreadCount = cleanChats.reduce((acc, curr) => {
        if (curr.lastMessage && curr.lastMessage.senderId !== currentUser.studentId && !curr.lastMessage.read) {
          return acc + 1;
        }
        return acc;
      }, 0);
      setTotalUnread(unreadCount);
    });

    return () => unsubscribe();
  }, [currentUser, currentUser?.student?.blockedUsers]);

  // Load messages in real-time when active chat changes
  useEffect(() => {
    if (!activeChat || !currentUser) return;

    // Mark as read immediately on selection
    markChatAsRead(activeChat.id, currentUser.studentId);

    const unsubscribe = listenToMessages(activeChat.id, (messageList) => {
      setMessages(messageList);
      // Auto-scroll
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [activeChat, currentUser]);

  // Read message triggers scroll and read markings
  useEffect(() => {
    if (messages.length > 0 && activeChat && currentUser) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderId !== currentUser.studentId && !lastMsg.read) {
        markChatAsRead(activeChat.id, currentUser.studentId);
      }
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Load Friends List to start new chats
  const loadFriends = async () => {
    if (!currentUser) return;
    const students = await getStudents();
    const userProfile = students.find(s => s.id === currentUser.studentId);
    
    if (userProfile && userProfile.friends) {
      const friends = students.filter(s => 
        userProfile.friends.includes(s.id) &&
        !userProfile.blockedUsers?.includes(s.id) &&
        !s.blockedUsers?.includes(currentUser.studentId)
      );
      setFriendsList(friends);
    } else {
      setFriendsList([]);
    }
  };

  const handleSelectFriend = async (friend) => {
    const chat = await getOrCreateChat(currentUser.studentId, friend.id);
    setRecipient(friend);
    setActiveChat(chat);
    setView('chat');
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChat || !currentUser) return;

    await sendMessage(activeChat.id, currentUser.studentId, newMessageText.trim());
    setNewMessageText('');
  };

  const handleBlock = async () => {
    if (!recipient || !currentUser) return;
    if (window.confirm(`Are you sure you want to block ${recipient.name}? You will no longer see each other's profiles or messages.`)) {
      await blockUser(currentUser.studentId, recipient.id);
      setView('list');
      setActiveChat(null);
      setRecipient(null);
    }
  };

  if (!currentUser) return null;

  const isBlocked = recipient && (
    (currentUser.student?.blockedUsers?.includes(recipient.id)) ||
    (recipient.blockedUsers?.includes(currentUser.studentId))
  );

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000, fontFamily: 'system-ui, sans-serif' }}>
      
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            loadFriends();
          }}
          style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--accent)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transition: 'transform 0.2s ease-in-out',
            outline: 'none'
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          aria-label="Open Chat"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '28px', height: '28px' }}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          {totalUnread > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: 'var(--danger)',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 'bold',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
              }}
            >
              {totalUnread}
            </span>
          )}
        </button>
      )}

      {/* Chatbox Window Container */}
      {isOpen && (
        <div
          className="glass"
          style={{
            width: '380px',
            height: '520px',
            borderRadius: '16px',
            border: '1px solid var(--border-color)',
            boxShadow: '0 12px 36px rgba(0,0,0,0.25)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            animation: 'fadeInUp 0.2s ease-out',
            textAlign: 'left'
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem'
            }}
          >
            {view === 'chat' && recipient ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, overflow: 'hidden' }}>
                <button
                  onClick={() => setView('list')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    padding: '0.2rem'
                  }}
                  title="Back to List"
                >
                  ←
                </button>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <AvatarImage avatarId={recipient.avatarId} id={`chat-head-${recipient.id}`} />
                </div>
                <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '0.9rem', color: 'var(--text-primary)' }}>{recipient.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>Active Chat</div>
                </div>
                {!isBlocked && (
                  <button
                    onClick={handleBlock}
                    style={{
                      background: 'var(--danger-bg)',
                      border: '1px solid var(--danger-border)',
                      color: 'var(--danger)',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '0.5rem'
                    }}
                  >
                    Block
                  </button>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <span style={{ fontWeight: 'bold', color: 'var(--text-primary)' }}>Messages</span>
                <button
                  onClick={async () => {
                    await loadFriends();
                    setView(view === 'friends' ? 'list' : 'friends');
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: 600
                  }}
                >
                  {view === 'friends' ? 'View Chats' : '+ New Chat'}
                </button>
              </div>
            )}
            
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                fontSize: '1.2rem',
                lineHeight: 1
              }}
              title="Minimize"
            >
              ✕
            </button>
          </div>

          {/* Body */}
          <div style={{ flex: 1, overflowY: 'auto', background: 'rgba(0,0,0,0.1)' }}>
            
            {/* VIEW: Chat List */}
            {view === 'list' && (
              <div>
                {chats.length === 0 ? (
                  <div style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>No conversations yet.</p>
                    <button
                      onClick={async () => {
                        await loadFriends();
                        setView('friends');
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      Browse Friends
                    </button>
                  </div>
                ) : (
                  chats.map((chat) => {
                    const unread = chat.lastMessage && chat.lastMessage.senderId !== currentUser.studentId && !chat.lastMessage.read;
                    return (
                      <div
                        key={chat.id}
                        onClick={() => {
                          setRecipient(chat.peer);
                          setActiveChat(chat);
                          setView('chat');
                        }}
                        style={{
                          padding: '0.85rem 1rem',
                          borderBottom: '1px solid var(--border-color)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.75rem',
                          cursor: 'pointer',
                          background: unread ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent',
                          transition: 'background 0.2s'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseOut={(e) => e.currentTarget.style.background = unread ? 'rgba(var(--accent-rgb), 0.05)' : 'transparent'}
                      >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                          <AvatarImage avatarId={chat.peer.avatarId} id={`chat-list-${chat.peer.id}`} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.15rem' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{chat.peer.name}</span>
                            {chat.lastMessage && (
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                {new Date(chat.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ 
                              fontSize: '0.8rem', 
                              color: unread ? 'var(--text-primary)' : 'var(--text-muted)',
                              fontWeight: unread ? 600 : 'normal',
                              textOverflow: 'ellipsis',
                              overflow: 'hidden',
                              whiteSpace: 'nowrap',
                              flex: 1
                            }}>
                              {chat.lastMessage ? chat.lastMessage.text : 'Start a conversation'}
                            </span>
                            {unread && (
                              <span style={{
                                width: '8px',
                                height: '8px',
                                background: 'var(--accent)',
                                borderRadius: '50%',
                                marginLeft: '0.5rem',
                                flexShrink: 0
                              }}></span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* VIEW: Friends Selector (New Chat) */}
            {view === 'friends' && (
              <div style={{ padding: '0.5rem 0' }}>
                <div style={{ padding: '0.5rem 1rem', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 'bold' }}>
                  Select Friend to Chat
                </div>
                {friendsList.length === 0 ? (
                  <div style={{ padding: '2rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    <p style={{ fontSize: '0.85rem' }}>You don't have any friends added yet. Connect with students in the directory first!</p>
                  </div>
                ) : (
                  friendsList.map(friend => (
                    <div
                      key={friend.id}
                      onClick={() => handleSelectFriend(friend)}
                      style={{
                        padding: '0.75rem 1rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                      onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                        <AvatarImage avatarId={friend.avatarId} id={`new-chat-${friend.id}`} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 'bold', fontSize: '0.875rem', color: 'var(--text-primary)' }}>{friend.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{friend.major}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* VIEW: Chat Window Messages */}
            {view === 'chat' && (
              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', minHeight: '100%' }}>
                {messages.map((msg) => {
                  const isOwn = msg.senderId === currentUser.studentId;
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isOwn ? 'flex-end' : 'flex-start',
                        maxWidth: '75%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: isOwn ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div
                        style={{
                          background: isOwn ? 'var(--accent)' : 'rgba(255,255,255,0.08)',
                          color: isOwn ? '#fff' : 'var(--text-primary)',
                          padding: '0.6rem 0.85rem',
                          borderRadius: isOwn ? '12px 12px 0 12px' : '12px 12px 12px 0',
                          fontSize: '0.85rem',
                          lineHeight: '1.4',
                          border: isOwn ? 'none' : '1px solid var(--border-color)',
                          wordBreak: 'break-word',
                          textAlign: 'left'
                        }}
                      >
                        {msg.text}
                      </div>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {isOwn && (
                          <span style={{ marginLeft: '0.25rem', color: msg.read ? 'var(--accent)' : 'var(--text-muted)' }}>
                            {msg.read ? '✓✓' : '✓'}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}

          </div>

          {/* Footer Input Area */}
          {view === 'chat' && (
            <div style={{ borderTop: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.02)' }}>
              {isBlocked ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--danger)', fontSize: '0.8rem', fontWeight: 600 }}>
                  🚫 Conversation unavailable (User Blocked)
                </div>
              ) : (
                <form onSubmit={handleSend} style={{ display: 'flex', padding: '0.75rem', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    style={{
                      flex: 1,
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      background: 'var(--accent)',
                      border: 'none',
                      color: '#fff',
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '14px', height: '14px', transform: 'rotate(45deg) translate(-1px, 1px)' }}>
                      <line x1="22" y1="2" x2="11" y2="13" />
                      <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default ChatBox;
