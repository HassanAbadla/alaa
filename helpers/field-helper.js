// helpers/fieldHelpers.js

/**
 * Converts an array of field objects to an object with key-value pairs.
 * Each field object should have 'name' and 'value' properties.
 * The resulting object will use the 'name' property as the key and the 'value' property as the value.
 *
 * @param {Array} fields - The array of field objects.
 * @return {Object} - The resulting object with key-value pairs.
 */
export function objectFromFields(fields) {
  return Object.fromEntries(fields.map((field) => [field.name, field.value]))
}
