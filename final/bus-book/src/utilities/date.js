const getFormattedDate = (date) => {
	if (!date) return "-";
	const d = new Date(date);
	if (isNaN(d.getTime())) return date;
	const year = d.getFullYear();
	const month = d.getMonth() + 1;
	const day = d.getDate();
	return `${day}/${month}/${year}`;
};

const formatReadableDate = (date) => {
	if (!date) return "-";
	const d = new Date(date);
	if (isNaN(d.getTime())) return String(date);
	return d.toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
};

export { getFormattedDate, formatReadableDate };
