import { useEffect, useRef, useState } from "react";

const PromptModal = ({
  title,
  label,
  initialValue = "",
  fields = null,
  submitLabel = "Submit",
  onSubmit,
  onClose,
  confirmationOnly = false
}) => {
  const [value, setValue] = useState(initialValue);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current && !confirmationOnly) inputRef.current.focus();
  }, [confirmationOnly]);

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  const handleFieldChange = (name, val) => {
    setFormValues(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validateForm = () => {
    if (!fields) return true;
    
    const newErrors = {};
    let isValid = true;

    fields.forEach(field => {
      if (field.required && !formValues[field.name]?.trim()) {
        newErrors[field.name] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    if (fields) {
      if (!validateForm()) return;
      onSubmit(formValues);
    } else {
      onSubmit(value);
    }
  };

  return (
    <div className="modal-overlay">
      <div className={`modal ${confirmationOnly ? 'modal-confirmation' : ''}`} onKeyDown={handleKeyDown}>
        <button 
          onClick={() => onClose()}
          className="modal-close" 
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-header">
          {confirmationOnly && (
            <div className="modal-warning-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          )}
          <h3 className="modal-title">{title}</h3>
        </div>

        <div className="modal-content">
          {confirmationOnly ? (
            <p className="modal-confirmation-text">{label}</p>
          ) : fields ? (
            fields.map((field, idx) => (
              <div key={field.name} className="modal-field">
                <label className="modal-label">
                  {field.label}
                  {field.required && <span className="required-asterisk">*</span>}
                </label>
                <input
                  ref={idx === 0 ? inputRef : null}
                  className={`modal-input ${errors[field.name] ? 'input-error' : ''}`}
                  value={formValues[field.name] || ""}
                  onChange={(e) => handleFieldChange(field.name, e.target.value)}
                />
                {errors[field.name] && (
                  <div className="input-error-message">{errors[field.name]}</div>
                )}
              </div>
            ))
          ) : (
            <div className="modal-field">
              <label className="modal-label">{label}</label>
              <input
                ref={inputRef}
                className="modal-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              />
            </div>
          )}
        </div>

        <div className="modal-actions">
          <button 
            className={`btn ${confirmationOnly ? 'btn-muted' : 'btn-muted'}`} 
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className={`btn ${confirmationOnly ? 'btn-danger' : 'btn-primary'}`} 
            onClick={handleSubmit}
          >
            {submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;