import StaticUtils from "./StaticUtils.js";

export default class LeadUtils {
  static findLeadField({ lead, fieldName, value = false } = {}) {
    const { custom_fields_values } = lead;
    const field = custom_fields_values?.filter(field => field?.field_name === fieldName)[0] || null;

    if (!field) {
      return null;
    }

    if (value) {
      const { values: [{ value }] } = field;
      return value;
    }

    return field;
  }

  static findContactField({ contact, fieldName, value = false } = {}) {
    const { custom_fields_values } = contact;
    const field = custom_fields_values?.filter(field => field?.field_name === fieldName)[0] || null;

    if (!field) {
      return null;
    }

    if (value) {
      const { values: [{ value }] } = field;
      return value;
    }

    return field;
  }

  static getPhoneNumber({ contact } = {}) {
    const { custom_fields_values } = contact;
    const field = custom_fields_values?.filter(field => field?.field_code === 'PHONE')[0] || null;

    if (!field) {
      return null;
    }

    const { values } = field;
    const { value } = values.filter(value => value.enum_code === 'WORK')[0] || null;
    if (!value) {
      return null;
    }
    return StaticUtils.removePhoneNonNumericCharacters(value);
  }
}