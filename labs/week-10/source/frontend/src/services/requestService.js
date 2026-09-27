import {
  apiFetch,
  ApiError,
} from './apiClient.js';

/**
 * Service Layer
 *
 * Development:
 *   ใช้ Express API ที่พอร์ต 3001
 *
 * Production Preview / GitHub Pages:
 *   หากติดต่อ API ไม่ได้ จะใช้ข้อมูล Demo จาก
 *   public/data/initialRequests.json
 *   และเก็บการเปลี่ยนแปลงใน localStorage
 */

export { ApiError };

const DEMO_STORAGE_KEY =
  'week10-campus-service-requests';

function isProductionBuild() {
  return import.meta.env.PROD;
}

function saveDemoRequests(requests) {
  localStorage.setItem(
    DEMO_STORAGE_KEY,
    JSON.stringify(requests)
  );

  return requests;
}

async function loadInitialRequests() {
  const dataUrl = new URL(
    './data/initialRequests.json',
    document.baseURI
  );

  const response = await fetch(dataUrl);

  if (!response.ok) {
    throw new ApiError(
      'โหลดข้อมูลตัวอย่างไม่สำเร็จ',
      response.status
    );
  }

  return response.json();
}

async function getDemoRequests() {
  const saved = localStorage.getItem(
    DEMO_STORAGE_KEY
  );

  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(
        DEMO_STORAGE_KEY
      );
    }
  }

  const initialRequests =
    await loadInitialRequests();

  return saveDemoRequests(
    initialRequests
  );
}

function createDemoRequestId(requests) {
  const numericIds = requests
    .map((request) => {
      const match = /^REQ-(\d+)$/.exec(
        request.id
      );

      return match
        ? Number(match[1])
        : 0;
    });

  const nextNumber =
    Math.max(0, ...numericIds) + 1;

  return `REQ-${String(nextNumber).padStart(
    3,
    '0'
  )}`;
}

export async function getRequests(
  options = {}
) {
  if (options.scenario === 'error') {
    throw new ApiError(
      'LAB scenario: จำลองการโหลดข้อมูลไม่สำเร็จ',
      500
    );
  }

  if (options.scenario === 'empty') {
    return [];
  }

  const query = options.status
    ? `?status=${encodeURIComponent(
        options.status
      )}`
    : '';

  try {
    return await apiFetch(
      `/api/requests${query}`
    );
  } catch (error) {
    if (!isProductionBuild()) {
      throw error;
    }

    const requests =
      await getDemoRequests();

    if (!options.status) {
      return requests;
    }

    return requests.filter(
      (request) =>
        request.status === options.status
    );
  }
}

export async function getRequestById(
  requestId
) {
  try {
    return await apiFetch(
      `/api/requests/${encodeURIComponent(
        requestId
      )}`
    );
  } catch (error) {
    if (
      error instanceof ApiError &&
      error.status === 404
    ) {
      return null;
    }

    if (!isProductionBuild()) {
      throw error;
    }

    const requests =
      await getDemoRequests();

    return (
      requests.find(
        (request) =>
          request.id === requestId
      ) ?? null
    );
  }
}

export async function addRequest(
  requestInput
) {
  try {
    return await apiFetch(
      '/api/requests',
      {
        method: 'POST',
        body: JSON.stringify(
          requestInput
        ),
      }
    );
  } catch (error) {
    if (!isProductionBuild()) {
      throw error;
    }

    const requests =
      await getDemoRequests();

    const createdRequest = {
      id: createDemoRequestId(
        requests
      ),
      requesterName:
        requestInput.requesterName,
      requestType:
        requestInput.requestType,
      location:
        requestInput.location,
      details:
        requestInput.details,
      priority:
        requestInput.priority ??
        'normal',
      status: 'pending',
      createdAt:
        new Date().toISOString(),
    };

    saveDemoRequests([
      ...requests,
      createdRequest,
    ]);

    return createdRequest;
  }
}

export async function updateRequestStatus(
  requestId,
  status
) {
  try {
    return await apiFetch(
      `/api/requests/${encodeURIComponent(
        requestId
      )}`,
      {
        method: 'PUT',
        body: JSON.stringify({
          status,
        }),
      }
    );
  } catch (error) {
    if (!isProductionBuild()) {
      throw error;
    }

    const requests =
      await getDemoRequests();

    const index = requests.findIndex(
      (request) =>
        request.id === requestId
    );

    if (index === -1) {
      throw new ApiError(
        `ไม่พบคำร้องรหัส ${requestId}`,
        404
      );
    }

    const updatedRequest = {
      ...requests[index],
      status,
    };

    const updatedRequests = [
      ...requests,
    ];

    updatedRequests[index] =
      updatedRequest;

    saveDemoRequests(
      updatedRequests
    );

    return updatedRequest;
  }
}

export async function deleteRequest(
  requestId
) {
  try {
    await apiFetch(
      `/api/requests/${encodeURIComponent(
        requestId
      )}`,
      {
        method: 'DELETE',
      }
    );

    return getRequests();
  } catch (error) {
    if (!isProductionBuild()) {
      throw error;
    }

    const requests =
      await getDemoRequests();

    const found = requests.some(
      (request) =>
        request.id === requestId
    );

    if (!found) {
      throw new ApiError(
        `ไม่พบคำร้องรหัส ${requestId}`,
        404
      );
    }

    const remainingRequests =
      requests.filter(
        (request) =>
          request.id !== requestId
      );

    return saveDemoRequests(
      remainingRequests
    );
  }
}

export async function resetRequests() {
  try {
    return await apiFetch(
      '/api/requests/reset',
      {
        method: 'POST',
      }
    );
  } catch (error) {
    if (!isProductionBuild()) {
      return getRequests();
    }

    localStorage.removeItem(
      DEMO_STORAGE_KEY
    );

    const initialRequests =
      await loadInitialRequests();

    return saveDemoRequests(
      initialRequests
    );
  }
}