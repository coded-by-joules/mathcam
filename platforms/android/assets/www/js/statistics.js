// class for statistical computations
(function (obj) {

	// private methods for the Statistic class
	var roundOff = function (number) {
		return Math.round(number * 100) / 100;
	};

	// privates
	var getMidpoint = function (minVal, maxVal) {
		return roundOff((minVal + maxVal) / 2);
	};

	var getMedianGroup = function (group) {
		var numberlist = [],
			rowCount = group.items.length;

		for (var i = group.items[0].minValue; i <= group.items[rowCount-1].maxValue; i++) {
			numberlist.push(i);
		}

		var median = (new Statistic.Ungrouped(numberlist)).Median(),
			median_index = -1;

		
		for (var j = 0; j < rowCount; j++) {
			var upper_class_boundary = group.items[j].maxValue + 0.4;
			if (group.items[j].lowerClassBoundary >= median && median <= upper_class_boundary) {
				median_index = j;
				break;
			}
		}

		return median_index;
	};

	var getModalGroups = function (group) {
		var largest = 0,
			large_groups = [],
			rowCount = group.items.length;

		for (var i = 0; i < rowCount; i++) {
			if (largest <= group.items[i].frequency) {
				largest = group.items[i].frequency;
			}
		}

		for (var j = 0; j < rowCount; j++) {
			if (largest === group.items[j].frequency)
				large_groups.push(j);
		}

		return large_groups;
	};

	// class itself
	var Statistic = {
		// class for ungrouped data
		Ungrouped: function (numbers_list) {
			this.numbers = numbers_list;
			this.num_count = numbers_list.length;
		},

		// class for grouped data
		Grouped: function (groupData) {
			this.GroupedData = groupData;

			// calculate the following data fields to alter the groupedData
			var rows = this.GroupedData.items.length,
				sum_mid_freq = 0;

			for (var i = 0; i < rows; i++) {
				var currentItem = this.GroupedData.items[i];
				// get midpoint
				this.GroupedData.items[i].midpoint = getMidpoint(currentItem.minValue, currentItem.maxValue);

				// get mid * frequency value
				this.GroupedData.items[i].midxfreq = this.GroupedData.items[i].midpoint * currentItem.frequency;
				sum_mid_freq = sum_mid_freq + this.GroupedData.items[i].midxfreq;

				// get lower class boundary
				this.GroupedData.items[i].lowerClassBoundary = currentItem.minValue - 0.5;
			}

			this.GroupedData.SumMidxFreq = sum_mid_freq;
		}
	};


	// methods for Ungrouped class
	Statistic.Ungrouped.prototype.Mean = function () {
		var sum = 0;

		for (var i = 0; i < this.num_count; i++) {
			sum = sum + parseInt(this.numbers[i]);
		}
		var mean = sum / this.num_count;

		return Math.round(mean * 100) / 100;
	};

	Statistic.Ungrouped.prototype.Median = function () {
		var nums = this.numbers.sort(),
			len = nums.length,
			median = 0;

		if (len % 2 === 0 ) {
			var mid_elem = Math.floor(len/2);
			median = roundOff((parseInt(nums[mid_elem]) + parseInt(nums[mid_elem+1]))/2);
		}
		else {
			median = nums[Math.floor(len/2)];
		}

		return median;			
	};

	Statistic.Ungrouped.prototype.Mode = function () {
		var collection = {},
			large_count = 0,
			largest = 0;
			

		for (var i = 0; i < this.num_count; i++) {
			if (isNaN(collection["a" + this.numbers[i]]))
				collection["a" + this.numbers[i]] = 0;

			collection["a" + this.numbers[i]]++;
			if (collection["a" + this.numbers[i]] >= large_count) {
				large_count = collection["a" + this.numbers[i]];
				largest = this.numbers[i];
			}
		}

		if (large_count == 1)
			largest = 0;

		return largest;
	};

	Statistic.Ungrouped.prototype.StandardDeviation = function () {
		var mean = this.Mean(),
			subtracted = [];

		for (var i = 0; i < this.num_count; i++) {
			var item = Math.pow((parseInt(this.numbers[i]) - mean), 2);
			subtracted.push(item);
		}
		var sub_mean = this.Mean();
		return roundOff(Math.sqrt(sub_mean));
	};

	// groups the raw data, returns Grouped object
	Statistic.Ungrouped.prototype.GroupData = function () {
		var u_numbers = this.numbers.sort(),
			u_length = u_numbers.length,
			minvalyu = parseInt(u_numbers[0]),
			maxvalyu = parseInt(u_numbers[u_length-1]),
			g_numbers = [],
			rows;

		console.log(u_numbers);
		// interval depends on how many numbers the data have
		if (u_length >= 30)
			rows = 5;
		else if (u_length >= 20 && u_length < 30)
			rows = 4;
		else if (u_length >= 10 && u_length < 20)
			rows = 3;
		else
			rows = 2;

		// initialize table
		var intval = Math.round((maxvalyu - minvalyu) / rows);
		for (var i = minvalyu; i <= maxvalyu; i += intval) {
			var data = {
				range: i.toString() + "-" + (i+(intval-1)).toString(),
				minValue: i.toString(),
				maxValue: (i+(intval-1)).toString(),
				frequency: 0
			};			

			g_numbers.push(data);
		}

		// populate data
		var rowCount = g_numbers.length;
		console.log(rowCount);
		for (var j = 0; j < u_length; j++) {
			var number = parseInt(u_numbers[j]);
			
			for (var k=0; k < rowCount; k++) {
				var startrange = g_numbers[k].minValue,
					endrange = g_numbers[k].maxValue;

				//console.log(g_numbers[k].frequency);
				if (startrange <= number && number <= endrange) {
					g_numbers[k].frequency = g_numbers[k].frequency + 1;
					break;
				}
			}
		}

		return (new Statistic.Grouped({
			items: g_numbers,
			numberCount: u_length,
			interval: intval
		})).GetGroupedData();
	};

	// methods for Grouped class
	Statistic.Grouped.prototype.Mean = function () {
		return roundOff(this.GroupedData.SumMidxFreq / this.GroupedData.numberCount);
	};

	Statistic.Grouped.prototype.Median = function () {
		var median_group_index = getMedianGroup(this.GroupedData),
			total_freq_before_median = 0;

		// calculate total frequency before the median group
		for (var i = 0; i < median_group_index; i++) {
			total_freq_before_median = total_freq_before_median + this.GroupedData.items[i].frequency;
		}

		// calculate the median now...
		var lcb = this.GroupedData.items[median_group_index].lowerClassBoundary,
			total = this.GroupedData.numberCount,
			gFreq = this.GroupedData.items[median_group_index].frequency,
			intval = this.GroupedData.interval;

		return roundOff(lcb + ((((total/2)-total_freq_before_median)/gFreq)*intval)); 
	};

	Statistic.Grouped.prototype.Mode = function () {
		var modes = [],
			modal_group_indices = getModalGroups(this.GroupedData),
			indices_length = modal_group_indices.length; // may be 2 modes, we never know

		for (var i = 0; i < indices_length; i++) {
			console.log(modal_group_indices[i]);
			var lcb = this.GroupedData.items[modal_group_indices[i]].lowerClassBoundary,
				freqBefore,
				freq = this.GroupedData.items[modal_group_indices[i]].frequency,
				freqAfter,
				intval = this.GroupedData.interval;

			// some assurances
			if (modal_group_indices[i] - 1 === -1) {
				freqBefore = 0;
			}
			else {
				freqBefore = this.GroupedData.items[modal_group_indices[i]-1].frequency;
			}

			if (modal_group_indices[i] + 1 === this.GroupedData.items.length) {
				freqAfter = 0;
			}
			else {
				freqAfter = this.GroupedData.items[modal_group_indices[i]+1].frequency;
			}

			modes.push(roundOff(lcb+(((freq-freqBefore)/((freq-freqBefore)+(freq-freqAfter)))*intval)));
		}

		return modes;
	};	

	Statistic.Grouped.prototype.StandardDeviation = function () {
		var rows = this.GroupedData.items.length,
			summation = 0,
			sumFreq = 0,
			mean = (this.Mean());

		for (var i = 0; i < rows; i++) {
			var freq = this.GroupedData.items[i].frequency,
				midp = this.GroupedData.items[i].midpoint;

			sumFreq = sumFreq + freq;
			summation = (freq*Math.pow(midp - mean,2));
		}			

		return roundOff(Math.sqrt(summation/sumFreq));
	};

	Statistic.Grouped.prototype.GetGroupedData = function () {
		return this.GroupedData;
	};

	obj.Statistic = Statistic;
})(this);
