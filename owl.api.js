const request = require('superagent');
const fs = require('fs');
const {format} = require('date-fns');


const fetch = async (week)=>{
	const processPlayer = (stat)=>{
		const timeInTenMin = (stat.time_played_total / 60) / 10;
		return {
			name        : stat.name,
			role        : stat.role,
			week        : week,
			elims       : Math.round(stat.eliminations_avg_per_10m * timeInTenMin),
			deaths      : Math.round(stat.deaths_avg_per_10m * timeInTenMin),
			damage      : Math.round(stat.hero_damage_avg_per_10m * timeInTenMin),
			healing     : Math.round(stat.healing_avg_per_10m * timeInTenMin),
			ults        : Math.round(stat.ultimates_earned_avg_per_10m * timeInTenMin),
			final_blows : Math.round(stat.final_blows_avg_per_10m * timeInTenMin),
		}
	}
	return request(`https://api.overwatchleague.com/stats/players?stage_id=regular_season&season=2019`)
		.then((res)=>JSON.parse(res.text).data)
		.then((data)=>{
			fs.writeFileSync(`./backup/${format(new Date(), 'D-M-YYYY')} - OWL.json`, JSON.stringify(data, null, '\t'), 'utf8');
			return data;
		})
		.then((data)=>data.map(processPlayer))
};


const mergeData = (apiSource, historic, week)=>{
	//fitler out the current weeks data from historic
	const filteredHistoric = historic.filter((record)=>record.week != week);

	const normalizedApiData = apiSource.map((rawRecord)=>{
		//Get all the historic records for a single player
		const recordsByName = filteredHistoric.filter((record)=>record.name==rawRecord.name);
		return recordsByName.reduce((result, record)=>{
			const {name, role} = record;
			//Subtract off the historic values from the values from the API for Season stats
			return {
				week, name, role,
				elims       : result.elims - record.elims,
				deaths      : result.deaths - record.deaths,
				damage      : result.damage - record.damage,
				healing     : result.healing - record.healing,
				ults        : result.ults - record.ults,
				final_blows : result.final_blows - record.final_blows,
			}

		}, rawRecord);
	})

	//Merge normalized results back into the historic data
	return filteredHistoric.concat(normalizedApiData);
}

module.exports = {
	mergeData, fetch
}