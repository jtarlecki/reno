var hardwoodWidth = 0;
var hardwoodNailing;

//Hardwoods
if (hardwoodWidth > 2.5){
	hardwoodNailing = 5;
} else {	
	hardwoodNailing = 7;
}



function isEmpty(input){
	if (input=="" || input==null) {return 0;} else {return input;}
}

/*
Main function
*/

function doit(){	

	function KeyArgs(){
		this.markup = 1.1;
	}

	function Room(){
		this.ceilingSF = $('#RoomFloorSF').val();
		this.wallSF = $('#RoomSheetrockLF').val();
	} 

	function Sheetrock(){
		
		room = new Room();
		
		// assumptions
		this.screwsPerSheet = 43; // screws per sheet. 
		this.screwLbsPerSF = 400; // SqFt
		
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
		calc();
		
		function calc(){
			sf = 0;
			if ($('#Sheetrock-Wall').is(':checked')){
				sf += room.wallSF;
			}
			if ($('#Sheetrock-Ceiling').is(':checked')){
				sf += room.wallSF;
			}
			console.log('sf: '+sf);
		}
		/*
		
		
		New Framing
		Layout
		SheetrockFramingDollarsPerUnit 
		Sheetrock Surfaces
		SheetrockDollarsPerUnit
		SheetrockScrewDollarsPerUnit
		*/
	}

	r = new Room();
	console.log('r.ceilingSF: ' + r.ceilingSF);
	console.log('r.wallSF: ' + r.wallSF);
	s = new Sheetrock();

	function Sector(sector){

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
				
		function getTotalCost(x){
			return (x.totalLF * x.totalDollarsPerLF + x.totalSF * x.totalDollarsPerSF); //+x.totalUnit * x.totalDollarsPerUnit		
		}
		
		function NaNtoZero(input){
			if (isNaN(input)){return 0;} else {return input;}
		}
		
		function getTotalLF(){
			var ans;	
			if (sector=="Door"){
				ans = (( 2*parseFloat($('#DoorHeightInches').val()) + parseFloat($('#DoorWidthInches').val()) ) / 12 );
			} else {
				ans = parseFloat($('[name*="' + sector + 'LF"]').val());
			}
			return ans;
		}

		function buildArray(v){
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
		

		//var sect = sect;
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
		
		
	});

		
	console.log("oSheetrock.totalSF: "+oSheetrock.totalSF);
	oSheetrock.totalSF = (oBaseboard.totalLF * oRoom.totalLF);
	console.log("oSheetrock.totalSF: " + oSheetrock.totalSF );
	console.log("oRoom: " + oRoom);

	$("#SmallTable").html(smltbl);


	$('#SumUL li:not(:first)').remove();
	$.each(RoomSectors, function(index, value){ 	
		$('#Sum')
			.clone(true)
			.show()
			.insertAfter('#SumUL li:last')
			.find(".ui-block-a")
			.html(value + ": ");
		if (value != "Room"){
				$('#SumUL li:last .ui-block-b').html(Sectors[index]).formatCurrency(); 		// Insert  $ amount here
				$('#SumUL li:last .ui-li-count').html(SectorCount[index]);					// Insert count of detail report here		
		} else {
				$('#SumUL li:last .ui-block-b').html(sumArray(Sectors)).formatCurrency(); 	// Insert  $ amount here
				$('#SumUL li:last .ui-li-count').html(Sectors.length-1);					// Insert count of detail report here								
		};
	});		

}

/*
function jumpToAnchor(p) {
	window.location = window.location + "#page2";
}
*/