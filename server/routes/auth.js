import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();


router.get('/', async (req, res) => {
    const allUsers = await prisma.user.findMany();
    res.json(allUsers);
});

router.post('/register', async (req, res) => {

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    
    await prisma.user.create({
        data: req.body
    });

    res.json({message: "Usuário criado com sucesso"});
});

router.post('/login', async (req, res) => {

    const user = await prisma.user.findUnique({ username });

    if(!user) return res.json({message: "Usuário não encontrado"});

    const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

    if(!isPasswordValid) return res.json({message: "Senha inválida"});

    const token = jwt.sign({id: user.id}, "secret");

    res.json({ token, userID: user.id });
});


export { router as authRouter };

// router.put('/:id', async (req, res) => {
//     const id = parseInt(req.params.id);
//     const newAge = req.body.age;
//     const updatedUser = await prisma.user.update({
//         where: { id: id },
//         data: { age: newAge }
//     });
//     res.json(updatedUser);

// });

// router.delete('/:id', async (req, res) => {
//     const id = parseInt(req.params.id);
//     const deletedUser = await prisma.user.delete({
//         where: { id: id }    
//     });
//     res.json(deletedUser);
// });
