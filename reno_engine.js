var i = 1;	//Crown counter
var j = 1; 	//Baseboard counter
var hardwoodWidth = 0;
var hardwoodNailing;
var RoomSectors = ["Room", "Crown", "Sheetrock", "Door", "Baseboard", "Floor", "Paint"];
//Hardwoods
	if (hardwoodWidth > 2.5) {
		hardwoodNailing = 5;
	}
	else {	
		hardwoodNailing = 7;
	}

$(document).ready(function() {
	$('#page1 form').submit(function(e) {
		e.preventDefault();
		doit();
	});			
});

//Hide this elements on initialize
$("#layout, #framingprice, #PaintObj, #Sum, #SheetrockPiece, #SheetrockScrews, #err, #popupVal").hide();

$("#AddBaseboard, #AddCrown").click(function(){       
	var trim = $(this).attr("id").split('Add').pop();
	var z
		if (trim == "Crown") {
			z=++i;
		}
		else {
			z=++j;
		}
	//alert($(this).attr("id"));
	$('#' + trim +'UL li:last')
		.clone(true)
		.insertAfter('#' + trim + 'UL li:last')
		.find("input")
		.attr("id", trim + z + "DollarsPerLF")
		.attr("name", trim + z + "DollarsPerLF")
		.val('');
	//re-select new last list item label
	$('#' + trim + 'UL li:last label')
		.html(trim +" Profile " + z)
		.attr("id",trim + z);    
}); 

$("#RemoveCrown").click(function(){
	if (i>1) {
		i--;
		$('#CrownUL li:last').remove();
	}
});
$("#RemoveBaseboard").click(function(){
	if (j>1) {
		j--;
		$('#BaseboardUL li:last').remove();
	}
});

$("#Reset").click(function(){
	i=1;
	j=1;
	$('#CrownUL li:not(:first), #BaseboardUL li:not(:lt(3))').remove();
	//Probably a better way than this; can't find proper selector for reset radio checkbox
	location.reload();
});

$("#framing input").click(function(){
	var id = $('#framing input:checked').attr("id");
	var framingLabel=($('label[for='+id+']').text());
	$("#layout, #framingprice").toggle(id!='framing3');
	$("#framingprice label").text(framingLabel);
});

// for sheetrock surface
$("#sheetrocksurface input").click(function(){
	var id = $('#sheetrocksurface input:checked').attr("id");
	$("#SheetrockPiece, #SheetrockScrews").toggle(id!=undefined);
});

$("p").css({"color":"red"});

var $m=$('#err').clone(true);
//Validation
$('input').keyup(function() {
	var $me = $(this)
	var id="err"+$me.attr("id");	
		if (isNaN($me.val())) {
			if (($("#"+id).length)==0) {
				//insert after and show
				$m.insertAfter($me).show().attr("id",id);
			} else {
				//already exists, just show
				$("#"+id).show();
			}
		} else {
			// its a number, just hide it
			$("#"+id).hide();
		}

});

$('input').mouseleave(function() {
	if (isNaN($(this).val())){
		//$("#popupVal").show().popup("open");
		//alert("Please input a number before continuing");
		$(this).select();
	}
});		


//Handle for click of paint checkboxes
$('input[name*="cb-"]').click(function () {
	var clsName = $(this).attr("id").substring(3);
	var id = clsName + 'Li';
	
	if ($('#' + id ).length) {
		//$($('#' + id )).toggle(this.checked);
		$('#' + id).remove();
	}
	else {
		var p = "Paint";
		$('#' + p +'Obj')
			.clone(true)
			.insertAfter('#paintUL li:last')
			.show()
			.attr("id", id);

		var allInputs = $('#' + id + ' :input').addClass(p);
		for (var n=0;n<allInputs.length;n++)
			{
			$("#" + id).find("label").eq(n).prepend(clsName + " ");
			$("#" + id).find("input").eq(n)
				.attr("id", p + clsName + n)
				.attr("name", p + clsName + n);
			}
	}
});

//Random numbers for input, packaged into a checkbox at top.
$('#rnd').click(function () {
	var b=$(this).attr("checked")=="checked";
	$.each(RoomSectors, function(index, value) { 	
		$('[class*="' + value + '"]').each(function() {
				if ($(this).attr("type")=="text") {
						if (b){
							$(this).val(Math.floor((Math.random()*100)+1));
						}else{
							$(this).val("");
						} 
				}
		});
	});
});


$(".Paint").attr('class', 'p');

function isEmpty(input){
	if (input=="" || input==null) {return 0;} else {return input;}
}

/*
Main function
*/

function doit()
{	

function Sector(sector)
	{
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
	
	
	

		if (sector=="Sheetrock") {
			$.each(['framing','layout','sheetrocksurface'], function(index, variable) {
				//alert((findCheckedInputElements(variable, 'label')).join(", "));
				//alert( sumArray(findCheckedInputElements(variable, 'value')) );
			});
		}
	
	function findCheckedInputElements(inputElementId,outputElementType)
		{
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
			
	function getTotalCost(x)
		{
		return (x.totalLF * x.totalDollarsPerLF + x.totalSF * x.totalDollarsPerSF); //+x.totalUnit * x.totalDollarsPerUnit		
		}
	
	function NaNtoZero(input)
		{if (isNaN(input)){return 0;} else {return input;}}
	
	function getTotalLF()
		{var ans;	
			if (sector=="Door"){
				ans = (( 2*parseFloat($('#DoorHeightInches').val()) + parseFloat($('#DoorWidthInches').val()) ) / 12 );
			} else {
				ans = parseFloat($('[name*="' + sector + 'LF"]').val());
			}
		return ans;
		}

	function buildArray(v)
		{
		var arr=[];
		$('[class*="' + sector + '"][name*=' + v + ']').each(function(index, value) {
			arr.push($(this).val());
		});
		return arr;
		}
	}

function sumArray(arr)
	{
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
	switch(sect)
	{
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

	///*
	//alert("oSheetrock.totalSF: "+oSheetrock.totalSF);
	oSheetrock.totalSF = (oBaseboard.totalLF * oRoom.totalLF);
	//alert("oSheetrock.totalSF: " + oSheetrock.totalSF );
	//*/
	

//$("#SmallTable").html(smltbl);


$('#SumUL li:not(:first)').remove();
$.each(RoomSectors, function(index, value) { 	
	$('#Sum')
		.clone(true)
		.show()
		.insertAfter('#SumUL li:last')
		.find(".ui-block-a")
		.html(value + ": ");
			if (value != "Room") {
					$('#SumUL li:last .ui-block-b').html(Sectors[index]).formatCurrency(); 		// Insert  $ amount here
					$('#SumUL li:last .ui-li-count').html(SectorCount[index]);					// Insert count of detail report here		
			} else {
					$('#SumUL li:last .ui-block-b').html(sumArray(Sectors)).formatCurrency(); 	// Insert  $ amount here
					$('#SumUL li:last .ui-li-count').html(Sectors.length-1);									// Insert count of detail report here								
			};
});		




}

function jumpToAnchor(p) {
	window.location = window.location + "#page2";
}