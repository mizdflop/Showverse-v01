Template.admin_edit_episodes.editableEpisodes = function() {
	return Episodes.find({});
}
Template.admin_edit_episodes.seriesTitle = function() {
	return this.seriesTitle;
}
Template.admin_edit_episodes.seasonNumber = function() {
	return this.seasonNumber;
}
Template.admin_edit_episodes.episodeNumber = function() {
	return this.episodeNumber;
}
Template.admin_edit_episodes.editingDoc = function () {
  return Episodes.findOne({_id: Session.get("episodeId")});
}
Template.admin_edit_episodes.events ({
	'click .popForm': function(){
		Session.set("episodeId", this._id);
		console.log(this._id);
	}
});