var hardwoodWidth = 0;
var hardwoodNailing;

//Hardwoods
if (hardwoodWidth > 2.5) {
	hardwoodNailing = 5;
} else {	
	hardwoodNailing = 7;
}

function isEmpty(input) {
	if (input=="" || input==null) {
		return 0;
	} else {
		return input;
	}
}

function NaNtoZero(input) {
	if (isNaN(input)) {
		return 0;
	} else {
		return input;
	}
}

/*
Main function
*/

function doit() {	

	function KeyArgs() {
		this.markup = 1.1;
		this.framing = 8; 	// 8' framing assumed
	}

	function Room() {
		
		var key = new KeyArgs();
		
		this.ceilingSF = parseFloat($('#RoomFloorSF').val());
		this.wallSF = parseFloat($('#RoomSheetrockLF').val());
		this.roomPerimeterFt = parseFloat($('#RoomBaseboardLF').val());
		this.roomHeightFt = parseFloat($('#RoomSheetrockLF').val());
		/* rock laying horizontally on walls */
		sheetRockCourses = Math.ceil(this.roomHeightFt / 4); 
		this.sheetRockWallCount = sheetRockCourses * this.roomPerimeterFt;
		this.sheetRockCeilingCount = Math.ceil((this.ceilingSF / 32) * key.markup);
		
		/*
		console.log('/n^^^^^^^^^^^^^^^^^^^/n');
		console.log(this.roomPerimeterFt);
		console.log(sheetRockCourses);
		console.log(this.sheetRockWallCount);
		console.log(this.sheetRockCeilingCount);
		
		console.log('/n^^^^^^^^^^^^^^^^^^^/n');
		*/
		
	} 

	function Sheetrock() {
		
		room = new Room();
		var key = new KeyArgs();
		
		// assumptions
		this.screwsPerSheet = 43; 		// screws per sheet. 
		this.screwLbsPerSF = (1/400); 	// SqFt
		this.SF = 0;					// __init__ = 0
		
		/*
		var id = $('#layout input:checked').attr("id");
		var framingLabel=($('label[for='+id+']').text());
		
		
		console.log('\nsheetrock');
		console.log('============================');
		console.log('layout:');
		console.log('id: '+id);
		console.log('framingLabel: '+framingLabel);
		
		console.log('$(SheetrockFramingDollarsPerUnit).val(): '+$(SheetrockFramingDollarsPerUnit).val());

		console.log('Sheetrock-Wall:');
		var b = $('#Sheetrock-Wall').is(':checked');
		console.log('#Sheetrock-Wall: '+b);
		var b = $('#Sheetrock-Ceiling').is(':checked');
		console.log('Sheetrock-Ceiling: '+b);
		console.log('============================\n');
		*/
		
		this.sheetRockWallCount = 0;
		this.sheetRockCeilingCount = 0;
		this.SF = 0;
		
		if ($('#Sheetrock-Wall').is(':checked')){
			this.sheetRockWallCount = room.sheetRockWallCount;
			this.SF += room.wallSF;
		}
		if ($('#Sheetrock-Ceiling').is(':checked')){
			this.sheetRockCeilingCount = room.sheetRockCeilingCount;
			this.SF += room.ceilingSF;
		}
		
		
		this.screwPrice = (this.screwLbsPerSF * this.SF) * parseFloat($('#SheetrockScrewDollarsPerUnit').val());
		this.sheetrockPrice = (this.sheetRockWallCount + this.sheetRockCeilingCount) * parseFloat($('#SheetrockDollarsPerUnit').val());
		
		/*
		When rock is hung length-wise and perpendicular to its framing members, 
		each sheet crosses the paths seven (7) framing members at 4' of length.
		The (+1) makes sure to include the extra framing member at the end
		*/
		
		this.framingPrice =
			Math.ceil((this.sheetRockWallCount * 7 * 4 ) / key.framing) +
			Math.ceil((this.sheetRockCeilingCount * 7 * 4 ) / key.framing);
		
		this.price = this.screwPrice + this.sheetrockPrice + this.framingPrice;
		
		
		
		/*
		console.log('\n%%%%%%%%%%%%%%%%%%%%%%%%%');
		console.log(this.screwPrice);
		console.log(this.sheetrockPrice);
		console.log(this.framingPrice);
		console.log('this.price: ' + this.price);
		console.log('%%%%%%%%%%%%%%%%%%%%%%%%%\n');
		*/
		
	}
	
	function Paint() {
		
		var room = new Room();
		
		var sqft = {
			Wall: room.wallSF,
			Ceiling: room.ceilingSF
		};
		
		var price = 0;
		var count = 0;
		
		console.log('>>>> Paint <<<<<');
	
		var areas = ['Wall', 'Ceiling'/*, 'Trim', 'Door', 'Floor'*/];
		$.each(areas, function(index, value){
				var paintSurface = value
				var v = $('#cb-' + value).is(':checked');
				console.log(value + ': ' + v);
				if (v){
					$.each([0,1,2,3], function(index, value) {
						console.log("$('#Paint' + paintSurface + value).val(): " + $('#Paint' + paintSurface + value).val());
						console.log('sqft[paintSurface]: ' + sqft[paintSurface]);
					});
					// total = (# coats) * (# gallons) * ($/gallon)
					console.log(
						parseFloat($('#Paint' + paintSurface + 1).val())	// primer # coats
						* (Math.ceil(sqft[paintSurface] / parseFloat(400)))	// primer # gallons
						* parseFloat($('#Paint' + paintSurface + 0).val())	// primer $/gallon
						+ 
						parseFloat($('#Paint' + paintSurface + 3).val())	// paint # coats
						* (Math.ceil(sqft[paintSurface] / parseFloat(400)))	// paint # gallons
						* parseFloat($('#Paint' + paintSurface + 2).val())	// paint $/gallon
						);
					price += 
						parseFloat($('#Paint' + paintSurface + 1).val())	// primer # coats
						* (Math.ceil(sqft[paintSurface] / parseFloat(400)))	// primer # gallons
						* parseFloat($('#Paint' + paintSurface + 0).val())	// primer $/gallon
						+ 
						parseFloat($('#Paint' + paintSurface + 3).val())	// paint # coats
						* (Math.ceil(sqft[paintSurface] / parseFloat(400)))	// paint # gallons
						* parseFloat($('#Paint' + paintSurface + 2).val())	// paint $/gallon
						;
					count+=1;
				}
		});
		
		console.log('price: ' + price);
		this.price = price;
		this.count = count;
		
		/*
		var $id = $('id^=cb-');
		alert($id);
		$id.each(function(index, value) {
			alert('paint-loop');
			var $me=$(this);
			var b = $me.text() + ' : ' + $me.is(':checked')
			//var a=$('#' + $me.attr('id') + ' label[for=' + $me.attr('id') + ']').text()
			//var a = $('label[for=' + $me.attr('id') + ']').text()
			
			console.log('>>>>');
			console.log(b);
			console.log('>>>>');
			
			
			$.each(["id", "name", "value", "placeholder"], function (index, value){
				t = t + "<td>" + isEmpty($me.attr(value)) + "</td>";
			});
			
			
		});
		*/
	}

	p = new Paint();
	r = new Room();

	function Sector(sector) {

		this.arrayDollarsPerLF = buildArray("DollarsPerLF");
		this.arrayDollarsPerSF = buildArray("DollarsPerSF");
		this.arrayDollarsPerUnit = buildArray("DollarsPerUnit");
		this.totalDollarsPerLF = NaNtoZero(sumArray(this.arrayDollarsPerLF));
		this.totalDollarsPerSF = NaNtoZero(sumArray(this.arrayDollarsPerSF));
		this.totalDollarsPerUnit = NaNtoZero(sumArray(this.arrayDollarsPerUnit));
		this.totalLF = NaNtoZero(getTotalLF());
		this.totalSF = NaNtoZero(parseFloat($('[name*="' + sector + 'SF"]').val()));	
			

		this.totalCost = getTotalCost(this);
		this.cnt = this.arrayDollarsPerLF.length + this.arrayDollarsPerSF.length + this.arrayDollarsPerUnit.length ;
		SectorCount.push(this.cnt);
		Sectors.push(this.totalCost);
		
		/*
		console.log('sector: ' + sector);
		console.log('-------------------------');
		console.log('arrayDollarsPerLF :' + this.arrayDollarsPerLF);
		console.log('arrayDollarsPerSF :' + this.arrayDollarsPerSF);
		console.log('arrayDollarsPerUnit :' + this.arrayDollarsPerUnit);
		console.log('totalDollarsPerLF :' + this.totalDollarsPerLF);
		console.log('this.totalDollarsPerSF :' + this.totalDollarsPerSF);
		console.log('this.totalDollarsPerUnit :' + this.totalDollarsPerUnit);
		console.log('this.totalLF :' + this.totalLF);
		console.log('this.totalSF :' + this.totalSF);
		console.log('this.totalCost :' + this.totalCost);
		console.log('this.totalSF :' + this.totalSF);
		console.log('this.totalCost :' + this.totalCost);
		console.log('this.cnt :' + this.cnt);
		console.log('\n');
		*/
		
		
		if (sector=="Sheetrock") {
			console.log('\n++++++++++++++++++\n');
			
			$.each(['framing','layout','sheetrocksurface'], function(index, variable){
				
				console.log((findCheckedInputElements(variable, 'label')).join(", "));
				console.log( sumArray(findCheckedInputElements(variable, 'value')) );
			});
			console.log('\n++++++++++++++++++\n');
		}
		
		function findCheckedInputElements(inputElementId,outputElementType){
			var arr=[];
			var id;
				$('#' + inputElementId + ' input:checked').each(function() {
					id = $(this).attr("id");
					var v = $(this).val();
					var a=$('#' + inputElementId + ' label[for=' + id + ']').text();
						if (outputElementType=='label'){
							arr.push(a);
						} else if (outputElementType=='value'){
							arr.push(v);
						}	
				});
			return arr; 			
		}	
				
		function getTotalCost(x) {
			return (x.totalLF * x.totalDollarsPerLF + x.totalSF * x.totalDollarsPerSF); //+x.totalUnit * x.totalDollarsPerUnit		
		}
		

		
		function getTotalLF() {
			var ans;	
			if (sector=="Door") {
				ans = (( 2*parseFloat($('#DoorHeightInches').val()) + parseFloat($('#DoorWidthInches').val()) ) / 12 );
			} else {
				ans = parseFloat($('[name*="' + sector + 'LF"]').val());
			}
			return ans;
		}

		function buildArray(v) {
			var arr=[];
			$('[class*="' + sector + '"][name*=' + v + ']').each(function(index, value) {
				arr.push($(this).val());
			});
			return arr;
		}

	}

	function sumArray(arr){
		var ans=0;
			$.each(arr, function(index,value){
				ans +=  parseFloat(isEmpty(value));
			});
		return ans;
	}
		
	var oRoom;
	var oCrown;
	var oSheetrock;
	var oDoor;
	var oBaseboard;
	var oFloor;
	var oPaint;

	var Sectors=[];
	var SectorCount=[];
	var SectorsTotalCost=0;

	/* build an html table for debugging  */
	var smltbl="<tr><th></th><th>id</th><th>name</th><th>value</th><th>units</th></tr>";	

	$.each(RoomSectors, function(index, sect) { 
		switch(sect){
			case "Room": oRoom = new Sector(sect); break;
			case "Crown": oCrown = new Sector(sect); break;
			case "Sheetrock": oSheetrock = new Sector(sect); break;
			case "Door": oDoor = new Sector(sect); break;
			case "Baseboard": oBaseboard = new Sector(sect); break;
			case "Floor": oFloor = new Sector(sect); break;
			case "Paint": oPaint = new Sector(sect); break;
		}
				
		/*
		var $cls = $('[class*="' + sect + '"]');
		smltbl = smltbl + '<th rowspan="' + ($cls.length+1) + '">' + sect + '</th>'
		$cls.each(function(index, value) {
			var $me=$(this);
			var t="";
			$.each(["id", "name", "value", "placeholder"], function (index, value){
				t = t + "<td>" + isEmpty($me.attr(value)) + "</td>";
			});
			smltbl = smltbl + "<tr>" + t + "</tr>";
		});
		*/
		
	});

	//$("#SmallTable").html(smltbl);
	
	
	$('#Results li:not(:first)').remove();  // clear out any garbage from list

	$.each(RoomSectors, function(index, value) { 	
		
		$('#Sum')
			.clone(true)
			.insertAfter('#Results li:last')
			.attr('id', 'Sum' + value)
			.removeClass('ui-first-child')
			;
			$me = $('#Results li:last')
		
		/* since JQM sucks, we need to reformat this ourselves by changing the classes */
		if (value != "Room") {
				$me
						.removeClass('ui-last-child')
					.find('.ui-block-a')
						.html(value + ": ")
						.parent()
					.find('.ui-block-b')
						.html(Sectors[index])												
						.parent()
					.find('.ui-li-count')      
						.html(SectorCount[index])
					;		
		} else {
				$me
						.addClass('ui-last-child')
						.addClass('ui-body-e')
						.wrapInner('<h1 class="ui-li-heading"></h1>')
					.find('.ui-block-a')
						.html(value + ' Total:')
						.parent()
					.find('.ui-block-b')
						.html(sumArray(Sectors))	
						.parent()
					.find('.ui-li-count')
						.html(Sectors.length-1)
					;

		};
	
	});	
	
	
	// this is filthy
	sheetrock = new Sheetrock();
	paint = new Paint();
	var total = sumArray(Sectors) + NaNtoZero(sheetrock.price) + NaNtoZero(paint.price);
	
	$('#SumSheetrock .ui-block-b').html(NaNtoZero(sheetrock.price)); // sheetrock has no count yet.
	
	$('#SumPaint .ui-block-b').html(NaNtoZero(paint.price));
	$('#SumPaint .ui-li-count').html(NaNtoZero(paint.count));	
	
	$('#SumRoom .ui-block-b').html(total);

	$('#Results li .ui-block-b').formatCurrency(); 	
	
}

/*
function jumpToAnchor(p) {
	window.location = window.location + "#page2";
}
*/