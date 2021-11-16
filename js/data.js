/* Categories */
var incomeCategory = [
    {
        isIncome: true,
        name: "Salary",
        colour: "#72a2ff"
    },
    {
        isIncome: true,
        name: "Sale",
        colour: "#FF9900"
    }
];

var expenseCategory = [
    {
        isIncome: false,
        name: "Rent",
        colour: "#895293",
        setBudget: false
    },
    {
        isIncome: false,
        name: "Food",
        colour: "#38af38",
        setBudget: false
    },
    {
        isIncome: false,
        name: "Clothes",
        colour: "#cd5c5c",
        setBudget: true,
        budget: 500,
        every_num: 1,
        every_timePeriod: 'years',
        warning: 400
    },
    {
        isIncome: false,
        name: "Phone",
        colour: "#4169e1",
        setBudget: false
    },
    {
        isIncome: false,
        name: "Video Games",
        colour: "#40e0d0",
        setBudget: true,
        budget: 200,
        every_num: 1,
        every_timePeriod: 'years',
        warning: 150
    },
    {
        isIncome: false,
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
        isIncome: true,
        category: 'Salary',
        amount: 1050.00,
        date: "2021-11-05",
        willRepeat: true,
        repeat_num: 2,
        repeat_timePeriod: 'weeks'
    },
    {
        isIncome: true,
        category: 'Sale',
        amount: 30.00,
        date: '2021-11-06',
        willRepeat: false
    },
    {
        isIncome: false,
        category: 'Food',
        amount: 100.00,
        date: '2021-11-06',
        willRepeat: true,
        repeat_num: 2,
        repeat_timePeriod: 'weeks'
    },
    {
        isIncome: false,
        category: 'Movies',
        amount: 25.00,
        date: '2021-11-12',
        willRepeat: false
    },
    {
        isIncome: false,
        category: 'Phone',
        amount: 60.00,
        date: '2021-11-15',
        willRepeat: true,
        repeat_num: 1,
        repeat_timePeriod: 'months'
    },
    {
        isIncome: false,
        category: 'Video Games',
        amount: 30.00,
        date: '2021-11-19',
        willRepeat: false
    },
    {
        isIncome: false,
        category: 'Clothes',
        amount: 80.00,
        date: '2021-11-20',
        willRepeat: false
    },
    {
        isIncome: false,
        category: 'Food',
        amount: 50.00,
        date: '2021-11-20',
        willRepeat: false
    },
    {
        isIncome: false,
        category: 'Rent',
        amount: 1000.00,
        date: '2021-11-26',
        willRepeat: true,
        repeat_num: 1,
        repeat_timePeriod: 'months'
    }
];