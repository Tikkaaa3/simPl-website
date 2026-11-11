import { latestWindowsRelease } from './releases';

export const repositoryUrl = 'https://github.com/Tikkaaa3/simPl-reader';

/**
 * The Windows release is read from GitHub when the site builds (see
 * `releases.ts`). These pinned values are the fallback for a build that can't
 * reach GitHub; update them when you want the fallback to move.
 */
const pinned = {
  version: '0.1.7',
  installerBytes: 10_080_936,
  installerSha256: '78ef294c7cfdfeff66dc22f671e842489e7937c9fc6ad2951cd59f5d8247fabe',
  portableBytes: 12_698_834,
};

const megabytes = (bytes: number) => `${(bytes / 1_000_000).toFixed(1)} MB`;
const liveVersion = latestWindowsRelease?.tag.slice(1);
const installer = latestWindowsRelease?.assets.find((asset) => asset.name === `simPl-${liveVersion}-windows-x64-setup.exe`);
const portable = latestWindowsRelease?.assets.find((asset) => asset.name === `simPl-${liveVersion}-windows-x64-portable.zip`);
// A release without its installer is still being published: stay on the pinned one.
const live = installer ? liveVersion : undefined;

export const releaseVersion = live ?? pinned.version;
/**
 * The release the "New in" section was written for. Set by hand on purpose:
 * the download follows the newest release by itself, and that copy must not
 * claim to describe a release it was not written for.
 */
export const featuredVersion = '0.1.7';
export const releaseUrl = `${repositoryUrl}/releases/tag/v${releaseVersion}`;

/**
 * The Windows installer. Set to null to show the unavailable state. A
 * site-relative path such as `/simPl-setup.exe` (a file in `public/`) also works.
 */
export const windowsDownloadUrl: string | null =
  `${repositoryUrl}/releases/download/v${releaseVersion}/simPl-${releaseVersion}-windows-x64-setup.exe`;
export const downloadSize = megabytes(live && installer ? installer.bytes : pinned.installerBytes);
/** Shown so a download can be checked against the release. */
export const installerSha256: string | null = live ? (installer?.sha256 ?? null) : pinned.installerSha256;

/** The portable build: extract the folder and run simPl.exe. Set to null to hide it. */
export const portableDownloadUrl: string | null =
  !live || portable
    ? `${repositoryUrl}/releases/download/v${releaseVersion}/simPl-${releaseVersion}-windows-x64-portable.zip`
    : null;
export const portableSize = megabytes(live && portable ? portable.bytes : pinned.portableBytes);

/** Android ships on its own release track. Set the URL to null to hide it. */
export const androidVersion = '0.1.2';
export const androidReleaseUrl = `${repositoryUrl}/releases/tag/android-v${androidVersion}`;
export const androidDownloadUrl: string | null =
  `${repositoryUrl}/releases/download/android-v${androidVersion}/simPl-${androidVersion}-android-arm64.apk`;
export const androidDownloadSize = '28.7 MB';
/** The universal APK also contains x86_64. Set to null to hide it. */
export const androidUniversalUrl: string | null =
  `${repositoryUrl}/releases/download/android-v${androidVersion}/simPl-${androidVersion}-android-universal.apk`;
export const androidUniversalSize = '51.5 MB';
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

for (const url of [windowsDownloadUrl, portableDownloadUrl, androidDownloadUrl, androidUniversalUrl]) {
  if (url && !isSafeDownloadURL(url)) {
    throw new Error(
      'Download URLs must be absolute HTTPS URLs or site-relative paths beginning with a single "/".',
    );
  }
}
