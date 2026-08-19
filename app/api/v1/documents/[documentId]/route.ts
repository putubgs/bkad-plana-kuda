import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { prisma } from "@/lib/db/prisma";
import { s3Client } from "@/lib/s3";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ documentId: string }> }
) {
    try {
        const { documentId } = await params;

        const document = await prisma.temporaryDocument.findUnique({
            where: {
                documentId: documentId,
            },
        });

        if (!document) {
            return Response.json(
                {
                    error: "Document not found",
                },
                { status: 404 }
            );
        }

        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: document.objectKey,
        });

        const downloadUrl = await getSignedUrl(
            s3Client,
            command,
            {
                expiresIn: 300, // 5 minutes
            }
        );

        return Response.json({
            documentId: document.documentId,
            fileName: document.fileName,
            mimeType: document.mimeType,
            url: downloadUrl,
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            {
                error: "Failed to generate download URL",
            },
            { status: 500 }
        );
    }
}