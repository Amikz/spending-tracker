
var currPage = ".home";
var prevPage = ".home";
var isIncome = false;
var timePeriod = 'monthly';


$(document).ready(function() {
    homePage();
    addEditPages();
	showMeTheBurger();
    addHomeData();
    addTransactionListData();

    $('.settings').hide();
    $('.transactionsList').hide();
    $('.home').show();
});

function addHomeData() {
    var legendCategoryFormat = 
        '<div class="legendItem">' +
            '<div class="legendCategoryColour"></div>' +
            '<p class="legendCategoryName"></p>' +
            '<p class="legendCategoryAmount"></p>' +
        '</div>';

    $('#incomeCategories').empty();
    for(var i = 0; i < incomeCategory.length; i++) {
        var $legendIncomeCategory = $($.parseHTML(legendCategoryFormat));
        $legendIncomeCategory.children('.legendCategoryColour').css('background-color', incomeCategory[i].colour);
        $legendIncomeCategory.children('.legendCategoryName').text(incomeCategory[i].name);
        $('#incomeCategories').append($legendIncomeCategory);
    }

    $('#expenseCategories').empty();
    for(var i = 0; i < expenseCategory.length; i++) {
        var $legendExpenseCategory = $($.parseHTML(legendCategoryFormat));
        $legendExpenseCategory.children('.legendCategoryColour').css('background-color', expenseCategory[i].colour);
        $legendExpenseCategory.children('.legendCategoryName').text(expenseCategory[i].name);
        $('#expenseCategories').append($legendExpenseCategory);
    }
}

function addTransactionListData() {
    var transactionItemFormat = 
    '<div class="transactionItem">' +
        '<p class="category"></p>' +
        '<p class="amount"></p>' +
        '<div class="rect"></div>' +
        '<p class="date"></p>' +
    '</div>';

    var filteredTransaction = transaction;

    $('#transactionsListContent').empty();
    for(var i = 0; i < filteredTransaction.length; i++) {
        var $transactionItem = $($.parseHTML(transactionItemFormat));
        $transactionItem.children('.category').text(filteredTransaction[i].category);
        $transactionItem.children('.amount').text('$' + (filteredTransaction[i].amount).toFixed(2));

        var colour = '#000'; //default
        var category = undefined;
        if(filteredTransaction[i].isIncome) {
            $transactionItem.children('.amount').addClass('income');
            category = incomeCategory.find(e => {
                return e.name == filteredTransaction[i].category
            });
        } else {
            $transactionItem.children('.amount').addClass('expense');
            category = expenseCategory.find(e => {
                return e.name == filteredTransaction[i].category
            });
        }

        if(category != undefined)
            colour = category.colour;

        $transactionItem.children('.rect').css('background-color', colour);
        var date = new Date(filteredTransaction[i].date);
        $transactionItem.children('.date').text(date.toLocaleString('default', { month: 'short' }) + ' ' + date.getDate() + ', ' + date.getFullYear());
        $('#transactionsListContent').append($transactionItem);
    }

}

