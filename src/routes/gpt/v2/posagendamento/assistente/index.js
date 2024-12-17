const express = require('express');
const router = express.Router();
const decodeKommoURI = require('../../../../../middlewares/decodeKommoURI');
const bodyParser = require('body-parser');
const PosAgendamento = require('../../../../../controllers/assistant-prompt/PosAgendamento');

router.use(bodyParser.text({ type: '*/*' }));
router.use(decodeKommoURI);

router.get('/', (req, res) => {
  res.json({ message: 'Rota de requisição de assistente - pós agendamento' });
});

// BOT PÓS AGENDAMENTO
router.post('/:assistant_id/confirmar-presenca', PosAgendamento.confirmar_presenca);

router.post('/:assistant_id/notificar-falta', PosAgendamento.notificar_falta);

router.post('/:assistant_id/iniciar-reagendamento', PosAgendamento.inicar_reagendamento);

module.exports = router;
