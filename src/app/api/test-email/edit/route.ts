import { NextRequest, NextResponse } from 'next/server';
import Home_page_slider from '@/models/Home_page_slider'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'cms'); // Save in the public directory


export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await connectToDatabase();

        // Ensure the uploads directory exists
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        const formData = await request.formData();

        const title = (formData.get('title') as string) ?? '';
        const id = (formData.get('_id') as string) ?? '';
        const description = (formData.get('description') as string) ?? '';
        const photo = formData.get('photo') as File;
        let Fields = {};

        if (photo) {
            const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
            const fileExtension = path.extname(photo.name);
            const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

            const filePath = path.join(UPLOAD_DIR, uniqueFileName);
            console.log('File Path:', filePath);

            const fileBuffer = Buffer.from(await photo.arrayBuffer());
            await fs.writeFile(filePath, fileBuffer);

            const image = `/uploads/cms/${uniqueFileName}`;

            // Prepare the fields to be inserted into the database
            Fields = { title, description, image };
        } else {
            // Prepare the fields to be inserted into the database
            Fields = { title, description };
        }

        // Create the new record with the fields
        await Home_page_slider.findByIdAndUpdate(id, Fields, { new: true });

        // Return success response
        return NextResponse.json({ message: 'data have been successfully updated.' });

    } catch (error) {
        console.error('Error updating data:', error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}


