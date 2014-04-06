Template.episode_list.seriesDetail = function() {
	return Series.findOne();
}
Template.episode_list.seriesTitle = function() {
	return this.seriesTitle;
}
Template.episode_list.network = function() {
	return this.network;
}
Template.episode_list.startYear = function() {
	return this.startAirDate.getFullYear();
}
Template.episode_list.endYear = function() {
	return this.endAirDate.getFullYear();
}
Template.episode_list.numberSeasons = function() {
	return this.numberSeasons;
}
Template.episode_list.numberEpisodes = function() {
	return this.numberEpisodes;
}

Template.episode_list.epiosdeLayout = function() {
	return Episodes.find();
}
Template.episode_list.episodeImage = function() {
	console.log(this)
	return this.episodeImage;
}
Template.episode_list.episodeNumber = function() {
	return this.episodeNumber;
}
Template.episode_list.episodeTitle = function() {
	return this.episodeTitle;
}
Template.episode_list.linkDestination = function() {
	var destinationURL = "Showverse";
	return destinationURL;
}
Template.episode_list.events ({
	'click .single_episode': function(){
		Router.go("/Showverse/" + this.episodeImage)
	}

});
