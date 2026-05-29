import React, { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../../components/Navbar/Navbar';
import Footer from '../../../components/Footer/Footer';
import ScrollReveal from '../../../components/ScrollReveal/ScrollReveal';
import ParallaxShapes from '../../../components/ParallaxShapes/ParallaxShapes';
import { JOBS } from '../JobListingsPage/jobsData';
import jobAppImg from '../../../../assets/jobapplication.png';
import './JobApplyPage.css';

/* ── icons ── */
const IconUpload = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
  </svg>
);
const IconFile = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
  </svg>
);

const JobApplyPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const job = JOBS.find((j) => j.id === jobId);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', state: '', postal: '',
  });
  const [resume, setResume] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  if (!job) {
    return (
      <div className="ja-page-wrapper">
        <Navbar />
        <div className="ja-not-found">
          <h2>Role not found</h2>
          <Link to="/careers/openings" className="ja-back-link">← Back to openings</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleFile = (file) => {
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      setErrors((p) => ({ ...p, resume: 'Only PDF or Word documents are accepted.' }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((p) => ({ ...p, resume: 'File must be smaller than 5 MB.' }));
      return;
    }
    setResume(file);
    setErrors((p) => ({ ...p, resume: '' }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = 'Required';
    if (!form.lastName.trim()) e.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim() || !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
      e.phone = 'Valid 10-digit mobile number required';
    if (!resume) e.resume = 'Please attach your resume / CV';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) { setErrors(e2); return; }
    setSubmitted(true);
  };

  /* success */
  if (submitted) {
    return (
      <div className="ja-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
        <Navbar />

        {/* Dynamic ambient moving shapes background */}
        <ParallaxShapes preset="side-decor" />

        <ScrollReveal variant="zoom-in">
          <div className="ja-success" style={{ position: 'relative', zIndex: 2 }}>
            <div className="ja-success-icon">🎉</div>
            <h2 className="ja-success-title">Application Submitted!</h2>
            <p className="ja-success-msg">
              Thanks, <strong>{form.firstName}</strong>! We've received your application for{' '}
              <strong>{job.title}</strong>. Our team will be in touch at{' '}
              <strong>{form.email}</strong> within 5–7 business days.
            </p>
            <div className="ja-success-actions">
              <button className="ja-btn-primary" onClick={() => navigate('/careers/openings')}>Browse More Roles</button>
              <button className="ja-btn-outline" onClick={() => navigate('/careers')}>Back to Careers</button>
            </div>
          </div>
        </ScrollReveal>
        <Footer />
      </div>
    );
  }

  return (
    <div className="ja-page-wrapper" style={{ position: 'relative', overflow: 'hidden' }}>
      <Navbar />

      {/* Dynamic ambient moving shapes background */}
      <ParallaxShapes preset="side-decor" />

      {/* breadcrumb */}
      <div className="ja-breadcrumb" style={{ position: 'relative', zIndex: 2 }}>
        <ScrollReveal variant="fade-up">
          <div className="ja-breadcrumb-inner">
            <button className="ja-back-btn" onClick={() => navigate(-1)}>
              <IconArrow /> Back to openings
            </button>
            <span className="ja-breadcrumb-sep">›</span>
            <span className="ja-breadcrumb-current">{job.title}</span>
          </div>
        </ScrollReveal>
      </div>

      {/* ── TWO-COLUMN LAYOUT ── */}
      <div className="ja-split-layout" style={{ position: 'relative', zIndex: 2 }}>

        {/* LEFT — illustration */}
        <ScrollReveal variant="fade-right" className="ja-image-col">
          <div style={{ height: '100%' }}>
            <img
              src={jobAppImg}
              alt="Job application illustration"
              className="ja-illustration"
            />
            <div className="ja-image-caption">
              <h3 className="ja-caption-title">One step closer 🎯</h3>
              <p className="ja-caption-text">
                Upload your latest resume and let us know who you are.
                We'll take it from here.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* RIGHT — form */}
        <ScrollReveal variant="fade-left" className="ja-form-col">
          <div className="ja-form-card">

            <div className="ja-form-head">
              <h1 className="ja-form-title">Apply for this position</h1>
              <p className="ja-form-role">{job.title}</p>
              <p className="ja-form-required"><span className="ja-req-star">*</span> Required fields</p>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              {/* Name */}
              <div className="ja-grid-2">
                <div className="ja-field-group">
                  <label className="ja-label" htmlFor="firstName">First Name <span className="ja-req-star">*</span></label>
                  <input id="firstName" name="firstName"
                    className={`ja-input ${errors.firstName ? 'ja-input--err' : ''}`}
                    value={form.firstName} onChange={handleChange} placeholder="Arjun" />
                  {errors.firstName && <span className="ja-err">{errors.firstName}</span>}
                </div>
                <div className="ja-field-group">
                  <label className="ja-label" htmlFor="lastName">Last Name <span className="ja-req-star">*</span></label>
                  <input id="lastName" name="lastName"
                    className={`ja-input ${errors.lastName ? 'ja-input--err' : ''}`}
                    value={form.lastName} onChange={handleChange} placeholder="Sharma" />
                  {errors.lastName && <span className="ja-err">{errors.lastName}</span>}
                </div>
              </div>

              {/* Email + Phone */}
              <div className="ja-grid-2">
                <div className="ja-field-group">
                  <label className="ja-label" htmlFor="email">Email Address <span className="ja-req-star">*</span></label>
                  <input id="email" name="email" type="email"
                    className={`ja-input ${errors.email ? 'ja-input--err' : ''}`}
                    value={form.email} onChange={handleChange} placeholder="arjun@example.com" />
                  {errors.email && <span className="ja-err">{errors.email}</span>}
                </div>
                <div className="ja-field-group">
                  <label className="ja-label" htmlFor="phone">Phone <span className="ja-req-star">*</span></label>
                  <input id="phone" name="phone" type="tel"
                    className={`ja-input ${errors.phone ? 'ja-input--err' : ''}`}
                    value={form.phone} onChange={handleChange} placeholder="98765 43210" maxLength={10} />
                  {errors.phone && <span className="ja-err">{errors.phone}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="ja-field-group">
                <label className="ja-label" htmlFor="address">Address</label>
                <input id="address" name="address" className="ja-input"
                  value={form.address} onChange={handleChange} placeholder="Street / Apartment" />
              </div>

              {/* City / State / Postal */}
              <div className="ja-grid-3">
                <div className="ja-field-group">
                  <label className="ja-label" htmlFor="city">City</label>
                  <input id="city" name="city" className="ja-input"
                    value={form.city} onChange={handleChange} placeholder="Ernakulam" />
                </div>
                <div className="ja-field-group">
                  <label className="ja-label" htmlFor="state">State</label>
                  <input id="state" name="state" className="ja-input"
                    value={form.state} onChange={handleChange} placeholder="Kerala" />
                </div>
                <div className="ja-field-group">
                  <label className="ja-label" htmlFor="postal">Postal Code</label>
                  <input id="postal" name="postal" className="ja-input"
                    value={form.postal} onChange={handleChange} placeholder="682025" />
                </div>
              </div>

              {/* Resume Upload */}
              <div className="ja-field-group">
                <label className="ja-label">Resume / CV <span className="ja-req-star">*</span></label>
                <div
                  className={`ja-upload-zone ${dragging ? 'ja-upload-zone--drag' : ''} ${resume ? 'ja-upload-zone--filled' : ''} ${errors.resume ? 'ja-upload-zone--err' : ''}`}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileRef.current?.click()}
                >
                  <input ref={fileRef} type="file" accept=".pdf,.doc,.docx"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFile(e.target.files[0])} />

                  {resume ? (
                    <div className="ja-upload-filled">
                      <div className="ja-upload-file-icon"><IconFile /></div>
                      <div className="ja-upload-file-info">
                        <p className="ja-upload-filename">{resume.name}</p>
                        <p className="ja-upload-size">{(resume.size / 1024).toFixed(1)} KB · Click to replace</p>
                      </div>
                      <div className="ja-upload-tick"><IconCheck /></div>
                    </div>
                  ) : (
                    <div className="ja-upload-placeholder">
                      <div className="ja-upload-icon-wrap"><IconUpload /></div>
                      <p className="ja-upload-cta">
                        <strong>Drag & drop</strong> your resume, or{' '}
                        <span className="ja-upload-link">click to browse</span>
                      </p>
                      <p className="ja-upload-hint">PDF, DOC, DOCX · Max 5 MB</p>
                    </div>
                  )}
                </div>
                {errors.resume && <span className="ja-err">{errors.resume}</span>}
              </div>

              <button type="submit" className="ja-submit-btn" id="submit-application-btn">
                Submit Application
              </button>

            </form>
          </div>
        </ScrollReveal>

      </div>

      <Footer />
    </div>
  );
};

export default JobApplyPage;
