const fs = require('fs');
const request = require('superagent');


const save = (name, data)=>{
	fs.writeFileSync(`./${name}.json`, JSON.stringify(data, null, '\t'))
	return data;
}



const processPlayer = (stat)=>{
	const timeInTenMin = (stat.time_played_total / 60) / 10;

	return {
		name        : stat.name,
		role        : stat.role,
		elims       : Math.round(stat.eliminations_avg_per_10m * timeInTenMin),
		deaths      : Math.round(stat.deaths_avg_per_10m * timeInTenMin),
		damage      : Math.round(stat.hero_damage_avg_per_10m * timeInTenMin),
		healing     : Math.round(stat.healing_avg_per_10m * timeInTenMin),
		ults        : Math.round(stat.ultimates_earned_avg_per_10m * timeInTenMin),
		final_blows : Math.round(stat.final_blows_avg_per_10m * timeInTenMin),
	}
}


const averagePerRole = (role, data)=>{
	const players = data.filter((player)=>player.role == role);
	const total = players.reduce((acc, player)=>{
		return {
			elims       : (acc.elims || 0) + player.elims,
			deaths      : (acc.deaths || 0) + player.deaths,
			damage      : (acc.damage || 0) + player.damage,
			healing     : (acc.healing || 0) + player.healing,
			ults        : (acc.ults || 0) + player.ults,
			final_blows : (acc.final_blows || 0) + player.final_blows
		}
	},{});

	return {
		elims       : Math.round(total.elims / players.length),
		deaths      : Math.round(total.deaths / players.length),
		damage      : Math.round(total.damage / players.length),
		healing     : Math.round(total.healing / players.length),
		ults        : Math.round(total.ults / players.length),
		final_blows : Math.round(total.final_blows / players.length),
	}
}



const getDataForYear = (year)=>{
	return request(`https://api.overwatchleague.com/stats/players?stage_id=regular_season&season=${year}`)
		.then((res)=>JSON.parse(res.text))
		.then((res)=>res.data)
		.then((data)=>save(`${year}raw`, data))

		.then((data)=>data.map(processPlayer))
		.then((data)=>save(`${year}stats`, data))

		.then((data)=>{
			return {
				offense : averagePerRole('offense', data),
				support : averagePerRole('support', data),
				tank : averagePerRole('tank', data),
			}
		})
		.then((data)=>save(`${year}avg`, data))
}
getDataForYear(2018)
//getDataForYear(2019)