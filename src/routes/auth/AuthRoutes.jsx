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
    <Route path="/"                     element={<SignInPage />}      />
    <Route path="/signup"               element={<SignUpPage />}      />
    <Route path="/signup/set-password"  element={<SetPasswordPage />} />
    <Route path="/careers"              element={<CareersPage />}     />
    <Route path="/careers/openings"     element={<JobListingsPage />} />
    <Route path="/careers/apply/:jobId" element={<JobApplyPage />}    />
    <Route path="/about"                element={<AboutPage />}       />
    <Route path="/blogs"                element={<BlogPage />}        />
    <Route path="/admin"                element={<AdminPage />}       />
    <Route path="/home"                 element={<HomePage />}        />
    <Route path="/profile"              element={<HomePage />}        />
    <Route path="/products/:type"       element={<ProductPage />}     />

    {/* ── Loan Apply Multi-Step Flow ── */}
    <Route path="/loan/apply/details"     element={<LoanApplicationProvider><Step1Details /></LoanApplicationProvider>}  />
    <Route path="/loan/apply/offer"     element={<LoanApplicationProvider><Step2Offer /></LoanApplicationProvider>}     />
    <Route path="/loan/apply/kyc"       element={<LoanApplicationProvider><Step3KYC /></LoanApplicationProvider>}      />
    <Route path="/loan/apply/terms"     element={<LoanApplicationProvider><Step4Terms /></LoanApplicationProvider>}    />
    <Route path="/loan/apply/disbursal" element={<LoanApplicationProvider><Step5Disbursal /></LoanApplicationProvider>}/>
  </>
);

export default AuthRoutes;
