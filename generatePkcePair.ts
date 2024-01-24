import { createHash, randomBytes } from "node:crypto";
import { Buffer } from "node:buffer";

export enum hashingAlgorithm {
  sha256 = "sha265",
  sha512 = "sha512",
}

/**
 * Converts the passed buffer instance to base64Url encoded string
 * @param buffer
 */
export function base64UrlEncode(buffer: Buffer): string {
  return buffer.toString("base64url");
}

/**
 * Generates a random verifier string from passed number of bytes, which should be in the range 32-96.
 * The generated verifier will be a url safe string.
 * @param bytes
 */
export function generateVerifier(bytes: number): string {
  if (bytes < 32 || bytes > 96) {
    throw new Error(
      "Expected bytes to be passed should be greater than 32 and less than 96 to generate correct length verifier",
    );
  }
  return base64UrlEncode(randomBytes(bytes));
}

/**
 * Generates the challenge from the passed verifier and hashing algorithm
 * @param verifier
 * @param algorithm
 */
export function generateChallenge(
  verifier: string,
  algorithm: hashingAlgorithm,
): string {
  return base64UrlEncode(createHash(algorithm).update(verifier).digest());
}

/**
 * Verifies the challenge against the verifier, returns 0 if verification is successfull and other numbers otherwise.
 * @param challenge
 * @param verifier
 * @param algorithm
 */
export function verifyChallenge(
  challenge: string,
  verifier: string,
  algorithm: hashingAlgorithm,
): 0 | 1 | -1 {
  return Buffer.compare(
    Buffer.from(challenge, "base64url"),
    createHash(algorithm).update(verifier).digest(),
  );
}

// Example for generating a verifier, a challenge against the verifier and verifying it.

const verifier = generateVerifier(96);
const challenge = generateChallenge(verifier, hashingAlgorithm.sha512);
console.log(verifyChallenge(challenge, verifier, hashingAlgorithm.sha256));
