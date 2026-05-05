import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import "./App.css";

const socket = io("https://chat-app-c4qg.onrender.com"); // Connect to backend

function App() {
  const [username, setUsername] = useState(""); // Stores the final username
  const [tempUsername, setTempUsername] = useState(""); // Temporary storage before confirming username
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on("message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => socket.off("message");
  }, []);

  const sendMessage = () => {
    if (message.trim() && username.trim()) {
      const data = { username, text: message };
      socket.emit("message", data);
      setMessage("");
    }
  };

  return (
    <div
      className="chat-container"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL + "/background.jpg"})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "100vh",
      }}
    >
      <h1>Real-Time Chat App</h1>

      {/* Username Input */}
      {!username && (
        <div className="username-container">
          <input
            type="text"
            placeholder="Enter your name..."
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)} // Store input temporarily
          />
          <button onClick={() => setUsername(tempUsername)}>Join Chat</button>
        </div>
      )}

      {/* Chat Window */}
      {username && (
        <div className="chat-box">
          <div className="messages">
            {messages.map((msg, index) => (
              <p key={index}><strong>{msg.username}:</strong> {msg.text}</p>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
}

export default App;
