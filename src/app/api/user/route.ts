import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
import path from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { sendEmail } from "@/utils/mail.util"
import { verificationTemplate } from '@/lib/template/verification';
import { welcomeTemplate } from '@/lib/template/welcome';
import { adminWelcomeTemplate } from '@/lib/template/welcome-admin';
import getSMTPSettings from '@/utils/settings.util';


type UploadedFile = {
    name: string;
    arrayBuffer: () => Promise<ArrayBuffer>;
};

const UPLOAD_PIC_DIR = path.join(process.cwd(), 'public', 'uploads', 'photos'); // Save in the public directory
const UPLOAD_HORO_DIR = path.join(process.cwd(), 'public', 'uploads', 'horoscope'); // Save in the public directory

const uploadFile = async (file: UploadedFile | undefined, uploadDir: string): Promise<string | null> => {

    // If the input is a string (file path), return it as is
    if (typeof file === "string") {
        return file;
    }

    // If no file is provided, return null
    if (!file) {
        return null;
    }

    // Generate a unique filename
    const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}`;
    const fileExtension = path.extname(file.name);
    const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

    // Construct the file path
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save the file to the server
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    // Return the relative file path
    return `/uploads/${path.basename(uploadDir)}/${uniqueFileName}`;
};


export async function POST(request: NextRequest) {

    // Ensure the uploads directory exists
    await fs.mkdir(UPLOAD_PIC_DIR, { recursive: true });
    await fs.mkdir(UPLOAD_HORO_DIR, { recursive: true });

    const formData = await request.formData();


    let copyright = '';
    const smtpSettings = await getSMTPSettings();
    if (smtpSettings) {
        copyright = `© ${new Date().getFullYear()} ${smtpSettings.copyright}`;
    }

    // Extract all fields from formData
    const id = (formData.get('_id') as string) ?? '';
    const name = (formData.get('name') as string) ?? '';
    const lastname = (formData.get('lastname') as string) ?? '';
    const email = (formData.get('email') as string) ?? '';
    const phonenumber = (formData.get('phonenumber') as string) ?? '';
    const password = (formData.get('password') as string) ?? '';
    const religion = (formData.get('religion') as string) ?? '';
    const caste = (formData.get('caste') as string) ?? '';
    const subcaste = (formData.get('subcaste') as string) ?? '';
    const birthdate = (formData.get('birthdate') as string) ?? '';
    const age = (formData.get('age') as string) ?? '';
    const place_of_birth = (formData.get('place_of_birth') as string) ?? '';
    const state_id = (formData.get('state_id') as string) ?? '';
    const city_id = (formData.get('city_id') as string) ?? '';
    const education = (formData.get('education') as string) ?? '';
    const complexion = (formData.get('complexion') as string) ?? '';
    const profession = (formData.get('profession') as string) ?? '';
    const income = (formData.get('income') as string) ?? '';
    const job = (formData.get('job') as string) ?? '';
    const place_of_work = (formData.get('place_of_work') as string) ?? '';
    const kuladeivam = (formData.get('kuladeivam') as string) ?? '';
    const place_of_kuladeivam_temple = (formData.get('place_of_kuladeivam_temple') as string) ?? '';
    const gothram = (formData.get('gothram') as string) ?? '';
    const father_name = (formData.get('father_name') as string) ?? '';
    const father_occupation = (formData.get('father_occupation') as string) ?? '';
    const father_phonenumber = (formData.get('father_phonenumber') as string) ?? '';
    const father_religion = (formData.get('father_religion') as string) ?? '';
    const father_profession = (formData.get('father_profession') as string) ?? '';
    const father_placeOfWork = (formData.get('father_placeOfWork') as string) ?? '';
    const mother_name = (formData.get('mother_name') as string) ?? '';
    const mother_occupation = (formData.get('mother_occupation') as string) ?? '';
    const mother_phonenumber = (formData.get('mother_phonenumber') as string) ?? '';
    const mother_religion = (formData.get('mother_religion') as string) ?? '';
    const mother_profession = (formData.get('mother_profession') as string) ?? '';
    const mother_placeOfWork = (formData.get('mother_placeOfWork') as string) ?? '';
    const address = (formData.get('address') as string) ?? '';
    const reference1 = (formData.get('reference1') as string) ?? '';
    const reference2 = (formData.get('reference2') as string) ?? '';
    const partner_pref_education = (formData.get('partner_pref_education') as string) ?? '';
    const partner_pref_age = (formData.get('partner_pref_age') as string) ?? '';
    const partner_pref_caste = (formData.get('partner_pref_caste') as string) ?? '';
    const partner_pref_subcaste = (formData.get('partner_pref_subcaste') as string) ?? '';

    const maritalstatus = (formData.get('maritalstatus') as string) ?? '';
    const profile_created_for = (formData.get('profile_created_for') as string) ?? '';
    const profile_creator_aadhar = (formData.get('profile_creator_aadhar') as string) ?? '';
    const profile_creator_name = (formData.get('profile_creator_name') as string) ?? '';
    const profile_creator_phonenumber = (formData.get('profile_creator_phonenumber') as string) ?? '';
    const lookingfor = (formData.get('lookingfor') as string) ?? '';
    const bride_groom_detail = (formData.get('bride_groom_detail') as string) ?? '';
    const gender = (formData.get('gender') as string) ?? '';


    const file = formData.get('profile_photo') as File | null;
    const file1 = formData.get('photo1') as File | null;
    const file2 = formData.get('photo2') as File | null;
    const file3 = formData.get('photo3') as File | null;
    const file4 = formData.get('photo4') as File | null;
    const file5 = formData.get('horoscope') as File | null;
    const file6 = formData.get('profile_creator_photo') as File | null;

    try {
        await connectToDatabase();

        const parsedBirthdate = birthdate ? new Date(birthdate) : '';

        const profile_photo = await uploadFile(file, UPLOAD_PIC_DIR);
        const photo1 = await uploadFile(file1, UPLOAD_PIC_DIR);
        const photo2 = await uploadFile(file2, UPLOAD_PIC_DIR);
        const photo3 = await uploadFile(file3, UPLOAD_PIC_DIR);
        const photo4 = await uploadFile(file4, UPLOAD_PIC_DIR);
        const horoscope = await uploadFile(file5, UPLOAD_HORO_DIR);
        const profile_creator_photo = await uploadFile(file6, UPLOAD_PIC_DIR);

        const hashedPassword = await bcrypt.hash(password, 10);

        const sanitizeAndTrimFields = (fields: Record<string, any>): Record<string, any> => {
            const sanitizedFields: Record<string, any> = {}; // Explicitly define type
            for (const [key, value] of Object.entries(fields)) {
                const valueType = typeof value; // Store the type in a variable

                if (valueType === 'string') {
                    // Check if the string value is `'null'` and replace it with an empty string
                    sanitizedFields[key] = value === 'null' ? '' : value.trim();
                } else if (value == null || value === '') {
                    // Replace null, undefined, or empty strings with an empty string
                    sanitizedFields[key] = '';
                } else {
                    // Retain numbers, objects, arrays, and other types as they are
                    sanitizedFields[key] = value;
                }
            }
            return sanitizedFields;
        };


        // Usage
        const newUserFields = sanitizeAndTrimFields({
            name,
            lastname,
            email,
            phonenumber,
            religion,
            caste,
            subcaste,
            birthdate: parsedBirthdate,
            age,
            state_id,
            city_id,
            place_of_birth,
            education,
            complexion,
            profession,
            income,
            job,
            place_of_work,
            kuladeivam,
            place_of_kuladeivam_temple,
            gothram,
            father_name,
            father_phonenumber,
            father_occupation,
            father_religion,
            father_profession,
            father_placeOfWork,
            mother_name,
            mother_phonenumber,
            mother_occupation,
            mother_religion,
            mother_profession,
            mother_placeOfWork,
            address,
            partner_pref_education,
            partner_pref_age,
            partner_pref_caste,
            partner_pref_subcaste,
            reference1,
            reference2,
            profile_photo,
            photo1,
            photo2,
            photo3,
            photo4,
            horoscope,
            profile_creator_photo,
            maritalstatus,
            profile_created_for,
            profile_creator_aadhar,
            profile_creator_name,
            profile_creator_phonenumber,
            lookingfor,
            bride_groom_detail,
            gender,
            created_at: new Date()
        });
        console.log("newUserFields", newUserFields);
        if (id) {
            // Update data
            await User.findByIdAndUpdate(id, newUserFields, { new: true });

            return NextResponse.json({ message: 'User details have been successfully updated.' });

        } else {

            newUserFields.password = hashedPassword;

            const newUser = await User.create(newUserFields);

            const verificationLink = `${process.env.BASE_URL}/verify-email?code=${newUser.email_code}`;


            const receipients = [{
                name: name,
                address: email
            }]

            const htmlBody = welcomeTemplate(name, copyright);

            const result = await sendEmail({
                receipients,
                subject: 'TMSM - Welcome mail',
                message: htmlBody
            })

            const htmlBody2 = verificationTemplate(name, verificationLink, copyright);

            const result2 = await sendEmail({
                receipients,
                subject: 'TMSM - Verification mail',
                message: htmlBody2
            })

            const htmlBody3 = adminWelcomeTemplate(email, name, phonenumber, copyright);

            const receipients2 = [{
                name: 'admin',
                address: ''
            }]

            const result3 = await sendEmail({
                receipients: receipients2,
                subject: 'TMSM - New User Registration',
                message: htmlBody3
            })

            return NextResponse.json({ message: 'User details have been added successfully.' });
        }

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
