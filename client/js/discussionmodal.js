Template.discussionmodal.helpers({ 
	commentForDiscussion: function(){
		return Comments.findOne({_id: Session.get("commentForDiscussion")});
	},
	commentorName: function(){
		var theUser = Meteor.users.findOne({_id: this.userId});
		return theUser.username;
	},
	commentText: function(){
		return this.commentText;
	}

});

Template.showverse.events({
	'click #enterComment': function(){
		console.log( Session.get("commentForDiscussion") );
		var discussionText = $('#discussionEnter').val();
		Comments.update(
			{
				_id: Session.get("commentForDiscussion")
			},
			{
				$push: {
					discussions: {
						discussionItem: {
							userId: Meteor.userId(),
							timestamp: Date.now(),
							discussionText: discussionText
						}
					}
				}
			}

		);
	},
});