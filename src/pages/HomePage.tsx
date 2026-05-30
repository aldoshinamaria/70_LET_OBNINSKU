import { useCallback, useMemo } from 'react';
import { voicesFromMessages } from '@/data/sampleMessages';
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
  const { stats, loading: statsLoading, error: statsError, refetch: refetchStats } =
    useStats();
  const {
    messages,
    loading: messagesLoading,
    refetch: refetchMessages,
  } = useApprovedMessages();

  const handleSubmitted = useCallback(() => {
    void refetchStats();
    void refetchMessages();
  }, [refetchStats, refetchMessages]);

  const heroVoices = useMemo(
    () => (messages.length > 0 ? voicesFromMessages(messages) : undefined),
    [messages],
  );

  return (
    <>
      <Header />
      <main className="min-w-0 overflow-x-clip">
        <Hero voices={heroVoices} />
        <Stats stats={stats} loading={statsLoading} error={statsError} />
        <About />
        <MessageForm onSubmitted={handleSubmitted} />
        <VoiceOfObninsk messages={messages} loading={messagesLoading} />
      </main>
      <Footer />
    </>
  );
}
