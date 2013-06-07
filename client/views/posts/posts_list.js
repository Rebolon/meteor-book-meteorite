Template.postsList.helpers({
	posts: function funcTplPostsListsPosts() {
		return Posts.find({}, {sort: {submitted: -1}});
	}
});
