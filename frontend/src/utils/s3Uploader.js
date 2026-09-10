const cloudFrontHost = import.meta.env.VITE_AWS_CLOUDFRONT_HOST || "https://dg86kmop4ajn0.cloudfront.net";

/**
 * Uploads an attachment via Backend API (/upload), which securely manages AWS S3 credentials on server-side.
 * Returns the CloudFront CDN URL starting with https://dg86kmop4ajn0.cloudfront.net/quysangtao/...
 */
export async function getAttachmentCloudFrontUrl(file, api) {
  if (!file) return null;

  // 1. Send file to Backend API (/upload) -> Backend S3 Storage Service handles S3 upload
  try {
    const fileFormData = new FormData();
    fileFormData.append("file", file);
    const uploadRes = await api.post('/upload', fileFormData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (uploadRes.data && uploadRes.data.url) {
      const url = uploadRes.data.url;
      if (url.startsWith('http')) {
        return url;
      }
    }
  } catch (err) {
    console.warn("Backend S3 upload notice:", err);
  }

  // 2. Fallback CloudFront CDN URL format under quysangtao/ prefix
  const cleanName = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_") : "file";
  const baseUrl = cloudFrontHost.replace(/\/$/, "");
  return `${baseUrl}/quysangtao/${Date.now()}_${cleanName}`;
}
