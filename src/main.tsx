import { createRoot } from "react-dom/client";
import App from "./NirogCareOriginalFixed.tsx";
import "./index.css";

const root = createRoot(document.getElementById("root")!);
import { ErrorBoundary } from "./components/ErrorBoundary";

import { AppProvider } from "@/context/AppContext";

root.render(
    <ErrorBoundary>
        <AppProvider>
            <App />
        </AppProvider>
    </ErrorBoundary>
);
