/* Categories */
var incomeCategoryList = [
    {
        name: "Salary",
        colour: "#72a2ff"
    },
    {
        name: "Sale",
        colour: "#FF9900"
    }
];

var expenseCategoryList = [
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
var transactionList = [
    {
        transactionID: '5-16',
        isIncome: false,
        category: 'Rent',
        amount: 1000.00,
        date: '2021-11-26',
        isRepeat: true,
        willRepeat: false
    },
    {
        transactionID: '15',
        isIncome: false,
        category: 'Food',
        amount: 50.00,
        date: '2021-11-21',
        isRepeat: false,
        willRepeat: false
    },
    {
        transactionID: '1-14',
        isIncome: false,
        category: 'Food',
        amount: 100.00,
        date: '2021-11-20',
        isRepeat: true,
        willRepeat: false
    },
    {
        transactionID: '13',
        isIncome: false,
        category: 'Clothes',
        amount: 80.00,
        date: '2021-11-20',
        isRepeat: false,
        willRepeat: false
    },
    {
        transactionID: '0-12',
        isIncome: true,
        category: 'Salary',
        amount: 1050.00,
        date: "2021-11-19",
        isRepeat: true,
        willRepeat: false
    },
    {
        transactionID: '11',
        isIncome: false,
        category: 'Video Games',
        amount: 30.00,
        date: '2021-11-19',
        isRepeat: false,
        willRepeat: false
    },
    {
        transactionID: '2-10',
        isIncome: false,
        category: 'Phone',
        amount: 60.00,
        date: '2021-11-15',
        isRepeat: false,
        willRepeat: false
    },
    {
        transactionID: '9',
        isIncome: false,
        category: 'Movies',
        amount: 25.00,
        date: '2021-11-12',
        isRepeat: false,
        willRepeat: false
    },
    {
        transactionID: '1-8',
        isIncome: false,
        category: 'Food',
        amount: 100.00,
        date: '2021-11-06',
        isRepeat: false,
        willRepeat: false
    },
    {
        transactionID: '7',
        isIncome: true,
        category: 'Sale',
        amount: 30.00,
        date: '2021-11-06',
        isRepeat: false,
        willRepeat: false
    },
    {
        transactionID: '0-6',
        isIncome: true,
        category: 'Salary',
        amount: 1050.00,
        date: "2021-11-05",
        isRepeat: false,
        willRepeat: false
    },
    {
        transactionID: '5',
        isIncome: false,
        category: 'Rent',
        amount: 1000.00,
        date: '2021-10-26',
        isRepeat: false,
        willRepeat: true,
        repeat_num: 1,
        repeat_timePeriod: 'months',
        repeat_until: 'forever'
    },
    {
        transactionID: '1-4',
        isIncome: false,
        category: 'Food',
        amount: 100.00,
        date: '2021-10-23',
        isRepeat: true,
        willRepeat: false
    },
    {
        transactionID: '0-3',
        isIncome: true,
        category: 'Salary',
        amount: 1050.00,
        date: "2021-10-22",
        isRepeat: true,
        willRepeat: false
    },
    {
        transactionID: '2',
        isIncome: false,
        category: 'Phone',
        amount: 60.00,
        date: '2021-10-15',
        isRepeat: false,
        willRepeat: true,
        repeat_num: 1,
        repeat_timePeriod: 'months',
        repeat_until: 'forever'
    },
    {
        transactionID: '1',
        isIncome: false,
        category: 'Food',
        amount: 100.00,
        date: '2021-10-09',
        isRepeat: false,
        willRepeat: true,
        repeat_num: 2,
        repeat_timePeriod: 'weeks',
        repeat_until: 'forever'
    },
    {
        transactionID: '0',
        isIncome: true,
        category: 'Salary',
        amount: 1050.00,
        date: "2021-10-08",
        isRepeat: false,
        willRepeat: true,
        repeat_num: 2,
        repeat_timePeriod: 'weeks',
        repeat_until: 'forever'
    }
];