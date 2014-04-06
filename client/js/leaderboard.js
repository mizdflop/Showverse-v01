Template.leaderboard.helpers({
	mostComments: function() {
		return CommentsMeta.find({totalComments: {$gt: 0}}, {sort: {totalComments: -1} , limit: 10});
	},
	userName: function (){
		return this.userName;
	},
	picture: function(){
		return this.picture;
	},
	totalComments: function(){
		return this.totalComments;
	},
	mostLikes: function() {
		return CommentsMeta.find({totalComments: {$gt: 0}}, {sort: {totalLikes: -1} , limit: 10});
	},
	userName: function (){
		return this.userName;
	},
	picture: function(){
		return this.picture;
	},
	totalLikes: function(){
		return this.totalLikes;
	},

});
