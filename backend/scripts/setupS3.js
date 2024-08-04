import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  sessionToken: process.env.AWS_SESSION_TOKEN,
  region: process.env.AWS_DEFAULT_REGION || "us-east-1",
});

const s3 = new AWS.S3();

// Use lowercase for bucket name and replace underscores with hyphens
const bucketName = "muzika-s2110857";

const bucketParams = {
  Bucket: bucketName,
};

async function createBucket() {
  try {
    await s3.createBucket(bucketParams).promise();
    console.log(`Bucket "${bucketName}" created successfully!`);
  } catch (error) {
    if (error.code === "BucketAlreadyOwnedByYou") {
      console.log(`Bucket "${bucketName}" already exists and is owned by you.`);
    } else {
      console.error("Error creating bucket:", error);
      throw error; // Rethrow the error to stop execution
    }
  }
}

async function createFolders() {
  const folders = ["hero-images/", "event-images/", "artist-images/"];
  for (const folder of folders) {
    const params = {
      Bucket: bucketName,
      Key: folder,
      Body: "",
    };
    try {
      await s3.putObject(params).promise();
      console.log(`Folder "${folder}" created successfully!`);
    } catch (error) {
      console.error(`Error creating folder "${folder}":`, error);
      throw error; // Rethrow the error to stop execution
    }
  }
}

async function setupS3() {
  try {
    await createBucket();
    await createFolders();
    console.log("S3 setup completed successfully!");
  } catch (error) {
    console.error("S3 setup failed:", error);
  }
}

setupS3();
