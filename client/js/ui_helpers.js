UI.registerHelper("editableEpisodes", function() {
	return Episodes.find({});
});

UI.registerHelper("episodesForForm", function() {
	var allEpiodes = Episodes.find().fetch();
	var holder = _.map(allEpiodes, function(item){
		return {value: item["_id"], label: item["seriesTitle"] + " " + item["seasonNumber"] + "." + item["episodeNumber"]};
	});
	holder.unshift({value: "", label: "Select an Episode"});
	return holder;
});
UI.registerHelper("typeForForm", function() {
	return [{label: "Quip", value: "Quip"}, {label: "Longread", value:"Longread"}];
});
UI.registerHelper("scenesForForm", function(){
	var holder = Episodes.find({_id: Session.get("episodeId")}).fetch();
	if(holder[0]!==undefined && holder[0].showMarkers!==undefined && 
		Session.get("associatedAtSceneLevel")){
		var arrayHolder = holder[0].showMarkers;
		var itemsForDropdown = _.map(arrayHolder, function(item){
				return {value: item["timestamp"], label: item["showMarker"]}
			});
		itemsForDropdown.unshift({value: "", label: "Select a Scene marker"});
		return itemsForDropdown;
	} else {
		return [{label: "NA", value:""}];
	}
});

UI.registerHelper("getCommentors", function(){
	return CommentsMeta.find({totalComments: {$gt: 0}});	
});
UI.registerHelper("getCommentors_userName", function(){
	var cursor = Meteor.users.findOne({_id: this.userId});
	return cursor.username;

});
UI.registerHelper("getCommentors_picture", function(){
	var cursor = Meteor.users.findOne({_id: this.userId});
	return cursor.profile[0].picture;

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
	return CommentsMeta.find({totalComments: {$gt: 0}}).count() - Session.get("unseenUsers").length;
});