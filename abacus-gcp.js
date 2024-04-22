import cors from "cors";
import express from "express";
import { Storage } from "@google-cloud/storage";

const app = express();
const storage = new Storage({ keyFilename: "abacus-gcp.json" });
const bucketName = "teachertrainingvidbucket";
const port = 3000;

app.use(cors());

app.get("/topic", async (req, res) => {
  try {
    const fileName = req.query.fileName;
    if (!fileName) {
      return res.status(400).send("File name is required");
    }

    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(fileName)
      .getSignedUrl(options);

    res.send({ url });
  } catch (error) {
    console.error("Error generating signed URL:", error);
    res.status(500).send("Failed to generate signed URL");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
