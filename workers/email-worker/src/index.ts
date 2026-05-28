interface EmailMessage {
  from: string;
  to: string;
  subject: string;
  headers: Headers;
  raw: ReadableStream;
  rawSize: number;
  forward(addr: string): Promise<void>;
  reply(body: string): Promise<void>;
}

interface Env {
  SEND_EMAIL: SendEmail;
}

export default {
  async email(message: EmailMessage, env: Env, ctx: ExecutionContext) {
    await message.forward("vqh9mnrdbp@privaterelay.appleid.com");
  },
};
