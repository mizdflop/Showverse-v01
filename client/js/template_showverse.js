Session.set("playPause", "glyphicon-play");
Session.set("unseenUsers", []);
Session.set("selectPicker", 1);
Session.setDefault("sessionRunTime", 0);
Session.setDefault("isSliding", 0);
Session.set("sliderInitialized", 0)
Session.set("timeOfPress",0);
Session.set("modalShown", 0);
dataArray = [];
showMarkersArray = []
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
Template.showverse.theComments = function() {
	//console.log(Session.get("unseenUsers"));
	if (Session.get("selectPicker")== 1){
		return Comments.find(
			{
				episodeId: Session.get("episodeId"), 
				commentRunTime: {$lte: Session.get("sessionRunTime")},
				userId: {$nin:  Session.get("unseenUsers") }, 
			}, 
			{sort: 
				{commentRunTime: -1, 
				timestamp: -1}, 
				limit: 30 
			}
		);
	} else if (Session.get("selectPicker")== 2){
	return Comments.find(
			{
				episodeId: Session.get("episodeId"), 
				commentRunTime: {$lte: Session.get("sessionRunTime")},
				userId: {$nin:  Session.get("unseenUsers") }, 
				likesCount: {$gt: 0}
			}, 
			{sort: 
				{commentRunTime: -1, 
				timestamp: -1}, 
				limit: 30 
			}
		);
	}
}

Template.showverse.helpers({ 
	isSpecial: function(){
		var cursor = Meteor.users.findOne({_id: this.userId});
		if(cursor.username == "ShowNotes"){
			return "special";
		}
	},
	userPhoto: function(){
		return Meteor.user().profile[0].picture;
	},

	totalComments: function() {
		result = Comments.find({}).count();
		return result;		
	},
	likers: function(){
		if (this.likers.length==0){
			return false;
		}
		var nameStr="";
		for(var i=0; i < this.likers.length; i++){
			if(i > 0){
				nameStr += ", ";
			}
			var cursor = Meteor.users.findOne({_id: this.likers[i]});
			nameStr += cursor.username;
		}
		return nameStr;
	},
	ismine: function() {
		if(this.userId==Meteor.userId()){
			return true;
		}		
	},
	commentorName: function() {
		var cursor = Meteor.users.findOne({_id: this.userId});
		return cursor.username;
	},
	commentText: function(){
  		return this.commentText;
	},
	commentRunTime: function(){
		return inMinutesSeconds(this.commentRunTime);
	},
	total_likes: function() {
		return this.likesCount;		
	},

	picture: function() {
		var cursor = Meteor.users.findOne({_id: this.userId});
		return cursor.profile[0].picture;

	},
	likeunliketext: function() {
		if (Comments.find( {_id: this._id, likers: Meteor.userId()} ).count()) {
			Session.set(this._id, "UserLikesIt");	
			return "Unlike";
		
		} else {
			Session.set(this._id, "UserDoesntLikesIt");
			return "Like";
		}		
	},
	runtime: function(){
		if(Session.get("sliding")){
			return inMinutesSeconds(Session.get("sliding"));
		} else {
			return inMinutesSeconds(Session.get("sessionRunTime"));
		}		
	},
	runtime_sliding: function() {
		return inMinutesSeconds(Session.get("sliding"));
	},
	icontype: function() {
		return Session.get("playPause");
	},
	showMarkers: function(){
		var epHolder = Episodes.findOne();
		return epHolder.showMarkers.sort(function(a,b){return a.timestamp-b.timestamp});
	},
	timestamp: function(){
		showMarkersArray.push(this.timestamp);
		return this.timestamp;
	},
	formatedTimeStamp: function(){
		return this.showMarker;
	},
	showMarker: function(){
		return inMinutesSeconds(this.timestamp);
	}, 
	showMarkersExist: function(){
		var epHolder = Episodes.findOne();
		if(epHolder.showMarkers==undefined || epHolder.showMarkers[0].timestamp==undefined){
			return false;
		} else {
			return true;
		}
	}
});

