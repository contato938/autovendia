'use client';

import { Component, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-4 text-center">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Erro no aplicativo</h1>
            <p className="text-muted-foreground">
              Houve um problema ao carregar esta página. Tente novamente ou volte ao dashboard.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mt-4 p-4 bg-muted rounded-md text-left">
                <p className="text-xs font-mono text-destructive">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="text-xs mt-2 overflow-auto max-h-40">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
            <div className="flex gap-2 justify-center pt-4">
              <Button
                onClick={() => window.location.reload()}
                variant="default"
              >
                🔄 Tentar novamente
              </Button>
              <Button
                onClick={() => window.location.href = '/dashboard'}
                variant="outline"
              >
                ← Voltar ao Dashboard
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
