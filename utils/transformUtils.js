// utils/transformUtils.js

/**
 * Transforms flattened multilingual fields to nested objects
 * Example: { 'name.en': 'Hello', 'name.ar': 'مرحبا' }
 * becomes: { name: { en: 'Hello', ar: 'مرحبا' } }
 *
 * @param {Object} data - The data object to transform
 * @param {Array} fields - Array of field names to transform (e.g., ['name', 'description'])
 * @param {Array} languages - Array of language codes (default: ['en', 'ar'])
 * @returns {Object} - Transformed data object
 */
export function flattenedToNested(data, fields = [], languages = ["en", "ar"]) {
  const transformed = { ...data }

  fields.forEach((fieldName) => {
    const hasAnyLanguage = languages.some((lang) => data[`${fieldName}.${lang}`] !== undefined)

    if (hasAnyLanguage) {
      // Create the nested object
      transformed[fieldName] = {}

      // Add each language
      languages.forEach((lang) => {
        const flatKey = `${fieldName}.${lang}`
        transformed[fieldName][lang] = data[flatKey] || ""

        // Remove the flattened property
        delete transformed[flatKey]
      })
    }
  })

  return transformed
}

/**
 * Transforms nested multilingual objects to flattened fields
 * Example: { name: { en: 'Hello', ar: 'مرحبا' } }
 * becomes: { 'name.en': 'Hello', 'name.ar': 'مرحبا' }
 *
 * @param {Object} data - The data object to transform
 * @param {Array} fields - Array of field names to transform (e.g., ['name', 'description'])
 * @param {Array} languages - Array of language codes (default: ['en', 'ar'])
 * @returns {Object} - Transformed data object
 */
export function nestedToFlattened(data, fields = [], languages = ["en", "ar"]) {
  const transformed = { ...data }

  fields.forEach((fieldName) => {
    if (data[fieldName] && typeof data[fieldName] === "object") {
      // Flatten each language
      languages.forEach((lang) => {
        const flatKey = `${fieldName}.${lang}`
        transformed[flatKey] = data[fieldName][lang] || ""
      })

      // Optionally remove the nested object (uncomment if desired)
      // delete transformed[fieldName];
    }
  })

  return transformed
}

/**
 * Helper function to transform a single item (for use in transformResponse)
 */
export function transformSingleItem(item, fields = [], languages = ["en", "ar"]) {
  return nestedToFlattened(item, fields, languages)
}

/**
 * Common transform configurations for different field types
 */
export const TRANSFORM_CONFIGS = {
  // Standard name field transformation
  NAME_FIELD: {
    fields: ["name"],
    languages: ["en", "ar"]
  },

  // Name and description fields
  NAME_AND_DESCRIPTION: {
    fields: ["name", "description"],
    languages: ["en", "ar"]
  },

  // Multiple language support
  MULTILINGUAL: {
    fields: ["name", "description", "title"],
    languages: ["en", "ar", "fr"]
  }
}
