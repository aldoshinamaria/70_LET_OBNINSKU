import { useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/sections/Hero';
import { Stats } from '@/sections/Stats';
import { About } from '@/sections/About';
import { MessageForm } from '@/sections/MessageForm';
import { VoiceOfObninsk } from '@/sections/VoiceOfObninsk';
import { useStats } from '@/hooks/useStats';
import { useApprovedMessages } from '@/hooks/useApprovedMessages';

export function HomePage() {
  const { stats, refetch: refetchStats } = useStats();
  const {
    messages,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useApprovedMessages();

  const handleSubmitted = useCallback(() => {
    void refetchStats();
    void refetchMessages();
  }, [refetchStats, refetchMessages]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Stats stats={stats} />
        <About />
        <MessageForm onSubmitted={handleSubmitted} />
        <VoiceOfObninsk messages={messages} loading={messagesLoading} />
      </main>
      <Footer />
    </>
  );
}
