
class ItemGrouper {
	map(items) {
		var results = new Array(items.length).fill(0);

		for (var i = 0; i < items.length; i++) {
			var val = Number.parseInt(items[i]);

			results[i] += val;
			results[i - 1] += val;
			results[i - 2] += val;
		}

		results.length = items.length;
		return results;
	}
}

module.exports = ItemGrouper;