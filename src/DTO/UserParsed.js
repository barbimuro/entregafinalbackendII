export default class UserDTOSession {
  name;
  role;
  id;
  constructor(user) {
    (this.name = `${user.firstName} ${user.lastName}`),
      (this.role = user.role),
      (this.id = user.id);
  }
}
