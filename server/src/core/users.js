module.exports = (User) => {
  return {
    getOne: (id) => {
      return User.findById(id);
    },
    update: (user) => {
      return user.save();
    },
  };
};
