
const multipliers = {
	offense : {
		elims       : 2,
		deaths      : -2,
		damage      : 0.0011,
		healing     : 0,
		ults        : 0,
		final_blows : 0,
	},
	tank : {
		elims       : 1,
		deaths      : -1,
		damage      : 0.001,
		healing     : 0,
		ults        : 3,
		final_blows : 0,
	},
	support : {
		elims       : 1,
		deaths      : -1,
		damage      : 0.001,
		healing     : 0.00125,
		ults        : 1,
		final_blows : 1,
	},
}

//TODO: change this to a single record
// module.exports = (records)=>{
// 	return records.map((record)=>{
// 		const {name, role, week} = record;
// 		const mults = multipliers[role];

// 		const points = ['elims','deaths','damage','healing','ults','final_blows'].reduce((total, stat)=>{
// 			return total + Math.round(record[stat] * mults[stat]);
// 		}, 0);

// 		return { name, role, week, points };
// 	});
// };


module.exports = (record)=>{
	const mults = multipliers[record.role];
	return ['elims','deaths','damage','healing','ults','final_blows'].reduce((total, stat)=>{
		return total + Math.round(record[stat] * mults[stat]);
	}, 0);
};

