import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: { file: string } }) {

    // Check if 'file' param is available
    if (!params || !params.file) {
        return NextResponse.json({ error: 'File parameter is missing' }, { status: 400 });
    }

    const file = params.file;
    const filePath = path.join(process.cwd(), 'uploads', 'photos', file);

    try {
        // Check if file exists asynchronously
        await fs.promises.access(filePath, fs.constants.F_OK);
    } catch (err) {
        // File doesn't exist
        return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Determine the content type
    const ext = path.extname(file).toLowerCase();
    const contentType =
        ext === '.jpg' || ext === '.jpeg'
            ? 'image/jpeg'
            : ext === '.png'
                ? 'image/png'
                : ext === '.gif'
                    ? 'image/gif'
                    : ext === '.webp'
                        ? 'image/webp'
                        : ext === '.svg'
                            ? 'image/svg+xml'
                            : ext === '.pdf'
                                ? 'application/pdf'
                                : 'application/octet-stream';

    // Read the file asynchronously
    const fileBuffer = await fs.promises.readFile(filePath);

    return new NextResponse(fileBuffer, {
        headers: {
            'Content-Type': contentType,
            'Content-Length': fileBuffer.length.toString(),
            'Cache-Control': 'public, max-age=31536000, immutable',
        },
    });
}
