import { useState, useCallback } from 'react';
import { apiService } from '../services';
import { useUser } from '../context/UserContext';
import type { AISession, AIMessage } from '../types';

interface UseAIAssistantReturn {
  session: AISession | null;
  messages: AIMessage[];
  isLoading: boolean;
  error: string | null;
  initSession: () => Promise<void>;
  sendPrompt: (prompt: string) => Promise<string | null>;
  clearMessages: () => void;
}

export function useAIAssistant(): UseAIAssistantReturn {
  const { user } = useUser();
  const [session, setSession] = useState<AISession | null>(null);
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initSession = useCallback(async () => {
    if (!user?.access_token) {
      setError('Oturum açmanız gerekiyor');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.getAISession(user.access_token);

      if (response.success && response.data) {
        setSession(response.data);
        setMessages([{
          id: 'welcome',
          role: 'assistant',
          content: 'Merhaba! Ben AI asistanınızım. Uçuş verilerinizi analiz etmeme, rota önerileri sunmama veya herhangi bir konuda yardımcı olmama izin verin. Size nasıl yardımcı olabilirim?',
          timestamp: new Date(),
        }]);
      } else {
        setError(response.message || 'AI oturumu başlatılamadı');
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Init AI session error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token]);

  const sendPrompt = useCallback(async (prompt: string): Promise<string | null> => {
    if (!user?.access_token) {
      setError('Oturum açmanız gerekiyor');
      return null;
    }

    const userMessage: AIMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    setIsLoading(true);
    setError(null);

    try {
      const response = await apiService.sendAIPrompt(prompt, user.access_token);

      if (response.success && response.data) {
        const assistantMessage: AIMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.data.response,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        return response.data.response;
      } else {
        const errorMessage: AIMessage = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Üzgünüm, şu anda yanıt veremiyorum. Lütfen tekrar deneyin.',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
        setError(response.message || 'AI yanıtı alınamadı');
        return null;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu');
      console.error('Send AI prompt error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user?.access_token]);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: 'Sohbet temizlendi. Size nasıl yardımcı olabilirim?',
      timestamp: new Date(),
    }]);
  }, []);

  return {
    session,
    messages,
    isLoading,
    error,
    initSession,
    sendPrompt,
    clearMessages,
  };
}