function homePage() {
    $('.legendCategoryAmount').hide();

    $('.addCategory').click(function() {
        $('.home').hide();
        $('.addEditCategories').show();
        prevPage = '.home';
        currPage = '.addEditCategories';
        isIncome = $(this).is('#addIncomeCategory');
    });

    $('#incomeGraph').mousemove(function(event) {
        var angle = calculateAngle(event);
        //Display percentage and number of section the angle is in
    });

    $('#expenseGraph').mousemove(function(event) {
        var angle = calculateAngle(event);
        //Display percentage and number of section the angle is in
    });

    $('#incomeLegend .expandPanel').click(function() {
        if($('#incomeLegend .legendCategoryAmount').is(':hidden')) {
            $('#incomeGraphContainer').hide();

            $('#incomeLegend').css('grid-column-start', 'graph');
            $('#incomeLegend .legendItem').css('padding-top', '2.5%');
            $('#incomeLegend .buttonWrapper').css('padding', '2.5% 0px');
            $('#incomeLegend .legendContentWrapper').css('padding', '0px 2.5%');
            $('#incomeLegend .expandPanelArrow').css('border-right', 'none');

            if($(window).width() >= 650) {
                $('#incomeLegend .expandPanelArrow').css('border-left', '8px solid black');
            } else {
                $('#incomeLegend .expandPanelArrow').css('border-left', '6px solid black');
            }

            $('#incomeLegend .legendCategoryAmount').show();
        } else {
            $('#incomeLegend .legendCategoryAmount').hide();

            $('#incomeLegend,' +
                '#incomeLegend .legendItem,' +
                '#incomeLegend .buttonWrapper,' +
                '#incomeLegend .legendContentWrapper,' +
                '#incomeLegend .expandPanelArrow,' +
                '#incomeLegend .expandPanelArrow,' +
                '#incomeLegend .expandPanelArrow'
            ).removeAttr('style');

            $('#incomeGraphContainer').show();
        }
    });

    $('#expenseLegend .expandPanel').click(function() {
        if($('#expenseLegend .legendCategoryAmount').is(':hidden')) {
            $('#expenseGraphContainer').hide();
            $('#expenseLegend').css('grid-column-start', 'graph');
            $('#expenseLegend .legendItem').css('padding-top', '2.5%');
            $('#expenseLegend .buttonWrapper').css('padding', '2.5% 0px');
            $('#expenseLegend .legendContentWrapper').css('padding', '0px 2.5%');
            $('#expenseLegend .expandPanelArrow').css('border-right', 'none');

            if($(window).width() >= 650) {
                $('#expenseLegend .expandPanelArrow').css('border-left', '8px solid black');
            } else {
                $('#expenseLegend .expandPanelArrow').css('border-left', '6px solid black');
            }

            $('#expenseLegend .legendCategoryAmount').show();
        } else {
            $('#expenseLegend .legendCategoryAmount').hide();

            $('#expenseLegend,' +
                '#expenseLegend .legendItem,' +
                '#expenseLegend .buttonWrapper,' +
                '#expenseLegend .legendContentWrapper,' +
                '#expenseLegend .expandPanelArrow,' +
                '#expenseLegend .expandPanelArrow,' +
                '#expenseLegend .expandPanelArrow'
            ).removeAttr('style');

            $('#expenseGraphContainer').show();
        }
    });
}

