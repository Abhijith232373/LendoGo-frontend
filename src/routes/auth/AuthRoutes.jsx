import { Route } from 'react-router-dom';
import SignInPage from '../../views/pages/SignInPage/SignInPage';
import SignUpPage from '../../views/pages/SignUpPage/SignUpPage';
import SetPasswordPage from '../../views/pages/SetPasswordPage/SetPasswordPage';
import CareersPage from '../../views/pages/CareersPage/CareersPage';
import JobListingsPage from '../../views/pages/JobListingsPage/JobListingsPage';
import JobApplyPage from '../../views/pages/JobApplyPage/JobApplyPage';
import AboutPage from '../../views/pages/AboutPage/AboutPage';
import BlogPage from '../../views/pages/BlogPage/BlogPage';
import AdminPage from '../../views/pages/AdminPage/AdminPage';
import HomePage from '../../views/pages/HomePage/HomePage';
import UserProfilePage from '../../views/pages/UserProfilePage/UserProfilePage';

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
    <Route path="/careers" element={<CareersPage />} />
    <Route path="/careers/openings" element={<JobListingsPage />} />
    <Route path="/careers/apply/:jobId" element={<JobApplyPage />} />
    <Route path="/about" element={<AboutPage />} />
    <Route path="/blogs" element={<BlogPage />} />
    <Route path="/admin" element={<AdminPage />} />
    <Route path="/home" element={<HomePage />} />
    <Route path="/profile" element={<UserProfilePage />} />
  </>
);

export default AuthRoutes;
