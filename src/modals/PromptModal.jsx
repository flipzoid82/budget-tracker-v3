import { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isValid } from "date-fns";

const DateInput = ({ value, onClick, onChange }) => (
  <input
    type="text"
    className="input"
    onClick={onClick}
    onChange={onChange}
    value={value}
    placeholder="MM/DD/YYYY"
    aria-label="Date input"
  />
);

const CustomDatePicker = ({ 
  value, 
  onChange, 
  error,
  id,
  label
}) => {
  const [internalDate, setInternalDate] = useState(null);

  useEffect(() => {
    if (value) {
      const dateParts = value.split('/');
      if (dateParts.length === 3) {
        const date = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
        if (isValid(date)) setInternalDate(date);
      }
    }
  }, [value]);

  const handleChange = (date) => {
    setInternalDate(date);
    onChange(format(date, "MM/dd/yyyy"));
  };

  return (
    <div className="date-field-container">
      <DatePicker
        selected={internalDate}
        onChange={handleChange}
        dateFormat="MM/dd/yyyy"
        className={`input ${error ? "input-error" : ""}`}
        placeholderText="Select or type date"
        popperPlacement="auto"
        popperModifiers={[
          {
            name: "offset",
            options: {
              offset: [0, 10]
            }
          },
          {
            name: "preventOverflow",
            options: {
            rootBoundary: "viewport",
            tether: false,
            altAxis: true
            }
          }
        ]}
        showPopperArrow={false}
        isClearable
        peekNextMonth
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        todayButton="Today"
        customInput={<DateInput />}
        ariaLabelledBy={`${id}-label`}
      />
      {/* <span className="date-format-hint">(MM/DD/YYYY)</span> */}
    </div>
  );
};

const PromptModal = ({
  title,
  label,
  initialValue = "",
  fields = null,
  submitLabel = "Submit",
  confirmationOnly = false,
  onSubmit,
  onClose,
}) => {
  const [value, setValue] = useState(initialValue);
  const [formValues, setFormValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (confirmationOnly) return;
  
    const delayFocus = setTimeout(() => {
      const el = inputRef.current || document.querySelector(".modal-content input");
      if (el) el.focus();
    }, 10); // small delay to wait for DOM
  
    return () => clearTimeout(delayFocus);
  }, [fields, confirmationOnly]);

  const validateDate = (dateString) => {
    if (!dateString) return true;
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    if (!regex.test(dateString)) return false;
    
    const [mm, dd, yyyy] = dateString.split('/');
    const date = new Date(yyyy, mm-1, dd);
    return date && date.getMonth()+1 === parseInt(mm);
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

      if (field.type === "date" && formValues[field.name]) {
        if (!validateDate(formValues[field.name])) {
          newErrors[field.name] = "Invalid date format (MM/DD/YYYY)";
          isValid = false;
        }
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (fields) {
      if (!validateForm()) return;
      setIsSubmitting(true);
      await onSubmit(formValues);
      setIsSubmitting(false);
    } else {
      setIsSubmitting(true);
      await onSubmit(value);
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") onClose();
  };

  const handleFieldChange = (name, val) => {
    setFormValues(prev => ({ ...prev, [name]: val }));
    setErrors(prev => ({ ...prev, [name]: null }));
  };

  return (
    <div className="modal-overlay">
      <div className={`modal ${confirmationOnly ? 'modal-confirmation' : ''}`} onKeyDown={handleKeyDown}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button 
            className="modal-close" 
            onClick={onClose} 
            aria-label="Close"
            disabled={isSubmitting}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-content">
          {confirmationOnly ? (
            <div className="confirmation-content">
              <div className="modal-warning-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger)">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <p className="modal-confirmation-text">{label}</p>
            </div>
          ) : fields ? (
            fields.map((field, idx) => (
              <div key={field.name} className="modal-field">
                <label htmlFor={field.name} className="modal-label">
                  {field.label}
                  {field.required && <span className="required-asterisk">*</span>}
                </label>
                {field.type === "date" ? (
                  <CustomDatePicker
                    value={formValues[field.name] || ""}
                    onChange={(val) => handleFieldChange(field.name, val)}
                    error={errors[field.name]}
                    id={field.name}
                    label={field.label}
                  />
                ) : field.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    id={field.name}
                    checked={formValues[field.name] || false}
                    onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                    disabled={isSubmitting}
                  />
                ) : (
                  <input
                    id={field.name}
                    ref={idx === 0 ? inputRef : null}
                    className={`input ${errors[field.name] ? "input-error" : ""}`}
                    value={formValues[field.name] || ""}
                    onChange={(e) => handleFieldChange(field.name, e.target.value)}
                    disabled={isSubmitting}
                  />
                )}

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
                className="input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                disabled={isSubmitting}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="modal-actions">
          <button 
            className={`btn ${confirmationOnly ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="spinner">Processing...</span>
            ) : (
              submitLabel
            )}
          </button>
          <button 
            className="btn btn-muted" 
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptModal;