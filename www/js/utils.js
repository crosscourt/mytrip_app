Date.prototype.sameDay = function(d) {
  return this.getFullYear() === d.getFullYear()
	&& this.getDate() === d.getDate()
	&& this.getMonth() === d.getMonth();
}