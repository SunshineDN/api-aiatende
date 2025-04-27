import { google } from "googleapis";
import GoogleClient from "../../clients/GoogleClient.js";
import styled from "../../utils/log/styled.js";

export default class GoogleServices {
  #calendarId;
  #documentId;

  constructor({ calendar_id = '', document_id = '' } = {}) {
    this.#calendarId = calendar_id;
    this.#documentId = document_id;
  }

  async getDocumentContent() {
    const docs = google.docs({ version: 'v1' });
    const googleClient = new GoogleClient({ scopes: ['https://www.googleapis.com/auth/documents'] });
    googleClient.authenticate();

    const response = await docs.documents.get({
      documentId: this.#documentId,
    });

    return response.data.body.content.map((element) => {
      if (element.paragraph) {
        return element.paragraph?.elements.map((e) => e.textRun?.content).join('');
      }

      if (element.table) {
        return element.table.tableRows.map((row) => {
          return row.tableCells.map((cell) => {
            return cell.content.map((content) => content.paragraph?.elements.map((e) => e.textRun?.content).join('')).join('');
          }).join('');
        }).join('');
      }

      return '';
    }).join('');
  }
}