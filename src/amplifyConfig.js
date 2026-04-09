import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports.js";

const parseRedirectUris = (value) =>
	value
		.split(",")
		.map((uri) => uri.trim())
		.filter(Boolean);

const pickRedirectUri = (uris) => {
	const envIndex = Number.parseInt(import.meta.env.VITE_REDIRECT_INDEX ?? "", 10);
	const currentHref = `${window.location.origin}${window.location.pathname}`;
	const currentOrigin = window.location.origin;
	const exactMatch = uris.find((uri) => {
		try {
			const parsed = new URL(uri);
			const normalized = `${parsed.origin}${parsed.pathname}`;
			return normalized === currentHref;
		} catch {
			return false;
		}
	});

	if (exactMatch) {
		return exactMatch;
	}

	const originMatch = uris.find((uri) => {
		try {
			return new URL(uri).origin === currentOrigin;
		} catch {
			return false;
		}
	});

	if (originMatch) {
		return originMatch;
	}

	if (Number.isInteger(envIndex) && envIndex >= 0 && envIndex < uris.length) {
		return uris[envIndex];
	}

	return uris[0];
};

const redirectSignInUris = parseRedirectUris(awsExports.oauth.redirectSignIn);
const redirectSignOutUris = parseRedirectUris(awsExports.oauth.redirectSignOut);

awsExports.oauth.redirectSignIn = pickRedirectUri(redirectSignInUris);
awsExports.oauth.redirectSignOut = pickRedirectUri(redirectSignOutUris);

console.log(`OAuth redirectSignIn set to ${awsExports.oauth.redirectSignIn}`);
console.log(`OAuth redirectSignOut set to ${awsExports.oauth.redirectSignOut}`);

Amplify.configure(awsExports);
