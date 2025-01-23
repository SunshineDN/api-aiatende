import request from 'supertest';
import app from '../../app';

describe('Método GET no /confirmacao', () => {
  it('Deve retornar 200 OK na rota "/" confirmacao prompt', async () => {
    const response = await request(app).get('/gpt/v2/confirmacao/prompt');
    expect(response.statusCode).toBe(200);
  });

  it('Deve retornar 200 OK na rota "/" confirmacao assistente', async () => {
    const response = await request(app).get('/gpt/v2/confirmacao/assistant');
    expect(response.statusCode).toBe(200);
  });
});

describe('Método POST no /confirmacao', () => {
  it('Deve retornar 200 OK no prompt de intenção', async () => {
    const response = await request(app)
      .post('/gpt/v2/confirmacao/assistant/YXNzdF9qeDlCWlMxdEJUMHhoRk5jemtSSEVBOTA/24h-1st-try')
      .send('leads%5Badd%5D%5B0%5D%5Bid%5D=19030890&leads%5Badd%5D%5B0%5D%5Bstatus_id%5D=71995068&leads%5Badd%5D%5B0%5D%5Bpipeline_id%5D=8933063&account%5Bid%5D=32000011&account%5Bsubdomain%5D=kommoagendamento');

    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('Deve retornar 200 OK no assistente 24h-2nd-try', async () => {
    const response = await request(app)
      .post('/gpt/v2/confirmacao/assistant/YXNzdF9qeDlCWlMxdEJUMHhoRk5jemtSSEVBOTA/24h-2nd-try')
      .send('leads%5Badd%5D%5B0%5D%5Bid%5D=19030890&leads%5Badd%5D%5B0%5D%5Bstatus_id%5D=71995068&leads%5Badd%5D%5B0%5D%5Bpipeline_id%5D=8933063&account%5Bid%5D=32000011&account%5Bsubdomain%5D=kommoagendamento');

    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('Deve retornar 200 OK no assistente 24h-3rd-try', async () => {
    const response = await request(app)
      .post('/gpt/v2/confirmacao/assistant/YXNzdF9qeDlCWlMxdEJUMHhoRk5jemtSSEVBOTA/24h-3rd-try')
      .send('leads%5Badd%5D%5B0%5D%5Bid%5D=19030890&leads%5Badd%5D%5B0%5D%5Bstatus_id%5D=71995068&leads%5Badd%5D%5B0%5D%5Bpipeline_id%5D=8933063&account%5Bid%5D=32000011&account%5Bsubdomain%5D=kommoagendamento');

    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('Deve retornar 200 OK no assistente 3h-1st-try', async () => {
    const response = await request(app)
      .post('/gpt/v2/confirmacao/assistant/YXNzdF9qeDlCWlMxdEJUMHhoRk5jemtSSEVBOTA/3h-1st-try')
      .send('leads%5Badd%5D%5B0%5D%5Bid%5D=19030890&leads%5Badd%5D%5B0%5D%5Bstatus_id%5D=71995068&leads%5Badd%5D%5B0%5D%5Bpipeline_id%5D=8933063&account%5Bid%5D=32000011&account%5Bsubdomain%5D=kommoagendamento');

    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  }, 10000);

  it('Deve retornar 200 OK no assistente 3h-2nd-try', async () => {
    const response = await request(app)
      .post('/gpt/v2/confirmacao/assistant/YXNzdF9qeDlCWlMxdEJUMHhoRk5jemtSSEVBOTA/3h-2nd-try')
      .send('leads%5Badd%5D%5B0%5D%5Bid%5D=19030890&leads%5Badd%5D%5B0%5D%5Bstatus_id%5D=71995068&leads%5Badd%5D%5B0%5D%5Bpipeline_id%5D=8933063&account%5Bid%5D=32000011&account%5Bsubdomain%5D=kommoagendamento');

    console.log(response.statusCode);
    expect(response.statusCode).toBe(200);
  }, 10000);
});
