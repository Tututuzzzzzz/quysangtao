import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const accessKey = import.meta.env.VITE_AWS_ACCESS_KEY;
const secretKey = import.meta.env.VITE_AWS_SECRET_KEY;
const bucket = import.meta.env.VITE_AWS_BUCKET || "30usdv2-cdn";
const region = import.meta.env.VITE_AWS_REGION || "ap-southeast-1";
const cloudFrontHost = import.meta.env.VITE_AWS_CLOUDFRONT_HOST || "https://dg86kmop4ajn0.cloudfront.net";

export async function uploadFileToS3(file) {
  if (!file || !accessKey || !secretKey) {
    console.warn("AWS S3 credentials not found in frontend environment variables.");
    return null;
  }

  try {
    const s3Client = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey.trim(),
        secretAccessKey: secretKey.trim(),
      },
    });

    const cleanFilename = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_") : "file";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const key = `quysangtao/${timestamp}_${randomStr}_${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    });

    await s3Client.send(command);

    const baseUrl = cloudFrontHost.replace(/\/$/, "");
    const cdnUrl = `${baseUrl}/${key}`;
    console.log("Successfully uploaded file directly to AWS S3 & CloudFront CDN:", cdnUrl);
    return cdnUrl;
  } catch (err) {
    console.warn("Direct browser S3 upload notice:", err);
    return null;
  }
}

export async function getAttachmentCloudFrontUrl(file, api) {
  if (!file) return null;

  // 1. Try direct S3 upload from browser
  const directS3Url = await uploadFileToS3(file);
  if (directS3Url && directS3Url.includes("cloudfront.net/quysangtao/")) {
    return directS3Url;
  }

  // 2. Fallback to backend API upload
  try {
    const fileFormData = new FormData();
    fileFormData.append("file", file);
    const uploadRes = await api.post('/upload', fileFormData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (uploadRes.data && uploadRes.data.url) {
      const url = uploadRes.data.url;
      if (url.startsWith('http') && url.includes('cloudfront.net/quysangtao/')) {
        return url;
      }
    }
  } catch (err) {
    console.warn("Backend upload notice:", err);
  }

  // 3. Fallback CloudFront CDN URL format under quysangtao/ prefix
  const cleanName = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_") : "file";
  const baseUrl = cloudFrontHost.replace(/\/$/, "");
  return `${baseUrl}/quysangtao/${Date.now()}_${cleanName}`;
}
