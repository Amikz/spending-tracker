$(document).ready(function() {
	
	$('.transactionRepeat').hide();
	$('#transactionRepeat_Check').click(function() {
        $(".transactionRepeat").toggle();
		if ($("#transactionRepeat_Check").is(':checked')) {
            $('div.addEditTransactions').css('grid-template-rows', 'repeat(5, [inputField] max-content) [buttons] auto [end]');
		} else {
            $('div.addEditTransactions').css('grid-template-rows', 'repeat(4, [inputField] max-content) [buttons] auto [end]');
		}
	});

    $('.categoryBudget').hide();
    $('#setCategoryBudget').click(function() {
        $('.categoryBudget').toggle();

        if($(this).is(":checked")) {
            $('div.addEditCategories').css('grid-template-rows', 'repeat(6, [inputField] max-content) [buttons] auto [end]');
        } else {
            $('div.addEditCategories').css('grid-template-rows', 'repeat(3, [inputField] max-content) [buttons] auto [end]');
        }
    });

    $('.addEditTransactions').hide();
    $('.addEditCategories').show();

    $('#addTransactionWithinCategory').click(function() {
        $('.addEditCategories').hide();
        $('.addEditTransactions').show();
    });

    $('#cancelButton').click(function() {
        if($('div.addEditTransactions').is(':visible')) { //TODO: add to this condition so that it also checks that we came from the Categories page
            $('.addEditTransactions').hide();
            $('.addEditCategories').show();
        }
    });
});
