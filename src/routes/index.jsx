import { Routes } from 'react-router-dom';
import AuthRoutes from './auth/AuthRoutes';

/**
 * Root router — combines all domain route groups.
 * Add new groups here as the app grows (e.g. DashboardRoutes, LoanRoutes).
 * Each group is a JSX variable (React.Fragment), not a component,
 * so React Router v6's type check is satisfied.
 */
const AppRoutes = () => (
  <Routes>
    {AuthRoutes}
    {/* {DashboardRoutes} */}
    {/* {LoanRoutes} */}
  </Routes>
);

export default AppRoutes;
