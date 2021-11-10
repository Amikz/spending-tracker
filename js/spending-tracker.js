$(document).ready(function() {
	
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

    $('.categoryBudget').hide();
    $('#setCategoryBudget').click(function() {
        $('.categoryBudget').toggle();

        if($(this).is(":checked")) {
            $('.addEditCategories').css('grid-template-rows', 'repeat(6, [inputField] max-content) [buttons] auto [end]');
        } else {
            $('.addEditCategories').css('grid-template-rows', 'repeat(3, [inputField] max-content) [buttons] auto [end]');
        }
    });

    //$('.addEditCategories').hide();
});