Template.showverse.events({
	'click .like_button, click .like_number' : function() {
		//id of the comment
		var theID = this._id;
		//get id of the user for use in updating CommentsMeta
		var metaId = CommentsMeta.findOne({userId: this.userId});

		//console.log(metaId._id);
		var timestamp = Date.now();
		if(Session.equals(theID, "UserDoesntLikesIt")){
			Comments.update(
				{ _id: this._id},
				{$inc: {likesCount: 1}, $push: {likers: Meteor.userId()}}				
			);
			CommentsMeta.update(
				{_id: metaId._id},
				{$inc: {totalLikes: 1}}
			)
		} else if(Session.equals(theID, "UserLikesIt")){
			Comments.update(
				{ _id: this._id},
				{$inc: {likesCount: -1}, $pull: {likers: Meteor.userId()}}				
			);
			CommentsMeta.update(
				{_id: metaId._id},
				{$inc: {totalLikes: -1}}
			)
		}
	},
	'click .delete_post': function() {
		//console.log('I ame here');
		Comments.remove({_id: this._id});
		CommentsMeta.update({_id: Session.get("CommentsMetaId")}, {'$inc': {totalComments: -1}});

	},
	'click #playPause':function(event,template){
		playPause();
	},
	'keypress #inputbox': function (e){ 
		//console.log("hey");
		if(e.charCode == 13) {		
			//console.log("how many times");
			var timestamp = Date.now();
			var commentText = $('#inputbox').val();
			if (commentText.length < 1) { return false; }
			Comments.insert({
					userId: Meteor.userId(),
					timestamp: timestamp,
					commentText: commentText,
					commentRunTime: Session.get ('sessionRunTime'),
					idString: Session.get("idString"),
					seriesTitle: Session.get("seriesTitle"),
					groupName: Session.get("groupName"),
					likesCount:0,
					likers:[]
				}, function(err, theId){
					//console.log(err);
					//console.log(theId);

				}
			);
			CommentsMeta.update(
					{_id: Session.get("CommentsMetaId")}, 
					{'$inc': {totalComments: 1}}
			);

			$('#inputbox').val("");
			event.preventDefault();
			event.stopPropagation();
			return false; 
		}
		
	},
	'change #thispicker': function(e){
		var theValue = parseInt( $('#thispicker :selected').val());
		Session.set("selectPicker", theValue);
	},
	'mouseenter .like_number': function(e){
		//console.log( e.target.id );
		$( "#" + e.target.id ).tooltip({ 
			position: { my: "top-55", at: "right center" } });
	},
	'change .selectpicker_timer': function(e){
			if(Session.equals("timerSetFromDropdown", 1)){
				Session.set("timerSetFromDropdown",0);
				return false;
			}
			Session.set("sliding", 0);
			Session.set("runTimeFromSlider",1);
			console.log(e.target.value);
			Session.set("sessionRunTime", parseInt(e.target.value));
			$('#timer').slider("value", e.target.value);
	}

});
Template.showverse.rendered = function ()
{
	$('.selectpicker_timer').selectpicker();
	$( "#timer" ).slider({
		range: "min",
		value: Session.get("sessionRunTime"),
		min: 1,
		max: 3600,
		stop: function( event, ui ) {
			var nearestSceneTimeStamp=0;
			Session.set("sliding", 0);
			Session.set("runTimeFromSlider",1);
			//console.log(Session.get("runTimeFromSlider"));
			Session.set("sessionRunTime", ui.value);
			setApplicableScene();
		},
		slide: function (event, ui) {
			Session.set("sliding", ui.value);				
		}
	});	
	// Assuming you're using jQuery 
   $('body').on('keydown',function(e) { 
   		if(Session.equals("timeOfPress",0) || Session.get("timeOfPress")+50 < Date.now()){
			if(e.which==32 && e.target.id!="inputbox"){
				e.preventDefault();
				playPause();				
				Session.set("timeOfPress", Date.now());					
			}
		}	
	});
   if(!Meteor.user().profile){
   		Session.set("nameForInserts", Meteor.user().username);
   		Session.set("imageForInserts", "/img/placeholder.jpg");
   } else{
   		Session.set("imageForInserts", Meteor.user().profile[0].picture);
   		Session.set("nameForInserts", Meteor.user().username);
   }
   if(CommentsMeta.find ({'userId': Meteor.userId()}).count()==0){
   		console.log("why am i here. line 220");

   		CommentsMeta.insert({
   			userId: Meteor.userId(),
   			idString: Session.get("idString"),
   			groupName: Session.get("groupName"),
   			totalComments: 0, 
   			totalLikes: 0, 
   		}, function(err, theId){
			//console.log(theId);
			//console.log("here");
			Session.set("CommentsMetaId", theId);

		}
	);

   } else {
   		var thePointer = CommentsMeta.findOne({'userId': Meteor.userId()});
		Session.set("CommentsMetaId", thePointer._id);
   }

		
}


