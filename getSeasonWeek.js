const {differenceInCalendarDays} = require('date-fns');
const SEASON_START = new Date(2019, 1, 12);

module.exports = (target = new Date())=>{
	const diff = differenceInCalendarDays(target, SEASON_START);
	return Math.floor(diff / 7) + 1;
};
