"use client";

import { useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

export default function FileUploadTest() {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [documentId, setDocumentId] = useState<string | null>(null);
    const [fileUrl, setFileUrl] = useState<string | null>(null);

    const handleSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();

        if (!file) {
            alert("Please select a file");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            alert("File must be smaller than 10 MB");
            return;
        }

        try {
            setUploading(true);
            setFileUrl(null);

            // ==========================================
            // 1. Get presigned URL
            // ==========================================

            const response = await fetch(
                "/api/v1/upload/presigned-url",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                    }),
                }
            );

            if (!response.ok) {
                const error = await response.json();

                throw new Error(
                    error.error ||
                        "Failed to generate upload URL"
                );
            }

            const {
                uploadUrl,
                key,
                documentId,
            } = await response.json();

            console.log(
                "Presigned URL:",
                uploadUrl
            );

            console.log("S3 key:", key);
            console.log("Document ID:", documentId);

            setDocumentId(documentId);

            // ==========================================
            // 2. Upload file directly to S3
            // ==========================================

            const uploadResponse = await fetch(
                uploadUrl,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                }
            );

            if (!uploadResponse.ok) {
                throw new Error(
                    "Failed to upload file to S3"
                );
            }

            console.log(
                "File successfully uploaded to S3"
            );

            // ==========================================
            // 3. Save document metadata
            // ==========================================

            const completeResponse = await fetch(
                "/api/v1/upload/complete",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        documentId,
                        fileName: file.name,
                        fileType: file.type,
                        fileSize: file.size,
                        key,
                    }),
                }
            );

            if (!completeResponse.ok) {
                const error =
                    await completeResponse.json();

                throw new Error(
                    error.error ||
                        "Failed to save document"
                );
            }

            const completeData =
                await completeResponse.json();

            console.log(
                "Document saved:",
                completeData
            );

            alert("File uploaded successfully!");

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Upload failed"
            );
        } finally {
            setUploading(false);
        }
    };

    // ==========================================
    // Get the uploaded image later
    // ==========================================

    const handleGetFile = async () => {
        if (!documentId) {
            alert("No document uploaded yet");
            return;
        }

        try {
            const response = await fetch(
                `/api/v1/documents/${documentId}`
            );

            if (!response.ok) {
                const error =
                    await response.json();

                throw new Error(
                    error.error ||
                        "Failed to get document"
                );
            }

            const data = await response.json();

            console.log(
                "Document:",
                data
            );

            console.log(
                "Download URL:",
                data.url
            );

            setFileUrl(data.url);

        } catch (error) {
            console.error(error);

            alert(
                error instanceof Error
                    ? error.message
                    : "Failed to get file"
            );
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Upload */}

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label
                        htmlFor="file"
                        className="block mb-2 font-medium"
                    >
                        Upload File
                    </label>

                    <input
                        id="file"
                        name="file"
                        type="file"
                        onChange={(e) => {
                            const selectedFile =
                                e.target.files?.[0];

                            if (selectedFile) {
                                setFile(
                                    selectedFile
                                );
                            }
                        }}
                    />
                </div>

                {file && (
                    <div className="border p-3 rounded">
                        <p>
                            <strong>
                                Name:
                            </strong>{" "}
                            {file.name}
                        </p>

                        <p>
                            <strong>
                                Type:
                            </strong>{" "}
                            {file.type}
                        </p>

                        <p>
                            <strong>
                                Size:
                            </strong>{" "}
                            {(
                                file.size /
                                1024 /
                                1024
                            ).toFixed(2)}{" "}
                            MB
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={uploading}
                    className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
                >
                    {uploading
                        ? "Uploading..."
                        : "Upload"}
                </button>
            </form>

            {/* Document information */}

            {documentId && (
                <div className="border p-4 rounded space-y-3">
                    <p>
                        <strong>
                            Document ID:
                        </strong>{" "}
                        {documentId}
                    </p>

                    <button
                        type="button"
                        onClick={handleGetFile}
                        className="px-4 py-2 border rounded"
                    >
                        Get File
                    </button>
                </div>
            )}

            {/* Preview */}

            {fileUrl && (
                <div className="border p-4 rounded">
                    <p className="font-medium mb-3">
                        File Preview
                    </p>

                    {file?.type.startsWith(
                        "image/"
                    ) ? (
                        <img
                            src={fileUrl}
                            alt={
                                file?.name ||
                                "Uploaded file"
                            }
                            className="max-w-md rounded"
                        />
                    ) : (
                        <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline"
                        >
                            Open File
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}