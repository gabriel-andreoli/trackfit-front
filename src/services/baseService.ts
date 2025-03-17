class BaseService {
  protected getAuthToken(): string | null {
    const user = localStorage.getItem('user');
    if (user) {
      const parsedUser = JSON.parse(user);
      return parsedUser.token || null;
    }
    return null;
  }

  protected createAuthHeaders(): Record<string, string> {
    const token = this.getAuthToken();
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }
}

export default BaseService;
