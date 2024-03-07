import { NextResponse } from 'next/server';
import { unsetCookie } from '@/functions/unsetCookie';

export async function POST(req, res) {
    try {
        
            unsetCookie(res); // Call function to unset cookie
            return NextResponse.json({ redirect: true });
        
    } catch (error) {
        console.error('Error occurred during logout:', error.message);
        return NextResponse.error();
    }
}
