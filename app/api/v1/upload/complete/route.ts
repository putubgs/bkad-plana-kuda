import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
        documentId,
        fileName,
        fileType,
        fileSize,
        key
    } = body;

    if (
        !documentId ||
        !fileName ||
        !fileType ||
        !fileSize ||
        !key
    ) {
        return Response.json(
            {
                error: "Missing required fields",
            },
            {
                status: 400
            }
        )
    }

    const document = await prisma.temporaryDocument.create({
        data: {
            documentId: documentId,
            fileName: fileName,
            objectKey: key,
            mimeType: fileType,
            fileSize: fileSize,
        }
    });

    return Response.json({
        success: true,
        document
    })


  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to save document",
      },
      {
        status: 500,
      },
    );
  }
}
