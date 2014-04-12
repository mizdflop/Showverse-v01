Template.layout.events({
	'click .logout_btn': function(){
		if(Meteor.userId()){
			Meteor.logout( function() {
				Router.go("/");
			});					
		} else{
			Router.go("/");
		}

	}
});
Template.layout.logInOut = function() {
	if(Meteor.userId()){
		return "Logout";
	} else{
		return "Login";
	}
};
Template.layout.myusername = function() {
	return Meteor.user().username;
};