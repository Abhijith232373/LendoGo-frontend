/**
 * Simple user model to represent the user data structure
 */
export class UserModel {
  constructor({ id = null, email = '', name = '', isAuthenticated = false }) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.isAuthenticated = isAuthenticated;
  }
}
