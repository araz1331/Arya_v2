"use server";

import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  type PutObjectCommandInput,
  type GetObjectCommandInput,
  type DeleteObjectCommandInput,
} from "@aws-sdk/client-s3";

const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
const AWS_REGION = process.env.AWS_REGION ?? "us-east-1";
const AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;

let s3Client: S3Client | null = null;

/**
 * Singleton AWS S3 client for HireArya platform.
 * Used for file uploads, agent assets, and media storage.
 */
function getS3Client(): S3Client {
  if (!s3Client) {
    if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new Error("AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be configured");
    }
    s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }
  return s3Client;
}

export interface UploadToS3Options {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export async function uploadToS3(options: UploadToS3Options): Promise<string> {
  if (!AWS_S3_BUCKET) {
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const client = getS3Client();
  const input: PutObjectCommandInput = {
    Bucket: AWS_S3_BUCKET,
    Key: options.key,
    Body: options.body,
    ContentType: options.contentType,
    Metadata: options.metadata,
  };

  await client.send(new PutObjectCommand(input));
  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${options.key}`;
}

export async function getFromS3(key: string): Promise<Buffer> {
  if (!AWS_S3_BUCKET) {
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const client = getS3Client();
  const input: GetObjectCommandInput = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
  };

  const response = await client.send(new GetObjectCommand(input));
  const stream = response.Body;
  if (!stream) {
    throw new Error(`No body returned for key: ${key}`);
  }

  const chunks: Uint8Array[] = [];
  for await (const chunk of stream as AsyncIterable<Uint8Array>) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export async function deleteFromS3(key: string): Promise<void> {
  if (!AWS_S3_BUCKET) {
    throw new Error("AWS_S3_BUCKET is not configured");
  }

  const client = getS3Client();
  const input: DeleteObjectCommandInput = {
    Bucket: AWS_S3_BUCKET,
    Key: key,
  };

  await client.send(new DeleteObjectCommand(input));
}
