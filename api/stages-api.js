export function getActualStages($axios, portfolioId, programId, projectId, methodologyId) {
  const params = new URLSearchParams()

  if (portfolioId) params.append("portfolio_id", portfolioId)
  if (programId) params.append("program_id", programId)
  if (projectId) params.append("project_id", projectId)
  if (methodologyId) params.append("methodology_id", methodologyId)

  const url = `actual-stages?${params.toString()}`
  return $axios.get(url)
}
