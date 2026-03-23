import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Fingerprint, MapPin, Clock, CreditCard, Activity, Search } from 'lucide-react';
import GlassCard from '../components/GlassCard';
import { predictFraud } from '../utils/mockApi';
import './LiveDetection.css';

const LiveDetection = () => {
  const [formData, setFormData] = useState({
    userId: '',
    amount: '',
    userCity: '',
    merchantCity: '',
    deviceType: 'mobile',
    paymentMethod: 'card',
    timestamp: new Date().toISOString().slice(0, 16)
  });

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const simulateDetection = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setResult(null);

    // Use Mock API
    const response = await predictFraud(formData, 2500);

    let status = 'safe';
    if (response.fraud) status = 'fraud';
    else if (response.risk_score >= 40) status = 'warning';

    setResult({
      status,
      score: response.risk_score,
      reasons: response.reasons
    });
    setIsAnalyzing(false);
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'fraud': return 'status-fraud';
      case 'warning': return 'status-warning';
      default: return 'status-safe';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'fraud': return <ShieldAlert size={48} />;
      case 'warning': return <AlertTriangle size={48} />;
      default: return <ShieldCheck size={48} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'fraud': return 'Fraud Detected';
      case 'warning': return 'Medium Risk';
      default: return 'Safe';
    }
  };

  const getTextColorClass = (status) => {
    switch (status) {
      case 'fraud': return 'text-neon-red';
      case 'warning': return 'text-neon-warning';
      default: return 'text-neon-green';
    }
  };

  return (
    <div className="animate-slide-in">
      <h1 className="page-title delay-1 mb-6">Live Fraud Detection</h1>
      
      <div className="live-detection-container">
        
        {/* Input Form */}
        <GlassCard className="form-card delay-2">
          <h3 className="flex items-center gap-2 mb-6 text-xl font-semibold border-b border-[var(--border-glass)] pb-4">
            <Activity size={24} color="var(--neon-blue)" /> Transaction Parameters
          </h3>
          
          <form onSubmit={simulateDetection} className="flex flex-col gap-6">
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">User ID</label>
                <div className="relative">
                  <Fingerprint className="absolute left-3 top-3 text-[var(--text-secondary)]" size={18} />
                  <input required type="text" name="userId" value={formData.userId} onChange={handleChange} className="form-input w-full pl-10" placeholder="e.g., U-8932" />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Transaction Amount ($)</label>
                <input required type="number" step="0.01" name="amount" value={formData.amount} onChange={handleChange} className="form-input" placeholder="0.00" />
              </div>

              <div className="form-group">
                <label className="form-label">User City (Billing)</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-[var(--text-secondary)]" size={18} />
                  <input required type="text" name="userCity" value={formData.userCity} onChange={handleChange} className="form-input w-full pl-10" placeholder="e.g., New York" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Merchant City</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 text-[var(--text-secondary)]" size={18} />
                  <input required type="text" name="merchantCity" value={formData.merchantCity} onChange={handleChange} className="form-input w-full pl-10" placeholder="e.g., Miami" />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Device Type</label>
                <select name="deviceType" value={formData.deviceType} onChange={handleChange} className="form-select">
                  <option value="mobile">Mobile App</option>
                  <option value="web">Web Browser</option>
                  <option value="atm">ATM</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Payment Method</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 text-[var(--text-secondary)]" size={18} />
                  <select name="paymentMethod" value={formData.paymentMethod} onChange={handleChange} className="form-select w-full pl-10">
                    <option value="card">Credit/Debit Card</option>
                    <option value="upi">UPI / Bank Transfer</option>
                    <option value="wallet">Digital Wallet</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Timestamp</label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-[var(--text-secondary)]" size={18} />
                <input required type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleChange} className="form-input w-full pl-10" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary justify-center mt-2" disabled={isAnalyzing}>
              {isAnalyzing ? (
                <><span className="spinner"></span> Analyzing Risk...</>
              ) : (
                <><Search size={20} /> Run Detection Model</>
              )}
            </button>
          </form>
        </GlassCard>

        {/* Result Area */}
        <div className="result-card-container delay-3 animate-slide-in">
          {!result && !isAnalyzing ? (
            <GlassCard className="empty-state">
              <ShieldCheck size={64} className="mb-4 opacity-50" />
              <h3>Awaiting Input</h3>
              <p>Enter transaction details and run the detection model to see the real-time AI analysis.</p>
            </GlassCard>
          ) : isAnalyzing ? (
            <GlassCard className="analysis-result">
              <div className="pulse-dot" style={{width: '60px', height: '60px', marginBottom: '2rem'}}></div>
              <h3 className="text-xl mb-4 text-neon-blue">AI Model Analyzing...</h3>
              <div className="w-full bg-[rgba(255,255,255,0.1)] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[var(--neon-blue)] w-1/2 animate-[scan_1s_ease-in-out_infinite_alternate] rounded-full"></div>
              </div>
              <p className="mt-6 text-[var(--text-secondary)] text-sm">Running thousands of feature checks against historical patterns...</p>
            </GlassCard>
          ) : (
            <GlassCard className={`analysis-result ${getStatusColorClass(result.status)}`}>
              <div className="scan-line"></div>
              
              <div className="status-icon-wrapper">
                {getStatusIcon(result.status)}
              </div>
              
              <div className={`status-text ${getTextColorClass(result.status)}`}>
                {getStatusText(result.status)}
              </div>
              
              <div className="risk-score">
                Risk Score: <span className={`score-value ${getTextColorClass(result.status)}`}>{result.score}%</span>
              </div>
              
              <div className="reasons-list">
                <h4><Search size={16} className="inline mr-2" /> Detection Reasons</h4>
                {result.reasons.map((reason, idx) => (
                  <div key={idx} className="reason-item animate-slide-in" style={{animationDelay: `${idx * 0.1 + 0.5}s`}}>
                    <div className="mt-1">
                      {result.status === 'fraud' || result.status === 'warning' ? 
                        <AlertTriangle size={16} color="currentColor" /> : 
                        <CheckCircle size={16} color="var(--neon-green)" />
                      }
                    </div>
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default LiveDetection;
