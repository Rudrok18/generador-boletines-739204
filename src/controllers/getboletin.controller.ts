import { Request, Response } from 'express';

import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { HTTP_STATUS_CODES } from '../types/http-status-codes';

import { getConnection } from '../utils/db-connect';

import dotenv from 'dotenv';

dotenv.config();

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const getBoletinById = async (req: Request, res: Response): Promise<void> => {
    const { boletinID } = req.params;
    const { email } = req.query;

    console.log('Boletin ID: ', boletinID);
    console.log('Email: ', email);

    if (!email) {
        res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Missing email query parameter' });
        return;
    }

    try {
        const connection = await getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM boletines WHERE id = ? AND email = ?',
            [boletinID, email]
        );

        const boletin = rows as Array<{id: string, content: string, email: string, s3link: string, leido: boolean}>

        if (boletin.length === 0) {
            res.status(HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Boletin not found' });
            return;
        }

        // IMAGE DOWNLOAD
        
        const s3Url = new URL(boletin[0].s3link);
        const key = decodeURIComponent(s3Url.pathname.slice(1));

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        
        res.json({
            image: signedUrl,
            file_link: boletin[0].s3link,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving boletin'});
    }
};