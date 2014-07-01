var i = 1;	//Crown counter
var j = 1; 	//Baseboard counter
//var RoomSectors = ["Room", "Crown", "Sheetrock", "Door", "Baseboard", "Floor", "Paint"];
var RoomSectors = ["Crown", "Sheetrock", "Door", "Baseboard", "Floor", "Paint", "Room"];
	
$(document).ready(function() {
	$('#page1 form').submit(function(e) {
		e.preventDefault();
		doit();
	});			
});

//Hide this elements on initialize
$("#layout, #framingprice, #PaintObj, #SumUL, #SheetrockPiece, #SheetrockScrews, #err, #popupVal").hide();

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
						if (b) {
							$(this).val(Math.floor((Math.random()*100)+1));
						} else {
							$(this).val("");
						} 
				}
		});
		
		$('#' + value).find("a").trigger("click");
		//sleep(10);
	
	});

	function sleep(miliseconds) {
		var currentTime = new Date().getTime();
		while (currentTime + miliseconds >= new Date().getTime()) {}
	}
		
});


$(".Paint").attr('class', 'p');