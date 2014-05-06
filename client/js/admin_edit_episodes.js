Template.admin_edit_episodes.editingDoc = function () {
  return Episodes.findOne({_id: Session.get("episodeId")});
}
Template.admin_edit_episodes.events ({
	'change #chooseEpisode': function(e){
		Session.set("episodeId", e.target.value);
		console.log(e.target.value);
	}
});