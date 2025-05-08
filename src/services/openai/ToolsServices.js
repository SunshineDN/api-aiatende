import styled from "../../utils/log/styled.js";

export default class ToolsServices {
  constructor() {
  }

  async analisarIntencaoUsuario({ resumoConversa }) {
    styled.info(resumoConversa);
    return;
  }

  async validarECapturarDados({ historico }) {
    styled.info(historico);
    return;
  }

  async capturarDadosConversa({ name, birthday, phone, neighborhood }) {

  }

  async listarHorariosDisponiveis({  }) {

  }

  async verificarDisponibilidade({  }) {

  }

  async confirmarAgendamento({  }) {

  }
}