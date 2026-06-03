import AppRoutes from './routes/index';
import { AuthProvider } from './controllers/auth/useAuthController';
import ChatWidget from './views/components/ChatWidget/ChatWidget';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ChatWidget />
    </AuthProvider>
  );
}

export default App;
