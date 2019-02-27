const OWL = require('./owl.api.js');
const Gist = require('./gist.api.js');
const tsv = require('./tsv.convert.js');

const fs = require('fs');


const calculateFantasy = require('./fantasyPoints.js');
const getWeek = require('./getSeasonWeek.js');
const currentWeek = `Week ${getWeek()}`


const saveJSON = (name, data)=>fs.writeFileSync(name, JSON.stringify(data, null, '\t'), 'utf8');
const saveTSV = (name, data)=>fs.writeFileSync(name, tsv.toTSV(data), 'utf8');


console.log('Fetching Season Stast from OWL: ', currentWeek);

OWL.fetch(currentWeek)
	.then((seasonData)=>{
		saveJSON(`./backup/week${getWeek()}-raw.json`,seasonData);
		saveTSV(`./backup/week${getWeek()}-raw.tsv`, seasonData);

		console.log('Fetching stats from gist');
		return Gist.fetchStats()
			.then((snapshots)=>{
				return OWL.mergeData(seasonData, snapshots, currentWeek);
			})

	})
	.then((updatedSnapshots)=>{
		console.log('Updating gist with new stats');
		saveTSV(`./backup/season_stats.tsv`, updatedSnapshots);
		return Gist.updateStats(updatedSnapshots)
			.then(()=>updatedSnapshots)
	})
	.then((data)=>{
		const points = data.map((record)=>{
			return {
				name : record.name,
				week : record.week,
				points : calculateFantasy(record)
			}
		});
		console.log('Updating gist with new points');
		saveTSV(`./backup/fantasy_points.tsv`, points);
		return Gist.updatePoints(points);
	})
	.then(()=>{
		console.log('DONE!');
	})
	.catch((err)=>console.log(err))





