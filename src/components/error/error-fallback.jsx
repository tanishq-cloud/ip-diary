import { useState } from "react";
import { AlertCircle, RefreshCw, MessageSquare } from "lucide-react";

export default function ErrorFallback({ error, resetErrorBoundary }) {
  const [showDetails, setShowDetails] = useState(false);
  const [feedBack, setFeedback] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const DepoID =
    "AKfycbzluP5fduZIzmLVcClTgx3fiaEiiVsTCxfXT9qAyH_9674SeLTv2MMjEpHsPOawjmkZ6Q";
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    const body = JSON.stringify({ feedback: feedBack });
    try {
      const res = await fetch(
        `https://script.google.com/macros/s/${DepoID}/exec`,
        {
          method: "POST",
          body: body,
          mode: "no-cors",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": body.length,
            Host: "script.google.com",
          },
        }
      );
      console.log(JSON.stringify({ feedback: feedBack }));

      setFeedbackSubmitted(true);
      setFeedback("");
    } catch (err) {
      console.error("Failed to submit feedback:", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 mx-4 bg-white rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>

        <h2 className="mb-2 text-2xl font-bold text-center text-gray-800">
          Something went wrong
        </h2>
        <p className="mb-6 text-center text-gray-600">
          We're sorry, but we encountered an unexpected error.
        </p>

        <div className="flex justify-center mb-6 space-x-4">
          <button
            onClick={resetErrorBoundary}
            className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try again
          </button>

          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center px-4 py-2 font-medium transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
          >
            {showDetails ? "Hide" : "Show"} details
          </button>
        </div>

        {showDetails && (
          <div className="p-4 mb-6 overflow-auto text-sm bg-gray-100 rounded-md max-h-32">
            <pre className="text-red-600">{error.toString()}</pre>
            {error.stack && (
              <pre className="mt-2 text-gray-700">{error.stack}</pre>
            )}
          </div>
        )}

        {!feedbackSubmitted ? (
          <form onSubmit={handleSubmitFeedback} className="mt-6">
            <p className="mb-2 text-sm font-medium text-gray-700">
              Help us improve by reporting this issue:
            </p>
            <div className="flex items-start space-x-2">
              <textarea
                value={feedBack}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="What were you doing when this error occurred?"
                rows={3}
              />
              <button
                type="submit"
                disabled={!feedBack.trim()}
                className="p-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-4 mt-6 text-sm text-green-700 bg-green-100 rounded-md">
            Thank you for your feedback! We'll look into this issue.
          </div>
        )}
      </div>
    </div>
  );
}
