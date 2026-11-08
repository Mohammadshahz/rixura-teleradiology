import { useNavigate } from "react-router-dom";
import { EnvelopeIcon, EyeIcon, PencilIcon } from "@heroicons/react/24/outline";

export const ActionCellRenderer = (props) => {
  const navigate = useNavigate();

  const iconStyles = "w-5 h-5 cursor-pointer text-gray-600 hover:text-blue-500";

  const handleEdit = () => {
    navigate(`/reports/edit/999`);
  };

  const handleView = () => {
    navigate(`/dicom/999`);
  };

  const handleSendMessage = () => {
    props.setModalData(props.data);
  };

  return (
    <div className="flex gap-4 mt-2">
      <EnvelopeIcon
        className={iconStyles}
        title="Send Message"
        onClick={handleSendMessage}
      />
      <EyeIcon className={iconStyles} title="View" onClick={handleView} />
      <PencilIcon className={iconStyles} title="Edit" onClick={handleEdit} />
    </div>
  );
};
