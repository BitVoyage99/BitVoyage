import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="w-full min-h-screen bg-slate-200">
        <header className="bg-blue-700 h-16 fixed w-full z-10">Header</header>
        <main className="pt-16 border-green-300 border-2 w-[95%] mx-auto flex justify-between items-start relative ">
          <div className="w-1/2"></div>

          <div className="sticky top-16"></div>
        </main>
      </div>
    </QueryClientProvider>
  );
}
