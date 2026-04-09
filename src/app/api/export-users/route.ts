import { NextRequest } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

// CSV-safe escaping: wrap in quotes if the value contains commas, quotes, or newlines
function escapeCsvValue(value: any): string {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
}

// Column definitions: [CSV Header, document field key]
const EXPORT_COLUMNS: [string, string][] = [
    ['Name', 'name'],
    ['Lastname', 'lastname'],
    ['Email', 'email'],
    ['Phone Number', 'phonenumber'],
    ['Gender', 'gender'],
    ['Age', 'age'],
    ['Birthdate', 'birthdate'],
    ['Marital Status', 'marital_status'],
    ['Religion', 'religion'],
    ['Caste', 'caste'],
    ['Subcaste', 'subcaste'],
    ['Education', 'education'],
    ['Profession', 'profession'],
    ['Income', 'income'],
    ['Job', 'job'],
    ['Place of Work', 'place_of_work'],
    ['Address', 'address'],
    ['State', 'state_id'],
    ['City', 'city_id'],
    ['Country', 'country_id'],
    ['Place of Birth', 'place_of_birth'],
    ['Complexion', 'complexion'],
    ['Kuladeivam', 'kuladeivam'],
    ['Place of Kuladeivam Temple', 'place_of_kuladeivam_temple'],
    ['Gothram', 'gothram'],
    ['Father Name', 'father_name'],
    ['Father Phone', 'father_phonenumber'],
    ['Father Occupation', 'father_occupation'],
    ['Father Religion', 'father_religion'],
    ['Father Profession', 'father_profession'],
    ['Father Place of Work', 'father_placeOfWork'],
    ['Mother Name', 'mother_name'],
    ['Mother Phone', 'mother_phonenumber'],
    ['Mother Occupation', 'mother_occupation'],
    ['Mother Religion', 'mother_religion'],
    ['Mother Profession', 'mother_profession'],
    ['Mother Place of Work', 'mother_placeOfWork'],
    ['Looking For', 'lookingfor'],
    ['Profile Created For', 'profile_created_for'],
    ['Profile Creator Name', 'profile_creator_name'],
    ['Profile Creator Phone', 'profile_creator_phonenumber'],
    ['Relation Name', 'relation_name'],
    ['Bride/Groom Detail', 'bride_groom_detail'],
    ['Partner Pref Education', 'partner_pref_education'],
    ['Partner Pref Age', 'partner_pref_age'],
    ['Partner Pref Caste', 'partner_pref_caste'],
    ['Partner Pref Subcaste', 'partner_pref_subcaste'],
    ['User Status', 'is_active'],
    ['Account Status', 'is_approve'],
    ['Verified', 'is_verify'],
    ['Created At', 'created_at'],
];

export const GET = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const name = (searchParams.get('name') || '').trim();
        const search = (searchParams.get('search') || '').trim();
        const is_active = searchParams.get('is_active') || '';
        const is_approve = searchParams.get('is_approve') || '';

        // Connect to the database
        await connectToDatabase();

        // Build the same query as /api/user-list
        const query: any = {};

        if (name) {
            query.name = { $regex: name, $options: 'i' };
        }

        if (search) {
            query.$or = [
                { email: { $regex: search, $options: 'i' } },
                { phonenumber: { $regex: search, $options: 'i' } },
            ];
        }

        if (is_active != '') {
            query.is_active = is_active;
        }

        if (is_approve != '') {
            query.is_approve = is_approve;
        }

        query.is_delete = { $ne: true };

        // Select only the fields we need for export (exclude password, email_code, photos, etc.)
        const selectFields = EXPORT_COLUMNS.map(([, field]) => field).join(' ');

        // Use cursor for memory-efficient streaming
        const cursor = User.find(query).sort({ created_at: -1 }).select(selectFields).lean().cursor();

        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const filename = `users_export_${timestamp}.csv`;

        // Build a ReadableStream that writes CSV row-by-row
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    // BOM for Excel UTF-8 compatibility
                    controller.enqueue(new TextEncoder().encode('\uFEFF'));

                    // Write CSV header row
                    const headerRow = EXPORT_COLUMNS.map(([header]) => escapeCsvValue(header)).join(',') + '\r\n';
                    controller.enqueue(new TextEncoder().encode(headerRow));

                    // Stream each document as a CSV row
                    for await (const doc of cursor) {
                        const row = EXPORT_COLUMNS.map(([, field]) => {
                            let value = (doc as any)[field];

                            // Format dates nicely
                            if (value instanceof Date) {
                                value = value.toISOString().slice(0, 10);
                            }

                            // Format booleans to readable text
                            if (typeof value === 'boolean') {
                                value = value ? 'Yes' : 'No';
                            }

                            return escapeCsvValue(value);
                        }).join(',') + '\r\n';

                        controller.enqueue(new TextEncoder().encode(row));
                    }

                    controller.close();
                } catch (err) {
                    controller.error(err);
                }
            },
        });

        return new Response(stream, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv; charset=utf-8',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });
    } catch (error) {
        console.error('Error exporting users:', error);
        return new Response(JSON.stringify({ message: 'Internal Server Error' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
};
