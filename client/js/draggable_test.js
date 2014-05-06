Session.set("runTime", 0);
var timerHandle;
Template.draggableplay.helpers({
	picture: function(){
		return Meteor.user().profile[0].picture;
	},
	timeCount: function(){
		return inMinutesSeconds(Session.get("runTime"));
	},
	allTheCommentors: function(){
		return CommentsMeta.find();
	},
	theUserName: function(){
		return userNameFromId(this.userId);
	},
	thePicture: function(){
		return userPhotoFromId(this.userId);
	},
	currentComments: function(){
		var handle = Comments.find({userId: this.userId, commentRunTime: {$lte: Session.get("runTime"), $gte: Session.get("runTime")-5}}).fetch();
		console.log(handle);
		return handle.commentText;
	},
});



Template.draggableplay.rendered=function() {
	$( ".draggable_user" ).draggable();
};

Template.draggableplay.events({
	'click .forPopover': function(){
		$().popover();
	},
	'click .glyphicon-play': function(){
		console.log('now here');
		quick_start_timer();
	},
	'click .glyphicon-pause': function(){
		Meteor.clearTimeout(timerHandle);
	}
});

var timerHandle;
quick_start_timer = function(){
	var currentTime = parseInt(Session.get("runTime"));
	currentTime++;
	Session.set("runTime", currentTime);
	timerHandle = Meteor.setTimeout(quick_start_timer, 1000)
}
