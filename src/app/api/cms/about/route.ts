import { NextRequest, NextResponse } from 'next/server';
import Model from '@/models/About';
import connectToDatabase from '@/lib/mongodb';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'cms'); // Directory to save uploads

// Handle PATCH requests: Update an existing entry
export async function PATCH(request: NextRequest) {
    try {
        await connectToDatabase();
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        const formData = await request.formData();

        // Extract fields from formData
        const banner_title = (formData.get('banner_title') as string) ?? '';
        const sec_one_title = (formData.get('sec_one_title') as string) ?? '';
        const sec_one_desc = (formData.get('sec_one_desc') as string) ?? '';
        const sec_two_title = (formData.get('sec_two_title') as string) ?? '';
        const sec_two_desc = (formData.get('sec_two_desc') as string) ?? '';
        const feature_one = (formData.get('feature_one') as string) ?? '';
        const feature_two = (formData.get('feature_two') as string) ?? '';
        const feature_three = (formData.get('feature_three') as string) ?? '';
        const feature_four = (formData.get('feature_four') as string) ?? '';
        const feature_one_desc = (formData.get('feature_one_desc') as string) ?? '';
        const feature_two_desc = (formData.get('feature_two_desc') as string) ?? '';
        const feature_three_desc = (formData.get('feature_three_desc') as string) ?? '';
        const feature_four_desc = (formData.get('feature_four_desc') as string) ?? '';

        // Initialize Fields with text data
        let Fields: Record<string, string> = {
            banner_title,
            sec_one_title,
            sec_one_desc,
            sec_two_title,
            sec_two_desc,
            feature_one,
            feature_two,
            feature_three,
            feature_four,
            feature_one_desc,
            feature_two_desc,
            feature_three_desc,
            feature_four_desc,
        };

        // Process image fields
        const imageFields = [
            { key: 'sec_one_img', pathKey: 'sec_one_img' },
            { key: 'sec_two_img', pathKey: 'sec_two_img' },
            { key: 'feature_one_img', pathKey: 'feature_one_img' },
            { key: 'feature_two_img', pathKey: 'feature_two_img' },
            { key: 'feature_three_img', pathKey: 'feature_three_img' },
            { key: 'feature_four_img', pathKey: 'feature_four_img' },
            { key: 'banner_img', pathKey: 'banner_img' },

        ];

        for (const field of imageFields) {
            const file = formData.get(field.key);
        
            if (typeof file === 'string') {
                // If the file is a string, return it directly
                Fields[field.pathKey] = file;
            } else if (file instanceof File) {
                // Handle the file upload
                const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
                const fileExtension = path.extname(file.name);
                const uniqueFileName = `${uniqueSuffix}${fileExtension}`;
                const filePath = path.join(UPLOAD_DIR, uniqueFileName);
        
                const fileBuffer = Buffer.from(await file.arrayBuffer());
                await fs.writeFile(filePath, fileBuffer);
                Fields[field.pathKey] = `/uploads/cms/${uniqueFileName}`;
            }
        }
        

        // Check if a record exists
        const existingRecord = await Model.findOne({});

        if (existingRecord) {
            // Update the existing record
            await Model.findOneAndUpdate({}, Fields, { new: true });
        } else {
            // Create a new record
            await Model.create(Fields);
        }

        return NextResponse.json({ message: 'Record updated successfully.' });
    } catch (error) {
        console.error('Error updating record:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}


// Handle GET requests: Fetch an entry by ID
export async function GET() {
    try {

        await connectToDatabase();

        const record = await Model.findOne({});

        if (!record) {
            return NextResponse.json({ message: 'Record not found.' }, { status: 404 });
        }

        return NextResponse.json({ data: record });
    } catch (error) {
        console.error('Error fetching record:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

