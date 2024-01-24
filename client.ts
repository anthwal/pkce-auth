import {
  generateChallenge,
  generateVerifier,
  hashingAlgorithm,
} from "./generatePkcePair";
import axios from "axios";

const verifier = generateVerifier(96);
const challenge = generateChallenge(verifier, hashingAlgorithm.sha256);

const reqUrl = "http://localhost:3000/oauth/authorization";
const authQueryObj = new URLSearchParams({
  grant_type: "pkce",
  client_id: "c2e10d5f-3e33-4154-a3a7-9fd7d9002fcb",
  code_challenge: challenge,
  algorithm: hashingAlgorithm.sha256,
  redirect_url: reqUrl,
});
console.log(authQueryObj);

axios
  .post(reqUrl, {}, { params: authQueryObj })
  .then((response) => console.log(response));
