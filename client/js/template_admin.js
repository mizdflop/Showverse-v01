if(Meteor.isClient){
  Template.fksToSeries.seriesInDb = function (){
    return Series.find();
  }
  Template.fksToSeries.seriesId = function (){
    return this._id;
  }
  Template.fksToSeries.seriesTitle = function (){
    return this.seriesTitle;
  }
}