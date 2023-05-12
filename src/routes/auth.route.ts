import {
    FastifyInstance,
    FastifyRequest,
    FastifyReply,
    FastifyPluginOptions,
    FastifyPluginAsync,
} from 'fastify';
import fp from 'fastify-plugin';
const authRoute: FastifyPluginAsync = async (
    fastify: FastifyInstance,
    _: FastifyPluginOptions,
): Promise<void> => {
    fastify.get('/auth', function (request: FastifyRequest, reply: FastifyReply) {
        reply.status(200).send({ message: 'Auth' });
    });
};
export default fp(authRoute);
