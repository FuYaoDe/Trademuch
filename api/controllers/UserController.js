module.exports = {

  find: async(req, res) => {
    try {
      let users = await UserService.findAll();
      res.ok({
        users
      });
    } catch (e) {
      res.serverError(e);
    }
  },

  update: async(req, res) => {
    console.log("====updateHobbyAndMail===", req.body);
    try {
      let data = req.body;
      let user = UserService.getLoginUser(req);

      if (data.email) {
        await UserService.updateUserMail({
          userId: user.id,
          userMail: data.email
        });
      }
      await PlaceService.add({
        userId: user.id,
        placeInfo: data.location
      });

      res.ok({success: true});
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  agreePolicies: async(req, res) => {
    try {
      const user = UserService.getLoginUser(req);
      const agree = await UserService.agreePolicies(user.id);
      res.ok(agree)
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  }
}
