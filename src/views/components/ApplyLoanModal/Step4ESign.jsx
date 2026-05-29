import React, { useRef, useState, useEffect } from 'react';

const Step4ESign = ({
  loanType,
  loanAmount,
  emi,
  tenure,
  interestRate,
  typedSignature,
  setTypedSignature,
  hasDrawnSignature,
  setHasDrawnSignature
}) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#60a5fa';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, []);

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getEventCoords(e, canvas);
    ctx.beginPath();
    ctx.moveTo(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const coords = getEventCoords(e, canvas);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();
    setHasDrawnSignature(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getEventCoords = (e, canvas) => {
    const rect = canvas.getBoundingClientRect();
    if (e.touches && e.touches[0]) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    }
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawnSignature(false);
  };

  return (
    <div className="loan-step-pane pane-4 animate-fade-in esign-prompt-section">
      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '6px' }}>Sanction E-Sign Contract</h3>
      <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '24px' }}>Review parameters and authorize electronic bank transfer</p>

      <div className="esign-summary-card">
        <h4>Disbursal Summary Contract</h4>
        <div className="esign-summary-grid">
          <div>
            <span className="summary-data-lbl">Lending Product</span>
            <strong className="summary-data-val">
              {loanType === 'micro' ? 'Personal Micro-Loan' : (loanType === 'home' ? 'Home Loan' : 'Vehicle Loan')}
            </strong>
          </div>
          <div>
            <span className="summary-data-lbl">Sanction Capital</span>
            <strong className="summary-data-val text-primary" style={{ color: '#60a5fa' }}>₹{loanAmount.toLocaleString('en-IN')}.00</strong>
          </div>
          <div>
            <span className="summary-data-lbl">Monthly Installment (EMI)</span>
            <strong className="summary-data-val">₹{emi.toLocaleString('en-IN')}/mo</strong>
          </div>
          <div>
            <span className="summary-data-lbl">Sanction Tenure</span>
            <strong className="summary-data-val">{tenure} Months</strong>
          </div>
          <div>
            <span className="summary-data-lbl">Interest rate baseline</span>
            <strong className="summary-data-val">{interestRate}% Fixed P.A.</strong>
          </div>
          <div>
            <span className="summary-data-lbl">Linked Payout Destination</span>
            <strong className="summary-data-val payout">SBI (**4099)</strong>
          </div>
        </div>
      </div>

      <div className="esign-box-wrapper">
        <div className="esign-box-header">
          <span>DRAW HANDWRITTEN SIGNATURE</span>
          {hasDrawnSignature && (
            <button className="btn-clear-esign" onClick={clearSignature}>Wipe signature</button>
          )}
        </div>
        <canvas 
          ref={canvasRef}
          width={600}
          height={120}
          className="esign-canvas-element"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      <div style={{ margin: '16px 0', fontSize: '0.8rem', color: '#6b7280' }}>— OR TYPE CLEARANCE KEY TO E-SIGN —</div>

      <input 
        type="text" 
        placeholder="Type your full legal name to authorize (e.g. Rahul Sharma)" 
        value={typedSignature}
        onChange={(e) => setTypedSignature(e.target.value)}
        className="esign-typed-input"
        style={{ textAlign: 'center', fontFamily: typedSignature.trim().length > 0 ? "'Alex Brush', 'Dancing Script', cursive, italic" : 'inherit', fontSize: typedSignature.trim().length > 0 ? '1.4rem' : '0.95rem' }}
      />
    </div>
  );
};

export default Step4ESign;
