const baseUrl = "checklist"

// Attachment APIs
export function uploadAttachment(payload, $axios) {
  return $axios.post(`${baseUrl}-attachments`, payload)
}
export function getAttachments(checklist_id, $axios) {
  return $axios.get(`${baseUrl}-attachments/${checklist_id}`)
}
export function removeAttachment(checklist_id, $axios) {
  return $axios.delete(`${baseUrl}-attachments/${checklist_id}`)
}

// Log APIs
export function getChecklistLogs(checklist_id, $axios) {
  return $axios.get(`project-${baseUrl}/${checklist_id}/logs`)
}
export function assignUser(checklist_id, payload, $axios) {
  return $axios.post(`project-${baseUrl}/${checklist_id}/assign`, payload)
}

export function getStatusOptions($axios) {
  return $axios.get(`${baseUrl}-statuses`)
}
