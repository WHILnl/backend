//@ts-check

/**
 * @typedef DeviceToken
 * @prop {number} id 	              //INTEGER PRIMARY KEY AUTOINCREMENT,
 * @prop {string} token             // TEXT,
 * @prop {number} issuedAt 	        //INTEGER, -- Unix epoch timestamp
 * @prop {number} lastUsed 	        //INTEGER
 * @prop {number | null} revokedAt  //INTEGER
 */
/**
 * @typedef EnrollCode
 * @prop {number} id              	// INTEGER PRIMARY KEY AUTOINCREMENT,
 * @prop {number} code 	            // INTEGER, -- 6 digit code
 * @prop {number} usesRemaining 	  // INTEGER,
 * @prop {number} issuedAt 	        // INTEGER, -- Unix epoch timestamp
 * @prop {number} validUntil 	      // INTEGER -- Unix epoch timestamp
 */

const device_token = {
  /**
   * Get all device tokens
   * @returns {Promise<DeviceToken[] | undefined>}
   */
  getAll: async () => {
    const res = await fetch('/api/admin/device_token');
    if (!res.ok) {
      console.error(
        'Could not get device tokens :',
        res.status,
        res.statusText,
      );
      return;
    }
    const body = await res.json();
    const data = body.data;
    return data;
  },
  /**
   * Revoke a token
   * @param {number} id Id of the token to revoke
   * @returns {Promise<boolean>} If an ok response was received from the server 
   */
  revoke: async (id) => {
    const res = await fetch(`/api/admin/device_token/${id}/revoke`, {
      method: 'POST',
    });
    return res.ok;
  },
};

const enroll_code = {
  /**
   * Get all device tokens
   * @returns {Promise<EnrollCode[] | undefined>}
   */
  getAll: async () => {
    const res = await fetch('/api/admin/enroll_code');
    if (!res.ok) {
      console.error(
        'Could not get enroll codes :',
        res.status,
        res.statusText,
      );
      return;
    }
    const body = await res.json();
    const data = body.data;
    return data;
  },
  /**
   * Delete a code
   * @param {number} id Id of the code to delete
   */
  delete: async (id) => {
    const res = await fetch(`/api/admin/enroll_code/${id}`, {
      method: 'DELETE',
    });
    return res.ok;
  },
};

export { device_token, enroll_code };
