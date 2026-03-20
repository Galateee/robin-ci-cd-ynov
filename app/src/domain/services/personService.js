import axios from "axios";

/**
 * Build API base URL from host and port.
 *
 * @param {string|number} [portOverride] - Optional API port override
 * @param {string} [hostOverride] - Optional API host override
 * @returns {string} API base URL
 */
function getApiBaseUrl(portOverride, hostOverride) {
  const host = hostOverride || "localhost";
  const port = portOverride || "8000";
  return `http://${host}:${port}`;
}

/**
 * Fetch all users from the API.
 *
 * @async
 * @function fetchUsers
 * @param {string|number} [apiPort] - API port passed from app configuration
 * @param {string} [apiHost] - API host passed from app configuration
 * @returns {Promise<Array>} List of users
 * @throws {Error} Throws "SERVER_ERROR" if request fails
 */
export async function fetchUsers(apiPort, apiHost) {
  try {
    const response = await axios.get(`${getApiBaseUrl(apiPort, apiHost)}/users`);
    const users = response.data?.utilisateurs || [];

    return users.map((row) => ({
      lastName: row?.[1] || "",
      firstName: row?.[2] || "",
      email: row?.[3] || "",
      birthDate: row?.[4] || "",
      zip: row?.[7] || "",
      city: row?.[6] || "",
    }));
  } catch {
    throw new Error("SERVER_ERROR");
  }
}

/**
 * Create a new user through backend API.
 *
 * @async
 * @function createUser
 * @param {Object} person - User object to create
 * @param {Array<string>} existingEmails - List of already registered emails
 * @param {string|number} [apiPort] - API port passed from app configuration
 * @param {string} [apiHost] - API host passed from app configuration
 * @returns {Promise<Object>} Created user
 * @throws {Error} Throws "EMAIL_ALREADY_EXISTS" or "SERVER_ERROR"
 */
export async function createUser(person, existingEmails = [], apiPort, apiHost) {
  if (existingEmails.includes(person.email.toLowerCase())) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  try {
    const payload = {
      nom: person.lastName,
      prenom: person.firstName,
      email: person.email,
      date_naissance: person.birthDate ? new Date(person.birthDate).toISOString().split("T")[0] : null,
      pays: null,
      ville: person.city,
      code_postal: person.zip,
    };

    const response = await axios.post(`${getApiBaseUrl(apiPort, apiHost)}/users`, payload);

    return {
      ...person,
      id: response.data?.id,
    };
  } catch {
    throw new Error("SERVER_ERROR");
  }
}
