class UserDTO {
  id;
  email;
  login;
  referrer;
  createdAt;

  constructor(model) {
    this.id = model._id;
    this.email = model.email;
    this.login = model.login;
    this.createdAt = model.createdAt;
    this.referrer = model.referrer;
  }
}

module.exports = UserDTO;
