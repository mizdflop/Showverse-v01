typesOfSnippets = [{label: "Critics", value: "Critics"}, {label: "Twitter", value:"Twitter"}, {label: "Reddit", value: "Reddit"},{label: "Memes", value: "Memes"}];
Session.set("attachedToTimeline", false);

Template.admin_create_bestofnotes.helpers({
	attachedToTimeline: function(){
		return Session.get("attachedToTimeline");
	},
	currentType: function(x){
		if(x==undefined || x.hash==undefined) { return false;}
		if(x.hash.itemSelected =="any") { 
			if(!Session.equals("bestOfType", "")){
				return true;
			}
		}
		if(x.hash.itemSelected == Session.get("bestOfType")) {return true;}
		return false;	
	},
	timeLineChecked: function(){
		return Session.get("attachedToTimeline");
	},
	previousSourceName: function(){
		if(Session.get("selectedSource")!==""){
			return Session.get("selectedSource").sourceName; 
		}
		return "";
	},
	previousSourceRootUri: function(){
		if(Session.get("selectedSource")!==""){
			return Session.get("selectedSource").sourceRootUri; 
		}
		return "";
	},
	previousDirectUri: function(){
		if(Session.get("selectedSource")!==""){
			return Session.get("selectedSource").directUri; 
		}
		return "";
	},
	previousAuthor: function(){
		if(Session.get("selectedSource")!==""){
			return Session.get("selectedSource").author; 
		}
		return "";
	},
	previousAuthorUri: function(){
		if(Session.get("selectedSource")!==""){
			return Session.get("selectedSource").authorUri; 
		}
		return "";
	},

});






Template.admin_create_bestofnotes.events({
	'change select': function(e){
		if(e.target.name==="episodeId"){
			Session.set("episodeId", e.target.value);
		}
	},
	/*'change [name=associatedAtSceneLevel]': function(e){
		Session.set("associatedAtSceneLevel", e.target.checked);
	},*/
	'change [name=attachedToTimeline]': function(e){
		Session.set("attachedToTimeline", e.target.checked);
	}, 
	'change [name=bestOfType]': function(e){
		Session.set("bestOfType", e.target.value);
	}

});
Template.admin_create_bestofnotes.rendered = function(){
	Session.set("bestOfType", "");
	Session.set("selectedSource", "");
}

Template.getPreviousArticles.helpers({
	previousSource: function(){
		return Bestof.find({bestOfType: "Critics"});
	}
})
Template.admin_create_bestofnotes.events({
	'change #articleSelector': function(e){
		console.log(e.target.value);
		Session.set("selectedSource", Bestof.findOne({_id: e.target.value}));
	},
});
