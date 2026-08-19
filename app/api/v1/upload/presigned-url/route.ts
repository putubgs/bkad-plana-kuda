import { NextRequest, NextResponse } from "next/server"
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "@/lib/s3"

export async function POST(request: NextRequest){
    try{
        const body = await request.json();
    
        const { fileName, fileType } = body;

        if(!fileName || !fileType ){
            return NextResponse.json(
                {
                    error: "fileName and fileType are required",
                },
                {
                    status: 400
                }
            )
        }

        const documentId = crypto.randomUUID();

        const key = `plana-kuda/${crypto.randomUUID()}-${fileName}`;

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET!,
            Key: key,
            ContentType: fileType
        })

        const uploadUrl = await getSignedUrl(
            s3Client,
            command,
            {
                expiresIn: 60
            }
        );

        return NextResponse.json({
            documentId,
            uploadUrl,
            key
        })
    } catch (error){
        console.error(error);

        return NextResponse.json(
            {
                error: "Failed to generate upload URL",
            },
            {
                status: 500
            }
        )
    }
}