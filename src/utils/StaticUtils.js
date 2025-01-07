import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import styled from "./log/styledLog.js";

export default class StaticUtils {
    static calendarLink(id) {
        id = id.toString();
        const encodedString = StaticUtils.encodeString(id);
        const domain = process.env.DOMAIN || 'https://teste.aiatende.dev.br';
        return `${domain}/site/calenar/${encodedString}`;
    }

    static encodeString(string) {
        return Buffer.from(string).toString('base64');
    }

    static decodeString(string) {
        return Buffer.from(string, 'base64').toString('utf-8');
    }

    static jsonPromptToString(text) {
        /* ```json
    {
      "date": "08/01/2025",
      "avaiableOptions": ["11:00", "11:30"]
    }
    ``` */

        const clearText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const json = JSON.parse(clearText);
        return json;
    }

    static extractJsonPrompt(text) {
        // Capturar apenas de onde inicia a mensagem com ```json e termina com ``` para pegar apenas o JSON e retornar o objeto
        styled.info('[StaticUtils.extractJsonPrompt] Texto:', text);
        const regex = /```json([\s\S]*?)```/g;
        const match = regex.exec(text);
        if (match) {
            return StaticUtils.jsonPromptToString(match[0]);
        } else {
            return null;
        }
    }

    static toDateTime(date) {
        dayjs.extend(customParseFormat);
        return dayjs(date, 'DD/MM/YYYY HH:mm').toDate();
    }

    static changeTimezone(date, timezone) {
        var invdate = new Date(date.toLocaleString('pt-BR', {
            timeZone: timezone
        }));

        var diff = date.getTime() - invdate.getTime();

        return new Date(date.getTime() - diff);
    }

    static getDentistName(dentist) {
        if (dentist.includes('Juliana Leite')) {
            return 'Dra. Juliana Leite';
        } else if (dentist.includes('Lucília')) {
            return 'Odontopediatria'
        } else if (dentist.includes('Odontopediatria')) {
            return 'Odontopediatria'
        } else {
            return 'Demais Dentistas'
        }
    }
}