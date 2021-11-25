/* Categories */
var incomeCategory = [
    {
        name: "Salary",
        colour: "#72a2ff"
    },
    {
        name: "Sale",
        colour: "#FF9900"
    }
];

var expenseCategory = [
    {
        name: "Rent",
        colour: "#895293",
        setBudget: false
    },
    {
        name: "Food",
        colour: "#38af38",
        setBudget: false
    },
    {
        name: "Clothes",
        colour: "#cd5c5c",
        setBudget: true,
        budget: 500,
        every_num: 1,
        every_timePeriod: 'years',
        warning: 400
    },
    {
        name: "Phone",
        colour: "#4169e1",
        setBudget: false
    },
    {
        name: "Video Games",
        colour: "#40e0d0",
        setBudget: true,
        budget: 200,
        every_num: 1,
        every_timePeriod: 'years',
        warning: 150
    },
    {
        name: "Movies",
        colour: "#daa520",
        setBudget: true,
        budget: 30,
        every_num: 1,
        every_timePeriod: 'months',
        warning: -1
    }
];

/*Transactions*/
var transaction = [
    {
        transactionID: 11,
        isIncome: false,
        category: 'Rent',
        amount: 1000.00,
        date: '2021-11-26',
        willRepeat: true,
        repeat_num: 1,
        repeat_timePeriod: 'months',
        repeat_duration: 'date',
        repeat_until: '2022-12-31'
    },
    {
        transactionID: 10,
        isIncome: false,
        category: 'Food',
        amount: 50.00,
        date: '2021-11-21',
        willRepeat: false
    },
    {
        transactionID: 8,
        isIncome: false,
        category: 'Food',
        amount: 100.00,
        date: '2021-11-20',
        willRepeat: false
    },
    {
        transactionID: 7,
        isIncome: false,
        category: 'Clothes',
        amount: 80.00,
        date: '2021-11-20',
        willRepeat: false
    },
    {
        transactionID: 6,
        isIncome: true,
        category: 'Salary',
        amount: 1050.00,
        date: "2021-11-19",
        willRepeat: false
    },
    {
        transactionID: 5,
        isIncome: false,
        category: 'Video Games',
        amount: 30.00,
        date: '2021-11-19',
        willRepeat: false
    },
    {
        transactionID: 4,
        isIncome: false,
        category: 'Phone',
        amount: 60.00,
        date: '2021-11-15',
        willRepeat: true,
        repeat_num: 1,
        repeat_timePeriod: 'months',
        repeat_duration: 'date',
        repeat_until: '2023-03-20'
    },
    {
        transactionID: 3,
        isIncome: false,
        category: 'Movies',
        amount: 25.00,
        date: '2021-11-12',
        willRepeat: false
    },
    {
        transactionID: 2,
        isIncome: false,
        category: 'Food',
        amount: 100.00,
        date: '2021-11-06',
        willRepeat: true,
        repeat_num: 2,
        repeat_timePeriod: 'weeks',
        repeat_duration: 'forever'
    },
    {
        transactionID: 1,
        isIncome: true,
        category: 'Sale',
        amount: 30.00,
        date: '2021-11-06',
        willRepeat: false
    },
    {
        transactionID: 0,
        isIncome: true,
        category: 'Salary',
        amount: 1050.00,
        date: "2021-11-05",
        willRepeat: true,
        repeat_num: 2,
        repeat_timePeriod: 'weeks',
        repeat_duration: 'forever'
    }
];