/**
 * GitHub App API Client
 * 
 * This client interacts with the GitHub App API to:
 * - Generate JWT tokens for authentication
 * - Get installation tokens for accessing repositories
 * - Fetch repository information and contents
 * 
 * GitHub App Setup:
 * 1. Create a GitHub App at https://github.com/settings/apps
 * 2. Generate a private key (.pem file)
 * 3. Note the App ID
 * 4. Install the app on repositories you want to allow
 * 
 * Required Permissions:
 * - Repository contents: read
 * - Metadata: read
 */

import { createHash } from "crypto";
import { readFileSync } from "fs";

interface GitHubConfig {
  appId: string;
  privateKey: string;
  clientId?: string;
  clientSecret?: string;
}

interface GitHubJWT {
  token: string;
  expiresAt: Date;
}

interface GitHubInstallation {
  id: number;
  account: {
    login: string;
    type: string;
  };
  permissions: Record<string, string>;
}

interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  clone_url: string;
  default_branch: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
}

interface GitHubFile {
  name: string;
  path: string;
  sha: string;
  size: number;
  type: "file" | "dir";
  download_url: string | null;
  html_url: string;
}

function getConfig(): GitHubConfig | null {
  const appId = process.env.GITHUB_APP_ID;
  const privateKeyPath = process.env.GITHUB_PRIVATE_KEY_PATH;
  const privateKeyContent = process.env.GITHUB_PRIVATE_KEY;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!appId) {
    console.log("[GitHub] App ID not configured");
    return null;
  }

  let privateKey = privateKeyContent;
  if (!privateKey && privateKeyPath) {
    try {
      privateKey = readFileSync(privateKeyPath, "utf-8");
    } catch (error) {
      console.error("[GitHub] Failed to read private key file:", error);
      return null;
    }
  }

  if (!privateKey) {
    console.log("[GitHub] Private key not configured");
    return null;
  }

  return {
    appId,
    privateKey,
    clientId: clientId || undefined,
    clientSecret: clientSecret || undefined,
  };
}

/**
 * Generate a JWT token for GitHub App authentication
 */
function generateJWT(): GitHubJWT | null {
  const config = getConfig();
  if (!config) return null;

  try {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + 600; // 10 minutes

    // Create JWT header and payload
    const header = Buffer.from(
      JSON.stringify({ alg: "RS256", typ: "JWT" })
    ).toString("base64url");

    const payload = Buffer.from(
      JSON.stringify({
        iat: now,
        exp: exp,
        iss: config.appId,
      })
    ).toString("base64url");

    // Sign the JWT using the private key
    const signature = signWithPrivateKey(
      `${header}.${payload}`,
      config.privateKey
    );

    return {
      token: `${header}.${payload}.${signature}`,
      expiresAt: new Date(exp * 1000),
    };
  } catch (error) {
    console.error("[GitHub] Failed to generate JWT:", error);
    return null;
  }
}

/**
 * Sign data with RSA private key using Node.js crypto
 */
function signWithPrivateKey(data: string, privateKey: string): string {
  // Use crypto module to sign
  const crypto = require("crypto");
  
  // Parse the PEM private key
  const keyObject = crypto.createPrivateKey({
    key: privateKey,
    format: "pem",
    type: "pkcs1",
  });

  const sign = crypto.createSign("RSA-SHA256");
  sign.update(data);
  const signature = sign.sign(keyObject);
  
  return signature.toString("base64url");
}

/**
 * Get all installations for the GitHub App
 */
export async function getInstallations(): Promise<GitHubInstallation[]> {
  const jwt = generateJWT();
  if (!jwt) return [];

  try {
    const response = await fetch("https://api.github.com/app/installations", {
      headers: {
        Authorization: `Bearer ${jwt.token}`,
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    });

    if (!response.ok) {
      console.error("[GitHub] Failed to get installations:", response.status);
      return [];
    }

    const data = await response.json();
    return data.installations as GitHubInstallation[];
  } catch (error) {
    console.error("[GitHub] Error getting installations:", error);
    return [];
  }
}

/**
 * Get an installation token for a specific installation
 */
export async function getInstallationToken(
  installationId: number
): Promise<string | null> {
  const jwt = generateJWT();
  if (!jwt) return null;

  try {
    const response = await fetch(
      `https://api.github.com/app/installations/${installationId}/access_tokens`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt.token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          permissions: {
            contents: "read",
            metadata: "read",
          },
        }),
      }
    );

    if (!response.ok) {
      console.error("[GitHub] Failed to get installation token:", response.status);
      return null;
    }

    const data = await response.json();
    return data.token as string;
  } catch (error) {
    console.error("[GitHub] Error getting installation token:", error);
    return null;
  }
}

