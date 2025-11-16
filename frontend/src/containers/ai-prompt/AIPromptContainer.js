import React, { useState } from 'react';
import AIPromptPresentational from '../../components/presentational/AIPromptPresentational';
import ToolbarContainer from '../toolbar/ToolbarContainer';

const AIPromptContainer = () => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    
    const newEntry = {
      id: Date.now(),
      prompt: prompt,
      response: `Resposta simulada para: "${prompt}". Aqui você pode integrar com OpenAI, Claude, ou outro LLM.`,
      timestamp: new Date().toLocaleTimeString()
    };

    setHistory(prev => [newEntry, ...prev]);
    setPrompt('');
    setLoading(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  return (
    <>
      <ToolbarContainer />
      <AIPromptPresentational
        prompt={prompt}
        loading={loading}
        history={history}
        onPromptChange={setPrompt}
        onSubmit={handleSubmit}
        onClearHistory={clearHistory}
      />
    </>
  );
};

export default AIPromptContainer;