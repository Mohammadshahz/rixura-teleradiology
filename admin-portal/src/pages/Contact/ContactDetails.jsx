import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import useContact from "../../hooks/useContact";

const ContactDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { contactDetail, loading, error } = useContact({ id });

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-b-slate-300 p-2 gap-4 flex items-center">
        <div
          className="text-lg w-6 h-6 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="text-lg text-gray-400" />
        </div>
        <h1 className="text-xl font-medium">Contact Details</h1>
      </div>
      {loading ? (
        <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <span className="text-gray-light text-lg font-medium">
            Loading contact details...
          </span>
        </div>
      ) : error ? (
        <p className="text-red-500">Failed to load feedback.</p>
      ) : contactDetail ? (
        <>
          {/* User Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
            <div>
              <p className="mb-1">
                <span className="font-medium">User Name:</span>{" "}
                {contactDetail.fullname || "—"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Email:</span>{" "}
                {contactDetail.email || "—"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Phone Number:</span>{" "}
                {contactDetail.phone_number || "—"}
              </p>
            </div>
            <div>
              <p className="mb-1">
                <span className="font-medium">Contact Type:</span>{" "}
                {contactDetail.contactType || "—"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Request Type:</span>{" "}
                {contactDetail.requestType || "—"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Created At:</span>{" "}
                {new Date(contactDetail.createdAt).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Description Card */}
          <div className=" p-2">
            <h2 className="text-xl font-medium mb-2">User Message</h2>
            <div className="p-4 rounded-lg border border-gray-200 shadow-inner">
              <p className=" whitespace-pre-line">
                {contactDetail.message || "No message provided."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No contact found.</p>
      )}
    </div>
  );
};

export default ContactDetails;
