import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { db } from '@/database';
import { User } from '@/models';
import { jwt } from '@/utils';

type Data =
    | { message: string; }
    | { token: string, user: { name: string, email: string, role: string; }; };

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return checkJWT(req, res);


        default:
            res.status(400).json({
                message: 'Bad request'
            });
    }

}

const checkJWT = async (req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { T0ken = '' } = req.cookies;
    let userId = '';

    try {
        userId = await jwt.isValidToken(T0ken);
    } catch (error) {
        return res.status(401).json({ message: 'Token de autorizacion no valido' });
    }

    await db.connect();
    const user = await User.findById(userId).lean();
    await db.disconnect();

    if (!user) return res.status(400).json({ message: 'No existe un usuario con ese ID' });

    const { _id, email, role, name } = user;


    return res.status(200).json({
        token: jwt.signToken(_id, email),
        user: {
            name,
            email,
            role
        }
    });

};