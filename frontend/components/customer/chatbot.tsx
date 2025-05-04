'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  ChevronUp,
  ChevronDown,
  Bot,
} from 'lucide-react';

// Define our types
type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

// Fallback responses in case of API failure
const botResponses = [
  'Hi there! How can I help you today?',
  'We’re open from 9am to 9pm, every day!',
  'You can return items within 30 days with a receipt.',
  'Shipping usually takes 3–5 business days.',
  'Yes! We have a sale going on right now — check our homepage!',
  'You can call us at (123) 456-7890.',
  'Yes, we offer gift wrapping at checkout!',
  'We have a loyalty program! Ask us how to join.',
  'Sorry to hear that. Let’s solve your issue together.',
  'Our store is located at 123 Main Street.',
  'I’m not sure about that, but I’m happy to help!',
];

export const getResponse = async (userMessage: string): Promise<string> => {
  const apiToken = process.env.NEXT_PUBLIC_HF_API_TOKEN;
  const apiUrl = process.env.NEXT_PUBLIC_HF_URL; // Correct model URL

  const apiRequestJson = {
    inputs: `<s>[INST] You are a helpful store assistant. Keep answers short and friendly. ${userMessage} [/INST]`,
    parameters: {
      max_length: 50,
      temperature: 0.7,
      top_p: 0.9,
    },
  };

  try {
    if (!apiUrl) {
      throw new Error(
        'API URL is not defined. Please check your environment variables.',
      );
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(apiRequestJson),
    });

    if (!response.ok) {
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later.');
      }
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Hugging Face API Response:', data);

    // Extract and clean the generated text
    if (data && data[0] && data[0].generated_text) {
      const rawText = data[0].generated_text;
      // Remove the prompt part from the response
      const responseText = rawText.split('[/INST]')[1]?.trim() || rawText;
      return responseText;
    }

    throw new Error('Invalid response format from Hugging Face API');
  } catch (error: any) {
    console.error('Hugging Face API error:', error.message || error);

    // Fallback logic
    const lowercaseMessage = userMessage.toLowerCase();
    if (lowercaseMessage.includes('hello') || lowercaseMessage.includes('hi')) {
      return botResponses[0];
    } else if (
      lowercaseMessage.includes('hours') ||
      lowercaseMessage.includes('open')
    ) {
      return botResponses[1];
    } else if (
      lowercaseMessage.includes('return') ||
      lowercaseMessage.includes('policy')
    ) {
      return botResponses[2];
    } else if (
      lowercaseMessage.includes('shipping') ||
      lowercaseMessage.includes('delivery')
    ) {
      return botResponses[3];
    } else if (
      lowercaseMessage.includes('sale') ||
      lowercaseMessage.includes('discount')
    ) {
      return botResponses[4];
    } else if (
      lowercaseMessage.includes('phone') ||
      lowercaseMessage.includes('call')
    ) {
      return botResponses[5];
    } else if (
      lowercaseMessage.includes('gift') ||
      lowercaseMessage.includes('wrap')
    ) {
      return botResponses[6];
    } else if (
      lowercaseMessage.includes('loyalty') ||
      lowercaseMessage.includes('program')
    ) {
      return botResponses[7];
    } else if (
      lowercaseMessage.includes('issue') ||
      lowercaseMessage.includes('problem')
    ) {
      return botResponses[8];
    } else if (
      lowercaseMessage.includes('location') ||
      lowercaseMessage.includes('store')
    ) {
      return botResponses[9];
    } else {
      return botResponses[10];
    }
  }
};

// The main component
export default function CustomerServiceChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I help you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages come in
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Handle opening the chat
  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  // Handle closing the chat
  const handleClose = () => {
    setIsOpen(false);
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    const userText = inputValue;
    setMessages([...messages, userMessage]);
    setInputValue('');

    // Show typing indicator
    const typingIndicatorId = `typing-${Date.now()}`;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: typingIndicatorId,
        content: '...',
        isUser: false,
        timestamp: new Date(),
      },
    ]);

    // Timeout for typing indicator (remove after 5 seconds if no response)
    const timeoutId = setTimeout(() => {
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== typingIndicatorId),
      );
    }, 5000);

    // Get response from Hugging Face API
    getResponse(userText)
      .then((responseText) => {
        clearTimeout(timeoutId); // Clear timeout
        // Remove typing indicator and add actual response
        setMessages((prevMessages) => {
          const filteredMessages = prevMessages.filter(
            (msg) => msg.id !== typingIndicatorId,
          );
          return [
            ...filteredMessages,
            {
              id: `bot-${Date.now()}`,
              content: responseText,
              isUser: false,
              timestamp: new Date(),
            },
          ];
        });
      })
      .catch((error) => {
        clearTimeout(timeoutId); // Clear timeout
        console.error('Error in chat response:', error);
        // Remove typing indicator and add error message
        setMessages((prevMessages) => {
          const filteredMessages = prevMessages.filter(
            (msg) => msg.id !== typingIndicatorId,
          );
          return [
            ...filteredMessages,
            {
              id: `bot-${Date.now()}`,
              content:
                error.message === 'Rate limit exceeded. Please try again later.'
                  ? 'Sorry, I’m a bit busy! Try again in a moment.'
                  : "Sorry, I'm having trouble right now. How can I help you?",
              isUser: false,
              timestamp: new Date(),
            },
          ];
        });
      });
  };

  // Handle pressing Enter to send
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 font-sans">
      {/* Chat button */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="bg-green-600 text-white p-2 rounded-full shadow-lg hover:bg-green-700 transition-all duration-200 flex items-center justify-center"
        >
          <Bot size={44} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl flex flex-col w-80 max-h-96 border border-gray-200">
          {/* Chat header */}
          <div className="bg-green-600 text-white p-3 rounded-t-lg flex justify-between items-center">
            <div className="flex items-center">
              <MessageSquare size={20} className="mr-2" />
              <span className="font-medium">Customer Service</span>
            </div>
            <div className="flex">
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                className="p-1 hover:bg-green-700 rounded"
              >
                {isMinimized ? (
                  <ChevronUp size={18} />
                ) : (
                  <ChevronDown size={18} />
                )}
              </button>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-green-700 rounded ml-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat body - hidden when minimized */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-3 overflow-y-auto max-h-72 bg-gray-50">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 flex ${
                      msg.isUser ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`p-3 rounded-lg max-w-xs ${
                        msg.isUser
                          ? 'bg-green-600 text-white rounded-br-none'
                          : 'bg-gray-200 text-gray-800 rounded-bl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat input */}
              <div className="border-t border-gray-200 p-3 flex">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-green-600 text-white px-4 py-2 rounded-r-lg hover:bg-green-700 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
