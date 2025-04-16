import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App.jsx";
import ErrorFallback from "./components/error/error-fallback.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Standard behavior: refresh the page
        window.location.reload();
      }}
      onError={(error, info) => {
        // Optional: Send error logs to your service
        console.error("Caught by ErrorBoundary:", error, info);
      }}
    >
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
