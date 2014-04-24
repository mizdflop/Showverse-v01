//*******  For Opening Modal *****************
Template.openingmodal.atotalCommentors = function(){
	var totalCommentors = CommentsMeta.find({totalComments: {$gt: 0}}).count();
	if ( totalCommentors == 1){
		return "One person has contributed to the to this episode:";
	} else if(totalCommentors ==0) {
		return "You will be the first to contribute to this episode.";
	} else {
		return totalCommentors  + " People contributed to this episode:";
	}
}

Template.openingmodal.commentorsList = function() {
	return CommentsMeta.find({totalComments: {$gt: 0}});
}
Template.openingmodal.totalCommentorsMessage = function(){
	var counter = CommentsMeta.find({totalComments: {$gt: 0}}).count();
	if (counter == 0 ){
		return "You will be the first contributor to this episode.";
	} else if (counter == 1){
		return "One person has contributed to this episode.";
	} else {
		return counter + "People have contributed to this episode"; 
	}
}
Template.openingmodal.auserName = function() {
	var cursor = Meteor.users.findOne({_id: this.userId});
	return cursor.username;
}
Template.openingmodal.atotalComments = function() {
	return this.totalComments;
}
Template.openingmodal.picture = function() {
	var cursor = Meteor.users.findOne({_id: this.userId});
	return cursor.profile[0].picture;
}
Template.openingmodal.dateOfComments = function(){
	var aComment = Comments.findOne({userId: this.userId});
	var d = new Date();
	d.setTime(aComment.timestamp);
	return( weekday[d.getDay()] + ", " + months[d.getMonth()] +  " " + 
			d.getDate() + " " + d.getFullYear());
	//WORKING HERE
}

Template.openingmodal.rendered = function(){
	$('#episode_contribute_modal').modal('show');
	$('.selectpicker_timer').selectpicker();
}

