$(document).ready(function() {

    $('.addEditCategories').hide();

	$('.addEditTransactions').show();
	
	$('.transactionOptionalField').hide();	
	
	$('#transactionRepeat_Check').click(function(){
		if ($("#transactionRepeat_Check").is(':checked')) {
			console.log("checked");
			$(".transactionOptionalField").show();
		} else {
			console.log("unchecked");
			$(".transactionOptionalField").hide();
		}
	});
});
