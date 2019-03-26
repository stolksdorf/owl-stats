const config = require('../config');
const tsv = require('./tsv.convert.js');
const request = require('superagent');


const gist = async (verb, data={})=>{
	return request
		[verb](`https://api.github.com/gists/${config.get('gist.id')}`)
		.send(data)
		.set('Accept', 'application/vnd.github.v3+json')
		.set('Authorization', `token ${config.get('gist.token')}`)
		.then((response)=>{
			return response.body
		})
};

module.exports = {
	fetchStats : async ()=>{
		return gist('get')
			.then((res)=>{
				return tsv.fromTSV(res.files['season_stats.tsv'].content)
			})
	},

	updateStats : async (newStats)=>{
		return gist('patch', {
			files : {
				'season_stats.tsv' : {
					content : tsv.toTSV(newStats)
				}
			}
		})
	},

	updatePoints : async (newPoints)=>{
		return gist('patch', {
			files : {
				'fantasy_points.tsv' : {
					content : tsv.toTSV(newPoints)
				}
			}
		})
	},

	test : async ()=>{
		return gist('patch', {
			files : {
				'temp.md' : {
					content : 'yo'
				}
			}
		})
	}
}