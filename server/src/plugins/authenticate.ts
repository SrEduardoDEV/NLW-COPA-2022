import { FastifyRequest } from "fastify";

export async function authenticate(request: FastifyRequest) {
  return request.jwtVerify();
}
