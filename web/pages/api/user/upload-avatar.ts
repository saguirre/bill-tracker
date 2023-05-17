import S3 from 'aws-sdk/clients/s3';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const s3 = new S3({
    region: process.env.REGION,
    apiVersion: '2006-03-01',
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  });

  const post = await s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: `avatars/${req.query.file}`,
      'Content-Type': req.query.fileType,
      ACL: "public-read",
    },
    
    Expires: 60, // seconds
    Conditions: [
      ['content-length-range', 0, 10485760], // up to 10 MB
    ],
  });

  res.status(200).json(post);
}
