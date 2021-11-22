// 
var currPage = ".home";
var prevPage = ".home";
var isIncome = false;
var isNew = false;
var currTransaction = 0;
var currCategory = 0;
var timePeriod = 'monthly';


$(document).ready(function() {
    addHomeData();
    addTransactionListData();
    homePage();
    addEditPages();
    transactionList();
	showMeTheBurger();

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

        $transactionItem.children('.rect').css('background-color', category.colour).attr('category', category.name);

        var date = new Date(filteredTransaction[i].date);
        $transactionItem.children('.date').text(date.toLocaleString('default', { month: 'short' }) + ' ' + (date.getDate() + 1) + ', ' + date.getFullYear());
        $transactionItem.children('.date').attr('date', filteredTransaction[i].date);
        $('#transactionsListContent').append($transactionItem);
    }

}

function homePage() {
    $('.legendCategoryAmount').hide();

    $('.addCategory').click(function() {
        $('.home').hide();
        $('.addEditCategories').show();
        resetAddEditCategoriesPage();
        prevPage = '.home';
        currPage = '.addEditCategories';
        isIncome = $(this).is('#addIncomeCategory');
        isNew = true;
        $('#editCategory').hide();
        hideExpenseFields(isIncome);
    });

    $(document).on('click', '.legendItem', function() {
        $('.home').hide();
        $('.addEditCategories').show();
        resetAddEditCategoriesPage();
        prevPage = '.home';
        currPage = '.addEditCategories';
        isIncome = $(this).parents('#incomeLegend').length;
        isNew = false;

        //Populate data
        var category = undefined;
        if(isIncome) {
            hideExpenseFields(true);
            category = incomeCategory.find(e => {
                return e.name == $(this).find('.legendCategoryName:first').text();
            });

            currCategory = incomeCategory.findIndex(e => {
                return e == category;
            });
        } else {
            category = expenseCategory.find(e => {
                return e.name == $(this).find('.legendCategoryName:first').text();
            });

            currCategory = expenseCategory.findIndex(e => {
                return e == category;
            });
        }

        $('#categoryName').val(category.name);
        $('#categoryColour').val(category.colour);
        if(category.setBudget) {
            $('#setCategoryBudget').click();
            $('#categoryBudget').val((category.budget).toFixed(2));
            $('#categoryBudgetEvery_Number').val(category.every_num);
            $('#categoryBudgetEvery_TimePeriod').val(category.every_timePeriod);

            if(category.warning >= 0)
                $('#categoryWarning').val(category.warning);
        }
        
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

function showMeTheBurger() {
	$('.burgerMenu').hide();
	$('#timeContainer').hide();
	disableButton();
	$('#burgerButton').click(function(){
		$('.burgerMenu').slideToggle();
		$('#timeContainer').hide();
        $('#timePeriodButton hr:not(.hide)').addClass('hide');
	});
	
	$('#goChangeTimePeriod').click(function(){
		$('#timeContainer').slideToggle();
        $('#timePeriodButton hr').toggleClass('hide');
        setTimePeriod();
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
		disableButton();
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
		disableButton();
    });
	
	// Uncomment when we get the reminders page
	//$('#goReminders').click(function() {
    //    if(currPage != '.reminders') {
    //        //$(currPage).hide();
    //        //$('.reminders').show();
    //        prevPage = currPage;
    //        currPage = '.reminders';
    //    }
    //    $('.burgerMenu').slideUp();
	//	disableButton();
    //});

    $('#goSettings').click(function() {
        if(currPage != '.settings') {
            $(currPage).hide();
            $('.settings').show();
            prevPage = currPage;
            currPage = '.settings';
        }
        $('.burgerMenu').slideUp();
		disableButton();
    });
	
}

function disableButton() {
    $(':button').prop('disabled', false); 
    if (currPage == '.home') {
        $('#goBackHome').attr('disabled',true);
    }
	if (currPage =='.transactionsList') {
        // $(':button').prop('disabled', false); 
        $('#goTransactions').attr('disabled',true);
    }
	if (currPage == '.settings') {
        // $(':button').prop('disabled', false); 
        $('#goSettings').attr('disabled',true);
    }
    disableTime();	
}

function setTimePeriod() {
	$('#dailyButton').click(function() {
        if(timePeriod != 'daily') {
            timePeriod = 'daily';
            console.log("Daily");
        }
		disableButton();
    });

    $('#weeklyButton').click(function() {
        if(timePeriod != 'weekly') {
            timePeriod = 'weekly';
        }
		disableButton();
    });

    $('#biWeeklyButton').click(function() {
        if(timePeriod != 'biWeekly') {
            timePeriod = 'biWeekly';
        }
		disableButton();
    });

    $('#monthlyButton').click(function() {
        if(timePeriod != 'monthly') {
            timePeriod = 'monthly';
        }
		disableButton();
    });

    $('#yearlyButton').click(function() {
        if(timePeriod != 'yearly') {
            timePeriod = 'yearly';
        }
		disableButton();
    });
}

function disableTime() {
    if (timePeriod == 'daily') {       
        $('#dailyButton').attr('disabled',true);
    }
    if (timePeriod == 'weekly') { 
        $('#weeklyButton').attr('disabled',true);
    }	
    if (timePeriod == 'biWeekly') {
        $('#biWeeklyButton').attr('disabled',true);
    }	
    if (timePeriod == 'monthly') {
        $('#monthlyButton').attr('disabled',true);
    }	
    if (timePeriod == 'yearly') { 
        $('#yearlyButton').attr('disabled',true);
    }	
}

function transactionList() {
    $(document).on('click', '.transactionItem', function() {
        $('.transactionsList').hide();
        $('.addEditTransactions').show();
        $('#pageContent').removeAttr('style');
        resetAddEditTransactionsPage();
        prevPage = '.transactionsList';
        currPage = '.addEditTransactions';
        isIncome = $(this).find('.income').length > 0;
        isNew = false;

        //Populate data
        if(isIncome)
            $('#transactionType').val('income');
        else
            $('#transactionType').val('expense');
        $('#transactionType').trigger('change');

        var category = $(this).find('.rect').attr('category');
        var amount = (parseFloat(($(this).find('.amount').text()).replace(/\$/g, ''))).toFixed(2);
        var date = $(this).find('.date').attr('date');

        $('#transactionCategory_Select').val(category);
        $('#transactionAmount').val(amount);
        $('#transactionDate').val(date);

        var transactionItem = transaction.find(e => {
            return (e.category == category) && (e.date == date) && ((e.amount).toFixed(2) == amount);
        });

        currTransaction = transaction.findIndex(e => {
            return e == transactionItem;
        });

        if(transactionItem != undefined && transactionItem.willRepeat) {
            $('#transactionRepeat_Check').click();
            $('#transactionRepeatEvery_Number').val(transactionItem.repeat_num);
            $('#transactionRepeatEvery_TimePeriod').val(transactionItem.repeat_timePeriod);
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
                var newCategory = {
                    name: $('#categoryName').val(),
                    colour: $('#categoryColour').val()
                }

                if(isIncome) {

                    if(isNew) {
                        incomeCategory.push(newCategory);
                    } else {

                        for(var i = 0; i < transaction.length; i++) {
                            if(transaction[i].category == incomeCategory[currCategory].name) {
                                transaction[i].category = newCategory.name;
                            }
                        }

                        incomeCategory[currCategory].name = newCategory.name;
                        incomeCategory[currCategory].colour = newCategory.colour;
                    }

                } else {
                    var setBudget = $('#setCategoryBudget').is(':checked');
                    newCategory = {
                        name: $('#categoryName').val(),
                        colour: $('#categoryColour').val(),
                        setBudget: setBudget
                    }

                    if(setBudget) {
                        var warning = -1;
                        if($('#categoryWarning').val() != '') {
                            warning = parseFloat($('#categoryWarning').val());
                        }

                        newCategory = {
                            name: $('#categoryName').val(),
                            colour: $('#categoryColour').val(),
                            setBudget: setBudget,
                            budget: parseFloat($('#categoryBudget').val()),
                            every_num: parseInt($('#categoryBudgetEvery_Number').val()),
                            every_timePeriod: $('#categoryBudgetEvery_TimePeriod').val(),
                            warning: warning
                        }
                    }

                    if(isNew) {
                        expenseCategory.push(newCategory);
                    } else {

                        for(var i = 0; i < transaction.length; i++) {
                            if(transaction[i].category == expenseCategory[currCategory].name) {
                                transaction[i].category = newCategory.name;
                            }
                        }

                        expenseCategory[currCategory].name = newCategory.name;
                        expenseCategory[currCategory].colour = newCategory.colour;
                        expenseCategory[currCategory].setBudget = newCategory.setBudget;

                        if(setBudget) {
                            expenseCategory[currCategory].budget = newCategory.budget;
                            expenseCategory[currCategory].every_num = newCategory.every_num;
                            expenseCategory[currCategory].every_timePeriod = newCategory.every_timePeriod;
                            expenseCategory[currCategory].warning = newCategory.warning;
                        }
                    }
                }
            } else if($('div.addEditTransactions').is(':visible')) {
                var repeat = $('#transactionRepeat_Check').is(':checked');
                var newTransaction = {
                    isIncome: $('#transactionType').val() == 'income',
                    category: $('#transactionCategory_Select').val(),
                    amount: parseFloat($('#transactionAmount').val()),
                    date: $('#transactionDate').val(),
                    willRepeat: repeat
                };

                if(repeat) {
                    newTransaction = {
                        isIncome: $('#transactionType').val() == 'income',
                        category: $('#transactionCategory_Select').val(),
                        amount: parseFloat($('#transactionAmount').val()),
                        date: $('#transactionDate').val(),
                        willRepeat: repeat,
                        repeat_num: parseInt($('#transactionRepeatEvery_Number').val()),
                        repeat_timePeriod: $('#transactionRepeatEvery_TimePeriod').val()
                    };
                }

                if(isNew) {
                    var lo = 0;
                    var hi = transaction.length;
                    
                    while(lo < hi) {
                        var mid = Math.floor((lo + hi) / 2);
                        if(new Date(newTransaction.date) >= new Date(transaction[mid].date)) {
                            hi = mid;
                        } else {
                            lo = mid + 1;
                        }
                    }

                    transaction.splice(lo, 0, newTransaction);
                } else {
                    transaction[currTransaction].isIncome = newTransaction.isIncome;
                    transaction[currTransaction].category = newTransaction.category;
                    transaction[currTransaction].amount = newTransaction.amount;
                    transaction[currTransaction].date = newTransaction.date;
                    transaction[currTransaction].willRepeat = newTransaction.willRepeat;

                    if(repeat) {
                        transaction[currTransaction].repeat_num = newTransaction.repeat_num;
                        transaction[currTransaction].repeat_timePeriod = newTransaction.repeat_timePeriod;
                    }
                }
            }

            addTransactionListData();
            addHomeData();
            $(currPage).hide();
            $('.home').show();
            prevPage = currPage;
            currPage = '.home';
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
            if(prevPage == '.transactionsList')
                $('#pageContent').css('padding', '0px');
            currPage = prevPage;
            prevPage = '.addEditTransactions';
        }
    });
    
    $('#addTransactionWithinCategory').click(function() {
        var category = $('#categoryName').val();
        $('.addEditCategories').hide();
        $('.addEditTransactions').show();
        resetAddEditTransactionsPage();
        $('#editTransaction').hide();
        prevPage = '.addEditCategories';
        currPage = '.addEditTransactions';
        isNew = true;

        if(isIncome)
            $('#transactionType').val('income');
        else
            $('#transactionType').val('expense');
        
        $('#transactionType').trigger('change');
        $('#transactionType').attr('disabled', true);

        $('#transactionCategory_Select').val(category);
        $('#transactionCategory_Select').attr('disabled', true);
    });

    $('#transactionType').change(function() {
        populateCategorySelect($(this).val() == 'income');
    });

    $('.transactionRepeat').hide();
	$('#transactionRepeat_Check').click(function() {
        $(".transactionRepeat").toggle();
		if ($("#transactionRepeat_Check").is(':checked')) {
            $('div.addEditTransactions').css('grid-template-rows', 'repeat(6, [inputField] max-content) [buttons] auto [end]');
		} else {
            $('div.addEditTransactions').removeAttr('style');
		}
	});
    
    $('.categoryBudget').hide();
    $('#setCategoryBudget').click(function() {
        $('.categoryBudget').toggle();

        if($(this).is(":checked")) {
            $('div.addEditCategories').css('grid-template-rows', 'repeat(6, [inputField] max-content) [buttons] auto [end]');
        } else {
            $('div.addEditCategories').removeAttr('style');
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

function resetAddEditTransactionsPage() {
    var $page = $('div.addEditTransactions');
    
    $page.find("input[type=text], select").each(function() {
        $(this).val("");
        $(this).parsley().reset();
    });

    $('#transactionType').removeAttr('disabled');
    $('#transactionCategory_Select').removeAttr('disabled');

    var date = new Date();
    $('#transactionDate').val(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());

    if($('#transactionRepeat_Check').is(":checked")) {
        $("#transactionRepeat_Check").click();
    }
    
    $('#editTransaction').show();
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

    hideExpenseFields(false);
    $('#editCategory').show();
}

function populateCategorySelect(isIncomeCategory) {
    var categoryList = expenseCategory;
    if(isIncomeCategory)
        categoryList = incomeCategory;

    var options = "<option value='' selected=''>Select...</option>";
    for (var i = 0; i < categoryList.length; i++) {
        options += "<option value='" + categoryList[i].name + "'>" + categoryList[i].name + "</option>";
    }

    $('#transactionCategory_Select').empty();
    $('#transactionCategory_Select').html(options);
}

function hideExpenseFields(isHide) {
    if(isHide) {
        $('.expenseCategory').hide();
        $('div.addEditCategories').css('grid-template-rows', 'repeat(2, [requiredInput] max-content) [buttons] auto [end]');
    } else {
        $('.expenseCategory').show();
        $('div.addEditCategories').removeAttr('style');
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
