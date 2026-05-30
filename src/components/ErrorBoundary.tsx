import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('Ошибка приложения:', error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-6 text-center text-text">
          <p className="font-display text-2xl text-primary">
            Не удалось загрузить страницу
          </p>
          <p className="max-w-md text-sm text-secondary">
            Перезагрузите вкладку. Если ошибка повторится — остановите dev-сервер
            и снова выполните{' '}
            <code className="text-primary">npm run dev</code>.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}
