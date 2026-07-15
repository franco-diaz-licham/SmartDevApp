/// <reference types="vite/client" />

// (optional) strongly type your custom vars:
interface ImportMetaEnv {
    readonly VITE_API_BASE: string;
}
interface ImportMeta {
    readonly env: ImportMetaEnv;
}
