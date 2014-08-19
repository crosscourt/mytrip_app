Date.prototype.sameDay = function(d) {
	if (d == null) {
		return false;
	}

	return this.getFullYear() === d.getFullYear()
		&& this.getDate() === d.getDate()
		&& this.getMonth() === d.getMonth();
}

Date.prototype.toYYYYMMDDHHMM = function () {
	var yyyy = this.getFullYear().toString();
	var MM = pad(this.getMonth() + 1,2);
	var dd = pad(this.getDate(), 2);
	var hh = pad(this.getHours(), 2);
	var mm = pad(this.getMinutes(), 2)
	//var ss = pad(this.getSeconds(), 2)

	return yyyy + MM + dd+  hh + mm; // + ss;
};

Date.fromYYYYMMDDHHMM = function(d) {
	return new Date(d.slice(0, 4), d.slice(4, 6) - 1, d.slice(6, 8),
		d.slice(8, 10), d.slice(10, 12), d.slice(12, 14))
}

function pad(number, length) {

	var str = '' + number;
	while (str.length < length) {
		str = '0' + str;
	}

	return str;
}

Date.prototype.getDisplayDateTime = function (callback, error) {
	navigator.globalization.dateToString(
		this,
		function (dateResult) {
			callback(dateResult.value);
		},
		function () {
			error('Error getting dateString');
		},
		{formatLength:'short', selector:'date and time'}
	);
}