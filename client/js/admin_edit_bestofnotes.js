Template.admin_edit_bestofnotes.helpers({
	bestOfNotes: function(){
		return Bestof.find();
	}
});
Template.admin_edit_bestofnotes.events ({
	'click .updateNote': function(){
		console.log(this._id);
		Session.set("bestOfId", this._id);
	}
});
Template.admin_edit_bestofnotes.editingDoc = function () {
  return Bestof.findOne({_id: Session.get("bestOfId")});
};