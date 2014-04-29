Session.setDefault("commentForDiscussion", Meteor.userId());
Template.discussionmodal.helpers({ 
	commentForDiscussion: function(){
		return Comments.findOne({_id: Session.get("commentForDiscussion")});
	},
	commentorPhoto: function(){
		var theUser = Meteor.users.findOne({_id: this.userId});
		return theUser.profile[0].picture;
	},
	commentorName: function(){
		var theUser = Meteor.users.findOne({_id: this.userId});
		return theUser.username;
	},
	commentText: function(){
		return this.commentText;
	},
	commentRunTime: function(){
		return inMinutesSeconds(this.commentRunTime);
	},
	numberLikes: function(){
		return this.likers.length;
	},
	numberReplies: function(){
		if(this.discussions!=undefined && this.discussions.length >0){
			return this.discussions.length;
		} 
		return "0";
	},
	currentUserPhoto: function(){
		return Meteor.user().profile[0].picture;
	},
	discussionItems: function(){	
		var holder = Comments.findOne({_id: Session.get("commentForDiscussion")});
		if(holder == undefined || holder.discussions == undefined){
			return false;
		} else {
			return holder.discussions.sort(function(a,b){return b.discussionItem.timestamp-a.discussionItem.timestamp});
		}	
	},
	discussionItemusername: function(){
		return userNameFromId(this.discussionItem.userId);
	},
	discussionItemUserPhoto: function(){
		return userPhotoFromId(this.discussionItem.userId);
	},
	discussionItemText: function(){
		return this.discussionItem.discussionText;
	},
	discussionItemEnterTime: function(){
		var d = new Date();
		d.setTime(this.discussionItem.timestamp);
		return( months[d.getMonth()] +  " " + d.getDate() + " " + d.getHours() + ":" + fixMinutes(d.getMinutes()) );
	}
});


Template.showverse.events({
	'keypress #discussionEnter': function(e){
		var discussionText = $('#discussionEnter').val();

		if(e.charCode == 13 && e.shiftKey) {		

			var content = this.value;
           	var caret = getCaret(this);
       		this.value = content.substring(0,caret)+"\n"+content.substring(carent,content.length-1);
      		event.stopPropagation();
		} else if (e.charCode == 13){

			Comments.update(
				{
					_id: Session.get("commentForDiscussion")
				},
				{
					$push: {
						discussions: {
							discussionItem: {
								userId: Meteor.userId(),
								timestamp: Date.now(),
								discussionText: discussionText
							}
						}
					}
				}
			);
			e.preventDefault();
			e.stopPropagation();
			$('#discussionEnter').val("");
			return false;

		}
	}
});


function getCaret(el) { 
  if (el.selectionStart) { 
    return el.selectionStart; 
  } else if (document.selection) { 
    el.focus(); 

    var r = document.selection.createRange(); 
    if (r == null) { 
      return 0; 
    } 

    var re = el.createTextRange(), 
        rc = re.duplicate(); 
    re.moveToBookmark(r.getBookmark()); 
    rc.setEndPoint('EndToStart', re); 

    return rc.text.length; 
  }  
  return 0; 
}