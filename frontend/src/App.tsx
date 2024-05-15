import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/query-client';
import Home from './components/home';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}
