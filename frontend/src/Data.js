// Stores the initial data for the local storage
// Demo accounts

export const LocalData = [
    {
        username: "admin",
        email: "admin@admin.com",
        password: "admin123",
        fullname: "Admin Account",
        type: "Savings",
        number: "47290539480",
        balance: 1000,
        isAdmin: true, 
        transactions: []
    },
    {
        username: "paul",
        email: "paul@gmail.com",
        password: "paul123",
        fullname: "Paul Andreson",
        type: "Salary",
        number: "57290539412",
        balance: 1030300.43,
        isAdmin: true, 
        transactions: []
    },
    {
        username: "jeff",
        email: "jeff@gmail.com",
        password: "jeff123",
        fullname: "Jeff Cruise",
        type: "Savings",
        number: "44260539482",
        balance: 182830.22,
        isAdmin: false, 
        transactions: [
            {
                title: "Fund transfer", 
                amount: 2000,
                type: "debit", 
                date: "October 1, 2021"
            }, 
            {
                title: "Withdraw", 
                amount: 10000, 
                type: "debit",
                date: "October 1, 2021"
            }
        ]
    },
    {
        username: "Natasha",
        email: "nat@gmail.com",
        password: "nat123",
        fullname: "Natahsa Stankovic",
        type: "Savings",
        number: "49290539483",
        balance: 102938,
        isAdmin: false, 
        transactions: []
    },

    {
        username: "Leena",
        email: "leena@gmail.com",
        password: "leena123",
        fullname: "Leena David",
        type: "Salary",
        number: "43290539485",
        balance: 574839.98, 
        isAdmin: false, 
        transactions: []
    }
];