var currPage = ".home";
var prevPage = ".home";
var isIncome = false;
var isNew = false;
var currTransaction = 0;
var currCategory = 0;
var transactionID = 12;
var timePeriod = 'monthly';
var incomeCategoryLabel = [];
var incomeCategoryAmount = [];
var incomeCategoryColour = [];
var expenseCategoryLabel = [];
var expenseCategoryAmount = [];
var expenseCategoryColour = [];
var incomeGraph;
var expenseGraph;

$(document).ready(function() {
    incomeGraph = new Chart($('#incomeGraph'), {
        type: 'pie',
        data: {
            labels: incomeCategoryLabel,
            datasets: [{
                label: "Income Graph",
                data: incomeCategoryAmount,
                backgroundColor: incomeCategoryColour,
                borderColor: '#F3F3F3'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

    expenseGraph = new Chart($('#expenseGraph'), {
        type: 'pie',
        data: {
            labels: expenseCategoryLabel,
            datasets: [{
                label: "Expense Graph",
                data: expenseCategoryAmount,
                backgroundColor: expenseCategoryColour,
                borderColor: '#F3F3F3'
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

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

    var filteredTransaction = transaction;
    /*var filteredTransaction = transaction.filter(e => {
        var date = new Date(e.date);
        return startDate < date && date < currDate;
    });*/

    //Display income legend
    $('#incomeCategories').empty();
    incomeCategoryLabel = [];
    incomeCategoryAmount = [];
    incomeCategoryColour = [];
    var totalIncome = 0;
    for(var i = 0; i < incomeCategory.length; i++) {
        var $legendIncomeCategory = $($.parseHTML(legendCategoryFormat));
        $legendIncomeCategory.children('.legendCategoryColour').css('background-color', incomeCategory[i].colour);
        $legendIncomeCategory.children('.legendCategoryName').text(incomeCategory[i].name);

        var transactionsInCategory = filteredTransaction.filter(e => {
            return e.category == incomeCategory[i].name;
        });

        var amount = 0;
        for(var t = 0; t < transactionsInCategory.length; t++) {
            amount += transactionsInCategory[t].amount;
        }

        $legendIncomeCategory.children('.legendCategoryAmount').text('$' + amount.toFixed(2));

        totalIncome += amount;
        incomeCategoryAmount.push(amount);
        incomeCategoryLabel.push(incomeCategory[i].name);
        incomeCategoryColour.push(incomeCategory[i].colour);

        $('#incomeCategories').append($legendIncomeCategory);
    }

    //Display expense legend
    $('#expenseCategories').empty();
    expenseCategoryLabel = [];
    expenseCategoryAmount = [];
    expenseCategoryColour = [];
    var totalExpenses = 0;
    for(var i = 0; i < expenseCategory.length; i++) {
        var $legendExpenseCategory = $($.parseHTML(legendCategoryFormat));
        $legendExpenseCategory.children('.legendCategoryColour').css('background-color', expenseCategory[i].colour);
        $legendExpenseCategory.children('.legendCategoryName').text(expenseCategory[i].name);

        var transactionsInCategory = filteredTransaction.filter(e => {
            return e.category == expenseCategory[i].name;
        });

        var amount = 0;
        for(var t = 0; t < transactionsInCategory.length; t++) {
            amount += transactionsInCategory[t].amount;
        }

        $legendExpenseCategory.children('.legendCategoryAmount').text('$' + amount.toFixed(2));

        totalExpenses += amount;
        expenseCategoryAmount.push(amount);
        expenseCategoryLabel.push(expenseCategory[i].name);
        expenseCategoryColour.push(expenseCategory[i].colour);

        $('#expenseCategories').append($legendExpenseCategory);
    }

    //Update Income, Expense, and Balance 
    var oldIncome = $('#incomeAmount').text();
    var newIncome = '$' + totalIncome.toFixed(2);
    var oldExpense = $('#expenseAmount').text();
    var newExpense = '$' + totalExpenses.toFixed(2);
    $('#incomeAmount').text(newIncome);
    $('#expenseAmount').text(newExpense);

    var balance = totalIncome - totalExpenses;
    if(balance >= 0) {
        $('#balanceAmount').text('$' + balance.toFixed(2));
    } else {
        $('#balanceAmount').text('- $' + Math.abs(balance).toFixed(2));
    }

    //Update income graph
    if(oldIncome != newIncome) {
        incomeGraph.data.labels = incomeCategoryLabel;
        incomeGraph.data.datasets[0].data = incomeCategoryAmount;
        incomeGraph.data.datasets[0].backgroundColor = incomeCategoryColour;
        incomeGraph.update();
    }

    //Update expense graph
    if(oldExpense != newExpense) {
        expenseGraph.data.labels = expenseCategoryLabel;
        expenseGraph.data.datasets[0].data = expenseCategoryAmount;
        expenseGraph.data.datasets[0].backgroundColor = expenseCategoryColour;
        expenseGraph.update();
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
    /*var filteredTransaction = transaction.filter(e => {
        var date = new Date(e.date);
        return startDate < date && date < currDate;
    });*/


    $('#transactionsListContent').empty();
    for(var i = 0; i < filteredTransaction.length; i++) {
        var $transactionItem = $($.parseHTML(transactionItemFormat));
        $transactionItem.attr('transactionID', filteredTransaction[i].transactionID);
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
        if($('.burgerMenu').is(':hidden')) {
            $('.home').hide();
            $('.addEditCategories').show();
            resetAddEditCategoriesPage();
            prevPage = '.home';
            currPage = '.addEditCategories';
            isIncome = $(this).is('#addIncomeCategory');
            isNew = true;
            $('#editCategory').hide();
            hideExpenseFields(isIncome);
        }
    });

    $(document).on('click', '.legendItem', function() {
        if($('.burgerMenu').is(':hidden')) {
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
        }
    });

    $('#incomeLegend .expandPanel').click(function() {
        if($('.burgerMenu').is(':hidden')) {
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
        }
    });

    $('#expenseLegend .expandPanel').click(function() {
        if($('.burgerMenu').is(':hidden')) {
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
        }
    });
}

function showMeTheBurger() {
	$('.burgerMenu').hide();
	$('#timeContainer').hide();
	disableButton();
    onHover();
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
        resetHome();
    });

    $('#goTransactions').click(function() {
        if(currPage != '.transactionsList') {
            $(currPage).hide();
            $('.transactionsList').show();
            prevPage = currPage;
            currPage = '.transactionsList';
            resetTransactionsList();
        }
        $('.burgerMenu').slideUp();
		disableButton();
    });
	
	// Uncomment if we add the reminders page
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
            $('#pageContent').removeAttr('style');
        }
        $('.burgerMenu').slideUp();
		disableButton();
    });

    $(document).click(function(event) {
        var burger = $('.burgerMenu, #burgerButton');

        if(!burger.is(event.target) && !burger.has(event.target).length) {
            $('.burgerMenu').hide();
        }
    });
	
}

function disableButton() {
    $(':button').prop('disabled', false); 
    if (currPage == '.home') {
        $('#goBackHome').attr('disabled',true);
    }
	if (currPage =='.transactionsList') {
        $('#goTransactions').attr('disabled',true);
    }
	if (currPage == '.settings') {
        $('#goSettings').attr('disabled',true);
    }
    disableTime();	
}

function setTimePeriod() {
	$('#dailyButton').click(function() {
        if(timePeriod != 'daily') {
            timePeriod = 'daily';
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
        $('#dailyButton').attr('disabled',true);    // Disable time period
        $('#dailyContainer').css("background-color","#DCDCDC");
        $('#dailyButton').css("background-color","#DCDCDC");
        $('#timeContainer').children().not($('#dailyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#dailyButton')).css("background-color","white");
    }
    if (timePeriod == 'weekly') { 
        $('#weeklyButton').attr('disabled',true);
        $('#weeklyContainer').css("background-color","#DCDCDC");
        $('#weeklyButton').css("background-color","#DCDCDC");
        $('#timeContainer').children().not($('#weeklyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#weeklyButton')).css("background-color","white");
    }	
    if (timePeriod == 'biWeekly') {
        $('#biWeeklyButton').attr('disabled',true);
        $('#biWeeklyContainer').css("background-color","#DCDCDC");
        $('#biWeeklyButton').css("background-color","#DCDCDC");
        $('#timeContainer').children().not($('#biWeeklyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#biWeeklyButton')).css("background-color","white");
    }	
    if (timePeriod == 'monthly') {
        $('#monthlyButton').attr('disabled',true);
        $('#monthlyContainer').css("background-color","#DCDCDC");
        $('#monthlyButton').css("background-color","#DCDCDC");
        $('#timeContainer').children().not($('#monthlyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#monthlyButton')).css("background-color","white");
    }	
    if (timePeriod == 'yearly') { 
        $('#yearlyButton').attr('disabled',true);
        $('#yearlyContainer').css("background-color","#DCDCDC");
        $('#yearlyButton').css("background-color","#DCDCDC");
        $('#timeContainer').children().not($('#yearlyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#yearlyButton')).css("background-color","white");
    }	
}

function onHover() {
    $("#dailyContainer").hover(function(){
        $(this).css("background-color", "#DCDCDC");
        $("#dailyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#dailyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#dailyButton").css("background-color", "white");
            } 
    });

    $("#weeklyContainer").hover(function(){
        $(this).css("background-color", "#DCDCDC");
        $("#weeklyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#weeklyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#weeklyButton").css("background-color", "white");
            } 
    });

    $("#biWeeklyContainer").hover(function(){
        $(this).css("background-color", "#DCDCDC");
        $("#biWeeklyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#biWeeklyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#biWeeklyButton").css("background-color", "white");
            } 
    });

    $("#monthlyContainer").hover(function(){
        $(this).css("background-color", "#DCDCDC");
        $("#monthlyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#monthlyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#monthlyButton").css("background-color", "white");
            } 
    });

    $("#yearlyContainer").hover(function(){
        $(this).css("background-color", "#DCDCDC");
        $("#yearlyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#yearlyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#yearlyButton").css("background-color", "white");
            } 
    });
}

function transactionList() {
    $('#addTransaction').click(function() {
        if($('.burgerMenu').is(':hidden')) {
            $('.transactionsList').hide();
            $('.addEditTransactions').show();
            resetAddEditTransactionsPage();
            $('#pageContent').removeAttr('style');
            $('#editTransaction').hide();
            prevPage = '.transactionsList';
            currPage = '.addEditTransactions';
            isNew = true;
        }
    });

    $(document).on('click', '.transactionItem', function() {
        if($('.burgerMenu').is(':hidden')) {
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
                return e.transactionID == $(this).attr('transactionID');
            });

            currTransaction = transaction.findIndex(e => {
                return e == transactionItem;
            });

            if(transactionItem != undefined && transactionItem.willRepeat) {
                $('#transactionRepeat_Check').click();
                $('#transactionRepeatEvery_Number').val(transactionItem.repeat_num);
                $('#transactionRepeatEvery_TimePeriod').val(transactionItem.repeat_timePeriod);
            }

            $('div.addEditTransactions').attr('transactionID', $(this).attr('transactionID'));
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

    $('label').click(function(event) {
        event.preventDefault();
    });

    window.Parsley.addValidator('preventDuplicate', {
        validateString: function(value) {
            var id = -1;
            if(isIncome) {
                id = incomeCategory.findIndex(e => {
                    return e.name == value;
                });
            } else {
                id = incomeCategory.findIndex(e => {
                    return e.name == value;
                });
            }

            return id < 0;
        },
        messages: {
            en: "A category with that name already exists."
        }
    });

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
                    transactionID: transactionID,
                    isIncome: $('#transactionType').val() == 'income',
                    category: $('#transactionCategory_Select').val(),
                    amount: parseFloat($('#transactionAmount').val()),
                    date: $('#transactionDate').val(),
                    willRepeat: repeat
                };

                if(repeat) {
                    var repeatForever = $('#transactionDuration_Select').val() == 'forever';
                    newTransaction = {
                        transactionID: transactionID,
                        isIncome: $('#transactionType').val() == 'income',
                        category: $('#transactionCategory_Select').val(),
                        amount: parseFloat($('#transactionAmount').val()),
                        date: $('#transactionDate').val(),
                        willRepeat: repeat,
                        repeat_num: parseInt($('#transactionRepeatEvery_Number').val()),
                        repeat_timePeriod: $('#transactionRepeatEvery_TimePeriod').val(),
                        repeat_duration: repeatForever
                    };

                    if(!repeatForever) {
                        var repeatUntil;

                        if($('#transactionDuration_Select').val() == 'endDate') {
                            repeatUntil = $('#transactionEndDate').val();
                        } else {
                            var repeatUntilDate = new Date($('#transactionDate').val());
                            repeatUntilDate.setDate(repeatUntilDate.getDate() + 1);
                            var repeatTimePeriod = $('#transactionRepeatEvery_TimePeriod').val();
                            var repeatNum = $('#transactionRepeatEvery_Number').val();
                            var numTimes = $('#numOfPayments').val();
                            if(repeatTimePeriod == 'days') {
                                repeatUntilDate.setDate(repeatUntilDate.getDate() + (numTimes * repeatNum));
                            } else if(repeatTimePeriod == 'weeks') {
                                repeatUntilDate.setDate(repeatUntilDate.getDate() + (numTimes * 7 * repeatNum));
                            } else if(repeatTimePeriod == 'months') {
                                repeatUntilDate.setMonth(repeatUntilDate.getMonth() + (numTimes * repeatNum));
                            } else if(repeatTimePeriod == 'years') {
                                repeatUntilDate.setFullYear(repeatUntilDate.getFullYear() + (numTimes * repeatNum));
                            }

                            repeatUntil = repeatUntilDate.getFullYear() + "-" + (repeatUntilDate.getMonth() + 1) + "-" + repeatUntilDate.getDate();
                        }

                        newTransaction = {
                            transactionID: transactionID,
                            isIncome: $('#transactionType').val() == 'income',
                            category: $('#transactionCategory_Select').val(),
                            amount: parseFloat($('#transactionAmount').val()),
                            date: $('#transactionDate').val(),
                            willRepeat: repeat,
                            repeat_num: parseInt($('#transactionRepeatEvery_Number').val()),
                            repeat_timePeriod: $('#transactionRepeatEvery_TimePeriod').val(),
                            repeat_duration: repeatForever,
                            repeat_until: repeatUntil
                        };
                    }
                }

                if(isNew) {
                    insertTransaction(newTransaction);
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

                transactionID++;
            }

            addTransactionListData();
            addHomeData();
            $(currPage).hide();

            var nextPage = '.home';
            if(prevPage == '.transactionsList')
                nextPage = '.transactionsList';

            $(nextPage).show();
            prevPage = currPage;
            currPage = nextPage;

            if(currPage == '.home')
                resetHome();
            else
                resetTransactionsList();
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
                resetTransactionsList();
            currPage = prevPage;
            prevPage = '.addEditTransactions';
        }

        if(currPage == '.home') {
            resetHome();
        }
    });

    $('#deleteTransaction').click(function() {
        //CRAIG
        var ID = $('div.addEditTransactions').attr('transactionID');
    });

    $('#deletCategory').click(function() {
        //CRAIG
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
    $('.transactionDuration').hide();
    $('.transactionEndDate').hide();
    $('.numOfPayments').hide();
	$('#transactionRepeat_Check').click(function() {
        $(".transactionRepeat").toggle();
        $(".transactionDuration").toggle();
		if ($("#transactionRepeat_Check").is(':checked')) {
            $('div.addEditTransactions').css('grid-template-rows', 'repeat(7, [inputField] max-content) [buttons] auto [end]');

            $('#transactionDuration_Select').on('change', function() {
                if (this.value == "endDate") {
                    $('div.addEditTransactions').css('grid-template-rows', 'repeat(8, [inputField] max-content) [buttons] auto [end]');
                    $('.transactionEndDate').toggle();
                    $('.numOfPayments').hide();
                }
                else if (this.value == "numPayments") {
                    $('div.addEditTransactions').css('grid-template-rows', 'repeat(8, [inputField] max-content) [buttons] auto [end]');
                    $('.transactionEndDate').hide();
                    $('.numOfPayments').toggle();
                }
                else if (this.value == "forever") {
                    $('div.addEditTransactions').css('grid-template-rows', 'repeat(7, [inputField] max-content) [buttons] auto [end]');
                    $('.transactionEndDate').hide();
                    $('.numOfPayments').hide();
                }
                else {
                    $('.transactionEndDate').hide();
                    $('.numOfPayments').hide();
                    $('div.addEditTransactions').css('grid-template-rows', 'repeat(7, [inputField] max-content) [buttons] auto [end]');
                }
              });
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

function resetHome() {
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

function resetTransactionsList() {
    $('#pageContent').css('padding', '0px');
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

function insertTransaction(newTransaction) {
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
}

function calculateAngle(event) {
    var boxBounds = event.target.getBoundingClientRect();
    var boxCenterX = boxBounds.left + (boxBounds.width/2);
    var boxCenterY = boxBounds.top + (boxBounds.height/2);
    var mouseX = event.pageX - boxCenterX;
    var mouseY = event.pageY - boxCenterY;

    return Math.abs((Math.atan2(mouseX, mouseY) * (180/Math.PI)) - 180);
}
