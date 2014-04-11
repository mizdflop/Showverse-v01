//default value of the season and episode should be the min possible values
Session.set("currentSeriesNmber", 1);
Session.set("episodeNumber", 1);

Template.select_episode.helpers ({
	//top of page
	numberSeries: function(){
		return Series.find({}).count(); 
	},
	//for allSeries #each block 
	allSeries: function(){
		return Series.find({}, {$sort: {seriesTitle: -1}});
	},
	seriesTitle: function(){
		return this.seriesTitle;
	},
	seriesImage: function(){
		return this.seriesImage;
	},
	allEpisodes: function(){
		return Episodes.find({seriesTitle: this.seriesTitle}, {$sort: {seasonNumber: -1, episodeNumber: -1}});
	},
	seasonNumber: function(){
		return this.seasonNumber;
	},
	episodeId: function(){
		return this._id;
	},
	episodeNumber: function(){
		return this.episodeNumber;
	},
	episodeTitle: function(){
		return this.episodeTitle;
	},
	groupName: function(){
	$('selectpicker').selectpicker();
		return Session.get("groupName");
	}

});

Template.select_episode.events({
	'click .discuss_btn': function(e){
		var groupAndEpId=Session.get("groupAndEpId");
		var tmpArray = groupAndEpId.split(":");
		var anEpisode = Episodes.findOne({_id: tmpArray[1]});
		//console.log(anEpisode);
		Router.go("/group/watch/" + tmpArray[0] + "/"  + anEpisode.seriesTitle + "/" + anEpisode.idString)
	},
	'change .my_select': function(e){
		console.log(e.target.value);
		Session.set("groupAndEpId", e.target.value);
	}
});
