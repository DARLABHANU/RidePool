import React, { useState, useEffect, useRef } from 'react';
import { X, Send } from 'lucide-react';
import { io } from 'socket.io-client';
import './ChatModal.css';

const ENDPOINT = 'http://localhost:5000';

const ChatModal = ({ ride, onClose, currentUser }) => {
    const [messages, setMessages] = useState(ride.messages || []);
    const [newMessage, setNewMessage] = useState('');
    const socketRef = useRef();
    const messagesEndRef = useRef(null);

    useEffect(() => {
        // Init socket connection
        socketRef.current = io(ENDPOINT);
        
        // Join this specific ride's chat room
        socketRef.current.emit('join_ride_chat', ride._id);

        // Listen for incoming messages
        socketRef.current.on('receive_message', (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [ride._id]);

    useEffect(() => {
        // Auto scroll to latest message
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageData = {
            rideId: ride._id,
            senderId: currentUser._id,
            senderName: currentUser.name,
            text: newMessage.trim(),
            timestamp: new Date()
        };

        // Emit through socket
        socketRef.current.emit('send_message', messageData);
        setNewMessage('');
    };

    return (
        <div className="chat-modal-overlay">
            <div className="chat-modal-container">
                <div className="chat-header">
                    <h3>Chat: {ride.from} → {ride.to}</h3>
                    <button className="chat-close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <div className="chat-messages">
                    {messages.length === 0 ? (
                        <p className="chat-empty">No messages yet. Say hello!</p>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMe = msg.sender === currentUser._id;
                            return (
                                <div key={idx} className={`chat-message ${isMe ? 'chat-message-me' : 'chat-message-other'}`}>
                                    <span className="chat-sender">{isMe ? 'You' : msg.name}</span>
                                    <div className="chat-bubble">
                                        {msg.text}
                                    </div>
                                    <span className="chat-time">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-area" onSubmit={handleSendMessage}>
                    <input 
                        type="text" 
                        placeholder="Type a message..." 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button type="submit" className="chat-send-btn">
                        <Send size={18} />
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatModal;
