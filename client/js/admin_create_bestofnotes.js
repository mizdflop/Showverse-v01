Session.set("associatedAtSceneLevel", false);
Session.set("attachedToTimeline", false);

Template.admin_create_bestofnotes.helpers({
	attachedToTimeline: function(){
		return Session.get("attachedToTimeline");
	}
});
Template.admin_create_bestofnotes.events({
	'change select': function(e){
		if(e.target.name==="episodeId"){
			Session.set("episodeId", e.target.value);
		}
	},
	'change [name=associatedAtSceneLevel]': function(e){
		Session.set("associatedAtSceneLevel", e.target.checked);
	},
	'change [name=attachedToTimeline]': function(e){
		Session.set("attachedToTimeline", e.target.checked);
	}

});