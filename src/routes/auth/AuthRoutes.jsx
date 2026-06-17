import { Route } from 'react-router-dom';
import SignInPage      from '../../views/pages/UserUI/SignInPage/SignInPage';
import SignUpPage      from '../../views/pages/UserUI/SignUpPage/SignUpPage';
import SetPasswordPage from '../../views/pages/UserUI/SetPasswordPage/SetPasswordPage';
import CareersPage     from '../../views/pages/UserUI/CareersPage/CareersPage';
import JobListingsPage from '../../views/pages/UserUI/JobListingsPage/JobListingsPage';
import JobApplyPage    from '../../views/pages/UserUI/JobApplyPage/JobApplyPage';
import AboutPage       from '../../views/pages/UserUI/AboutPage/AboutPage';
import BlogPage        from '../../views/pages/UserUI/BlogPage/BlogPage';
import AdminPage       from '../../views/pages/AdminPage/AdminPage';
import HomePage        from '../../views/pages/UserUI/HomePage/HomePage';
import ProductPage     from '../../views/pages/UserUI/ProductPage/ProductPage';

// Loan Apply Flow — context wraps all 5 steps
import { LoanApplicationProvider } from '../../views/pages/UserUI/LoanApplyPage/LoanApplicationContext';
import Step1Details  from '../../views/pages/UserUI/LoanApplyPage/steps/Step1Details';
import Step2Offer     from '../../views/pages/UserUI/LoanApplyPage/steps/Step2Offer';
import Step3KYC       from '../../views/pages/UserUI/LoanApplyPage/steps/Step3KYC';
import Step4Terms     from '../../views/pages/UserUI/LoanApplyPage/steps/Step4Terms';
import Step5Disbursal from '../../views/pages/UserUI/LoanApplyPage/steps/Step5Disbursal';

import { ProtectedRoute } from '../ProtectedRoute';
import { PublicRoute } from '../PublicRoute';

/**
 * Root router — combines all domain route groups.
 * The /loan/apply/* steps share state via LoanApplicationProvider
 * which is rendered once at the /loan/apply/type entry point.
 *
 * NOTE: React Router v6 only accepts <Route> or <React.Fragment>
 * as direct children of <Routes>, so we export raw JSX.
 */
const AuthRoutes = (
  <>
    {/* Public Routes (Only accessible if NOT logged in) */}
    <Route path="/"                     element={<PublicRoute><SignInPage /></PublicRoute>}      />
    <Route path="/signup"               element={<PublicRoute><SignUpPage /></PublicRoute>}      />
    <Route path="/signup/set-password"  element={<PublicRoute><SetPasswordPage /></PublicRoute>} />
    
    {/* Publicly accessible anyway */}
    <Route path="/careers"              element={<CareersPage />}     />
    <Route path="/careers/openings"     element={<JobListingsPage />} />
    <Route path="/careers/apply/:jobId" element={<JobApplyPage />}    />
    <Route path="/about"                element={<AboutPage />}       />
    <Route path="/blogs"                element={<BlogPage />}        />
    
    {/* Protected Admin Routes */}
    <Route path="/admin"                element={<ProtectedRoute requireAdmin={true}><AdminPage /></ProtectedRoute>}       />
    
    {/* Protected User Routes */}
    <Route path="/home"                 element={<ProtectedRoute><HomePage /></ProtectedRoute>}        />
    <Route path="/profile"              element={<ProtectedRoute><HomePage /></ProtectedRoute>}        />
    <Route path="/products/:type"       element={<ProtectedRoute><ProductPage /></ProtectedRoute>}     />

    {/* ── Loan Apply Multi-Step Flow ── */}
    <Route path="/loan/apply/details"     element={<ProtectedRoute><LoanApplicationProvider><Step1Details /></LoanApplicationProvider></ProtectedRoute>}  />
    <Route path="/loan/apply/offer"     element={<ProtectedRoute><LoanApplicationProvider><Step2Offer /></LoanApplicationProvider></ProtectedRoute>}     />
    <Route path="/loan/apply/kyc"       element={<ProtectedRoute><LoanApplicationProvider><Step3KYC /></LoanApplicationProvider></ProtectedRoute>}      />
    <Route path="/loan/apply/terms"     element={<ProtectedRoute><LoanApplicationProvider><Step4Terms /></LoanApplicationProvider></ProtectedRoute>}    />
    <Route path="/loan/apply/disbursal" element={<ProtectedRoute><LoanApplicationProvider><Step5Disbursal /></LoanApplicationProvider></ProtectedRoute>}/>
  </>
);

export default AuthRoutes;
