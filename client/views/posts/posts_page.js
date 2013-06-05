Template.postPage.helpers({
	currentPost: function() {
		return Posts.findOne(Session.get('currentPostId')); // same as {_id: Session.get('currentPostId')}
	}
});
