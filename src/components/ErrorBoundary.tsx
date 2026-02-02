
import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-600 mb-4">
              The application encountered an error and could not load.
            </p>
            
            {this.state.error && (
              <div className="bg-gray-100 p-3 rounded text-left overflow-auto max-h-40 mb-4 text-xs font-mono border border-gray-200">
                <p className="font-semibold text-red-600 mb-1">{this.state.error.toString()}</p>
                {this.state.errorInfo && (
                  <pre className="text-gray-500">{this.state.errorInfo.componentStack}</pre>
                )}
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
            >
              Reload Application
            </button>
            <p className="text-xs text-gray-500 mt-4">
              If this persists, please check the browser console for more details.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
