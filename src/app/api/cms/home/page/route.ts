import { NextRequest, NextResponse } from 'next/server';
import Home from '@/models/Home_page';
import connectToDatabase from '@/lib/mongodb';
import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'cms'); // Directory to save uploads

// Handle PATCH requests: Update an existing entry
export async function PATCH(request: NextRequest) {
    try {
        await connectToDatabase();
        await fs.mkdir(UPLOAD_DIR, { recursive: true });

        const formData = await request.formData();

        // Extract fields from formData
        const sec_one_title = (formData.get('sec_one_title') as string) ?? '';
        const sec_one_desc = (formData.get('sec_one_desc') as string) ?? '';
        const sec_two_title = (formData.get('sec_two_title') as string) ?? '';
        const sec_two_desc = (formData.get('sec_two_desc') as string) ?? '';
        const feature_one = (formData.get('feature_one') as string) ?? '';
        const feature_two = (formData.get('feature_two') as string) ?? '';
        const feature_three = (formData.get('feature_three') as string) ?? '';
        const feature_four = (formData.get('feature_four') as string) ?? '';
        const banner_title = (formData.get('banner_title') as string) ?? '';
        const banner_btn_text = (formData.get('banner_btn_text') as string) ?? '';
        const banner_btn_link = (formData.get('banner_btn_link') as string) ?? '';

        const sec_one_title_ta = (formData.get('sec_one_title_ta') as string) ?? '';
        const sec_one_desc_ta = (formData.get('sec_one_desc_ta') as string) ?? '';
        const sec_two_title_ta = (formData.get('sec_two_title_ta') as string) ?? '';
        const sec_two_desc_ta = (formData.get('sec_two_desc_ta') as string) ?? '';
        const feature_one_ta = (formData.get('feature_one_ta') as string) ?? '';
        const feature_two_ta = (formData.get('feature_two_ta') as string) ?? '';
        const feature_three_ta = (formData.get('feature_three_ta') as string) ?? '';
        const feature_four_ta = (formData.get('feature_four_ta') as string) ?? '';
        const banner_title_ta = (formData.get('banner_title_ta') as string) ?? '';
        const banner_btn_text_ta = (formData.get('banner_btn_text_ta') as string) ?? '';


        // Initialize Fields with text data
        let Fields: Record<string, string> = {
            sec_one_title,
            sec_one_desc,
            sec_two_title,
            sec_two_desc,
            feature_one,
            feature_two,
            feature_three,
            feature_four,
            banner_title,
            banner_btn_text,
            banner_btn_link,
            sec_one_title_ta,
            sec_one_desc_ta,
            sec_two_title_ta,
            sec_two_desc_ta,
            feature_one_ta,
            feature_two_ta,
            feature_three_ta,
            feature_four_ta,
            banner_title_ta,
            banner_btn_text_ta,
        };

        // Process image fields
        const imageFields = [
            { key: 'sec_one_img', pathKey: 'sec_one_img' },
            { key: 'sec_two_img', pathKey: 'sec_two_img' },
            { key: 'feature_one_img', pathKey: 'feature_one_img' },
            { key: 'feature_two_img', pathKey: 'feature_two_img' },
            { key: 'feature_three_img', pathKey: 'feature_three_img' },
            { key: 'feature_four_img', pathKey: 'feature_four_img' },
        ];

        for (const field of imageFields) {

            const file = formData.get(field.key) as File;

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
        const existingRecord = await Home.findOne({});

        if (existingRecord) {
            // Update the existing record
            const filteredFields = Object.fromEntries(
                Object.entries(Fields).filter(([_, value]) => value.trim() !== '')
            );
            await Home.findOneAndUpdate(existingRecord._id, filteredFields, { new: true });
        } else {
            // Create a new record
            await Home.create(Fields);
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

        const record = await Home.findOne({});

        if (!record) {
            return NextResponse.json({ message: 'Record not found.' }, { status: 404 });
        }

        return NextResponse.json({ data: record });
    } catch (error) {
        console.error('Error fetching record:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}

