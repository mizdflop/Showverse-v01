UI.registerHelper("getCommentors", function(){
	return CommentsMeta.find({totalComments: {$gt: 0}});	
});
UI.registerHelper("getCommentors_userName", function(){
	return this.userName;
});
UI.registerHelper("getCommentors_picture", function(){
	return this.picture;
});
UI.registerHelper("getCommentors_totalComments", function(){
	return this.totalComments;
});
UI.registerHelper("episodeInfo", function(){
	return Episodes.findOne();
});
UI.registerHelper("seriesTitle", function (){
	return this.seriesTitle;
});
UI.registerHelper("network", function () {
	var result = Series.find({}, {fields: {"network": 1}}).fetch();
	return result[0].network;
});
UI.registerHelper("seasonNumber", function (){
	return this.seasonNumber;		
});
UI.registerHelper("episodeNumber", function () {
	return this.episodeNumber;		
});
UI.registerHelper("episodeTitle", function () {
	return this.episodeTitle;		
});
UI.registerHelper("imdbRating", function() {		
	return this.imdbRating;		
});
UI.registerHelper("episodeAirDate", function () {
	var fullDate = this.episodeAirDate;
	var theMonth = months[fullDate.getMonth()];		var theDate = fullDate.getDate();
	var fullYear = fullDate.getFullYear();
	return theMonth + " " + theDate + ", " + fullYear;
});
UI.registerHelper("totalCommentors", function() {		
	return CommentsMeta.find({totalComments: {$gt: 0}}).count();
});