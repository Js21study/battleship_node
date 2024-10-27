import WebSocket from 'ws';

const serverUrl = 'ws://localhost:8080';

describe('WebSocket Server', () => {
  let server: WebSocket.Server;
  beforeAll((done) => {
    server = new WebSocket.Server({ port: 8080 });

    server.on('connection', (ws) => {
      ws.on('message', (message) => {
        const request = JSON.parse(message.toString());

        if (request.type === 'reg') {
          const response = {
            type: 'reg',
            data: {
              name: request.data.name,
              index: 1,
              error: false,
              errorText: '',
            },
            id: request.id,
          };
          ws.send(JSON.stringify(response));
        }
      });
    });

    done();
  });

  afterAll((done) => {
    server.close();
    done();
  });

  it('should respond to a registration request', (done) => {
    const ws = new WebSocket(serverUrl);

    ws.on('open', () => {
      const regRequest = {
        type: 'reg',
        data: { name: 'test', password: '123' },
        id: 0,
      };
      ws.send(JSON.stringify(regRequest));
    });

    ws.on('message', (message) => {
      const response = JSON.parse(message.toString());
      expect(response.type).toBe('reg');
      expect(response.data.error).toBe(false);
      ws.close();
      done();
    });
  });
});
