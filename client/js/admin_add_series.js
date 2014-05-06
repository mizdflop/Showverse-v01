Template.admin_add_series.events({
	'change #pickSeries': function(e){
		console.log(e.target.value);
		$("[name='seriesId']").val(e.target.value);
	}
});