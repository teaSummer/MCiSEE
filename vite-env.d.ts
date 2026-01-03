/// <reference types="vite/client" />

interface ViteTypeOptions {
	// strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
	readonly VITE_IS_PREVIEW: boolean
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}
