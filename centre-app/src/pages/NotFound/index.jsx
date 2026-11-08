import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50 dark:bg-black px-6">
      <div className="max-w-2xl text-center relative">
        {/* Background Visual */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <svg
            className="w-80 h-80 text-gray-300 dark:text-gray-700"
            fill="none"
            stroke="currentColor"
            strokeWidth={1}
            viewBox="0 0 48 48"
          >
            <path
              d="M24 4a20 20 0 100 40 20 20 0 000-40zm0 0v20m0 0l8-8m-8 8l-8-8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        {/* Main Content */}
        <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          404
        </h1>
        <p className="mt-4 text-xl text-gray-700 dark:text-gray-300 font-semibold">
          Oops. This page doesn’t exist.
        </p>
        <p className="mt-2 text-gray-500 dark:text-gray-400">
          We couldn’t find what you were looking for. Either it's been moved, deleted, or never existed.
        </p>
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
