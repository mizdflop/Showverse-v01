Session.set("playPause", "glyphicon-play");
Session.set("unseenUsers", []);
Session.set("selectPicker", 1);
Session.setDefault("sessionRunTime", 0);
Session.setDefault("isSliding", 0);
Session.set("sliderInitialized", 0)
Session.set("timeOfPress",0);
Session.set("modalShown", 0);
dataArray = [];
postId="";
months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
weekday=new Array(7);
weekday[0]="Sunday";
weekday[1]="Monday";
weekday[2]="Tuesday";
weekday[3]="Wednesday";
weekday[4]="Thursday";
weekday[5]="Friday";
weekday[6]="Saturday";
Template.showverse.theComments = function() {
	k=0;
	//console.log(Session.get("unseenUsers"));
	if (Session.get("selectPicker")== 1){
		return Comments.find(
			{
				idString: Session.get("idString"), 
				seriesTitle: Session.get("seriesTitle"),
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
			{ $or:
           		[
            		{
						idString: Session.get("idString"), 
						seriesTitle: Session.get("seriesTitle"),
						commentRunTime: {$lte: Session.get("sessionRunTime")},
						userId: {$nin:  Session.get("unseenUsers") }, 
						likesCount: {$gt: 0}
					},
					{
						idString: Session.get("idString"), 
						seriesTitle: Session.get("seriesTitle"),
						commentRunTime: {$lte: Session.get("sessionRunTime")},
						type: "sceneMarker"						
					}
				]
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
		return Comments.find({userId: {$exists: true}}).count();
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
		return _.pluck(Meteor.users.find({_id: this.userId}, {fields: {username: 1}}).fetch(), 'username');
	},
	commentText: function(){
  		return this.commentText;
	},
	commentRunTime: function(){
		return inMinutesSeconds(this.commentRunTime);
	},
	total_likes: function() {
		return this.likers.length;		
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
	hiddenUsers: function(){
		var theUnseen = Session.get("unseenUsers");
		return theUnseen.length;
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
		var epHolder = Episodes.findOne({idString: Session.get("idString"), seriesTitle: Session.get("seriesTitle")});
		epHolder.showMarkers.sort(function(a,b){return a.timestamp-b.timestamp});
		Session.set("showMarkers", epHolder.showMarkers);
		return epHolder.showMarkers;
	},
	timestamp: function(){
		return this.timestamp;
	},
	formatedTimeStamp: function(){
		return this.showMarker;
	},
	isSelected: function(){
		if(this.isSelected){
			return this.isSelected;
		}
	},
	showMarker: function(){
		return inMinutesSeconds(this.timestamp);
	},
	writeSceneMarker: function(){
		if(this.type=="sceneMarker"){
			//Session.set("currentSceneMarker", this.marker)
			return true;
		}
	},
	commentsInScene: function(){
		var nextMarker = Comments.findOne(
							{
								type: "sceneMarker",
								seriesTitle: Session.get("seriesTitle"),
								idString: Session.get("idString"),
								commentRunTime: {$gt: this.commentRunTime}
							},
							{sort: 
								{commentRunTime: 1}, 

							}
						);
		if(nextMarker==undefined){
			var commentsInScene = Comments.find(
								{
									type: {$exists: false},
									seriesTitle: Session.get("seriesTitle"),
									idString: Session.get("idString"),
									commentRunTime: {$gt: this.commentRunTime}
								}	
								).count();


		} else {
			var commentsInScene = Comments.find(
								{
									type: {$exists: false},
									seriesTitle: Session.get("seriesTitle"),
									idString: Session.get("idString"),
									commentRunTime: {$gt: this.commentRunTime, $lt: nextMarker.commentRunTime}
								}	
								).count();
		}
		return commentsInScene; 
	},
	sceneRuntime: function(){
		return inMinutesSeconds(this.commentRunTime);
	},
	sceneMarker: function(){
		return this.marker;
	},
	currentSceneMarker: function(){
		return Session.get("currentSceneMarker");
	},
	hasComments: function(){
		if(this.discussions!=undefined && this.discussions.length >0){
			return true;
		}
		return false;
	},
	numberReplies: function(){
		if(this.discussions!=undefined && this.discussions.length >0){
			return this.discussions.length;
		} 
		return "0";
	}

});

Template.showverse.events({
	'click .like_button, click .like_number' : function() {
		console.log(this._id);
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
		Comments.remove({_id: this._id});
		CommentsMeta.update({_id: Session.get("CommentsMetaId")}, {'$inc': {totalComments: -1}});

	},
	'click #playPause':function(event,template){
		playPause();
	},
	'keypress #inputbox': function (e){ 
		//console.log("hey");
			if(e.charCode == 13) {		
			var timestamp = Date.now();
			var commentText = $('#inputbox').val();
			//is there an @mention in the post
			//find out who was mentioned,
			//add into CommentsMets
			if(commentText.indexOf("@")!= -1 ){
				var mentions=[];
				var wordsArray = commentText.split(" ");
				for(var i=0; i<wordsArray.length; i++){
					if(wordsArray[i].indexOf("@") === 0 ){
						//see if the @mention relates to 
						//someone in the Users collection,
						//but first strip the @
						wordsArray[i]=wordsArray[i].replace("_", " ");
						var forQuery = wordsArray[i].substr(1);
						var result = Meteor.users.findOne({username: forQuery});
						if( result!=undefined ){ // this is a valid @mention
							mentions.push( result._id);
							//format the metion with <strong>
							wordsArray[i] = "<strong>" + wordsArray[i] + "</strong>";
						}
					}
				}
				commentText = wordsArray.join(" ");
			}
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
					likers:[],
					mentions: mentions
				}, function(err, theId){
					if(mentions.length >0){
						for(var i=0; i<mentions.length; i++){
							var tempResult = CommentsMeta.findOne({userId: mentions[i], idString: Session.get("idString"), groupName: Session.get("groupName")});
							CommentsMeta.update(
								{_id: tempResult._id},
								{$push: {mentionedIn: theId}}
							);
						}
					}
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
		if(Session.get("setFromForm")==0){
			return false;
		}
		//console.log(parseInt(e.target.value));
		Session.set("sessionRunTime", parseInt(e.target.value));
		Session.set("runTimeFromSlider", 1)
		$('#timer').slider("value", e.target.value);
		$( ".comment_list" ).scrollTop( 0 );
	},
	'click .right_replies, click .reply_count, click .reply_button, click .replies_number': function(){
		Session.set("commentForDiscussion", this._id);
		$('.replies_modal').modal('show');
	}

});
Template.showverse.rendered = function ()
{
	Session.set("sessionRunTime",0);
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
		},
		slide: function (event, ui) {
			Session.set("sliding", ui.value);				
		}
	});	
	// Assuming you're using jQuery 
   $('body').on('keydown',function(e) { 
   		if(e.which==32 && e.target.id!="inputbox" && e.target.id !="discussionEnter"){
			e.preventDefault();
			playPause();				
		}	
	});
	$("#inputbox")
	.bind("keydown", function(event) {
		//console.log( $('#ui-id-1').is(":visible") );
	    if (event.keyCode === $.ui.keyCode.TAB && $('#ui-id-1').is(":visible")) {
	        event.preventDefault();
	    }
	}).autocomplete({
	    minLength: 0,
	    source: function(request, response) {
	        var term = request.term,
	            results = [];
	        if (term.indexOf("@") >= 0) {
	            term = extractLast(request.term);
	            if (term.length > 0) {
	                results = $.ui.autocomplete.filter(
	                availableTags, term);
	            } else {
	                results = [startTyping];
	            }
	        }
	        response(results);
	    },
	    focus: function() {
	        return false;
	    },
	    select: function(event, ui) {
	        if (ui.item.value !== startTyping) {
	            var terms = this.value.split(' ');
	            terms.pop();
	            terms.push("@" + ui.item.value);
	            //terms.push("[@" + ui.item.value + "]");
	            this.value = terms.join(" ");
	            console.log(this.value);
	        }
	        return false;
	    }
	 });

   // Make sure user isn't totally nnw. if he is, give
   // him a document in CommentsMeta
   if(!Meteor.user().profile){
   		Session.set("nameForInserts", Meteor.user().username);
   		Session.set("imageForInserts", "/img/placeholder.jpg");
   } else{
   		Session.set("imageForInserts", Meteor.user().profile[0].picture);
   		Session.set("nameForInserts", Meteor.user().username);
   }
   if(CommentsMeta.find ({'userId': Meteor.userId()}).count()==0){
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
Deps.autorun(function() {	
	var runtime = Session.get("sessionRunTime");
	var markers = Session.get("showMarkers");
	var currentMarker=0;
	for(var p in markers){
		if(markers[p].timestamp<=runtime){
			//console.log( inMinutesSeconds(markers[p].timestamp ));
			currentMarker = markers[p].timestamp;
			Session.set("currentSceneMarker", markers[p].showMarker);
			Session.set("nextSceneTimeStart", markers[p].timestamp);
		}
	}
	Session.set("setFromForm", 0);
	$('.selectpicker_timer').selectpicker("val", currentMarker);
	$('.selectpicker_timer').selectpicker('render');
	Session.set("setFromForm", 1);

});

Deps.autorun(function(){
   var currentTime = Session.get("sessionRunTime");
   //need to create an active list of users for this set of comments
   	var forCommentorsList= CommentsMeta.find({groupName: Session.get("groupName"), idString: Session.get("idString")}).fetch();
	var theUserIds = _.pluck(forCommentorsList, "userId");
	var theUserNames=[];
	for(var i=0; i<theUserIds.length; i++){
		var theHolder = Meteor.users.findOne({_id: theUserIds[i]});
		theUserNames.push( theHolder.username.replace(" ", "_") );
	}
	availableTags = theUserNames;
	//for testing
});

inMinutesSeconds = function(seconds){
	var timeInSeconds=seconds;
	var hours = Math.floor(timeInSeconds / 3600);
	timeInSeconds -= hours * 3600;
	var minutes = Math.floor(timeInSeconds / 60);
	timeInSeconds -= minutes * 60;
	var seconds = parseInt(timeInSeconds % 60, 10);
	counterFormat = (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
	return(counterFormat);			
}
userNameFromId = function(userId){
	var holder = Meteor.users.findOne({_id: userId});
	return holder.username;
}
userPhotoFromId = function(userId){
	var holder = Meteor.users.findOne({_id: userId});
	return holder.profile[0].picture;	
}
fixMinutes = function(minutes){
	if(parseInt(minutes) < 10){
		minutes = "0" + minutes;
	} 
	return minutes;
}
var availableTags;


var startTyping = "Start typing...";

function split(val) {
    return val.split(/@/);
}

function extractLast(term) {
    return split(term).pop();
}