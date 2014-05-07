var isActive = 0;
Template.clipper.helpers({
	longNote: function(){
		var holder = Episodes.findOne();
		return holder.showMarkers;
	},
	active: function(){
		if(isActive==0){
			Session.set("associatedWithScene", this.timestamp);
			isActive++;
			return "active";
		}
	},
	notesForScene: function(){
		return Bestof.find({associatedWithScene: Session.get("associatedWithScene"), bestOfType: "Longread" });
	},

	
});
Template.clipper.rendered = function(){
	$('#carousel-example-generic').on('slid.bs.carousel', function () {
		var theTimestamp = $('.active').attr('value');
		Session.set("associatedWithScene", parseInt(theTimestamp));
	});
}