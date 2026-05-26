export class UserModel {
  constructor(data) {
    this.id = data.id || null;
    this.email = data.email || '';
    this.name = data.name || '';
    this.role = data.role || 'user'; // 👈 Added role tracking
    this.isAuthenticated = data.isAuthenticated || false;
  }
}