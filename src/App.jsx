import AppRoutes from './routes/index';
import { AuthProvider } from './controllers/auth/useAuthController';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
