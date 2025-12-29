import { ObjectId } from 'mongodb';

export interface UserOtp {
    _id?: ObjectId;
    email: string;
    otp: string;
    org_id: string;
    created_at: Date;
}
