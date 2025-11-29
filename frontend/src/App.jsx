import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FormPage from './pages/FormPage';
import SubmissionsPage from './pages/SubmissionsPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-dark-bg dark">
          <nav className="sticky top-0 z-50 bg-dark-card/95 backdrop-blur-md border-b border-dark-border shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <div className="flex items-center mr-2 sm:mr-6">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-xs sm:text-sm">FB</span>
                    </div>
                    <span className="ml-2 text-base sm:text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                      Form Builder
                    </span>
                  </div>
                  <Link
                    to="/"
                    className="inline-flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 rounded-lg hover:bg-dark-hover hover:text-primary-400 transition-all"
                  >
                    New Form
                  </Link>
                  <Link
                    to="/submissions"
                    className="inline-flex items-center px-2 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-300 rounded-lg hover:bg-dark-hover hover:text-primary-400 transition-all"
                  >
                    Submissions
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Routes>
              <Route path="/" element={<FormPage />} />
              <Route path="/submissions" element={<SubmissionsPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
