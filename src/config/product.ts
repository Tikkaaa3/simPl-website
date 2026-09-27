/**
 * Set this to the Windows installer location when it is available:
 * an absolute HTTPS URL, or a site-relative path such as
 * `/simPl-setup.exe` for a file placed in `public/`.
 */
export const windowsDownloadUrl: string | null =
  'https://github.com/Tikkaaa3/simPl-reader/releases/download/v0.1.0/simPl-0.1.0-windows-x64-setup.exe';

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

if (windowsDownloadUrl && !isSafeDownloadURL(windowsDownloadUrl)) {
  throw new Error(
    'The Windows download URL must be an absolute HTTPS URL or a site-relative path beginning with a single "/".',
  );
}
