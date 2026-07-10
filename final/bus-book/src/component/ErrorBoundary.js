import React from "react";

class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true, error };
	}

	componentDidCatch(error, errorInfo) {
		console.error("ErrorBoundary caught an error:", error, errorInfo);
	}

	render() {
		if (this.state.hasError) {
			return (
				<div className="min-h-screen flex items-center justify-center px-4 bg-surface-50">
					<div className="text-center max-w-md bg-white p-8 rounded-2xl border border-surface-200 shadow-card">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
							<svg className="w-10 h-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
							</svg>
						</div>

						<h1 className="text-2xl font-bold text-surface-900 mb-2">Something went wrong</h1>
						<p className="text-surface-500 mb-6 text-sm">
							An unexpected error occurred while loading this page. Please try reloading the application.
						</p>
						{this.state.error?.message && (
							<pre className="text-xs bg-surface-50 text-red-600 p-3 rounded-lg font-mono mb-6 text-left overflow-x-auto max-h-32">
								{this.state.error.message}
							</pre>
						)}

						<div className="flex flex-col sm:flex-row gap-3 justify-center">
							<button
								onClick={() => window.location.reload()}
								className="btn-primary font-medium"
							>
								Reload Page
							</button>
							<a href="/" className="btn-secondary font-medium">
								Go Home
							</a>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
