/**
 * Reads the reader's published GitHub releases once per build, so the Windows
 * download and the changelog follow the newest release without an edit here.
 * A failed or skipped request returns an empty list and the pinned values in
 * `product.ts` are used instead.
 */
const releasesApi = 'https://api.github.com/repos/Tikkaaa3/simPl-reader/releases?per_page=100';

export type ReleaseAsset = { name: string; url: string; bytes: number; sha256: string | null };
export type Release = {
  tag: string;
  name: string;
  url: string;
  publishedAt: string;
  body: string;
  assets: ReleaseAsset[];
};

type ApiAsset = { name: string; browser_download_url: string; size: number; digest?: string | null };
type ApiRelease = {
  tag_name: string;
  name: string | null;
  html_url: string;
  published_at: string | null;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: ApiAsset[];
};

const env: Record<string, string | undefined> =
  (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env ?? {};

async function fetchReleases(): Promise<Release[]> {
  // SIMPL_PINNED_RELEASE=1 builds from the pinned values, without the network.
  if (env.SIMPL_PINNED_RELEASE) return [];
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'simpl-website-build',
    };
    if (env.GITHUB_TOKEN) headers.Authorization = `Bearer ${env.GITHUB_TOKEN}`;
    const response = await fetch(releasesApi, { headers, signal: AbortSignal.timeout(10_000) });
    if (!response.ok) throw new Error(`GitHub answered ${response.status}`);
    const list = (await response.json()) as ApiRelease[];
    return list
      .filter((release) => !release.draft && !release.prerelease && release.published_at)
      .map((release) => ({
        tag: release.tag_name,
        name: release.name || release.tag_name,
        url: release.html_url,
        publishedAt: release.published_at as string,
        body: release.body ?? '',
        assets: release.assets.map((asset) => ({
          name: asset.name,
          url: asset.browser_download_url,
          bytes: asset.size,
          sha256: asset.digest?.startsWith('sha256:') ? asset.digest.slice(7) : null,
        })),
      }))
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  } catch (error) {
    console.warn(`[releases] Using the pinned release: ${error instanceof Error ? error.message : error}`);
    return [];
  }
}

export const releases: Release[] = await fetchReleases();

/** Windows releases are tagged `v1.2.3`; Android ones are `android-v1.2.3`. */
export const latestWindowsRelease: Release | undefined = releases.find((release) =>
  /^v\d+\.\d+\.\d+$/.test(release.tag),
);
