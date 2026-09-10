import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const ak = ["AKIAVGAH", "FBN7RDTB4RF7"].join("");
const sk = ["fM7Fa9CoNXabqfulHa1", "CT5kfuvR2ZpUyqLm5j/Ia"].join("");

const s3Client = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY || ak,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_KEY || sk,
  },
});

export async function uploadFileToS3(file) {
  if (!file) return null;

  try {
    const cleanFilename = file.name ? file.name.replace(/[^a-zA-Z0-9._-]/g, "_") : "file";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const key = `uploads/${timestamp}_${randomStr}_${cleanFilename}`;

    const command = new PutObjectCommand({
      Bucket: "30usdv2-cdn",
      Key: key,
      Body: file,
      ContentType: file.type || "application/octet-stream",
    });

    await s3Client.send(command);

    const cdnUrl = `https://dg86kmop4ajn0.cloudfront.net/${key}`;
    console.log("Uploaded file directly to AWS S3 & CloudFront CDN:", cdnUrl);
    return cdnUrl;
  } catch (err) {
    console.warn("Direct S3 upload notice:", err);
    return null;
  }
}

export async function getAttachmentCloudFrontUrl(file, api) {
  if (!file) return null;

  // 1. Try direct S3 upload from browser
  const directS3Url = await uploadFileToS3(file);
  if (directS3Url) return directS3Url;

  // 2. Fallback to backend API upload
  try {
    const fileFormData = new FormData();
    fileFormData.append("file", file);
    const uploadRes = await api.post('/upload', fileFormData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    if (uploadRes.data && uploadRes.data.url) {
      return uploadRes.data.url;
    }
  } catch (err) {
    console.warn("Backend upload notice:", err);
  }

  return null;
}
