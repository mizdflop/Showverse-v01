Template.leaderboard.helpers({
	mostComments: function() {
		return CommentsMeta.find({totalComments: {$gt: 0}}, {sort: {totalComments: -1} , limit: 10});
	},
	userName: function (){
		var cursor = Meteor.users.findOne({_id: this.userId});
		return cursor.username;
	},
	picture: function(){
		var cursor = Meteor.users.findOne({_id: this.userId});
		return cursor.profile[0].picture;
	},
	totalComments: function(){
		return this.totalComments;
	},
	mostLikes: function() {
		return CommentsMeta.find({totalLikes: {$gt: 0}}, {sort: {totalLikes: -1} , limit: 10});
	},
	userName: function (){
		var cursor = Meteor.users.findOne({_id: this.userId});
		return cursor.username;
	},
	picture: function(){
		var cursor = Meteor.users.findOne({_id: this.userId});
		return cursor.profile[0].picture;
	},
	totalLikes: function(){
		return this.totalLikes;
	},

});
