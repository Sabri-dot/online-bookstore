// src/components/ContactUs.jsx
import React, { useState, useMemo, useEffect } from 'react';

const ContactUs = ({ user: propUser }) => {
  // Merr user nga prop ose nga localStorage
  const userFromStorage = useMemo(() => {
    try {
      const stored = localStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }, []);

  const user = propUser || userFromStorage;

  // Vlera fillestare e formës
  const initialFormData = {
    fullName: user?.username || '',
    companyName: '',
    location: '',
    phone: '',
    email: user?.email || '',
    areaOfContact: '',
    otherArea: '',
    message: '',
    applyToPartner: false,
  };

  const [formData, setFormData] = useState(initialFormData);
  const [showOtherArea, setShowOtherArea] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    // Rifreskon fullName dhe email-in nëse user ndryshon
    setFormData((prev) => ({
      ...prev,
      fullName: user?.username || '',
      email: user?.email || '',
    }));
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'areaOfContact') {
      setShowOtherArea(value === 'other');
    }
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      setSubmitStatus({ type: 'error', message: 'Nuk jeni i identifikuar. Ju lutem logohuni.' });
      return;
    }
    // Krahasim i username me trim + lowercase
    if (
      !formData.fullName ||
      formData.fullName.trim().toLowerCase() !== user.username.trim().toLowerCase()
    ) {
      setSubmitStatus({
        type: 'error',
        message: 'Full Name duhet të jetë i njëjtë me emrin tuaj të regjistruar.',
      });
      return;
    }
    if (
      !formData.email ||
      formData.email.trim().toLowerCase() !== user.email.trim().toLowerCase()
    ) {
      setSubmitStatus({
        type: 'error',
        message: 'Email duhet të jetë i njëjtë me emailin tuaj të regjistruar.',
      });
      return;
    }
    if (!formData.areaOfContact) {
      setSubmitStatus({ type: 'error', message: 'Ju lutem zgjidhni Area of Contact.' });
      return;
    }
    if (formData.areaOfContact === 'other' && !formData.otherArea.trim()) {
      setSubmitStatus({
        type: 'error',
        message: 'Ju lutem specifikoni Area of Contact.',
      });
      return;
    }

    // Simulim dërgimi email-i
    setSubmitStatus({
      type: 'success',
      message: 'Email u dërgua me sukses! Faleminderit që na kontaktuat.',
    });

    // Pastro fushat (përveç fullName dhe email)
    setFormData((prev) => ({
      ...prev,
      companyName: '',
      location: '',
      phone: '',
      areaOfContact: '',
      otherArea: '',
      message: '',
      applyToPartner: false,
    }));
    setShowOtherArea(false);
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary">🤝 Contact Online Book Store</h2>
      <p className="mb-4">
        Grow with us. Jemi këtu për t'ju ndihmuar dhe për të dëgjuar sugjerimet tuaja për përmirësimin e Online Book Store.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="applyToPartner"
            name="applyToPartner"
            className="form-check-input"
            checked={formData.applyToPartner}
            onChange={handleChange}
          />
          <label htmlFor="applyToPartner" className="form-check-label fw-bold">
            📝Contact Us
          </label>
        </div>

        <div className="mb-3">
          <label htmlFor="fullName" className="form-label">
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            name="fullName"
            className="form-control border"
            value={formData.fullName}
            readOnly
            required
          />
          <div className="form-text">
            Emri juaj është i regjistruar, prandaj nuk keni nevojë ta ndryshoni.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="companyName" className="form-label">
            Company Name (nëse ka):
          </label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            className="form-control border"
            value={formData.companyName}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="location" className="form-label">
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            className="form-control border"
            value={formData.location}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="phone" className="form-label">
            Phone Number / WhatsApp:
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="form-control border"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            className="form-control border"
            value={formData.email}
            readOnly
            required
          />
          <div className="form-text">
            Email-i juaj është i regjistruar, prandaj nuk keni nevojë ta ndryshoni.
          </div>
        </div>

        <div className="mb-3">
          <label htmlFor="areaOfContact" className="form-label">
            Area of Contact:
          </label>
          <select
            id="areaOfContact"
            name="areaOfContact"
            className="form-select border"
            value={formData.areaOfContact}
            onChange={handleChange}
            required
          >
            <option value="">-- Zgjidhni --</option>
            <option value="support">Support</option>
            <option value="sales">Sales</option>
            <option value="partnership">Partnership</option>
            <option value="feedback">Feedback</option>
            <option value="other">Tjetër</option>
          </select>
        </div>

        {showOtherArea && (
          <div className="mb-3">
            <label htmlFor="otherArea" className="form-label">
              Ju lutem specifikoni:
            </label>
            <input
              type="text"
              id="otherArea"
              name="otherArea"
              className="form-control border"
              value={formData.otherArea}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            Na thuaj më shumë:
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            className="form-control border"
            value={formData.message}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary px-5">
          Dërgo email
        </button>

        {submitStatus.message && (
          <div
            className={`alert mt-3 ${
              submitStatus.type === 'success' ? 'alert-success' : 'alert-danger'
            }`}
            role="alert"
          >
            {submitStatus.message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactUs;
