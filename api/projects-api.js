const baseUrl = "projects"

export function getAllProjects($axios, programId) {
  const params = new URLSearchParams()

  if (programId) params.append("program_id", programId)
  return $axios.get(`${baseUrl}?${params}`)
}

export function getProjectById(id, $axios) {
  return $axios.get(`${baseUrl}/${id}`)
}

export function createProject(payload, $axios) {
  return $axios.post(baseUrl, payload)
}

export function updateProject(payload, $axios, id) {
  return $axios.put(`${baseUrl}/${id}`, payload)
}

export function deleteProject(id, $axios) {
  return $axios.delete(`${baseUrl}/${id}`)
}

// CONSTRACTS APIS
const contractsUrl = "contracts"

export function getAllContractsByProjectId(project_id, $axios) {
  const params = project_id ? `?project_id=${project_id}` : ""
  return $axios.get(`${contractsUrl}${params}`)
}

export function getContractByIdAndProjectId(projectId, contractId, $axios) {
  return $axios.get(`${contractsUrl}/${contractId}`)
}

export function createContract(projectId, payload, $axios) {
  return $axios.post(`${contractsUrl}`, payload)
}

export function updateContract(projectId, payload, $axios, contractId) {
  return $axios.put(`${contractsUrl}/${contractId}`, payload)
}

export function deleteContract(projectId, contractId, $axios) {
  return $axios.delete(`${contractsUrl}/${contractId}`)
}
const checklistUrl = "checklist"
export function createContractChecklist(payload, $axios) {
  return $axios.post(`${checklistUrl}/store?`, payload)
}
