
Template.homepage.buttonPlacement = function (){
	if(Meteor.loggingIn()){
		return "Waiting on Facebook for login";
	}
	else if(!Meteor.user()){
		return 'Please continue to the <a href="/login">login page</a>.';
	} else {
		return "Please <a href='/group/nattercast/Deadwood/''>choose an episode</a>."
	}

}
