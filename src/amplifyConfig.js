import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports.js";

const parseCandidates = (csv) => String(csv || '')
	.split(',')
	.map((v) => v.trim())
	.filter(Boolean)

const getOrigin = (uri) => {
	try {
		return new URL(uri).origin
	} catch {
		return ''
	}
}

const pickRedirectByOrigin = (csv, preferredIndexRaw) => {
	const candidates = parseCandidates(csv)
	if (candidates.length === 0) return ''

	const currentOrigin = typeof window !== 'undefined' ? window.location.origin : ''
	if (currentOrigin) {
		const matched = candidates.find((uri) => getOrigin(uri) === currentOrigin)
		if (matched) return matched
	}

	const preferredIndex = Number.parseInt(String(preferredIndexRaw ?? ''), 10)
	if (Number.isInteger(preferredIndex) && preferredIndex >= 0 && preferredIndex < candidates.length) {
		return candidates[preferredIndex]
	}

	return candidates[0]
}

const configuredIndex = import.meta.env.VITE_REDIRECT_INDEX
awsExports.oauth.redirectSignIn = pickRedirectByOrigin(awsExports.oauth.redirectSignIn, configuredIndex)
awsExports.oauth.redirectSignOut = pickRedirectByOrigin(awsExports.oauth.redirectSignOut, configuredIndex)

Amplify.configure(awsExports);
