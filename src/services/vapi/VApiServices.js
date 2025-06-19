import { VapiClient } from "@vapi-ai/server-sdk";
import axios from "axios";

export default class VApiServices {
  #token;
  #base_url;
  #phone_number_id;

  constructor({ token }) {
    this.#token = token;
    this.client = new VapiClient({
      token: this.#token
    });
    this.#base_url = "https://api.vapi.ai";
    this.#phone_number_id = process.env.VAPI_PHONE_ID;
  }

  async callToAssistant({ assistant_id, phone_number }) {
    if (!assistant_id || !phone_number) {
      throw new Error("assistant_id, and phone_number are required");
    }

    let vapi_assistant_id;

    if (assistant_id === "asst_epSsBL4xTTSse7v2yqk9E4IA") {
      vapi_assistant_id = "2ed4fe14-1ae1-4f70-8f6d-52e42e5f9e4d";

    } else if (assistant_id === "asst_sXKsda8Ff8XuITyeDjd4uidR") {
      vapi_assistant_id = "27085100-5e79-401a-94cb-b2836658c51b";

    } else if (assistant_id === "asst_mmcn6qluOVCZYg8wTKV2VLBf") {
      vapi_assistant_id = "e5c8c48b-07fb-4611-b320-122b17fc17e8";

    } else if (assistant_id === "asst_GX31vSL1yjVYNRsLvsDJ5QOh") {
      vapi_assistant_id = "cbd46ca1-32a7-48e7-adff-86c85a3befed";

    } else {
      vapi_assistant_id = "2ed4fe14-1ae1-4f70-8f6d-52e42e5f9e4d";
    }

    const url = `${this.#base_url}/call`;

    const options = {
      method: "POST",
      url,
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.#token}`
      },
      data: {
        assistantId: vapi_assistant_id,
        phoneNumberId: this.#phone_number_id,
        customer: {
          number: phone_number
        }
      }
    }

    const { data } = await axios.request(options);
    return data;
  }
}