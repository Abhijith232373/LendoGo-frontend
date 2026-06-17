import AppRoutes from './routes/index';
import { AuthProvider } from './controllers/auth/useAuthController';
import { WebConfigProvider } from './context/WebConfigContext';
import ChatWidget from './views/components/ChatWidget/ChatWidget';

function App() {
  return (
    <WebConfigProvider>
      <AuthProvider>
        <AppRoutes />
        <ChatWidget />
      </AuthProvider>
    </WebConfigProvider>
  );
}

export default App;