//******* For Opening Modal *****************
Template.openingmodal.atotalCommentors = function(){
	var totalCommentors = CommentsMeta.find({totalComments: {$gt: 0}}).count();
	if ( totalCommentors == 1){
		return "One person has contributed to the to this episode.";
	} else if(totalCommentors ==0) {
		return "You will be the first to contribute to this episode.";
	} else {
		return totalCommentors  + " People contributed to this episode.";
	}
}

Template.openingmodal.commentorsList = function() {
	return CommentsMeta.find({totalComments: {$gt: 0}});
}
Template.openingmodal.totalCommentorsMessage = function(){
	var counter = CommentsMeta.find({totalComments: {$gt: 0}}).count();
	if (counter == 0 ){
		return "There are no previous commentors.";
	} else if (counter == 1){
		return "There is one previous commentor.";
	} else {
		return "There are " + counter + " previous commentors."; 
	}
}
Template.openingmodal.auserName = function() {
	var cursor = Meteor.users.findOne({_id: this.userId});
	return cursor.username;
}
Template.openingmodal.atotalComments = function() {
	return this.totalComments;
}
Template.openingmodal.rendered = function(){
	
//	if(Session.equals("modalShown", 0)){
//		Session.set("modalShown", 1);
		$('#episode_contribute_modal').modal('show');
		$('.selectpicker_timer').selectpicker();

//		console.log("here just once");
//	}
}



function playPause(){
	if (Session.equals("playPause", "glyphicon-play")){
		Session.set("playPause", "glyphicon-pause");
		startTimer();
	} else if (Session.equals("playPause", "glyphicon-pause")){			
		Session.set("playPause", "glyphicon-play");
		// figure out a way to pause here
		pauseTimer("set", true);
	}
}
var displayedRunTime = 0;
var atTimerStart = 0;
var pauseFlag = false;
var timeDifference = 0;
function startTimer(){
	//Lots to do to build this.
	//idea is every time play button is started, start a detailed timer at 0, 
	//synched to getTime. 
	//check every 50 ms if a full second has elapased (the difference between to getTimes
	// if a new second call the reactive elements) 
	//pauseTimer("set", false);
	var currentTime = Date.now();
	 if (atTimerStart == 0){
	 	atTimerStart  = Date.now();	 	
	 } else if (atTimerStart == -1 ){
	 	atTimerStart = Date.now() - timeDifference;
	 } else if (Session.equals("runTimeFromSlider", 1)) {
		//console.log( "I am" + Session.get("sessionRunTime"));
		atTimerStart = Date.now() - Session.get("sessionRunTime") * 1000;
		Session.set("runTimeFromSlider", 0);
	 }
	 timeDifference = currentTime - atTimerStart;
	 if (displayedRunTime !== Math.floor( timeDifference/1000)) {	
		displayedRunTime = Math.floor( timeDifference/1000 );
		Session.set("sessionRunTime", displayedRunTime);
		$('#timer').slider("value", displayedRunTime);
		if(_.indexOf(showMarkersArray, displayedRunTime)!==-1){
			$('.selectpicker_timer').selectpicker("val", displayedRunTime);
			$('.selectpicker_timer').selectpicker('render');
		}
	}
	if(pauseTimer("get")){
		pauseTimer("set", false);
		atTimerStart = -1;
		return false;
	} else {
		Meteor.setTimeout(startTimer, 50);
	}
}
function pauseTimer(setOrGet, yesOrNo){
	if (setOrGet=="set"){
		pauseFlag = yesOrNo;
		return;
	} else{
		return pauseFlag;
	}
}

function setApplicableScene(){
	//console.log(showMarkersArray);
	var currentApplicableScene=0;
	var currentApplicableSceneSet=0;
	for(var i=0; i<showMarkersArray.length; i++){
		if(Session.get("sessionRunTime")<=parseInt(showMarkersArray[i]) &&currentApplicableSceneSet==0){
			currentApplicableScene=showMarkersArray[i-1];	
			currentApplicableSceneSet=1;		
		}
	}
	if(currentApplicableSceneSet==0){currentApplicableScene=showMarkersArray[showMarkersArray.length-1]}
	$('.selectpicker_timer').selectpicker("val", currentApplicableScene);
	$('.selectpicker_timer').selectpicker('render');
	Session.set("timerSetFromDropdown", 1);

}


function inMinutesSeconds(seconds){
	var timeInSeconds=seconds;
	var hours = Math.floor(timeInSeconds / 3600);
	timeInSeconds -= hours * 3600;
	var minutes = Math.floor(timeInSeconds / 60);
	timeInSeconds -= minutes * 60;
	var seconds = parseInt(timeInSeconds % 60, 10);
	counterFormat = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
	return(counterFormat);			
}
