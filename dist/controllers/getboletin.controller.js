"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoletinById = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const http_status_codes_1 = require("../types/http-status-codes");
const db_connect_1 = require("../utils/db-connect");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const s3 = new client_s3_1.S3Client({ region: process.env.AWS_REGION });
const getBoletinById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { boletinID } = req.params;
    const { email } = req.query;
    console.log('Boletin ID: ', boletinID);
    console.log('Email: ', email);
    if (!email) {
        res.status(http_status_codes_1.HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Missing email query parameter' });
        return;
    }
    try {
        const connection = yield (0, db_connect_1.getConnection)();
        const [rows] = yield connection.execute('SELECT * FROM boletines WHERE id = ? AND email = ?', [boletinID, email]);
        const boletin = rows;
        if (boletin.length === 0) {
            res.status(http_status_codes_1.HTTP_STATUS_CODES.NOT_FOUND).json({ error: 'Boletin not found' });
            return;
        }
        // IMAGE DOWNLOAD
        const s3Url = new URL(boletin[0].s3link);
        const key = decodeURIComponent(s3Url.pathname.slice(1));
        const command = new client_s3_1.GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
        });
        const signedUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 3600 });
        res.json({
            image: signedUrl,
            file_link: boletin[0].s3link,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error retrieving boletin' });
    }
});
exports.getBoletinById = getBoletinById;
