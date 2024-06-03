**Rotas voltada apenas para modificar campos de Leads:**
https://api.aiatende.com.br/lead/
https://api.aiatende.com.br/lead/data-hora (armazena a data e hora + dia da semana no card)
https://api.aiatende.com.br/lead/split-fields (antes a rota era /teste/augencio, divide o campo pai diretamente em Nome completo, data de nascimento e bairro)

**Rotas voltadas para requisições do OpenAI**
https://api.aiatende.com.br/gpt/v1/
https://api.aiatende.com.br/gpt/v1/prompt (rota para prompt)
https://api.aiatende.com.br/gpt/v1/:assistant_id/message (rota para assistente)
https://api.aiatende.com.br/gpt/v1/audio-to-text (rota para transcrever áudio em texto)
https://api.aiatende.com.br/gpt/v1/text-to-audio (rota para enviar áudio do 0133 para o lead)

**Rotas para requisições do Google Calendar**
https://api.aiatende.com.br/calendar/
https://api.aiatende.com.br/calendar/listEvents/ (rota para listar eventos do google calendar)
https://api.aiatende.com.br/calendar/addEvent/ (rota para agendar no google calendar)
https://api.aiatende.com.br/calendar/updateEvent/
https://api.aiatende.com.br/calendar/removeEvent/
