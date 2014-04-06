Template.thanksupload.yourPicture = function(){
	if(Meteor.user().profile!==undefined && Meteor.user().profile[0].picture !== undefined){
		return Meteor.user().profile[0].picture;
	}
}