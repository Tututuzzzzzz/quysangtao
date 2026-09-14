import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans text-slate-800">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-orange-200 shadow-xl max-w-xl w-full text-center space-y-4">
            <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
              ⚡
            </div>
            <h2 className="text-xl font-bold text-slate-900">Có lỗi xảy ra khi tải trang</h2>
            
            {/* Error Detail Display */}
            <div className="bg-red-50 border border-red-200 text-red-700 text-left text-xs p-3.5 rounded-xl font-mono overflow-auto max-h-48 break-words">
              <strong>Lỗi chi tiết:</strong> {this.state.error ? this.state.error.toString() : 'Không rõ nguyên nhân'}
              {this.state.error?.stack && (
                <pre className="mt-2 text-[10px] opacity-80 whitespace-pre-wrap">
                  {this.state.error.stack}
                </pre>
              )}
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Vui lòng nhấn nút bên dưới để xóa cache và tải lại trang.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all active:scale-95"
              >
                Tải lại trang (Reload)
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-all"
              >
                Xóa bộ nhớ đệm & Đặt lại
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
