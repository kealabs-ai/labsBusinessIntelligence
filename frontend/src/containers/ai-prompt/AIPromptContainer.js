import React, { useState } from 'react';
import AIPromptPresentational from '../../components/presentational/AIPromptPresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';

const AIPromptContainer = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    
    const newEntry = {
      id: Date.now(),
      prompt: prompt,
      response: `Resposta simulada para: "${prompt}". Aqui você pode integrar com OpenAI, Claude, ou outro LLM.`,
      timestamp: new Date().toLocaleTimeString(),
      date: new Date().toLocaleDateString()
    };

    setHistory(prev => [newEntry, ...prev]);
    
    // Adicionar à lista de conversas se não existir
    const conversationTitle = prompt.length > 50 ? prompt.substring(0, 50) + '...' : prompt;
    const existingConv = conversations.find(c => c.id === activeConversation);
    
    if (!existingConv) {
      const newConversation = {
        id: Date.now(),
        title: conversationTitle,
        lastMessage: newEntry.timestamp,
        messages: [newEntry]
      };
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversation(newConversation.id);
    } else {
      setConversations(prev => prev.map(c => 
        c.id === activeConversation 
          ? { ...c, messages: [newEntry, ...c.messages], lastMessage: newEntry.timestamp }
          : c
      ));
    }
    
    setPrompt('');
    setLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
    setConversations([]);
    setActiveConversation(null);
  };

  const selectConversation = (conversationId) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setHistory(conversation.messages);
      setActiveConversation(conversationId);
    }
  };

  const newConversation = () => {
    setHistory([]);
    setActiveConversation(null);
  };

  return (
    <>
      <ToolbarContainer />
      <AIPromptPresentational
        prompt={prompt}
        loading={loading}
        history={history}
        conversations={conversations}
        activeConversation={activeConversation}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        onClearHistory={clearHistory}
        onSelectConversation={selectConversation}
        onNewConversation={newConversation}
      />
    </>
  );
};

export default AIPromptContainer;