export default class LeadUtils {
  static findLeadField({ lead, fieldName, value = false } = {}) {
    const { custom_fields_values } = lead;
    const field = custom_fields_values.filter(field => field.field_name === fieldName)[0] || null;

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
    const field = custom_fields_values.filter(field => field.field_name === fieldName)[0] || null;

    if (!field) {
      return null;
    }

    if (value) {
      const { values: [{ value }] } = field;
      return value;
    }

    return field;
  }
}