// process name
const ELECTRON_PROCESS_NAME =
    typeof window === "undefined"
        ? "main"
        : "renderer";

export default ELECTRON_PROCESS_NAME;
