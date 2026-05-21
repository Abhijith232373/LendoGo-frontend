import { Route } from 'react-router-dom';
import SignInPage from '../../views/pages/SignInPage/SignInPage';
import SignUpPage from '../../views/pages/SignUpPage/SignUpPage';
import SetPasswordPage from '../../views/pages/SetPasswordPage/SetPasswordPage';

/**
 * Auth-related routes (exported as JSX, not a component).
 * React Router v6 only accepts <Route> or <React.Fragment> as direct
 * children of <Routes> — custom components are rejected by the type check.
 * Exporting raw JSX (a React.Fragment) bypasses that restriction cleanly.
 */
const AuthRoutes = (
  <>
    <Route path="/" element={<SignInPage />} />
    <Route path="/signup" element={<SignUpPage />} />
    <Route path="/signup/set-password" element={<SetPasswordPage />} />
  </>
);

export default AuthRoutes;
