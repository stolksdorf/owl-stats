const Players = require('./players.json');
const fs = require('fs');

let res = [];

const roles = {
	tank : 'Tank',
	support : 'Support',
	offense : 'Offense',
}

Players.competitors.map((temp)=>{
	const competitor = temp.competitor
	const team = competitor.name;

	competitor.players.map((temp2)=>{
		const player = temp2.player;
		//console.log(player);

		res.push([
			player.headshot,
			player.name,
			roles[player.attributes.role],
			team
		].join('\t'))
	})
});

fs.writeFileSync('./players.txt', res.join('\n'), 'utf8');