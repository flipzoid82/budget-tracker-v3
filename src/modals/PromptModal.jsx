import { useState } from "react";

const PromptModal = ({ title, label, onSubmit, onClose }) => {
  const [value, setValue] = useState("");

  return (
    <div className="modal">
      <h3>{title}</h3>
      <label>{label}</label>
      <input value={value} onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => onSubmit(value)}>Submit</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
};

export default PromptModal;
