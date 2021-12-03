
class ListCounter {
	increased(items) {
		var prev = Number.MAX_SAFE_INTEGER;

		var increased = 0;

		items.forEach(element => {
			var curr = Number.parseInt(element);
			if (curr > prev) {
				increased++;
			}

			prev = curr;
		});

		return increased;
	}
}

module.exports = ListCounter;