import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../components/layout-ui/Button";
import useFeedback from "../../hooks/useFeedback";

const FeedbackDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { feedbackDetail, loading, error } = useFeedback({ id });

  return (
    <div className="flex flex-col gap-4">
      <div className="border-b border-b-slate-300 p-2 gap-4 flex items-center">
        <div
          className="text-lg w-6 h-6 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <ChevronLeftIcon className="text-lg text-gray-400" />
        </div>
        <h1 className="text-xl font-medium">Feedback Details</h1>
        {/* <Button type="submit" className="ml-auto">
          Add
        </Button> */}
      </div>
      {loading ? (
        <div className="absolute inset-0 z-10 bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <span className="text-gray-light text-lg font-medium">
            Loading feedback details...
          </span>
        </div>
      ) : error ? (
        <p className="text-red-500">Failed to load feedback.</p>
      ) : feedbackDetail ? (
        <>
          {/* User Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
            <div>
              <p className="mb-1">
                <span className="font-medium">User Name:</span>{" "}
                {feedbackDetail.user?.name || "—"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Email:</span>{" "}
                {feedbackDetail.user?.email || "—"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Mobile Number:</span>{" "}
                {feedbackDetail.user?.mobileNumber || "—"}
              </p>
            </div>
            <div>
              <p className="mb-1">
                <span className="font-medium">Address:</span>{" "}
                {feedbackDetail.user?.address || "—"}
              </p>
              <p className="mb-1">
                <span className="font-medium">Created At:</span>{" "}
                {new Date(feedbackDetail.user?.createdAt).toLocaleString()}
              </p>
              <p className="mb-1">
                <span className="font-medium">Role:</span>{" "}
                {feedbackDetail.user?.role || "—"}
              </p>
            </div>
          </div>

          {/* Description Card */}
          <div className=" p-2">
            <h2 className="text-xl font-medium mb-2">User Feedback</h2>
            <div className="p-4 rounded-lg border border-gray-200 shadow-inner">
              <p className=" whitespace-pre-line">
                {feedbackDetail.description || "No feedback provided."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No feedback found.</p>
      )}
    </div>
  );
};

export default FeedbackDetails;
