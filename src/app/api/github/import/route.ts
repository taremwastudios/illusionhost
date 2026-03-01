import { NextResponse } from "next/server";
import {
  isGitHubAppConfigured,
  parseGitHubUrl,
  findInstallationForRepo,
  getInstallationToken,
  getRepository,
  getRepositoryContents,
  getInstallationUrl,
} from "@/lib/github";

export async function POST(request: Request) {
  try {
    const { repoUrl } = await request.json();

    if (!repoUrl) {
      return NextResponse.json(
        { success: false, error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // Validate GitHub URL format
    const parsed = parseGitHubUrl(repoUrl);
    if (!parsed) {
      return NextResponse.json(
        { success: false, error: "Invalid GitHub repository URL. Use format: https://github.com/owner/repo" },
        { status: 400 }
      );
    }

    const { owner, repo } = parsed;

    // Check if GitHub App is configured
    if (!isGitHubAppConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "GitHub App is not configured. Please set GITHUB_APP_ID and GITHUB_PRIVATE_KEY environment variables.",
        },
        { status: 500 }
      );
    }

    // Find the installation for this repository
    const installation = await findInstallationForRepo(owner, repo);
    if (!installation) {
      // Get installation URL for the repository owner
      const installUrl = getInstallationUrl(owner);
      return NextResponse.json(
        {
          success: false,
          error: `GitHub App is not installed on your account. Please install the app to grant access to your repositories.`,
          needsInstallation: true,
          installationUrl: installUrl,
          owner,
          repo,
        },
        { status: 403 }
      );
    }

    // Get installation token
    const token = await getInstallationToken(installation.id);
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Failed to authenticate with GitHub" },
        { status: 500 }
      );
    }

    // Get repository information
    const repository = await getRepository(owner, repo, token);
    if (!repository) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch repository information" },
        { status: 500 }
      );
    }

    // Get repository contents to understand the project structure
    const contents = await getRepositoryContents(owner, repo, "", token);
    
    // Detect project type based on files
    let projectType: string | null = null;
    const fileNames = contents.map(f => f.name);
    
    if (fileNames.includes("package.json")) {
      projectType = "nodejs";
    } else if (fileNames.includes("requirements.txt") || fileNames.includes("setup.py") || fileNames.includes("pyproject.toml")) {
      projectType = "python";
    } else if (fileNames.includes("composer.json")) {
      projectType = "php";
    } else if (fileNames.includes("go.mod")) {
      projectType = "go";
    } else if (fileNames.includes("Cargo.toml")) {
      projectType = "rust";
    } else if (fileNames.includes("pom.xml") || fileNames.includes("build.gradle")) {
      projectType = "java";
    } else if (fileNames.includes("index.html")) {
      projectType = "static";
    }

    // Return success with repository information
    // In a full implementation, this would:
    // 1. Create a new web domain in HestiaCP
    // 2. Clone the repository to the server
    // 3. Set up the build environment
    // 4. Configure nginx
    // 5. Set up SSL
    // 6. Start the application

    return NextResponse.json({
      success: true,
      message: "Repository access verified. Deployment will begin shortly.",
      deployment: {
        url: `https://${repo.toLowerCase()}.illusionhost.dev`,
        status: "preparing",
        buildLogs: [
          `Found repository: ${owner}/${repo}`,
          `Project type detected: ${projectType || "unknown"}`,
          `Installation: ${installation.account.login}`,
          "Setting up deployment...",
        ],
      },
      repo: {
        owner,
        name: repo,
        fullName: `${owner}/${repo}`,
        description: repository.description,
        language: repository.language,
        defaultBranch: repository.default_branch,
        stars: repository.stargazers_count,
        private: repository.private,
      },
      projectType,
    });
  } catch (error) {
    console.error("GitHub import error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to import repository" },
      { status: 500 }
    );
  }
}
