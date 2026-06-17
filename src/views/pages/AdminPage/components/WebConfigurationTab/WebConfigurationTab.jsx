import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../../../../utils/apiClient';
import { useWebConfig } from '../../../../../context/WebConfigContext';

const configModules = [
  {
    id: 'core_features',
    title: 'Core Features',
    toggles: [
      { id: 'apply_loan_enabled', label: 'Disable Apply Loan' },
      { id: 'login_enabled', label: 'Disable Login' },
      { id: 'register_enabled', label: 'Disable Register' },
      { id: 'apply_job_enabled', label: 'Disable Apply Job' }
    ]
  },
  {
    id: 'user_dashboard_features',
    title: 'User Dashboard Features',
    toggles: [
      { id: 'profile_update_enabled', label: 'Disable Profile Update' },
      { id: 'feedback_enabled', label: 'Disable Feedback' },
      { id: 'loan_history_enabled', label: 'Disable Loan History' },
      { id: 'repay_enabled', label: 'Disable Repay' }
    ]
  },
  {
    id: 'coming_soon_features',
    title: 'Coming Soon Features',
    toggles: [
      { id: 'auto_pay_enabled', label: 'Disable Auto Pay' },
      { id: 'internal_score_enabled', label: 'Disable Internal Score' },
      { id: 'cibil_score_enabled', label: 'Disable Cibil Score' }
    ]
  },
  {
    id: 'support_content_features',
    title: 'Support & Content Features',
    toggles: [
      { id: 'blog_enabled', label: 'Disable Blog Area' },
      { id: 'chat_support_enabled', label: 'Disable Chat Support' },
      { id: 'free_consultation_enabled', label: 'Disable Free Consultation' }
    ]
  }
];

const allToggleIds = configModules.flatMap(m => m.toggles.map(t => t.id));

const WebConfigurationTab = () => {
  const { webConfig } = useWebConfig();
  const [configParams, setConfigParams] = useState({
    apply_loan_enabled: true,
    login_enabled: true,
    register_enabled: true,
    apply_job_enabled: true,
    profile_update_enabled: true,
    feedback_enabled: true,
    loan_history_enabled: true,
    repay_enabled: true,
    auto_pay_enabled: false,
    internal_score_enabled: false,
    cibil_score_enabled: false,
    blog_enabled: true,
    chat_support_enabled: true,
    free_consultation_enabled: true,
    min_credit_score: 650,
    base_interest_rate: 14.0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const isFirstLoad = useRef(true);

  // Sync with Global WebConfig Context (which listens to WS updates!)
  useEffect(() => {
    if (webConfig) {
      setConfigParams(prev => {
        // Only update local state if it actually differs to prevent loop
        const isDifferent = Object.keys(webConfig).some(k => webConfig[k] !== prev[k]);
        return isDifferent ? { ...webConfig } : prev;
      });
      setIsLoading(false);
    }
  }, [webConfig]);

  useEffect(() => {
    if (isFirstLoad.current || isLoading) {
      isFirstLoad.current = false;
      return;
    }

    const saveConfig = async () => {
      try {
        await apiClient('/config/admin', {
          method: 'PUT',
          body: JSON.stringify(configParams)
        });
      } catch (e) {
        console.error("Failed to save web configuration", e);
      }
    };

    // Debounce to prevent spamming PUT requests on rapid toggling
    const timer = setTimeout(() => {
      saveConfig();
    }, 500);
    return () => clearTimeout(timer);
  }, [configParams, isLoading]);

  const handleGlobalToggle = () => {
    const isAllSelected = allToggleIds.every(id => configParams[id]);
    const newConfig = { ...configParams };
    allToggleIds.forEach(id => {
      newConfig[id] = !isAllSelected;
    });
    setConfigParams(newConfig);
  };

  const handleModuleToggle = (moduleIds, isModuleAllSelected) => {
    const newConfig = { ...configParams };
    moduleIds.forEach(id => {
      newConfig[id] = !isModuleAllSelected;
    });
    setConfigParams(newConfig);
  };

  const handleToggle = (id) => {
    setConfigParams(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isAllSelected = allToggleIds.every(id => configParams[id]);

  return (
    <div className="tab-pane-container animate-fade-in" style={{ paddingBottom: '40px' }}>
      
      {/* Global Toggle Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap',
        gap: '20px',
        marginBottom: '30px', 
        padding: '24px', 
        background: 'var(--admin-card)', 
        border: '1px solid var(--admin-border)', 
        borderRadius: '16px',
        boxShadow: '0 4px 20px var(--admin-shadow)'
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--admin-text)' }}>System Web Configurations</h2>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', background: 'var(--admin-bg)', padding: '12px 20px', borderRadius: '12px' }}>
          <span style={{ fontWeight: '600', color: 'var(--admin-text)' }}>Disable All</span>
          <label className="toggle-switch" style={{ margin: 0 }}>
            {/* If every feature is disabled (!configParams[id]), then the global disable switch is ON */}
            <input type="checkbox" checked={allToggleIds.every(id => !configParams[id])} onChange={() => {
              const isAllDisabled = allToggleIds.every(id => !configParams[id]);
              const newConfig = { ...configParams };
              allToggleIds.forEach(id => {
                newConfig[id] = isAllDisabled; // if all disabled, turn them true (enable), else turn false (disable)
              });
              setConfigParams(newConfig);
            }} />
            <span className="slider-round" />
          </label>
        </div>
      </div>

      {/* Feature Toggles Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '24px' 
      }}>
        {configModules.map(module => {
          const moduleIds = module.toggles.map(t => t.id);
          const isModuleAllDisabled = moduleIds.every(id => !configParams[id]);

          return (
            <div key={module.id} style={{ 
              background: 'var(--admin-card)', 
              border: '1px solid var(--admin-border)', 
              borderRadius: '16px', 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column',
              boxShadow: '0 4px 20px var(--admin-shadow)',
              color: 'var(--admin-text)'
            }}>
              
              {/* Card Header */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                borderBottom: '1px solid var(--admin-border)', 
                paddingBottom: '16px', 
                marginBottom: '20px' 
              }}>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: '600' }}>{module.title}</h3>
                <label className="toggle-switch" style={{ margin: 0 }}>
                  <input type="checkbox" checked={isModuleAllDisabled} onChange={() => {
                     const newConfig = { ...configParams };
                     moduleIds.forEach(id => {
                       newConfig[id] = isModuleAllDisabled; 
                     });
                     setConfigParams(newConfig);
                  }} />
                  <span className="slider-round" />
                </label>
              </div>

              {/* Toggles List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flexGrow: 1 }}>
                {module.toggles.map(toggle => (
                  <div key={toggle.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.95rem', fontWeight: '500', color: 'var(--admin-text)' }}>{toggle.label}</span>
                    <label className="toggle-switch" style={{ transform: 'scale(0.85)', margin: 0 }}>
                      <input type="checkbox" checked={!configParams[toggle.id]} onChange={() => handleToggle(toggle.id)} />
                      <span className="slider-round" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WebConfigurationTab;
