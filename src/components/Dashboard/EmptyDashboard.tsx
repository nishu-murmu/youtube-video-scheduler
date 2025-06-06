const EmptyDashboard = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div
        className="bg-gray-200 rounded-3xl p-12 border border-gray-300"
        style={{
          boxShadow:
            "inset 16px 16px 32px #c1c5c9, inset -16px -16px 32px #ffffff",
        }}
      >
        <div className="text-center">
          <div
            className="w-20 h-20 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center"
            style={{
              boxShadow: "12px 12px 24px #c1c5c9, -12px -12px 24px #ffffff",
            }}
          >
            <svg
              className="w-10 h-10 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2m0 0V3a1 1 0 011 1v12a4 4 0 01-4 4H8a4 4 0 01-4-4V4a1 1 0 011-1m0 0h12m-6 8l-2-2m0 0l-2 2m2-2v6"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Data Available
          </h3>
          <p className="text-gray-500 max-w-sm">
            There are currently no items to display. Add some content to get
            started.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyDashboard;
