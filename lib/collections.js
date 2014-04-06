Series = new Meteor.Collection("series", {
    schema: {
        seriesTitle: {
            type: String,
            label: "Title",
            max: 200
        },
        createdBy: {
            type: String,
            label: "Created By"
        },
        network: {
            type: String,
            label: "Airing network"
        },
        startAirDate: {
            type: Date,
            label: "Air date of first episode "
        },
        endAirDate: {
            type: Date,
            label: "Air date of last episode "
        },
        currentlyAired: {
            type: Boolean,
            label: "Sill on the Air? "
        },
        seriesDescription: {
            type: String,
            label: "Brief summary"
        },
        numberSeasons: {
          type: Number,
          label: "Total number of seasons"
        },
        numberEpisodes: {
          type: Number,
          label: "Total number of episodes."
        },
        seriesImage: {
          type: String,
          label: "image name (assuming lives in img folder"
        }

    }
});
Episodes = new Meteor.Collection("episodes", {
    schema: {
      seriesId: {
        type: String,
        label: "Fk from Series",
      },
      seriesTitle: {
        type: String,
        label: "Name of the Series"
      },
      seasonNumber: {
        type: Number
      },
      episodeNumber: {
        type: Number
      },
      idString: {
        type: String,
        label: "For example S1-Ep1"
      },
      episodeAirDate:{
        type: Date
      },
      episodeRunTime: {
        type: Number,
        label: "Runtime in Seconds"
      },
      episodeTitle: {
        type: String
      },
      episodeDescription: {
        type: String
      },
      episodeImage: {
        type: String
      },
      imdbRating: {
        type: String
      }
    }

});

Groups = new Meteor.Collection("groups", {
  schema: {
    groupName: {
      type: String
    },
    groupDesc: {
      type: String
    },
    groupURL: {
      type: String
    }
  }
});
CommentsMeta = new Meteor.Collection("commentsmeta");
Comments = new Meteor.Collection("comments");

