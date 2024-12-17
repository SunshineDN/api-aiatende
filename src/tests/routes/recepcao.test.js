const request = require('supertest');
const app = require('../../../app');

describe('Método GET no /recepcao', () => {
  it('Deve retornar 200 OK na rota "/" recepcao prompt', async () => {
    const response = await request(app).get('/gpt/v2/recepcao/prompt');
    expect(response.statusCode).toBe(200);
  });

  it('Deve retornar 200 OK na rota "/" recepcao assistente', async () => {
    const response = await request(app).get('/gpt/v2/recepcao/assistant');
    expect(response.statusCode).toBe(200);
  });
});

describe('Método POST no /recepcao', () => {
  it('Deve retornar 200 OK no prompt de intenção', async () => {
    const response = await request(app)
      .post('/gpt/v2/recepcao/prompt/intencao')
      .send('leads%5Badd%5D%5B0%5D%5Bid%5D=19030890&leads%5Badd%5D%5B0%5D%5Bstatus_id%5D=71995068&leads%5Badd%5D%5B0%5D%5Bpipeline_id%5D=8833059&account%5Bid%5D=32000011&account%5Bsubdomain%5D=kommoagendamento');

    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('Deve retornar 200 OK no assistente indefinido', async () => {
    const response = await request(app)
      .post('/gpt/v2/recepcao/assistant/YXNzdF9qeDlCWlMxdEJUMHhoRk5jemtSSEVBOTA/indefinido')
      .send('leads%5Badd%5D%5B0%5D%5Bid%5D=19030890&leads%5Badd%5D%5B0%5D%5Bstatus_id%5D=71995068&leads%5Badd%5D%5B0%5D%5Bpipeline_id%5D=8833059&account%5Bid%5D=32000011&account%5Bsubdomain%5D=kommoagendamento');

    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('Deve retornar 200 OK no assistente não qualificado', async () => {
    const response = await request(app)
      .post('/gpt/v2/recepcao/assistant/YXNzdF9qeDlCWlMxdEJUMHhoRk5jemtSSEVBOTA/nao_qualificado')
      .send('leads%5Badd%5D%5B0%5D%5Bid%5D=19030890&leads%5Badd%5D%5B0%5D%5Bstatus_id%5D=71995068&leads%5Badd%5D%5B0%5D%5Bpipeline_id%5D=8833059&account%5Bid%5D=32000011&account%5Bsubdomain%5D=kommoagendamento');

    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  }, 10000);
});
