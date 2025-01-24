import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'; // Adjust this path based on your project structure
import connectToDatabase from '@/lib/mongodb';
import path from 'path';
import { promises as fs } from 'fs';
import crypto from 'crypto';


export async function POST(request: NextRequest) {

    const UPLOAD_PIC_DIR = path.join(process.cwd(), 'public', 'uploads', 'photos'); // Save in the public directory
    const UPLOAD_HORO_DIR = path.join(process.cwd(), 'public', 'uploads', 'horoscope'); // Save in the public directory

    // Ensure the uploads directory exists
    await fs.mkdir(UPLOAD_PIC_DIR, { recursive: true });
    await fs.mkdir(UPLOAD_HORO_DIR, { recursive: true });

    const formData = await request.formData();

    console.log('formData: ', formData);

    // Extract all fields from formData
    const id = (formData.get('_id') as string) ?? '';
    const name = (formData.get('name') as string) ?? '';
    const lastName = (formData.get('lastName') as string) ?? '';
    const email = (formData.get('email') as string) ?? '';
    const phonenumber = (formData.get('phonenumber') as string) ?? '';
    const religion = (formData.get('religion') as string) ?? '';
    const caste = (formData.get('caste') as string) ?? '';
    const subcaste = (formData.get('subcaste') as string) ?? '';
    const birthdate = (formData.get('birthdate') as string) ?? '';
    const age = (formData.get('age') as string) ?? '';
    const place_of_birth = (formData.get('place_of_birth') as string) ?? '';
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
    const bride_groom_detail = (formData.get('bride_groom_detail') as string) ?? '';
    const gender = (formData.get('gender') as string) ?? '';

    const file = (formData.get('profile_photo') as File) ?? '';
    const file1 = (formData.get('photo1') as File) ?? '';
    const file2 = (formData.get('photo2') as File) ?? '';
    const file3 = (formData.get('photo3') as File) ?? '';
    const file4 = (formData.get('photo4') as File) ?? '';
    const file5 = (formData.get('horoscope') as File) ?? '';


    var profile_photo = '';
    var photo1 = '';
    var photo2 = '';
    var photo3 = '';
    var photo4 = '';
    var horoscope = '';

    if (!id) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        const user = await User.findById(id); // Ensure this method exists in User model

        if (!user) {
            return NextResponse.json({ message: 'User not found or invalid ID' }, { status: 404 });
        }

        const parsedBirthdate = birthdate ? new Date(birthdate) : user.birthdate;

        // update profile pic
        if (file) {
            // Generate a unique filename using timestamp and random string
            const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
            const fileExtension = path.extname(file.name);
            const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

            // Construct the file path within the public/uploads folder
            const filePath = path.join(UPLOAD_PIC_DIR, uniqueFileName);

            // Save the file to the server
            const fileBuffer = Buffer.from(await file.arrayBuffer());
            await fs.writeFile(filePath, fileBuffer);

            // Save the file path in the user document (relative to public)
            profile_photo = `/uploads/photos/${uniqueFileName}`; // Adjusted path to public folder
        }

        // update profile pic
        if (file1) {
            // Generate a unique filename using timestamp and random string
            const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
            const fileExtension = path.extname(file1.name);
            const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

            // Construct the file path within the public/uploads folder
            const filePath = path.join(UPLOAD_PIC_DIR, uniqueFileName);

            // Save the file to the server
            const fileBuffer = Buffer.from(await file1.arrayBuffer());
            await fs.writeFile(filePath, fileBuffer);

            // Save the file path in the user document (relative to public)
            photo1 = `/uploads/photos/${uniqueFileName}`; // Adjusted path to public folder
        }

        // update profile pic
        if (file2) {
            // Generate a unique filename using timestamp and random string
            const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
            const fileExtension = path.extname(file2.name);
            const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

            // Construct the file path within the public/uploads folder
            const filePath = path.join(UPLOAD_PIC_DIR, uniqueFileName);

            // Save the file to the server
            const fileBuffer = Buffer.from(await file2.arrayBuffer());
            await fs.writeFile(filePath, fileBuffer);

            // Save the file path in the user document (relative to public)
            photo2 = `/uploads/photos/${uniqueFileName}`; // Adjusted path to public folder
        }

        // update profile pic
        if (file3) {
            // Generate a unique filename using timestamp and random string
            const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
            const fileExtension = path.extname(file3.name);
            const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

            // Construct the file path within the public/uploads folder
            const filePath = path.join(UPLOAD_PIC_DIR, uniqueFileName);

            // Save the file to the server
            const fileBuffer = Buffer.from(await file3.arrayBuffer());
            await fs.writeFile(filePath, fileBuffer);

            // Save the file path in the user document (relative to public)
            photo3 = `/uploads/photos/${uniqueFileName}`; // Adjusted path to public folder
        }

        // update profile pic
        if (file4) {
            // Generate a unique filename using timestamp and random string
            const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
            const fileExtension = path.extname(file4.name);
            const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

            // Construct the file path within the public/uploads folder
            const filePath = path.join(UPLOAD_PIC_DIR, uniqueFileName);

            // Save the file to the server
            const fileBuffer = Buffer.from(await file4.arrayBuffer());
            await fs.writeFile(filePath, fileBuffer);

            // Save the file path in the user document (relative to public)
            photo4 = `/uploads/photos/${uniqueFileName}`; // Adjusted path to public folder
        }

        // update profile pic
        if (file5) {

            // Generate a unique filename using timestamp and random string
            const uniqueSuffix = Date.now() + '-' + crypto.randomBytes(6).toString('hex');
            const fileExtension = path.extname(file5.name);
            const uniqueFileName = `${uniqueSuffix}${fileExtension}`;

            // Construct the file path within the public/uploads folder
            const filePath = path.join(UPLOAD_HORO_DIR, uniqueFileName);

            // Save the file to the server
            const fileBuffer = Buffer.from(await file5.arrayBuffer());
            await fs.writeFile(filePath, fileBuffer);

            // Save the file path in the user document (relative to public)
            horoscope = `/uploads/horoscope/${uniqueFileName}`; // Adjusted path to public folder
        }

        // Prepare the updated fields (only fields provided will be updated)
        const updatedFields = {
            name: name || user.name,
            lastname: lastName || user.lastName,
            email: email || user.email,
            phonenumber: phonenumber || user.phonenumber,
            religion: religion || user.religion,
            caste: caste || user.caste,
            subcaste: subcaste || user.subcaste,
            birthdate: parsedBirthdate,
            age: age || user.age,
            place_of_birth: place_of_birth || user.place_of_birth,
            education: education || user.education,
            complexion: complexion || user.complexion,
            profession: profession || user.profession,
            income: income || user.income,
            job: job || user.job,
            place_of_work: place_of_work || user.place_of_work,
            kuladeivam: kuladeivam || user.kuladeivam,
            place_of_kuladeivam_temple: place_of_kuladeivam_temple || user.place_of_kuladeivam_temple,
            gothram: gothram || user.gothram,
            father_name: father_name || user.father_name,
            father_phonenumber: father_phonenumber || user.father_phonenumber,
            father_occupation: father_occupation || user.father_occupation,
            father_religion: father_religion || user.father_religion,
            father_profession: father_profession || user.father_profession,
            father_placeOfWork: father_placeOfWork || user.father_placeOfWork,
            mother_name: mother_name || user.mother_name,
            mother_phonenumber: mother_phonenumber || user.mother_phonenumber,
            mother_occupation: mother_occupation || user.mother_occupation,
            mother_religion: mother_religion || user.mother_religion,
            mother_profession: mother_profession || user.mother_profession,
            mother_placeOfWork: mother_placeOfWork || user.mother_placeOfWork,
            address: address || user.address,
            partner_pref_education: partner_pref_education || user.partner_pref_education,
            partner_pref_age: partner_pref_age || user.partner_pref_age,
            partner_pref_caste: partner_pref_caste || user.partner_pref_caste,
            partner_pref_subcaste: partner_pref_subcaste || user.partner_pref_subcaste,
            reference1: reference1 || user.reference1,
            reference2: reference2 || user.reference2,
            profile_photo: profile_photo || user.profile_photo,
            photo1: photo1 || user.photo1,
            photo2: photo2 || user.photo2,
            photo3: photo3 || user.photo3,
            photo4: photo4 || user.photo4,
            horoscope: horoscope || user.horoscope,
            gender: gender || user.gender,
            bride_groom_detail: bride_groom_detail || user.bride_groom_detail,
        };

        // Use findByIdAndUpdate for efficient update
        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        return NextResponse.json({ message: 'User details have been successfully updated.', user: updatedUser });

    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
