module.exports = {
	toTSV : (json)=>{
		const columns = Object.keys(json[0]);
		return columns.join('\t') + '\n' +
			json.map((entry)=>{
				return columns.map((fieldName)=>entry[fieldName]).join('\t');
			}).join('\n');
	},
	fromTSV : (tsv)=>{
		const [firstRow, ...rest] = tsv.split('\n');
		const columns = firstRow.split('\t');
		return rest.map((line)=>{
			const fields = line.split('\t');
			return columns.reduce((acc, name, idx)=>{
				acc[name] = fields[idx];
				return acc;
			}, {})
		});
	}
};