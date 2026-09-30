/**
 * Set this to the Windows installer location when it is available:
 * an absolute HTTPS URL, or a site-relative path such as
 * `/simPl-setup.exe` for a file placed in `public/`.
 */
export const windowsDownloadUrl: string | null =
  'https://github.com/Tikkaaa3/simPl-reader/releases/download/v0.1.5/simPl-0.1.5-windows-x64-setup.exe';

export const repositoryUrl = 'https://github.com/Tikkaaa3/simPl-reader';
export const releaseVersion = '0.1.5';
export const releaseUrl = `${repositoryUrl}/releases/tag/v${releaseVersion}`;
export const downloadSize = '9.9 MB';

/** The portable build: extract the folder and run simPl.exe. Set to null to hide it. */
export const portableDownloadUrl: string | null =
  `${repositoryUrl}/releases/download/v${releaseVersion}/simPl-${releaseVersion}-windows-x64-portable.zip`;
export const portableSize = '12.4 MB';
export const sourceLicenseUrl = `${repositoryUrl}/blob/main/LICENSE.md`;
export const releaseLicenseUrl = `${repositoryUrl}/blob/main/LICENSE-BINARY.txt`;

function isSafeDownloadURL(url: string): boolean {
  // A site-relative path is served from this origin and is safe to link.
  if (url.startsWith('/') && !url.startsWith('//')) {
    return true;
  }
  try {
    return new URL(url).protocol === 'https:';
  } catch {
    return false;
  }
}

for (const url of [windowsDownloadUrl, portableDownloadUrl]) {
  if (url && !isSafeDownloadURL(url)) {
    throw new Error(
      'Download URLs must be absolute HTTPS URLs or site-relative paths beginning with a single "/".',
    );
  }
}
