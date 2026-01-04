/// <reference types="vite/client" />

interface ViteTypeOptions {
	// strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
	readonly VITE_IS_PREVIEW: string;
	readonly VITE_BUILD_TIMESTAMP: string;
	
	// https://vercel.com/docs/environment-variables/system-environment-variables
	readonly VERCEL?: string;
	readonly VERCEL_GIT_COMMIT_AUTHOR_EMAIL?: string;
	readonly VERCEL_GIT_COMMIT_AUTHOR_NAME?: string;
	readonly VERCEL_GIT_COMMIT_REF?: string;
	readonly VERCEL_GIT_COMMIT_SHA?: string;
	readonly VERCEL_GIT_COMMIT_MESSAGE?: string;
	readonly VERCEL_GIT_PREVIOUS_SHA?: string;
	readonly VERCEL_GIT_PROVIDER?: string;
	readonly VERCEL_GIT_PULL_REQUEST_ID?: string;
	readonly VERCEL_GIT_REPO_OWNER?: string;
	readonly VERCEL_GIT_REPO_SLUG?: string;
	readonly VERCEL_GIT_REPO_ID?: string;

}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
