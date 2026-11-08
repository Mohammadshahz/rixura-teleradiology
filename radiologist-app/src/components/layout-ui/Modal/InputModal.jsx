import { useState } from "react";
import Modal from ".";
import FormInput from "../InputFields/FormInput";
import Button from "../Button";

const InputModal = ({ isOpen, onClose, onSave, comments }) => {
  const [title, setTitle] = useState("");

  const handleSave = () => {
    if (!title.trim()) return;
    onSave(title.trim(), comments); // ✅ pass both title and comments
    setTitle("");
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Save as New Template">
      <div className="space-y-4">
        <FormInput
          name="templateTitle"
          label="Template Title"
          placeholder="Enter a name for your new template"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <Button onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim()}>
            Save as New Template
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InputModal;
