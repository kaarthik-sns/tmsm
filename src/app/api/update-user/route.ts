import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User'; // Adjust this path based on your project structure
import Admin from '@/models/Admin';
import connectToDatabase from '@/lib/mongodb';
import { promises as fs } from 'fs';
import path from 'path';
const UPLOAD_DIR = path.join(process.cwd(), "public/uploads"); // Adjust as needed

export async function POST(request: NextRequest) {
    
    const { 
        id, 
        is_admin, 
        name, 
        lastName, 
        email, 
        phonenumber, 
        religion, 
        caste, 
        subcaste, 
        birthdate, 
        age, 
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
        father_occupation,
        father_phonenumber,
        father_religion,
        father_profession,
        father_placeOfWork,
        mother_name,
        mother_occupation,
        mother_phonenumber,
        mother_religion,
        mother_profession,
        mother_placeOfWork,
        address,
        reference1, 
        reference2,
        partner_pref_education,
        partner_pref_age, 
        profile_photo,
    } = await request.json();

    const formData = await request.formData();

    const file = formData.get('profile_photo') as File;

    console.log(file);
 
    if (!id) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    try {
        await connectToDatabase();

        // Determine the user type and fetch the record
        let user;
        if (is_admin) {
            user = await Admin.findById(id); // Ensure this method exists in Admin model
        } else {
            user = await User.findById(id); // Ensure this method exists in User model
        }

        if (!user) {
            return NextResponse.json({ message: 'User not found or invalid ID' }, { status: 404 });
        }

        const parsedBirthdate = birthdate ? new Date(birthdate) : user.birthdate;

    // Handle profile picture upload
    if (file) {
        // Debugging the file details
        console.log('File Details:', {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        });
  
        // Construct the file path within the public/uploads folder
        const filePath = path.join(UPLOAD_DIR, file.name);
        console.log('File Path:', filePath);
  
        // Save the file to the server
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        await fs.writeFile(filePath, fileBuffer);
  
        // Save the file path in the user document (relative to public)
        user.profile_photo = `/uploads/${file.name}`; // Adjusted path to public folder
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
            profile_photo : profile_photo || user.profile_photo,
            reference1: reference1 || user.reference1,
            reference2: reference2 || user.reference2,
        };

        // Use findByIdAndUpdate for efficient update
        const updatedUser = await User.findByIdAndUpdate(id, updatedFields, { new: true });

        // If is_admin, update in Admin model as well
        if (is_admin) {
            const updatedAdmin = await Admin.findByIdAndUpdate(id, updatedFields, { new: true });
            return NextResponse.json({ message: 'Admin details have been successfully updated.', user: updatedAdmin });
        }

        return NextResponse.json({ message: 'User details have been successfully updated.', user: updatedUser });

    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json({ message: 'An error occurred while processing your request' }, { status: 500 });
    }
}
