const mongoose = require('mongoose');

const ProjectSettingsSchema = mongoose.Schema({

					_id    : mongoose.Schema.Types.ObjectId,
					key    : String,
					Secret : String,
					bucket : String,
					region : String,
					type   : String,

});

module.exports = mongoose.model('projectSettings',ProjectSettingsSchema);
