import { useState } from "react";

interface DeactivateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const DeactivateModal: React.FC<DeactivateModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-semibold mb-3">Deactivate Account</h2>
        <textarea
          className="w-full p-2 border rounded-md focus:ring focus:ring-red-300"
          placeholder="Enter reason for deactivation..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={onClose}
            className="px-3 py-2 text-sm rounded-lg border border-gray-400 bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reason)}
            className="px-3 py-2 text-sm rounded-lg border border-red-600 bg-red-600 text-white hover:bg-opacity-90"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeactivateModal;
