import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports.js";

const redirectSignInUri = awsExports.oauth.redirectSignIn.split(',')
awsExports.oauth.redirectSignIn = redirectSignInUri[parseInt(import.meta.env.VITE_REDIRECT_INDEX)]
const redirectSignOutUri = awsExports.oauth.redirectSignOut.split(',')
awsExports.oauth.redirectSignOut = redirectSignOutUri[parseInt(import.meta.env.VITE_REDIRECT_INDEX)]

Amplify.configure(awsExports);
