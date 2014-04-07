Template.admin_edit_series.editableSeries = function() {
	return Series.find({});
}
Template.admin_edit_series.seriesTitle = function() {
	return this.seriesTitle;
}
Template.admin_edit_series.editingDoc = function () {
  return Series.findOne({_id: Session.get("seriesId")});
}
Template.admin_edit_series.events ({
	'click .popForm': function(){
		Session.set("seriesId", this._id);
		console.log(this._id);
	}
});