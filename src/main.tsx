import ReactDOM from "react-dom/client";
import App from "./App";

// biome-ignore lint/style/noNonNullAssertion: This is necessary to avoid a type error
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
