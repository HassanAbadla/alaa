// configs/attachmentConfigs.js

/**
 * Base attachment configuration
 */
const baseAttachmentConfig = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "image/jpeg",
    "image/png",
    "image/gif",
    "text/plain"
  ]
}

/**
 * Risk attachment configuration
 */
export const riskAttachmentConfig = {
  ...baseAttachmentConfig,
  entityName: "risk",
  storeName: "risk",
  parentIdField: "risk_id",
  createAction: "risk/createRiskAttachment",
  attachmentCountField: "risk_attachments_count",

  // Standard fields configuration
  fields: {
    note: {
      label: "form.note",
      default: ""
    },
    validUntil: {
      label: "table.valid_until",
      required: true,
      default: ""
    },
    valid: {
      label: "table.valid",
      default: true
    }
  },

  // No custom fields for risk attachments
  customFields: {},

  permissions: {
    add: "add_risk_document",
    view: "access_risk_documents",
    edit: "edit_risk_document",
    delete: "delete_risk_document"
  }
}

/**
 * Threat attachment configuration
 */
export const threatAttachmentConfig = {
  ...baseAttachmentConfig,
  entityName: "threat",
  storeName: "threatAttachments",
  parentIdField: "bcm_threats_id", // Based on your API screenshot
  createAction: "threatAttachments/addAttachment",
  attachmentCountField: "threat_attachments_count",

  // Standard fields configuration
  fields: {
    note: {
      label: "form.note",
      default: ""
    }
    // No validUntil or valid fields for threats based on API
  },

  // Custom fields specific to threats (based on your API screenshot)
  customFields: {
    user_id: {
      type: "number",
      label: "form.user",
      required: true,
      default: null
    }
  },

  permissions: {
    add: "create_threat_attachment",
    view: "access_threat_attachments",
    edit: "update_threat_attachment",
    delete: "delete_threat_attachment"
  }
}

/**
 * Example configuration for future entity (e.g., incidents)
 */
export const incidentAttachmentConfig = {
  ...baseAttachmentConfig,
  entityName: "incident",
  storeName: "incidentAttachments",
  parentIdField: "incident_id",
  createAction: "incidentAttachments/addAttachment",
  attachmentCountField: "incident_attachments_count",

  fields: {
    note: {
      label: "form.note",
      default: ""
    },
    validUntil: {
      label: "table.valid_until",
      required: false,
      default: ""
    },
    priority: {
      type: "dropdown",
      label: "form.priority",
      required: true,
      options: [
        { id: 1, name: "High" },
        { id: 2, name: "Medium" },
        { id: 3, name: "Low" }
      ],
      itemValue: "id",
      itemText: "name",
      default: null
    }
  },

  customFields: {
    evidence_type: {
      type: "text",
      label: "form.evidence_type",
      required: true,
      default: ""
    },
    chain_of_custody: {
      type: "text",
      label: "form.chain_of_custody",
      required: false,
      default: ""
    }
  },

  permissions: {
    add: "create_incident_attachment",
    view: "access_incident_attachments",
    edit: "update_incident_attachment",
    delete: "delete_incident_attachment"
  }
}

/**
 * Helper function to get attachment config by entity type
 */
export function getAttachmentConfig(entityType) {
  const configs = {
    risk: riskAttachmentConfig,
    threat: threatAttachmentConfig,
    incident: incidentAttachmentConfig
  }

  return configs[entityType] || null
}

/**
 * Helper function to create attachment config for new entities
 */
export function createAttachmentConfig(options) {
  const {
    entityName,
    storeName = `${entityName}Attachments`,
    parentIdField = `${entityName}_id`,
    attachmentCountField = `${entityName}_attachments_count`,
    fields = {},
    customFields = {},
    permissions = {},
    ...rest
  } = options

  // Auto-generate permission names if not provided
  const defaultPermissions = {
    add: permissions.add || `create_${entityName}_attachment`,
    view: permissions.view || `access_${entityName}_attachments`,
    edit: permissions.edit || `update_${entityName}_attachment`,
    delete: permissions.delete || `delete_${entityName}_attachment`
  }

  return {
    ...baseAttachmentConfig,
    entityName,
    storeName,
    parentIdField,
    attachmentCountField,
    createAction: `${storeName}/addAttachment`,
    fields,
    customFields,
    permissions: defaultPermissions,
    ...rest
  }
}
