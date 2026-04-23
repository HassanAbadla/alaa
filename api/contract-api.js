const baseUrl = "contract"

export function getContractDisciplines($axios) {
  return $axios.get(`${baseUrl}/disciplines`)
}

export function getContractStatus($axios) {
  return $axios.get(`${baseUrl}/status`)
}

export function getContractTypes($axios) {
  return $axios.get(`${baseUrl}/types`)
}

// ASK Will there be a Edit contract api? DONE
