export const EmptyTable = () => {
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            No Videos Available
          </h3>
          <p className="text-gray-500 max-w-sm">
            There are currently no videos to display. Add some content to get
            started.
          </p>
        </div>
      </div>
    </div>
  );
};
