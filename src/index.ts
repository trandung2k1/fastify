import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';
import colors from 'colors';
import bcrypt from 'bcrypt';
import auth from './routes/auth.route';
import sequelize from './configs/db';
import User from './models/user.model';
dotenv.config();
const p: number = +process.env.PORT! || 4000;
const server: FastifyInstance = Fastify({ logger: true });
server.register(auth);
server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({ message: 'Welcome to the server👋👋' });
});
type IBody = {
    username: string;
    email: string;
    password: string;
};
server.post(
    '/register',
    async (
        request: FastifyRequest<{
            Body: IBody;
        }>,
        reply: FastifyReply,
    ) => {
        const { username, email }: IBody = request.body;
        if (!username || !email || !request.body.password) {
            return reply.status(400).send({
                message: 'Username, email and password is required',
            });
        }
        try {
            const finUser = await User.findOne({ where: { email: email } });
            if (finUser) {
                return reply.status(400).send({
                    message: 'Email is already exists',
                });
            }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(request.body.password, salt);
            const newUser = await User.create({
                username,
                email,
                password: hashPassword,
            });
            const info = {
                username: newUser.dataValues['username'],
                id: newUser.dataValues['id'],
                email: newUser.dataValues['email'],
            };
            return reply.status(201).send(info);
        } catch (error) {
            if (error instanceof Error) {
                return reply.status(500).send({
                    message: error.message,
                });
            }
        }
    },
);
server.get('/users', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } });
        return reply.status(200).send(users);
    } catch (error) {
        if (error instanceof Error) {
            return reply.status(500).send({
                message: error.message,
            });
        }
    }
});
const start = async (): Promise<void> => {
    try {
        await sequelize.sync();
        await server.listen({ port: p });
        const address = server.server.address();
        const port = typeof address === 'string' ? address : address?.port;
        console.log(colors.green(`Server listening on http://localhost:${port}`));
    } catch (error) {
        server.log.error(error);
        process.exit(1);
    }
};
start();