/**
 * Find installation for a specific repository
 */
export async function findInstallationForRepo(
  owner: string,
  repo: string
): Promise<GitHubInstallation | null> {
  const installations = await getInstallations();
  
  for (const installation of installations) {
    if (installation.account.login.toLowerCase() === owner.toLowerCase()) {
      return installation;
    }
  }
  
  return null;
}

/**
 * Get repository information using installation token
 */
export async function getRepository(
  owner: string,
  repo: string,
  token: string
): Promise<GitHubRepository | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      console.error("[GitHub] Failed to get repository:", response.status);
      return null;
    }

    return (await response.json()) as GitHubRepository;
  } catch (error) {
    console.error("[GitHub] Error getting repository:", error);
    return null;
  }
}

/**
 * Get repository contents (files and directories)
 */
export async function getRepositoryContents(
  owner: string,
  repo: string,
  path: string,
  token: string
): Promise<GitHubFile[]> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      console.error("[GitHub] Failed to get contents:", response.status);
      return [];
    }

    const data = await response.json();
    return (Array.isArray(data) ? data : [data]) as GitHubFile[];
  } catch (error) {
    console.error("[GitHub] Error getting contents:", error);
    return [];
  }
}

/**
 * Download a file from repository
 */
export async function downloadFile(
  owner: string,
  repo: string,
  path: string,
  token: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github.raw",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      console.error("[GitHub] Failed to download file:", response.status);
      return null;
    }

    return await response.text();
  } catch (error) {
    console.error("[GitHub] Error downloading file:", error);
    return null;
  }
}

/**
 * Get default branch reference for repository
 */
export async function getDefaultBranchRef(
  owner: string,
  repo: string,
  token: string
): Promise<string | null> {
  try {
    const repoInfo = await getRepository(owner, repo, token);
    if (!repoInfo) return null;

    // Get the ref for the default branch
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${repoInfo.default_branch}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.object.sha as string;
  } catch (error) {
    console.error("[GitHub] Error getting default branch ref:", error);
    return null;
  }
}

/**
 * Import a repository (GitHub's built-in import API)
 * This is useful for importing external repos into GitHub
 */
export async function importRepository(
  owner: string,
  repo: string,
  token: string,
  options: {
    vcs?: string;
    vcsUrl?: string;
  } = {}
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/import`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        body: JSON.stringify({
          vcs: options.vcs,
          vcs_url: options.vcsUrl,
        }),
      }
    );

    return response.ok;
  } catch (error) {
    console.error("[GitHub] Error importing repository:", error);
    return false;
  }
}

/**
 * Get the GitHub App installation URL for a specific owner
 * This is where users are redirected to install the app
 */
export function getInstallationUrl(owner: string): string | null {
  const config = getConfig();
  if (!config) {
    return null;
  }
  
  // The installation URL allows users to install the GitHub App
  // and grant access to their repositories
  // We use the client_id to construct the URL
  // Format: https://github.com/apps/{client_id}/installations/new?repository_owner={owner}
  // Note: In practice, the app slug may differ from client_id
  // If GITHUB_APP_SLUG is set, use that instead
  const appSlug = process.env.GITHUB_APP_SLUG || config.clientId || config.appId;
  
  return `https://github.com/apps/${appSlug}/installations/new?repository_owner=${owner}`;
}

/**
 * Check if GitHub App is configured
 */
export function isGitHubAppConfigured(): boolean {
  return getConfig() !== null;
}

/**
 * Parse GitHub repository URL to get owner and repo
 */
export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  // Match: https://github.com/owner/repo or https://github.com/owner/repo.git
  const match = url.match(/github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?$/);
  if (!match) return null;

  return {
    owner: match[1],
    repo: match[2].replace(/\.git$/, ""),
  };
}
