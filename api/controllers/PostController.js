module.exports = {

  story: async(req, res) => {
    try {
      res.view('story');
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  postStory: async(req, res) => {
    try {
      console.log("==== postStory ===", req.body);
      let data = req.body;
      let result = await PostService.create(data, req);
      res.ok(result);
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  getPostById: async(req, res) => {
    try {
      console.log("==== getPostById ===", req.param('id'));
      let post = await PostService.getPostById(req.param('id'));
      let fbId=0;

      let login = await UserService.getLoginState(req);
      let isFav = false;
      if(login){
        let user = await UserService.getLoginUser(req);
        let UserFavorites = await UserService.getUserFavorites({userId: user.id});
        console.log("===UserFavorites[0]=>",UserFavorites[0]);
        let itemId = req.param('id');
        fbId = await UserService.getFBId(user.id);
        console.log("fbId=>",fbId);
        UserFavorites.forEach(function(fav) {
          if(fav.id==itemId) isFav = true;
        }); // end forEach
      }
      res.view('postDetail', {
        post,
        isFav,
        fbId
      });
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  getF7ViewPostById: async(req, res) => {
    try {
      console.log("==== getF7ViewPostById ===", req.param('id'));
      let post = await PostService.getPostById(req.param('id'));
      let fbId=0;

      let login = await UserService.getLoginState(req);
      let isFav = false;
      if(login){
        let user = await UserService.getLoginUser(req);
        let UserFavorites = await UserService.getUserFavorites({userId: user.id});
        console.log("===UserFavorites[0]=>",UserFavorites[0]);
        let itemId = req.param('id');
        fbId = await UserService.getFBId(user.id);
        console.log("fbId=>",fbId);
        UserFavorites.forEach(function(fav) {
          if(fav.id==itemId) isFav = true;
        }); // end forEach
      }
      res.view('postDetailF7', {
        post,
        isFav,
        fbId
      });
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  // search
  getPostByKeyword: async(req, res) => {
    try {
      var keyword = req.param('keyword');
      console.log("==== getPostByKeyword ===", keyword);
      let items = await PostService.getPostByKeyword(keyword);
      console.log("=== item[0] ===\n",items[0]);
      res.ok({
        items
      });
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  getAllPost: async(req, res) => {
    try {
      let result = await PostService.getAllPost();
      let loginedUser, favorites;
      let userLogin = await UserService.getLoginState(req);
      let isFav = false;
      if(userLogin){
        loginedUser = await UserService.getLoginUser(req);
        // console.log("==== logined User is ===>", loginedUser);
        favorites = await UserService.getUserFavorites({userId:loginedUser.id});
        // console.log("==== user favorites are ===>", favorites);
        result.data.forEach(function(post,index){
          favorites.forEach(function(fav){
            if(post.id===fav.id) post.isFav = true;
            // console.log("index",index);
          }); // end forEach
        });// end forEach
      } // end if
      res.ok(result);
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  storyCategory: async(req, res) => {
    try {

      let categorys = await PostService.getAllCategory();
      res.view('storyCategory', {
        categorys
      });
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  },

  getStoryCategoryItemById: async(req, res) => {
    try {

      let categoryItems = await ItemService.findByLikeId(req.param('id'));
      res.view('storyDetail', {
        categoryItems
      });
    } catch (e) {
      sails.log.error(e);
      res.serverError(e);
    }
  }

}
