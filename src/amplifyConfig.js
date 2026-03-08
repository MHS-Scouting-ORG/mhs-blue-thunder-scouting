import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports.js";

console.log(`imported from ${import.meta.env.VITE_REDIRECT_INDEX} index`)
console.log(`redirecting to ${awsExports.oauth.redirectSignIn}`)

const redirectSignInUri = awsExports.oauth.redirectSignIn.split(',')
console.log(`redirecting to ${awsExports.oauth.redirectSignIn}`)
awsExports.oauth.redirectSignIn = redirectSignInUri[parseInt(import.meta.env.VITE_REDIRECT_INDEX)]
const redirectSignOutUri = awsExports.oauth.redirectSignOut.split(',')
awsExports.oauth.redirectSignOut = redirectSignOutUri[parseInt(import.meta.env.VITE_REDIRECT_INDEX)]

Amplify.configure(awsExports);
