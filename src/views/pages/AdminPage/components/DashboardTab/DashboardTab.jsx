import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import "./DashboardTab.css";

import { apiClient } from '../../../../../utils/apiClient';

const DashboardTab = ({ activeBalance, disbursedCapital, setActiveTab }) => {
  const [timeframe, setTimeframe] = useState('year');
  const [trackFilter, setTrackFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    active_portfolio: 0,
    total_disbursed: 0,
    distribution: {
      Personal: 0,
      Business: 0,
      Home: 0
    },
    chart_data: [],
    top_stats: { total_users: 0, total_staff: 0, total_loans: 0, total_kyc: 0 }
  });

  useEffect(() => {
    fetchStats();
  }, [timeframe, trackFilter]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const data = await apiClient(`/admin/system-stats?timeframe=${timeframe}&track=${trackFilter}`);
      setStats({
        active_portfolio: data.active_portfolio || 0,
        total_disbursed: data.total_disbursed || 0,
        distribution: data.distribution || {},
        chart_data: data.chart_data || [],
        top_stats: data.top_stats || { total_users: 0, total_staff: 0, total_loans: 0, total_kyc: 0 }
      });
    } catch (error) {
      console.error("Failed to fetch stats", error);
    }
    setLoading(false);
  };

  const COLORS = ['#0066ff', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#14b8a6'];

  const PRODUCT_NAMES = {
    'personal': 'Personal Loans',
    'business': 'Business Loan',
    'home': 'Home Loan',
    'property': 'Loan Against Property',
    'instant': 'Instant Personal Loans',
    'credit-builder': 'Credit Builder Loan'
  };

  const TRACK_CATEGORIES = {
    'all': ['instant', 'personal', 'business', 'home', 'property', 'credit-builder'],
    'low': ['instant', 'credit-builder'],
    'high': ['personal', 'business', 'home', 'property']
  };

  const processDistribution = () => {
    const rawDist = stats.distribution || {};
    const processed = {
      'Personal Loans': 0,
      'Business Loan': 0,
      'Home Loan': 0,
      'Loan Against Property': 0,
      'Instant Personal Loans': 0,
      'Credit Builder Loan': 0
    };

    Object.keys(rawDist).forEach(key => {
      const lowerKey = key ? key.toLowerCase() : '';
      const formattedKey = PRODUCT_NAMES[lowerKey] || (key ? key.charAt(0).toUpperCase() + key.slice(1).toLowerCase() : 'Uncategorized');
      processed[formattedKey] = (processed[formattedKey] || 0) + rawDist[key];
    });

    return Object.keys(processed).map((key, index) => ({
      name: key,
      value: processed[key],
      color: COLORS[index % COLORS.length]
    }));
  };

  const displayPieData = processDistribution();

  return (
    <div className="tab-pane-container animate-fade-in">
      <div className="welcome-banner" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="banner-content">
          <h2>Analyst Dashboard</h2>
        </div>
        <div className="timeframe-selector" style={{ display: 'flex', gap: '0.5rem', background: 'var(--admin-input)', padding: '0.5rem', borderRadius: '12px' }}>
          {['day', 'week', 'month', 'year'].map(t => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: 'none',
                background: timeframe === t ? 'var(--primary)' : 'transparent',
                color: timeframe === t ? '#fff' : 'var(--admin-text-light)',
                fontWeight: timeframe === t ? '700' : '500',
                cursor: 'pointer',
                textTransform: 'capitalize',
                transition: 'all 0.2s',
                boxShadow: timeframe === t ? '0 4px 10px rgba(0,102,255,0.3)' : 'none'
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
          <div className="spinner"></div>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: '30px' }}>
            <div className="grid-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Total Users</h4>
                  <h2 style={{ fontSize: '2rem', color: 'var(--admin-text)', fontWeight: '800', letterSpacing: '-0.5px' }}>{stats.top_stats.total_users.toLocaleString()}</h2>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 102, 255, 0.1)', color: '#0066ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </div>
              </div>
            </div>

            <div className="grid-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Total Staff</h4>
                  <h2 style={{ fontSize: '2rem', color: 'var(--admin-text)', fontWeight: '800', letterSpacing: '-0.5px' }}>{stats.top_stats.total_staff.toLocaleString()}</h2>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
              </div>
            </div>

            <div className="grid-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>Loan Requests</h4>
                  <h2 style={{ fontSize: '2rem', color: 'var(--admin-text)', fontWeight: '800', letterSpacing: '-0.5px' }}>{stats.top_stats.total_loans.toLocaleString()}</h2>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
              </div>
            </div>

            <div className="grid-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--admin-text-light)', fontWeight: '700', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.5px' }}>KYC Submissions</h4>
                  <h2 style={{ fontSize: '2rem', color: 'var(--admin-text)', fontWeight: '800', letterSpacing: '-0.5px' }}>{stats.top_stats.total_kyc.toLocaleString()}</h2>
                </div>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-grid-layout" style={{ marginTop: '30px' }}>
            
            <div className="grid-card assets-card">
            <div className="card-header">
              <h4>Active Loan Portfolio</h4>
              <span className="info-icon" title="Aggregated sum of all active loans distributed.">ⓘ</span>
            </div>
            <div className="card-value-wrap">
              <h2>₹{stats.active_portfolio.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h2>
              <span className="trend-badge positive">↑ Active <span className="trend-sub">Operational Safe</span></span>
            </div>
            
            <div style={{ width: '100%', height: '220px', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={displayPieData}
                    cx="40%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {displayPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`} 
                    contentStyle={{ backgroundColor: 'var(--admin-card)', borderColor: 'var(--admin-border)', borderRadius: '8px', color: 'var(--admin-text)' }}
                    itemStyle={{ color: 'var(--admin-text)' }}
                  />
                  <Legend 
                    layout="vertical" 
                    verticalAlign="middle" 
                    align="right" 
                    iconType="circle" 
                    wrapperStyle={{ fontSize: '13px', color: 'var(--admin-text-light)', paddingRight: '20px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="grid-card chart-card">
            <div className="card-header">
              <h4>Capital Disbursements Trend</h4>
            </div>
            <div className="card-value-wrap">
              <h2>₹{stats.total_disbursed.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</h2>
            </div>
            
            <div style={{ width: '100%', height: '240px', marginTop: '1rem' }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chart_data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" />
                  <XAxis dataKey="date" stroke="var(--admin-text-light)" fontSize={12} tickLine={false} axisLine={false} tickMargin={10} />
                  <YAxis 
                    stroke="var(--admin-text-light)" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false}
                    tickFormatter={(value) => `₹${value >= 1000 ? (value/1000) + 'k' : value}`}
                    width={50}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--admin-card)', borderColor: 'var(--admin-border)', borderRadius: '8px' }}
                    itemStyle={{ color: 'var(--admin-text)' }}
                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    labelStyle={{ color: 'var(--admin-text-light)', fontWeight: 600, marginBottom: '4px' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="disbursed" 
                    name="Disbursed Capital" 
                    stroke="#0066ff" 
                    strokeWidth={3.5} 
                    dot={{ r: 4, strokeWidth: 2, fill: 'var(--admin-card)', stroke: '#0066ff' }} 
                    activeDot={{ r: 6, fill: '#0066ff', stroke: '#fff' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default DashboardTab;
