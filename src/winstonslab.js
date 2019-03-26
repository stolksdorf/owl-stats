// https://www.winstonslab.com/fantasy/faq.php

const url = `https://www.winstonslab.com/customquery/comparePlayers/herodataJSON.php?dateGreater=2019-02-14&dateSmaller=2019-02-15&statsBy=1`

const request = require('superagent');
const HeroTypes = require('./heroes.js');
const fs = require('fs');

Object.prototype.map=function(fn){return Object.keys(this).map((key,idx,src)=>fn(this[key],key,idx,src))};
Object.prototype.reduce=function(fn, init){return Object.keys(this).reduce((a,key,idx,src)=>fn(a,this[key],key,idx,src),init);}


const eventId=130


// winstonslab.api.js
// hero types
//


const getData = async (date, eventId)=>{
	const res = await request(url);

	return JSON.parse(res.text).reduce((acc, entry)=>{
		if(!acc[entry.playername]) acc[entry.playername] = {
			tank    : getDefault(),
			support : getDefault(),
			dps     : getDefault(),
		};

		const type = HeroTypes[entry.hero];
		acc[entry.playername][type] = mergeStats(entry, acc[entry.playername][type]);
		return acc;
	}, {});
}

// const get = (entry)=>{
// 	return {
// 		hero          : entry.hero,
// 		heroType      : HeroTypes[entry.hero],
// 		playername    : entry.playername,
// 		kills         : Number(entry.kills),
// 		deaths        : Number(entry.deaths),
// 		ults          : Number(entry.ults),
// 		firstKills    : Number(entry.firstKills),
// 		firstDeaths   : Number(entry.firstDeaths),
// 		ressurections : Number(entry.ressurections),
// 	}
// }

const getDefault = ()=>{
	return {
		kills         : 0,
		deaths        : 0,
		ults          : 0,
		firstKills    : 0,
		firstDeaths   : 0,
		ressurections : 0,
	}
}

const mergeStats = (set1={}, set2={})=>{
	return {
		kills         : Number(set1.kills)         + Number(set2.kills),
		deaths        : Number(set1.deaths)        + Number(set2.deaths),
		ults          : Number(set1.ults)          + Number(set2.ults),
		firstKills    : Number(set1.firstKills)    + Number(set2.firstKills),
		firstDeaths   : Number(set1.firstDeaths)   + Number(set2.firstDeaths),
		ressurections : Number(set1.ressurections) + Number(set2.ressurections),
	}
}

const calculateFantastyPoints = (data)=>{

	data.dps.fantasyPoints =
		data.dps.kills       * 2 +
		data.dps.deaths      * -1 +
		data.dps.ults        * 1 +
		data.dps.firstKills  * 2 +
		data.dps.firstDeaths * -2 +
		data.support.ressurections * 0

	data.tank.fantasyPoints =
		data.tank.kills       * 2 +
		data.tank.deaths      * -1 +
		data.tank.ults        * 3 +
		data.tank.firstKills  * 4 +
		data.tank.firstDeaths * -1 +
		data.support.ressurections * 0


	data.support.fantasyPoints =
		data.support.kills       * 3 +
		data.support.deaths      * -1 +
		data.support.ults        * 3 +
		data.support.firstKills  * 4 +
		data.support.firstDeaths * -2 +
		data.support.ressurections * 1.5


	data.fantasyPoints =
		data.dps.fantasyPoints +
		data.tank.fantasyPoints +
		data.support.fantasyPoints;

	return data;
}


const run = async ()=>{
	let data = await getData();

	//let temp = data.filter((entry)=>entry.playername == 'Pine');


	data = data.map((player, name)=>{
		player.name = name;
		return calculateFantastyPoints(player);
	});



	fs.writeFileSync('data.json', JSON.stringify(data, null, '\t'));

}


run();