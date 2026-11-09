//@ts-check

const device_token = {
  /**
   * Revoke a token
   * @param {number} id Id of the token to revoke
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
