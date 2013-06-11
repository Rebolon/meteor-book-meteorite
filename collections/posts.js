Posts = new Meteor.Collection('posts');

Posts.allow({
	insert: function(userId, doc) {
		// only allow posting if you are logged in
		return !! userId;
	}
});

Meteor.methods({
	post: function(postAttributes) {
		var user = Meteor.user(),
		postWithSameLink = Posts.findOne({url: postAttributes.url});
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "You need to login to post new stories");
		// ensure the post has a title
		if (!postAttributes.title)
			throw new Meteor.Error(422, 'Please fill in a headline');
		// check that there are no previous posts with the same link
		if (postAttributes.url && postWithSameLink) {
			throw new Meteor.Error(302,
				'This link has already been posted',
				postWithSameLink._id);
		}

		// pick out the whitelisted keys
		var post = _.extend(_.pick(postAttributes, 'url'), {
			title: postAttributes.title + (this.isSimulation ? '(client)' : '(server)'),
			userId: user._id,
			author: user.username,
			submitted: new Date().getTime()
		});

		// wait for 5 seconds
		if (! this.isSimulation) {
			var Future = Npm.require('fibers/future');
			var future = new Future();
			Meteor.setTimeout(function() {
				future.ret();
			}, 5 * 1000);
			future.wait();
		}

		var postId = Posts.insert(post);
		/* personal hack coz the code seems to fail because the client views wait for server response to allow callback that will use Router... sad coz latency compensation seems to work but the behavior is not what we want : callback should be called when client side meteor methods post return postId.
		   so i decided to do the redirection directly here and i ask for more explanation on the github of Microscope project.
		*/
		if (this.isSimulation) {
			Meteor.Router.to('postsList');
		}
		return postId;
	}
});
