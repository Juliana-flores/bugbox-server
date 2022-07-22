import { Server, Socket } from 'socket.io';

import { UserLoginSchema, UserSchema, EmailSchema } from './schema';
import { serverParams } from './config/env';
import { Email } from './models';
import { load } from './boot';

enum ErrorMessage {
  alreadyExists = 'Usuário já existe.',
  invalidPassword = '"password" is wrong',
  notFound = '"username" not found',
  generic = 'Erro ao realizar transação. Favor tentar novamente.',
  invalidParamSignup = 'Impossível realizar cadastro. Por favor, verifique as credenciais.',
  invalidParamsSignin = 'Impossível realizar login. Por favor, verifique as credenciais.',
  notFoundUser = 'Usuário não existe. Favor verificar credencial de e-mail.',
  wrongPassword = 'Senha ou usuário inválido. Favor verificar credenciais.',
}

enum Event {
  disconnect = 'disconnect',
  connection = 'connection',
  trashcan = 'trashcan',
  receive = 'receive',
  delete = 'delete',
  signin = 'signin',
  signup = 'signup',
  send = 'send',
  inbox = 'inbox',
  outbox = 'outbox',
}

interface EmailPayload {
  subject: string;
  from: string;
  body: string;
  to: string;
}

interface UserLogin {
  username: string;
  password: string;
}

interface User {
  username: string;
  password: string;
  name: string;
}

(async () => {
  const server = new Server();

  const { userRepository, serverRepository } = await load();

  server.on(Event.connection, async (socket: Socket) => {
    /**
     * Criar usuário
     */
    socket.on(Event.signup, async (payload: User) => {
      try {
        payload = await UserSchema.validateAsync(payload);
        if (await userRepository.exists(payload.username)) {
          socket.emit(Event.signup, { error: ErrorMessage.alreadyExists });
          return;
        }

        const user = {
          ...payload,
          outbox: [],
          inbox: [],
        };

        await userRepository.save(user);

        socket.emit(Event.signup, { user });
        return;
      } catch (error) {
        socket.emit(Event.signup, { error: ErrorMessage.invalidParamsSignin });
      }
    });

    /**
     * Login
     */
    socket.on(Event.signin, async (payload: UserLogin) => {
      try {
        payload = await UserLoginSchema.validateAsync(payload);
        const user = await userRepository.findByEmail(payload.username);

        if (!user) {
          socket.emit(Event.signin, { error: ErrorMessage.notFoundUser });
          return;
        }

        if (!user.isValidPassword(payload.password)) {
          socket.emit(Event.signin, { error: ErrorMessage.wrongPassword });
          return;
        }

        socket.emit(Event.signin, { user });
        return;
      } catch (error) {
        socket.emit(Event.signin, { error });
      }
    });

    /**
     * Enviar
     */
    socket.on(Event.send, async (payload: EmailPayload) => {
      try {
        payload = await EmailSchema.validateAsync(payload);

        if (!serverRepository.isFromSameServer(payload.to)) {
        }

        const [from, to] = await Promise.all([
          userRepository.findByEmail(payload.from),
          userRepository.findByEmail(payload.to),
        ]);

        if (!from) {
          socket.emit(Event.send, { error: 'DEU ERRO' });
          return;
        }

        if (!to) {
          //  const error = new CustomError(
          //     payload,
          //     Field.username,
          //     ErrorMessage.notFound,
          //     ErrorMessage.notFound
          //   );
          //   socket.emit(Event.send, error);
          return;
        }

        // const email = await emailRepository.create({
        //   subject: payload.subject,
        //   body: payload.body,
        //   from: from.username,
        //   to: to.username,
        // });
        const email = new Email('', payload.from, payload.to, payload.subject, payload.body, false);

        from.outbox = [...from.outbox, email];
        to.inbox = [...to.inbox, email];

        await Promise.all([userRepository.save(to), userRepository.save(from)]);

        socket.in(payload.to).emit(Event.receive, payload);
        socket.emit(Event.send, payload);

        return;
      } catch (error) {
        socket.emit(Event.send, error);
      }
    });

    /**
     * Remover
     */
    socket.on(Event.delete, async (payload) => {});

    /**
     * Listar CAIXA DE ENTRADA
     */
    socket.on(Event.inbox, async (payload) => {
      const { username } = payload;

      const mails = await userRepository.inbox(username);

      socket.emit(Event.inbox, { mails });
    });

    /**
     * Listar CAIXA DE SAÍDA
     */
    socket.on(Event.outbox, async (payload) => {
      const { username } = payload;

      const emails = await userRepository.outbox(username);

      socket.emit(Event.outbox, emails);
    });

    /**
     * Lixeira
     */
    socket.on(Event.trashcan, async (payload) => {
      const { username } = payload;

      const emails = await userRepository.trashCan(username);

      socket.emit(Event.outbox, emails);
    });

    /**
     * Desconectar
     */
    socket.on(Event.disconnect, () => {
      console.log(Event.disconnect, socket.id);
    });
  });

  server.listen(serverParams.port);

  console.log('Running on port:', serverParams.port);
})();
