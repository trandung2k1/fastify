import Fastify, { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';
import colors from 'colors';
import auth from './routes/auth.route';
import sequelize from './configs/db';
dotenv.config();
const p: number = +process.env.PORT! || 4000;
const server: FastifyInstance = Fastify({ logger: true });
server.register(auth);
server.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    reply.status(200).send({ message: 'Welcome to the server👋👋' });
});
server.get('/sync', async (request: FastifyRequest, reply: FastifyReply) => {
    await sequelize.sync({ force: true });
    reply.status(200).send({ message: 'All models were synchronized successfully.👋' });
});
const start = async (): Promise<void> => {
    try {
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
