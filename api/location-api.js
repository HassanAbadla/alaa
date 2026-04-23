export function getCountries($axios) {
  return $axios.get("countries")
}
export function getCitiesByCountryId(countryId, $axios) {
  return $axios.get(`cities/${countryId}`)
}
