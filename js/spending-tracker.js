var currPage = ".home";
var prevPage = ".home";
var isIncome = false;
var isNew = false;
var currTransaction = 0;
var currCategory = 0;
var transactionID = 17;
var timePeriod = 'monthly'
var startDate = new Date(2021, 10, 1);
var currDate = new Date(2021, 11, 0);
var endDate = new Date(2021, 11, 0);
var incomeGraph;
var expenseGraph;
var deleteMe = false;

$(document).ready(function() {
    var draw = Chart.controllers.pie.prototype.draw;
    Chart.controllers.pie = Chart.controllers.pie.extend({
        draw: function() {
            draw.apply(this, arguments);
            var ctx = this.chart.chart.ctx;
            var fill = ctx.fill;
            ctx.fill = function() {
                ctx.save();
                ctx.shadowColor = 'rgb(0 0 0 / 20%)';
                ctx.shadowBlur = 3;
                fill.apply(this, arguments);
                ctx.restore();
            }
        }
    });

    incomeGraph = new Chart($('#incomeGraph'), {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                label: "Income Graph",
                data: [],
                backgroundColor: [],
                borderColor: '#F3F3F3',
                borderWidth: 0.75
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
            labels: [],
            datasets: [{
                label: "Expense Graph",
                data: [],
                backgroundColor: [],
                borderColor: '#F3F3F3',
                borderWidth: 0.75
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
    transactionsListPage();
    settingsPage();
	showMeTheBurger();
    changeTimePeriod();

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
    
    var filteredTransaction = transactionList.filter(e => {
        var date = new Date(e.date);
        date.setDate(date.getDate() + 1);
        date.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        return startDate <= date && date <= endDate;
    });

    //Display income legend
    $('#incomeCategories').empty();
    var incomeCategoryLabel = [];
    var incomeCategoryAmount = [];
    var tempIncomeCategoryAmount = [];
    var incomeCategoryColour = [];
    var totalIncome = 0;

    //Calculate amount per category
    for(var i = 0; i < incomeCategoryList.length; i++) {
        var transactionsInCategory = filteredTransaction.filter(e => {
            return e.category == incomeCategoryList[i].name;
        });

        var amount = 0;
        for(var t = 0; t < transactionsInCategory.length; t++) {
            amount += transactionsInCategory[t].amount;
        }

        totalIncome += amount;
        tempIncomeCategoryAmount.push(amount);
        incomeCategoryAmount.push(amount);
    }

    //Sort amounts from highest to lowest
    incomeCategoryAmount.sort((e1, e2) => {
        return -1 * (e1-e2);
    });

    //Display categories on home page in order
    for(var i = 0; i < incomeCategoryAmount.length; i++) {
        var index = tempIncomeCategoryAmount.findIndex(e => {
            return e == incomeCategoryAmount[i];
        });

        tempIncomeCategoryAmount[index] = -1;

        var $legendIncomeCategory = $($.parseHTML(legendCategoryFormat));
        $legendIncomeCategory.children('.legendCategoryColour').css('background-color', incomeCategoryList[index].colour);
        $legendIncomeCategory.children('.legendCategoryName').text(incomeCategoryList[index].name);
        $legendIncomeCategory.children('.legendCategoryAmount').text('$' + incomeCategoryAmount[i].toFixed(2));

        incomeCategoryLabel.push(incomeCategoryList[index].name);
        incomeCategoryColour.push(incomeCategoryList[index].colour);

        $('#incomeCategories').append($legendIncomeCategory);
    }

    //Display expense legend
    $('#expenseCategories').empty();
    var expenseCategoryLabel = [];
    var expenseCategoryAmount = [];
    var tempExpenseCategoryAmount = [];
    var expenseCategoryColour = [];
    var totalExpenses = 0;

    //Calculate amount per category
    for(var i = 0; i < expenseCategoryList.length; i++) {
        var transactionsInCategory = filteredTransaction.filter(e => {
            return e.category == expenseCategoryList[i].name;
        });

        var amount = 0;
        for(var t = 0; t < transactionsInCategory.length; t++) {
            amount += transactionsInCategory[t].amount;
        }

        totalExpenses += amount;
        expenseCategoryAmount.push(amount);
        tempExpenseCategoryAmount.push(amount);
    }

    //Sort amounts from highest to lowest
    expenseCategoryAmount.sort((e1, e2) => { 
        return -1 * (e1-e2);
    });

    //Display categories on home page in order
    for(var i = 0; i < expenseCategoryAmount.length; i++) {
        var index = tempExpenseCategoryAmount.findIndex(e => {
            return e == expenseCategoryAmount[i];
        });

        tempExpenseCategoryAmount[index] = -1;

        var $legendExpenseCategory = $($.parseHTML(legendCategoryFormat));
        $legendExpenseCategory.children('.legendCategoryColour').css('background-color', expenseCategoryList[index].colour);
        $legendExpenseCategory.children('.legendCategoryName').text(expenseCategoryList[index].name);
        $legendExpenseCategory.children('.legendCategoryAmount').text('$' + expenseCategoryAmount[i].toFixed(2));

        expenseCategoryLabel.push(expenseCategoryList[index].name);
        expenseCategoryColour.push(expenseCategoryList[index].colour);

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

    resetHome();
}

function addTransactionListData() {
    var transactionItemFormat = 
    '<div class="transactionItem">' +
        '<p class="category"></p>' +
        '<p class="amount"></p>' +
        '<div class="rect"></div>' +
        '<p class="date"></p>' +
    '</div>';

    var filteredTransaction = transactionList;
    filteredTransaction = transactionList.filter(e => {
        var date = new Date(e.date);
        date.setDate(date.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);
        startDate.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        return startDate <= date && date <= endDate;
    });


    $('#transactionsListContent').empty();
    for(var i = 0; i < filteredTransaction.length; i++) {
        var $transactionItem = $($.parseHTML(transactionItemFormat));
        $transactionItem.attr('transactionID', filteredTransaction[i].transactionID);
        $transactionItem.children('.category').text(filteredTransaction[i].category);
        $transactionItem.children('.amount').text('$' + (filteredTransaction[i].amount).toFixed(2));

        var category = undefined;
        if(filteredTransaction[i].isIncome) {
            $transactionItem.children('.amount').addClass('income');
            category = incomeCategoryList.find(e => {
                return e.name == filteredTransaction[i].category
            });
        } else {
            $transactionItem.children('.amount').addClass('expense');
            category = expenseCategoryList.find(e => {
                return e.name == filteredTransaction[i].category
            });
        }

        $transactionItem.children('.rect').css('background-color', category.colour).attr('category', category.name);

        var date = new Date(filteredTransaction[i].date);
        date.setDate(date.getDate() + 1);
        $transactionItem.children('.date').text(date.toLocaleString('default', { month: 'short' }) + ' ' + date.getDate() + ', ' + date.getFullYear());
        $transactionItem.children('.date').attr('date', filteredTransaction[i].date);
        $('#transactionsListContent').append($transactionItem);
    }

}

function homePage() {
    $('.legendCategoryAmount').hide();

    $('.addCategory').click(function() {
        if($('.burgerMenu').is(':hidden')) {
            $('.home').hide();
            resetAddEditCategoriesPage();
            prevPage = '.home';
            currPage = '.addEditCategories';
            isIncome = $(this).is('#addIncomeCategory');
            isNew = true;
            hideExpenseFields(isIncome);

            if(isIncome) {
                $('h1.addEditCategories').text('Income Category');
            } else {
                $('h1.addEditCategories').text('Expense Category');
            }
        }
    });

    $(document).on('click', '.legendItem', function() {
        if($('.burgerMenu').is(':hidden')) {
            $('.home').hide();
            resetAddEditCategoriesPage();

            prevPage = '.home';
            currPage = '.existingCategory';
            isIncome = $(this).parents('#incomeLegend').length;
            isNew = false;

            //Populate data
            var category = undefined;
            if(isIncome) {
                hideExpenseFields(true);
                category = incomeCategoryList.find(e => {
                    return e.name == $(this).find('.legendCategoryName:first').text();
                });

                currCategory = incomeCategoryList.findIndex(e => {
                    return e == category;
                });
            } else {
                category = expenseCategoryList.find(e => {
                    return e.name == $(this).find('.legendCategoryName:first').text();
                });

                currCategory = expenseCategoryList.findIndex(e => {
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

            $('h1.existingCategory').text(category.name);
            $('.addEditCategories').hide();
            $('.existingCategory').show();
        }
    });

    $('#editCategory').click(function() {
        prevPage = currPage;
        currPage = '.addEditCategories';
        $('.existingCategory').hide();
        $('.addEditCategories').show();
        $('#categoryName').removeAttr('data-parsley-prevent-duplicate');

        if(isIncome) {
            $('h1.addEditCategories').text('Income Category');
        } else {
            $('h1.addEditCategories').text('Expense Category');
        }
    });

    $('#incomeLegend .expandPanel').click(function() {
        if($('.burgerMenu').is(':hidden')) {
            if($('#incomeLegend .legendCategoryAmount').is(':hidden')) {
                $('#incomeGraphContainer').hide();

                $('#incomeLegend').css('grid-column-start', 'graph');
                $('#incomeLegend .legendItem').css('padding-top', '2.5%');
                $('#incomeLegend .legendItem:first-child').removeAttr('style');
                $('#incomeLegend .buttonWrapper').css('padding', '2.5% 0px');
                $('#incomeLegend .legendContentWrapper').css('padding', '0px 2.5%');
                $('#incomeLegend .legendContent').css('margin','2.5% 0px 2% 0px');
                $('#incomeLegend .legendContent').css('height','92%');
                $('#incomeLegend .expandPanelArrow').css('border-right', 'none');

                if($(window).width() >= 650 && $(window).height() >= 775) {
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
                    '#incomeLegend .legendContent,' +
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
                $('#expenseLegend .legendItem:first-child').removeAttr('style');
                $('#expenseLegend .buttonWrapper').css('padding', '2.5% 0px');
                $('#expenseLegend .legendContent').css('margin', '2.5% 0px 2% 0px');
                $('#expenseLegend .legendContent').css('height', '92%');
                $('#expenseLegend .legendContentWrapper').css('padding', '0px 2.5%');
                $('#expenseLegend .expandPanelArrow').css('border-right', 'none');

                if($(window).width() >= 650 && $(window).height() >= 775) {
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
                    '#expenseLegend .legendContent,' +
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
	$('#burgerButton').click(function() {
		$('.burgerMenu').slideToggle();
		$('#timeContainer').hide();
        $('#timePeriodButton hr:not(.hide)').addClass('hide');
	});
	
	$('#goChangeTimePeriod').click(function() {
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
        currDate = new Date(2021, 11, 0);
        startDate = new Date(2021, 11, 0);
        endDate = new Date(2021, 11, 0);
        $('h1.home').text(currDate.toLocaleString('default', { month: 'short' }) + ' ' + currDate.getDate());
        addHomeData();
        addTransactionListData();
		disableButton();
    });

    $('#weeklyButton').click(function() {
        if(timePeriod != 'weekly') {
            timePeriod = 'weekly';     
        }
        currDate = new Date(2021, 11, 0);
        startDate = new Date(2021, 10, 28);
        endDate = new Date(2021, 11, 4);
        
        if(startDate.getMonth() != endDate.getMonth()) {
            $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.toLocaleString('default', { month: 'short' }) + ' ' + endDate.getDate());
        } else {
            $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.getDate());
        }
        addHomeData();
        addTransactionListData();
		disableButton();
    });

    $('#biWeeklyButton').click(function() {
        if(timePeriod != 'biWeekly') {
            timePeriod = 'biWeekly';     
        }
        currDate = new Date(2021, 11, 0);
        startDate = new Date(2021, 10, 28);
        endDate = new Date(2021, 11, 11);
        
        if(startDate.getMonth() != endDate.getMonth()) {
            $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.toLocaleString('default', { month: 'short' }) + ' ' + endDate.getDate());
        } else {
            $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.getDate());
        }
        addHomeData();
        addTransactionListData();
        disableButton();
    });

    $('#monthlyButton').click(function() {
        if(timePeriod != 'monthly') {
            timePeriod = 'monthly';
        }
        currDate = new Date(2021, 11, 0);
        startDate = new Date(2021, 10, 01);
        endDate = new Date(2021, 11, 0);
        $('h1.home').text(currDate.toLocaleString('default', { month: 'long' }));
        addHomeData();
        addTransactionListData();
		disableButton();
    });

    $('#yearlyButton').click(function() {
        if(timePeriod != 'yearly') {
            timePeriod = 'yearly';
        }
        currDate = new Date(2021, 11, 0);
        startDate = new Date(2021, 0, 1);
        endDate = new Date(2021, 11, 0);
        $('h1.home').text(currDate.getFullYear());
        addHomeData();
        addTransactionListData();
		disableButton();
    });
}

function changeTimePeriod() {
	$('#leftArrow').click(function() {
        if(timePeriod == 'daily') {
            currDate.setDate(currDate.getDate() - 1);
            startDate.setDate(startDate.getDate() - 1);
            endDate.setDate(startDate.getDate() - 1);
            $('h1.home').text(currDate.toLocaleString('default', { month: 'short' }) + ' ' + currDate.getDate());
        }

        if(timePeriod == 'weekly') {
            currDate.setDate(currDate.getDate() - 7);
            startDate.setDate(startDate.getDate() - 7);
            endDate.setDate(endDate.getDate() - 7);
            if(startDate.getMonth() != endDate.getMonth()) {
                $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.toLocaleString('default', { month: 'short' }) + ' ' + endDate.getDate());
            } else {
                $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.getDate());
            }
        }

        if(timePeriod == 'biWeekly') {
            currDate.setDate(currDate.getDate() - 14);
            startDate.setDate(startDate.getDate() - 14);
            endDate.setDate(endDate.getDate() - 14);
            if(startDate.getMonth() != endDate.getMonth()) {
                $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.toLocaleString('default', { month: 'short' }) + ' ' + endDate.getDate());
            } else {
                $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate()+ ' - ' + endDate.getDate());
            }
        }
         
        if(timePeriod == 'monthly') {
            var tempYear = currDate.getFullYear();
            var tempMonth = currDate.getMonth();
            currDate = new Date(tempYear,tempMonth, 0)
            startDate = new Date(tempYear,tempMonth-1, 1);
            endDate = new Date(tempYear,tempMonth, 0);
            $('h1.home').text(currDate.toLocaleString('default', { month: 'long' }));
        }

        if(timePeriod == 'yearly') {
            currDate.setFullYear(currDate.getFullYear() - 1);
            startDate.setFullYear(startDate.getFullYear() - 1);
            endDate.setFullYear(endDate.getFullYear() - 1);
            $('h1.home').text(currDate.getFullYear());
        }

        addHomeData();
        addTransactionListData();
    });

    $('#rightArrow').click(function() {

        if(timePeriod == 'daily') {
            currDate.setDate(currDate.getDate() + 1);
            startDate.setDate(startDate.getDate() + 1);
            endDate.setDate(startDate.getDate() + 1);
            $('h1.home').text(currDate.toLocaleString('default', { month: 'short' }) + ' ' + currDate.getDate());
        }

        if(timePeriod == 'weekly') {
            currDate.setDate(currDate.getDate() + 7);
            startDate.setDate(startDate.getDate() + 7);
            endDate.setDate(endDate.getDate() + 7);
            if(startDate.getMonth()!=endDate.getMonth()) {
                $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.toLocaleString('default', { month: 'short' }) + ' ' + endDate.getDate());
            } else {
                $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.getDate());
            }
        }

        if(timePeriod == 'biWeekly') {
            currDate.setDate(currDate.getDate() + 14);
            startDate.setDate(startDate.getDate() + 14);
            endDate.setDate(endDate.getDate() + 14);
            if(startDate.getMonth()!=endDate.getMonth()) {
                $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.toLocaleString('default', { month: 'short' }) + ' ' + endDate.getDate());
            } else {
                $('h1.home').text(startDate.toLocaleString('default', { month: 'short' }) + ' ' + startDate.getDate() + ' - ' + endDate.getDate());
            }
        }
        
        if(timePeriod == 'monthly') {
            var tempYear = currDate.getFullYear();
            var tempMonth = currDate.getMonth()+2;
            currDate = new Date(tempYear, tempMonth, 0);
            startDate = new Date(tempYear, tempMonth-1, 1);
            endDate = new Date(tempYear, tempMonth, 0);
            $('h1.home').text(currDate.toLocaleString('default', { month: 'long' }));
        }

        if(timePeriod == 'yearly') {
            currDate.setFullYear(currDate.getFullYear() + 1);
            startDate.setFullYear(startDate.getFullYear() + 1);
            endDate.setFullYear(endDate.getFullYear() + 1);
            $('h1.home').text(currDate.getFullYear());
        }

        var filteredTransaction = transactionList;
        filteredTransaction = transactionList.filter(e => {
            var date = new Date(e.date);
            date.setDate(date.getDate() + 1);
            date.setHours(0, 0, 0, 0);
            startDate.setHours(0, 0, 0, 0);
            endDate.setHours(0, 0, 0, 0);
            return e.willRepeat && e.repeat_until == 'forever';
        });

        for(var i = 0; i < filteredTransaction.length; i++) {
            var transactionDate = new Date(filteredTransaction[i].date);
            transactionDate.setDate(transactionDate.getDate() + 1);
            
            while(transactionDate < endDate) {
                if(filteredTransaction[i].repeat_timePeriod == 'days') {
                    transactionDate.setDate(transactionDate.getDate() + filteredTransaction[i].repeat_num);
                } else if(filteredTransaction[i].repeat_timePeriod == 'weeks') {
                    transactionDate.setDate(transactionDate.getDate() + (7 * filteredTransaction[i].repeat_num));
                } else if(filteredTransaction[i].repeat_timePeriod == 'months') {
                    transactionDate.setMonth(transactionDate.getMonth() + filteredTransaction[i].repeat_num);
                } else if(filteredTransaction[i].repeat_timePeriod == 'years') {
                    transactionDate.setFullYear(transactionDate.getFullYear() + filteredTransaction[i].repeat_num);
                }

                if(transactionDate >= startDate) {
                    var date = transactionDate.getFullYear() + "-" + (transactionDate.getMonth() + 1) + "-" + transactionDate.getDate();
                    if(transactionDate.getDate() < 10) {
                        var dateArr = date.split('-');
                        date = dateArr[0] + '-' + dateArr[1] + '-0' + dateArr[2];
                    }
                    
                    if(transactionDate.getMonth() < 10) {
                        var dateArr = date.split('-');
                        date = dateArr[0] + '-0' + dateArr[1] + '-' + dateArr[2];
                    }
    
                    var exists = transactionList.findIndex(e => {
                        var splitID = e.transactionID.split("-");
                        return e.date == date && splitID[0] == filteredTransaction[i].transactionID;
                    });
    
                    if(exists < 0) {
                        var transaction = {
                            transactionID: filteredTransaction[i].transactionID + "-" + transactionID,
                            isIncome: filteredTransaction[i].isIncome,
                            category: filteredTransaction[i].category,
                            amount: filteredTransaction[i].amount,
                            date: date,
                            isRepeat: true,
                            willRepeat: false
                        };
                        insertTransaction(transaction);
                        transactionID++;
                    }
                }
            }
        }
        
        addHomeData();
        addTransactionListData();
    });
}

function disableTime() {
    if (timePeriod == 'daily') {       
        $('#dailyButton').attr('disabled',true);    // Disable time period
        $('#dailyContainer').css("background-color","#DCDCDC");
        $('#dailyButton').css("background-color","#DCDCDC");
        $('#dailyContainer').css("cursor","default");
        $('#dailyButton').css("cursor","default");
        $('#timeContainer').children().not($('#dailyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#dailyButton')).css("background-color","white");
    }
    if (timePeriod == 'weekly') { 
        $('#weeklyButton').attr('disabled',true);
        $('#weeklyContainer').css("background-color","#DCDCDC");
        $('#weeklyButton').css("background-color","#DCDCDC");
        $('#weeklyContainer').css("cursor","default");
        $('#weeklyButton').css("cursor","default");
        $('#timeContainer').children().not($('#weeklyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#weeklyButton')).css("background-color","white");
    }	
    if (timePeriod == 'biWeekly') {
        $('#biWeeklyButton').attr('disabled',true);
        $('#biWeeklyContainer').css("background-color","#DCDCDC");
        $('#biWeeklyButton').css("background-color","#DCDCDC");
        $('#biWeeklyContainer').css("cursor","default");
        $('#biWeeklyButton').css("cursor","default");
        $('#timeContainer').children().not($('#biWeeklyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#biWeeklyButton')).css("background-color","white");
    }	
    if (timePeriod == 'monthly') {
        $('#monthlyButton').attr('disabled',true);
        $('#monthlyContainer').css("background-color","#DCDCDC");
        $('#monthlyButton').css("background-color","#DCDCDC");
        $('#monthlyContainer').css("cursor","default");
        $('#monthlyButton').css("cursor","default");
        $('#timeContainer').children().not($('#monthlyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#monthlyButton')).css("background-color","white");
    }	
    if (timePeriod == 'yearly') { 
        $('#yearlyButton').attr('disabled',true);
        $('#yearlyContainer').css("background-color","#DCDCDC");
        $('#yearlyButton').css("background-color","#DCDCDC");
        $('#yearlyContainer').css("cursor","default");
        $('#yearlyButton').css("cursor","default");
        $('#timeContainer').children().not($('#yearlyContainer')).css("background-color","white");
        $('#timeContainer').children().children().children().not($('#yearlyButton')).css("background-color","white");
    }	
}

function onHover() {
    $("#dailyContainer").hover(function() {
        $(this).css("background-color", "#DCDCDC");
        $("#dailyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#dailyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#dailyButton").css("background-color", "white");
            } 
    });

    $("#weeklyContainer").hover(function() {
        $(this).css("background-color", "#DCDCDC");
        $("#weeklyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#weeklyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#weeklyButton").css("background-color", "white");
            } 
    });

    $("#biWeeklyContainer").hover(function() {
        $(this).css("background-color", "#DCDCDC");
        $("#biWeeklyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#biWeeklyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#biWeeklyButton").css("background-color", "white");
            } 
    });

    $("#monthlyContainer").hover(function() {
        $(this).css("background-color", "#DCDCDC");
        $("#monthlyButton").css("background-color", "#DCDCDC");
    }, function() {
        if ($('#monthlyButton').is(":not(:disabled)"))
            {
                $(this).css("background-color", "white");
                $("#monthlyButton").css("background-color", "white");
            } 
    });

    $("#yearlyContainer").hover(function() {
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

function transactionsListPage() {
    $('#addTransaction').click(function() {
        if($('.burgerMenu').is(':hidden')) {
            $('.transactionsList').hide();
            resetAddEditTransactionsPage();
            $('#pageContent').removeAttr('style');
            prevPage = '.transactionsList';
            currPage = '.addEditTransactions';
            isNew = true;
        }
    });

    $(document).on('click', '.transactionItem', function() {
        if($('.burgerMenu').is(':hidden')) {
            $('.transactionsList').hide();
            $('#pageContent').removeAttr('style');
            resetAddEditTransactionsPage();
            prevPage = '.transactionsList';
            currPage = '.existingTransaction';
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

            var transactionItem = transactionList.find(e => {
                return e.transactionID == $(this).attr('transactionID');
            });

            currTransaction = transactionList.findIndex(e => {
                return e == transactionItem;
            });

            if(transactionItem != undefined && transactionItem.willRepeat) {
                $('#transactionRepeat_Check').click();
                $('#transactionRepeatEvery_Number').val(transactionItem.repeat_num);
                $('#transactionRepeatEvery_TimePeriod').val(transactionItem.repeat_timePeriod);
                $('#repeatUntil_Select').val(transactionItem.repeat_until);
                if(transactionItem.repeat_until == 'date') {
                    $('#transactionEndDate').val(transactionItem.repeat_until_date);
                    $('div.addEditTransactions').css('grid-template-rows', 'repeat(8, [inputField] max-content) [end]');
                    $('.transactionEndDate').show();
                } else if(transactionItem.repeat_until == 'num') {
                    $('#numTimesRepeated').val(transactionItem.repeat_until_num);
                    $('div.addEditTransactions').css('grid-template-rows', 'repeat(8, [inputField] max-content) [end]');
                    $('.numTimesRepeated').show();
                }
            }

            $('div.addEditTransactions').attr('transactionID', $(this).attr('transactionID'));

            $('h1.existingTransaction').text(category);
            $('.addEditTransactions').hide();
            $('.existingTransaction').show();
        }
    });

    $('#editTransaction').click(function() {
        prevPage = currPage;
        currPage = '.addEditTransactions';
        $('.existingTransaction').hide();
        $('.addEditTransactions').show();
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
                id = incomeCategoryList.findIndex(e => {
                    return e.name == value;
                });
            } else {
                id = incomeCategoryList.findIndex(e => {
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
                        incomeCategoryList.push(newCategory);
                    } else {

                        for(var i = 0; i < transactionList.length; i++) {
                            if(transactionList[i].category == incomeCategoryList[currCategory].name) {
                                transactionList[i].category = newCategory.name;
                            }
                        }

                        incomeCategoryList[currCategory].name = newCategory.name;
                        incomeCategoryList[currCategory].colour = newCategory.colour;
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
                        expenseCategoryList.push(newCategory);
                    } else {

                        for(var i = 0; i < transactionList.length; i++) {
                            if(transactionList[i].category == expenseCategoryList[currCategory].name) {
                                transactionList[i].category = newCategory.name;
                            }
                        }

                        expenseCategoryList[currCategory].name = newCategory.name;
                        expenseCategoryList[currCategory].colour = newCategory.colour;
                        expenseCategoryList[currCategory].setBudget = newCategory.setBudget;

                        if(setBudget) {
                            expenseCategoryList[currCategory].budget = newCategory.budget;
                            expenseCategoryList[currCategory].every_num = newCategory.every_num;
                            expenseCategoryList[currCategory].every_timePeriod = newCategory.every_timePeriod;
                            expenseCategoryList[currCategory].warning = newCategory.warning;
                        }
                    }
                }
            } else if($('div.addEditTransactions').is(':visible')) {
                var repeat = $('#transactionRepeat_Check').is(':checked');
                var newTransaction = {
                    transactionID: transactionID + '',
                    isIncome: $('#transactionType').val() == 'income',
                    category: $('#transactionCategory_Select').val(),
                    amount: parseFloat($('#transactionAmount').val()),
                    date: $('#transactionDate').val(),
                    isRepeat: false,
                    willRepeat: repeat
                };

                if(repeat) {
                    var repeatUntil = $('#repeatUntil_Select').val();
                    var repeatNum = parseInt($('#transactionRepeatEvery_Number').val());
                    var repeatTimePeriod = $('#transactionRepeatEvery_TimePeriod').val();
                    newTransaction = {
                        transactionID: transactionID + '',
                        isIncome: $('#transactionType').val() == 'income',
                        category: $('#transactionCategory_Select').val(),
                        amount: parseFloat($('#transactionAmount').val()),
                        date: $('#transactionDate').val(),
                        isRepeat: false,
                        willRepeat: repeat,
                        repeat_num: repeatNum,
                        repeat_timePeriod: repeatTimePeriod,
                        repeat_until: repeatUntil
                    };

                    if(repeatUntil != 'forever') {
                        var repeatUntilDate = $('#transactionEndDate').val();
                        if($('#repeatUntil_Select').val() == 'date') {
                            newTransaction = {
                                transactionID: transactionID + '',
                                isIncome: $('#transactionType').val() == 'income',
                                category: $('#transactionCategory_Select').val(),
                                amount: parseFloat($('#transactionAmount').val()),
                                date: $('#transactionDate').val(),
                                isRepeat: false,
                                willRepeat: repeat,
                                repeat_num: repeatNum,
                                repeat_timePeriod: repeatTimePeriod,
                                repeat_until: repeatUntil,
                                repeat_until_date: repeatUntilDate
                            };
                            
                        } else {
                            var tempRepeatUntilDate = new Date($('#transactionDate').val());
                            tempRepeatUntilDate.setDate(tempRepeatUntilDate.getDate() + 1);
                            var numTimes = parseInt($('#numTimesRepeated').val());

                            if(repeatTimePeriod == 'days') {
                                tempRepeatUntilDate.setDate(tempRepeatUntilDate.getDate() + (numTimes * repeatNum));
                            } else if(repeatTimePeriod == 'weeks') {
                                tempRepeatUntilDate.setDate(tempRepeatUntilDate.getDate() + (numTimes * 7 * repeatNum));
                            } else if(repeatTimePeriod == 'months') {
                                tempRepeatUntilDate.setMonth(tempRepeatUntilDate.getMonth() + (numTimes * repeatNum));
                            } else if(repeatTimePeriod == 'years') {
                                tempRepeatUntilDate.setFullYear(tempRepeatUntilDate.getFullYear() + (numTimes * repeatNum));
                            }

                            repeatUntilDate = tempRepeatUntilDate.getFullYear() + "-" + (tempRepeatUntilDate.getMonth() + 1) + "-" + tempRepeatUntilDate.getDate();

                            newTransaction = {
                                transactionID: transactionID + '',
                                isIncome: $('#transactionType').val() == 'income',
                                category: $('#transactionCategory_Select').val(),
                                amount: parseFloat($('#transactionAmount').val()),
                                date: $('#transactionDate').val(),
                                isRepeat: false,
                                willRepeat: repeat,
                                repeat_num: repeatNum,
                                repeat_timePeriod: repeatTimePeriod,
                                repeat_until: repeatUntil,
                                repeat_until_date: repeatUntilDate,
                                repeat_until_num: numTimes
                            };
                        }

                        if(isNew) {
                            var transactionDate = new Date($('#transactionDate').val());
                            transactionDate.setDate(transactionDate.getDate() + 1);
                            var repeatDate = new Date(repeatUntilDate);
                            repeatDate.setDate(repeatDate.getDate() + 1);
                            var originalTransactionID = transactionID + '';
                            while(transactionDate < repeatDate) {
                                if(repeatTimePeriod == 'days') {
                                    transactionDate.setDate(transactionDate.getDate() + repeatNum);
                                } else if(repeatTimePeriod == 'weeks') {
                                    transactionDate.setDate(transactionDate.getDate() + (7 * repeatNum));
                                } else if(repeatTimePeriod == 'months') {
                                    transactionDate.setMonth(transactionDate.getMonth() + repeatNum);
                                } else if(repeatTimePeriod == 'years') {
                                    transactionDate.setFullYear(transactionDate.getFullYear() + repeatNum);
                                }
    
                                var date = transactionDate.getFullYear() + "-" + (transactionDate.getMonth() + 1) + "-" + transactionDate.getDate();
                                if(transactionDate.getDate() < 10) {
                                    var dateArr = date.split('-');
                                    date = dateArr[0] + '-' + dateArr[1] + '-0' + dateArr[2];
                                }
                                
                                if(transactionDate.getMonth() < 10) {
                                    var dateArr = date.split('-');
                                    date = dateArr[0] + '-0' + dateArr[1] + '-' + dateArr[2];
                                }
    
                                transactionID++;
                                var transaction = {
                                    transactionID: originalTransactionID + "-" + transactionID,
                                    isIncome: $('#transactionType').val() == 'income',
                                    category: $('#transactionCategory_Select').val(),
                                    amount: parseFloat($('#transactionAmount').val()),
                                    date: date,
                                    isRepeat: true,
                                    willRepeat: false
                                };
                                insertTransaction(transaction);

                            }
                        }

                    }
                }

                if(isNew) {
                    insertTransaction(newTransaction);
                } else {
                    transactionList[currTransaction].isIncome = newTransaction.isIncome;
                    transactionList[currTransaction].category = newTransaction.category;
                    transactionList[currTransaction].amount = newTransaction.amount;
                    transactionList[currTransaction].date = newTransaction.date;
                    transactionList[currTransaction].willRepeat = newTransaction.willRepeat;

                    if(repeat) {
                        transactionList[currTransaction].repeat_num = newTransaction.repeat_num;
                        transactionList[currTransaction].repeat_timePeriod = newTransaction.repeat_timePeriod;
                    }
                }

                if(!isIncome) {
                    checkAmount(newTransaction.category);
                }

                transactionID++;
            }

            addTransactionListData();
            addHomeData();
            $(currPage).hide();

            var nextPage = '.home';
            if(prevPage == '.existingTransaction')
                nextPage = '.transactionsList';

            $(nextPage).show();
            prevPage = currPage;
            currPage = nextPage;

            if(currPage == '.home')
                resetHome();
            else
                resetTransactionsList();

            disableButton();
        }
    });
    
    $('#cancelButton').click(function() {
        $(currPage).hide();
        if(prevPage == '.transactionsList')
            resetTransactionsList();

        var nextPage = prevPage;

        if(currPage == '.existingCategory') {
            nextPage = '.home';
        } else if(currPage == '.existingTransaction') {
            nextPage = '.transactionsList';
        }

        prevPage = currPage;
        currPage = nextPage;

        $(currPage).show();
        if(currPage == '.home') {
            resetHome();
        } else if(currPage == '.transactionsList') {
            resetTransactionsList();
        }

        disableButton();
    });

    $('#deleteTransaction').click(function() {
        
        
        //var ID = $('div.addEditTransactions').attr('transactionID');
        deleteWarning('transaction');
        // if (deleteMe) {
        //     var index = transactionList.findIndex(e => {
        //     return e.transactionID == ID;   
        //     });

        //     transactionList.splice(index,1);
        //     addTransactionListData();
        //     addHomeData();
        //     $(currPage).hide();

        //     var nextPage = '.home';
        //     if(prevPage == '.transactionsList')
        //         nextPage = '.transactionsList';

        //     $(nextPage).show();
        //     prevPage = currPage;
        //     currPage = nextPage;

        //     if(currPage == '.home')
        //         resetHome();
        //     else
        //         resetTransactionsList();

        //     disableButton();
        //     deleteMe = false;
        // }
        // else {
        //     //
        // }
    });

    $('#deleteCategory').click(function() {
        deleteWarning('category');
        // var categoryName = $('#categoryName').val();
        // if(isIncome) {
        //     var index = incomeCategoryList.findIndex(e => {
        //         return e.name == categoryName;
        //     });
        //     incomeCategoryList.splice(index,1);
        // } else {
        //     var index = expenseCategoryList.findIndex(e => {
        //         return e.name == categoryName;
        //     });
        //     expenseCategoryList.splice(index,1);
        // }
        // addHomeData();
        // $(currPage).hide();
        // $(".home").show();
        // prevPage = currPage;
        // currPage = ".home";
        // resetHome();
    });
    
    $('#addTransactionWithinCategory').click(function() {
        var category = $('#categoryName').val();
        $('.existingCategory').hide();
        resetAddEditTransactionsPage();
        prevPage = '.existingCategory';
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
    
    $('#transactionRepeat_Check').click(function() {
        $(".transactionRepeat").toggle();
		if ($("#transactionRepeat_Check").is(':checked')) {
            $('div.addEditTransactions').css('grid-template-rows', 'repeat(7, [inputField] max-content) [end]');
		} else {
            $('div.addEditTransactions').removeAttr('style');
		}
	});

    $('#repeatUntil_Select').on('change', function() {
        $('div.addEditTransactions').css('grid-template-rows', 'repeat(8, [inputField] max-content) [end]');
        if (this.value == "date") {
            $('.transactionEndDate').show();
            $('.numTimesRepeated').hide();
        }
        else if (this.value == "num") {
            $('.transactionEndDate').hide();
            $('.numTimesRepeated').show();
        }
        else {
            $('div.addEditTransactions').css('grid-template-rows', 'repeat(7, [inputField] max-content) [end]');
            $('.transactionEndDate').hide();
            $('.numTimesRepeated').hide();
        }
    });

    $('.categoryBudget').hide();
    $('#setCategoryBudget').click(function() {
        $('.categoryBudget').toggle();

        if($(this).is(":checked")) {
            $('div.addEditCategories').css('grid-template-rows', 'repeat(6, [inputField] max-content) [end]');
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

function settingsPage() {
    $('#saveMessage').hide();

    $('.switch').click(function() {
        if( $(this).children('input').prop("checked"))
            $(this).children('input').prop("checked", false);
        else
            $(this).children('input').prop("checked", true);
    });

    $('.settings select').change(function() {
        $('#saveMessage').fadeIn();
        setTimeout(function() { 
            $('#saveMessage').fadeOut();
        }, 1000);
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
    
    $('.existingTransaction').hide();
    $('.addEditTransactions').show();
    
    $page.find("input[type=text], select").each(function() {
        $(this).val("");
        $(this).parsley().reset();
    });

    $('#transactionType').removeAttr('disabled');
    $('#transactionCategory_Select').removeAttr('disabled');

    var date = new Date();
    $('#transactionDate').val(date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate());

    $('.repeatUntil').hide();
    $('#transactionRepeat_Check').prop('checked', false);
    $('.transactionRepeat').hide();
}

function resetAddEditCategoriesPage() {
    var $page = $('div.addEditCategories');
    
    $('.existingCategory').hide();
    $('.addEditCategories').show();
    
    $page.find("input[type=text], select").each(function() {
        $(this).val("");
        $(this).parsley().reset();
    });

    $("#categoryColour").val("#000000");
    $("#categoryColour").parsley().reset();

    if($('#setCategoryBudget').is(":checked")) {
        $("#setCategoryBudget").click();
    }

    $('#categoryName').attr('data-parsley-prevent-duplicate', "");
    hideExpenseFields(false);
}

function populateCategorySelect(isIncomeCategory) {
    var categoryList = expenseCategoryList;
    if(isIncomeCategory)
        categoryList = incomeCategoryList;

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
        $('div.addEditCategories').css('grid-template-rows', 'repeat(2, [requiredInput] max-content) [end]');
    } else {
        $('.expenseCategory').show();
        $('div.addEditCategories').removeAttr('style');
    }
}

function insertTransaction(newTransaction) {
    var lo = 0;
    var hi = transactionList.length;
    
    while(lo < hi) {
        var mid = Math.floor((lo + hi) / 2);
        if(new Date(newTransaction.date) >= new Date(transactionList[mid].date)) {
            hi = mid;
        } else {
            lo = mid + 1;
        }
    }
    
    transactionList.splice(lo, 0, newTransaction);
}

function calculateAngle(event) {
    var boxBounds = event.target.getBoundingClientRect();
    var boxCenterX = boxBounds.left + (boxBounds.width/2);
    var boxCenterY = boxBounds.top + (boxBounds.height/2);
    var mouseX = event.pageX - boxCenterX;
    var mouseY = event.pageY - boxCenterY;

    return Math.abs((Math.atan2(mouseX, mouseY) * (180/Math.PI)) - 180);
}

function checkAmount(transCategory) {
    var category = expenseCategoryList.find(c => {
        return c.name == transCategory
    });

    var amount = 0;
    
    var filteredTransaction = transactionList;
    var transactionsInCategory = filteredTransaction.filter(e => {
        return e.category == category.name;
    });

    for(var t = 0; t < transactionsInCategory.length; t++) {
        amount += transactionsInCategory[t].amount;
    }

    if (category.setBudget) {
        console.log("set");
        if (category.warning >= 0) {
            console.log("Warning");
            console.log(category.warning);
            if (amount >= category.warning) {
                // console.log("Boi ya fucked up lmao");
                var diff = category.budget - amount;
                var msg = undefined;
                if (amount < category.budget) {
                    msg = "You are $" + diff + " away from your \"" + 
                    category.name + "\" budget." + "<br />" + "<br />" + "Your Current Budget:\t$" +
                    category.budget + "<br />" + "Amount Spent:\t$" +
                    amount;
                }
                else { 
                    msg = "You have reached your \"" + category.name + "\" budget limit." + 
                    "<br />" + "<br />" + "Your Current Budget:\t$" +
                    category.budget + "<br />" + "Amount Spent:\t$" +
                    amount;
                }
                $(function() {
                    $('#dialog').css("visibility", "visible");
                    $('#dialog').css("position", "static");
                    $('#warningMessage').html(msg);
                    $('#dialog').dialog({
                        buttons: [
                          {
                                text: "OK",
                                click: function() {
                                    $( this ).dialog( "close" );
                            }
                          }
                        ]
                      });
                });
            }
        }
        else {
            if (amount >= category.budget) {
                // console.log("Boi ya fucked up lmao");
                var msg = "You have reached your budget limit!" + 
                    "<br />" + "<br />" + "Your Current Budget:\t$" +
                    category.budget + "<br />" + "Amount Spent:\t$" +
                    amount;
    
                $(function() {
                    $('#dialog').css("visibility", "visible");
                    $('#dialog').css("position", "static");
                    $('#warningMessage').html(msg);
                    $('#dialog').dialog({
                        buttons: [
                          {
                                text: "OK",
                                click: function() {
                                    $( this ).dialog( "close" );
                            }
                          }
                        ]
                      });
                });
            }
        }
    }
}

function deleteWarning(eType) {
    var msg = undefined;
    var cType = undefined;
    if (eType == 'transaction') {
        msg = 'transaction';
        cType = '#deleteTransWarning';
        $('#transMessage').html("Are you sure you want to delete this " + msg + "?");
    }
    else {
        msg = 'category';
        cType = '#deleteCatWarning';
        $('#catMessage').html("Are you sure you want to delete this " + msg + "? Deleting this category will delete all transactions within it.");
    }
    $(function() {
        $(cType).css("visibility", "visible");
        $(cType).css("position", "static"); 
        // $('#transMessage').html("Are you sure you want to delete this " + msg + "?");
        $(cType).dialog({
            buttons: [
                {
                    text: "CANCEL",
                    click: function() {
                        $( this ).dialog( "close" );                     
                    }
                },
                {
                    text: "OK",
                    click: function() {
                        $( this ).dialog( "close" );
                        if (eType == 'transaction') {
                            
                            var ID = $('div.addEditTransactions').attr('transactionID');
                            var index = transactionList.findIndex(e => {
                                return e.transactionID == ID;   
                                });
                    
                                transactionList.splice(index,1);
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
                    
                                disableButton();
                        }
                        if (eType == 'category') {
                            // $( this ).dialog( "close" );
                            var categoryName = $('#categoryName').val();

                            transactionList = transactionList.filter(e => {
                                return e.category != categoryName;
                            });

                            if(isIncome) {
                                var index = incomeCategoryList.findIndex(e => {
                                    return e.name == categoryName;
                                });
                                incomeCategoryList.splice(index,1);

                            } else {
                                var index = expenseCategoryList.findIndex(e => {
                                    return e.name == categoryName;
                                });
                                expenseCategoryList.splice(index,1);
                            }

                            addHomeData();
                            addTransactionListData();
                            $(currPage).hide();
                            $(".home").show();
                            prevPage = currPage;
                            currPage = ".home";
                            resetHome();
                        }
                } 
            }
            ]
          });
    });
}