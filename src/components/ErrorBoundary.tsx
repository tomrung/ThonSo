import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Trash2 } from 'lucide-react';

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
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary caught error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetDataAndReload = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-2xl w-full bg-slate-800 border border-slate-700 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            
            <div className="w-16 h-16 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center border border-rose-500/30">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white tracking-tight">
                Đã Xảy Ra Lỗi Hiển Thị Giao Diện
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hệ thống đã tự động bắt lỗi an toàn (Error Boundary). Hãy bấm nút <strong className="text-rose-400">Xóa Cache & Khôi Phục Gốc</strong> bên dưới để làm sạch bộ nhớ tạm thời và tải lại dữ liệu chuẩn.
              </p>
            </div>

            {this.state.error && (
              <div className="text-left bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs font-mono text-rose-300 overflow-x-auto max-h-56">
                <p className="font-bold text-rose-400 mb-1">Chi tiết lỗi runtime:</p>
                <p className="whitespace-pre-wrap break-all text-white font-bold">{this.state.error.toString()}</p>
                {this.state.error.stack && (
                  <pre className="text-[10px] text-slate-400 mt-2 overflow-x-auto whitespace-pre-wrap break-all">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleResetDataAndReload}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer ring-4 ring-rose-500/30"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa Cache & Khôi Phục Dữ Liệu Gốc</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Tải Lại Trang</span>
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/'; }}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4" />
                <span>Về Trang Chủ</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
