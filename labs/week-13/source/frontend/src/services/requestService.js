import { apiFetch, ApiError } from './apiClient.js';
import {
  clearStoredRequests,
  readStoredRequests,
  writeStoredRequests,
} from './requestStorage.js';

export { ApiError };

/**
 * development α╣âα╕èα╣ë Express API
 * production build α╕¬α╕│α╕½α╕úα╕▒α╕Ü GitHub Pages α╣âα╕èα╣ëα╕éα╣ëα╕¡α╕íα╕╣α╕Ñ Demo α╣âα╕Ö browser
 */
const USE_BROWSER_STORAGE = import.meta.env.PROD;

async function loadInitialRequests() {
  const response = await fetch(
    `${import.meta.env.BASE_URL}data/initialRequests.json`
  );

  if (!response.ok) {
    throw new ApiError(
      'α╣äα╕íα╣êα╕¬α╕▓α╕íα╕▓α╕úα╕ûα╣éα╕½α╕Ñα╕öα╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╕òα╕▒α╕ºα╕¡α╕óα╣êα╕▓α╕çα╣äα╕öα╣ë',
      response.status
    );
  }

  const requests = await response.json();

  writeStoredRequests(requests);

  return structuredClone(requests);
}

async function getStoredRequests() {
  const stored = readStoredRequests();

  if (stored.status === 'valid') {
    return stored.requests;
  }

  return loadInitialRequests();
}

function createNextId(requests) {
  const highestNumber = requests.reduce((highest, request) => {
    const number = Number(
      String(request.id).replace('REQ-', '')
    );

    if (!Number.isFinite(number)) {
      return highest;
    }

    return Math.max(highest, number);
  }, 0);

  return `REQ-${String(highestNumber + 1).padStart(3, '0')}`;
}

export async function getRequests(options = {}) {
  if (options.scenario === 'error') {
    throw new ApiError(
      'LAB scenario: α╕êα╕│α╕Ñα╕¡α╕çα╕üα╕▓α╕úα╣éα╕½α╕Ñα╕öα╕éα╣ëα╕¡α╕íα╕╣α╕Ñα╣äα╕íα╣êα╕¬α╕│α╣Çα╕úα╣çα╕ê',
      500
    );
  }

  if (options.scenario === 'empty') {
    return [];
  }

  if (!USE_BROWSER_STORAGE) {
    const query = options.status
      ? `?status=${encodeURIComponent(options.status)}`
      : '';

    return apiFetch(`/api/requests${query}`);
  }

  const requests = await getStoredRequests();

  if (!options.status) {
    return requests;
  }

  return requests.filter(
    (request) => request.status === options.status
  );
}

export async function getRequestById(requestId) {
  if (!USE_BROWSER_STORAGE) {
    try {
      return await apiFetch(
        `/api/requests/${encodeURIComponent(requestId)}`
      );
    } catch (error) {
      if (
        error instanceof ApiError &&
        error.status === 404
      ) {
        return null;
      }

      throw error;
    }
  }

  const requests = await getStoredRequests();

  return requests.find(
    (request) => request.id === requestId
  ) ?? null;
}

export async function addRequest(requestInput) {
  if (!USE_BROWSER_STORAGE) {
    return apiFetch('/api/requests', {
      method: 'POST',
      body: JSON.stringify(requestInput),
    });
  }

  const requests = await getStoredRequests();

  const created = {
    id: createNextId(requests),
    requesterName: requestInput.requesterName.trim(),
    requestType: requestInput.requestType,
    location: requestInput.location.trim(),
    details: requestInput.details.trim(),
    priority: requestInput.priority ?? 'normal',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  writeStoredRequests([...requests, created]);

  return structuredClone(created);
}

export async function updateRequestStatus(requestId, status) {
  if (!USE_BROWSER_STORAGE) {
    return apiFetch(
      `/api/requests/${encodeURIComponent(requestId)}`,
      {
        method: 'PUT',
        body: JSON.stringify({ status }),
      }
    );
  }

  const requests = await getStoredRequests();

  const index = requests.findIndex(
    (request) => request.id === requestId
  );

  if (index === -1) {
    throw new ApiError(
      `α╣äα╕íα╣êα╕₧α╕Üα╕äα╕│α╕úα╣ëα╕¡α╕çα╕úα╕½α╕▒α╕¬ ${requestId}`,
      404
    );
  }

  const updated = {
    ...requests[index],
    status,
  };

  const nextRequests = [...requests];
  nextRequests[index] = updated;

  writeStoredRequests(nextRequests);

  return structuredClone(updated);
}

export async function deleteRequest(requestId) {
  if (!USE_BROWSER_STORAGE) {
    await apiFetch(
      `/api/requests/${encodeURIComponent(requestId)}`,
      {
        method: 'DELETE',
      }
    );

    return getRequests();
  }

  const requests = await getStoredRequests();

  const nextRequests = requests.filter(
    (request) => request.id !== requestId
  );

  if (nextRequests.length === requests.length) {
    throw new ApiError(
      `α╣äα╕íα╣êα╕₧α╕Üα╕äα╕│α╕úα╣ëα╕¡α╕çα╕úα╕½α╕▒α╕¬ ${requestId}`,
      404
    );
  }

  writeStoredRequests(nextRequests);

  return structuredClone(nextRequests);
}

export async function resetRequests() {
  if (!USE_BROWSER_STORAGE) {
    return getRequests();
  }

  clearStoredRequests();

  return loadInitialRequests();
}