function addEditPages() {
    jQuery("#addEditPages").parsley({ excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], :hidden" });

    resetAddEditTransactionsPage();
    resetAddEditCategoriesPage();
    $('.addEditTransactions').hide();
    $('.addEditCategories').hide();
	$('#burgerButton').show();

    $('#saveButton').click(function() {
        $('#addEditPages').parsley().validate();
        if($("#addEditPages").parsley().isValid()) {
            //Save the data
            if($('div.addEditCategories').is(':visible')) {
                if(isIncome) {
                    //Save category within income section

                } else {
                    //Save category within expense section

                }
            } else if($('div.addEditTransactions').is(':visible')) {
                if($('#transactionType').val() != '') {
                    isIncome = $('#transactionType').val() == 'income';
                }

                if(isIncome) {
                    //Save transaction within income section

                } else {
                    //Save transaction within expense section

                }
            }
        }
    });
    
    $('#cancelButton').click(function() {
        if(currPage == '.addEditCategories') {
            $('.addEditCategories').hide();
            $('.home').show();
            prevPage = '.addEditCategories';
            currPage = '.home';
        } else if(currPage == '.addEditTransactions') {
            $('.addEditTransactions').hide();
            $(prevPage).show();
            currPage = prevPage;
            prevPage = '.addEditTransactions';
        }
    });
    
    $('#addTransactionWithinCategory').click(function() {
        $('.addEditCategories').hide();
        $('.addEditTransactions').show();
        prevPage = '.addEditCategories';
        currPage = '.addEditTransactions';
        resetAddEditTransactionsPage();
    });

    $('.transactionRepeat').hide();
	$('#transactionRepeat_Check').click(function() {
        $(".transactionRepeat").toggle();
		if ($("#transactionRepeat_Check").is(':checked')) {
            $('div.addEditTransactions').css('grid-template-rows', 'repeat(6, [inputField] max-content) [buttons] auto [end]');
		} else {
            $('div.addEditTransactions').css('grid-template-rows', 'repeat(5, [inputField] max-content) [buttons] auto [end]');
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
    
    $('.nameFormat').on('input', function() {
        var position = this.selectionStart;
        var setPosition = (/([^(A-z|\-|'|À|Á|Â|Ã|Ä|Å|Æ|Ç|È|É|Ê|Ë|Ì|Í|Î|Ï|Ñ|Ò|Ó|Ô|Õ|Ö|Š|Ú|Û|Ü|Ù|Ý|Ÿ|Ž|à|á|â|ã|ä|å|æ|ç|è|é|ê|ë|ì|í|î|ï|ñ|ò|ó|ô|õ|ö|š|ù|ú|û|ü|ý|ÿ|ž)])|(`|\^|\(|\)|\[|\]|\\|\||_)/g).test($(this).val());

        //Replace anything that isn't A-z, -, ', or accented letters
        $(this).val($(this).val().replace(/([^(A-z|\-|'|À|Á|Â|Ã|Ä|Å|Æ|Ç|È|É|Ê|Ë|Ì|Í|Î|Ï|Ñ|Ò|Ó|Ô|Õ|Ö|Š|Ú|Û|Ü|Ù|Ý|Ÿ|Ž|à|á|â|ã|ä|å|æ|ç|è|é|ê|ë|ì|í|î|ï|ñ|ò|ó|ô|õ|ö|š|ù|ú|û|ü|ý|ÿ|ž)])|(`|\^|\(|\)|\[|\]|\\|\||_)/g, ''));

        if(setPosition)
            this.selectionEnd = position - 1;
    });
    
    $('.wholeNumber').on('input', function() {
        var position = this.selectionStart;
        var setPosition = (/([^(0-9)])|(`|\^|\(|\)|\[|\]|\\|\||_)/g).test($(this).val());

        //Replace anything that isn't 0-9
        $(this).val($(this).val().replace(/([^(0-9)])|(`|\^|\(|\)|\[|\]|\\|\||_)/g, ''));

        if(setPosition)
            this.selectionEnd = position - 1;
    });
    
    $(".monetaryAmount").on("input", function() {
        var position = this.selectionStart;
        var setPosition = (/([^(0-9|\.)])|(`|\^|\(|\)|\[|\]|\\|\||_)/g).test($(this).val());

        //Replace anything that isn't 0-9 or .
        $(this).val($(this).val().replace(/([^(0-9|\.)])|(`|\^|\(|\)|\[|\]|\\|\||_)/g, ''));

        //Ensure there is only one decimal (at most)
        var spot = $(this).val().indexOf('.');
        if(spot != -1) {
            var first = $(this).val().slice(0, spot + 1);
            var second = $(this).val().slice(spot + 1);
            second = second.replace(/\./g, '');
            $(this).val(first + second);
        }

        //Prevent additional characters after 2 decimal places
        $(this).val($(this).val().replace(/(^.+\.[0-9]{2})(.*)/, '$1'));

        if(setPosition)
            this.selectionEnd = position - 1;
    });
}

function showMeTheBurger() {
	$('.burgerMenu').hide();
	$('#timeContainer').hide();
	
	$('#burgerButton').click(function(){
		$('.burgerMenu').slideToggle();
		$('#timeContainer').hide();
        $('#timePeriodButton hr:not(.hide)').addClass('hide');
	});
	
	$('#goChangeTimePeriod').click(function(){
		$('#timeContainer').slideToggle();
        $('#timePeriodButton hr').toggleClass('hide');
	});

    $('#goBackHome').click(function() {
        if(currPage != '.home') {
            $(currPage).hide();
            $('.home').show();
            prevPage = currPage;
            currPage = '.home';
            $('#pageContent').removeAttr('style');
        }
        $('.burgerMenu').slideUp();
    });

    $('#goTransactions').click(function() {
        if(currPage != '.transactionsList') {
            $(currPage).hide();
            $('.transactionsList').show();
            prevPage = currPage;
            currPage = '.transactionsList';
            $('#pageContent').css('padding', '0px');
        }
        $('.burgerMenu').slideUp();
    });

    $('#goSettings').click(function() {
        if(currPage != '.settings') {
            $(currPage).hide();
            $('.settings').show();
            prevPage = currPage;
            currPage = '.settings';
        }
        $('.burgerMenu').slideUp();
    });
}

function resetAddEditTransactionsPage() {
    var $page = $('div.addEditTransactions');
    
    $page.find("input[type=text], select").each(function() {
        $(this).val("");
        $(this).parsley().reset();
    });

    var date = new Date();
    $('#transactionDate').val(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());

    if($('#transactionRepeat_Check').is(":checked")) {
        $("#transactionRepeat_Check").click();
    }
}

function resetAddEditCategoriesPage() {
    var $page = $('div.addEditCategories');
    
    $page.find("input[type=text], select").each(function() {
        $(this).val("");
        $(this).parsley().reset();
    });

    $("#categoryColour").val("#000000");
    $("#categoryColour").parsley().reset();

    if($('#setCategoryBudget').is(":checked")) {
        $("#setCategoryBudget").click();
    }
}

function calculateAngle(event) {
    var boxBounds = event.target.getBoundingClientRect();
    var boxCenterX = boxBounds.left + (boxBounds.width/2);
    var boxCenterY = boxBounds.top + (boxBounds.height/2);
    var mouseX = event.pageX - boxCenterX;
    var mouseY = event.pageY - boxCenterY;

    return Math.abs((Math.atan2(mouseX, mouseY) * (180/Math.PI)) - 180);
}
