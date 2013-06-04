Template.postsList.helpers({
	posts: function funcTplPostsListsPosts() {
		return Posts.find();
	}
});
