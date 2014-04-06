Template.modal.events({
	'change .checkbox': function(e){
		var toExclude = Session.get("unseenUsers");
		console.log(this.userId)
		if( $(e.target).is(':checked')){
			var index = toExclude.indexOf(this.userId);
			toExclude.splice(index,1);
		} else{
			toExclude.push(this.userId);
		}
		Session.set("unseenUsers", toExclude);
		console.log( Session.get("unseenUsers"));
	}
	

});
