export const tasks = [
    {
        id: 1,
        name: "UX Research",
        status: "Done",
        lead: "You",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBcr0kA75mJNq_BBJwZXZAMXl99uaw1oOTO-ivZcTUweOtM9xxiMBekqEBGBj6XQEcdGbyUCgGjqE97rPgg259DygfgbOW3R7DoVcVx65Bmouh_YsW0b1GdHa8rbfHK3EkbI3m5lrKh5AHRgXLO0cTHqGlQjUfo3Nf3hvts63S0zwemStbJRuIpwvOhyKOYAb2QHfm4WiK9Gr12JdR12aAtsQLPUAQDI_4R5kRcgUkNSZ3xlukqEZ2wQhy9qOX-A0uBzJgKGas8wAOa",
        budget: "$1.2K (+$200)",
        risk: "Med",
        plan: "Oct 17",
        actual: "Oct 15",
        progress: 100,
        startDay: 0,
        duration: 3,
        color: "secondary",
        dependsOn: null
    },
    {
        id: 2,
        name: "Design Phase",
        status: "In Progress",
        lead: "Sarah J.",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7D4mRU7c9QoNynHl2jWtsELAzLhMGia0MnYO9TRhBluUaT3gziYprJbZXKa94ESfFM7RHtJOUX4s1iIMuNGIVMeezq0G4g16xR6BPQXD82FmnZErhMBtC1bopz6N303_EHp9xxdjLj6EmpCkF2sQBfwwRQNaPMqDSTvE-J8sQDpaBF6rVMX0UQ-HeDMhev7H303VhGaH4n6MZq5AXzVw3Mo-mwu887gfPu0i20KVtY7AaYABw_l_9GUp1_pmCVNpGuG0tsGHXoEur",
        budget: "$2.5K / $2.8K",
        risk: "Med",
        plan: "Oct 19",
        est: "Oct 20",
        progress: 45,
        startDay: 3,  // Start after UX Research ends (0+3=3)
        duration: 4,
        color: "primary",
        dependsOn: 1
    },
    {
        id: 3,
        name: "API Dev",
        status: "Pending",
        lead: "DT",
        initials: "DT",
        budget: "$3.0K (Est)",
        risk: "High",
        plan: "Oct 23",
        est: "Oct 26",
        progress: 0,
        startDay: 7,  // Start after Design Phase ends (3+4=7)
        duration: 3,
        color: "surface-highlight",
        dependsOn: 2
    },
    {
        id: 4,
        name: "QA Testing",
        status: "Blocked",
        lead: "QA",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAvYega6vie4tM3Xuu9GLYusSV1znA3Jzoci7wlA60fzYejplEx_1_XOEWKcNt6sbqcIhOOTATNsgkZ7KQgvieoKrdc9VdqNp6265kDxHiCcQ50q29I2Er6oXkSykOroLN8i58X07lbflQt_ipezdcraHyR1wPgN6sgFhCOpYBLj6spAn9NjYWnigIexkJTXLp2QU3vxEn_2RUjC8ejObsxHeBzCUlhyniEwzjKgXax2WtJ4fOXRvYeGctsXM79WaW_5F0g_f488EY4",
        budget: "$1.5K (Est)",
        risk: "Med",
        plan: "Oct 26",
        est: "Oct 30",
        progress: 10,
        startDay: 10, // Start after API Dev ends (7+3=10)
        duration: 3,
        color: "danger", // Using danger for blocked
        dependsOn: 3
    }
];

export const days = [
    { day: "Mon", date: 16 },
    { day: "Tue", date: 17, today: true },
    { day: "Wed", date: 18 },
    { day: "Thu", date: 19 },
    { day: "Fri", date: 20 },
    { day: "Sat", date: 21, weekend: true },
    { day: "Sun", date: 22, weekend: true },
    { day: "Mon", date: 23 },
    { day: "Tue", date: 24 },
    { day: "Wed", date: 25 },
    { day: "Thu", date: 26 },
    { day: "Fri", date: 27 },
    { day: "Sat", date: 28, weekend: true },
];

export const taskListData = [
    { id: "WF-1234", name: "DESIGN HOMEPAGE", priority: "high", assignee: "SARAH (PM)", dueDays: 12, allocation: "8 HRS/DAY", progress: 75 },
    { id: "DEV-5678", name: "FIX API BUG", priority: "medium", assignee: "MIKE (DEV)", dueDays: 3, allocation: "4 HRS/DAY", progress: 20 },
    { id: "MKT-9012", name: "CONTENT DRAFT", priority: "low", assignee: "YOU (CM)", dueDays: 0, allocation: "2 HRS/DAY", progress: 0 },
    { id: "WF-4321", name: "REVIEW WIREFRAMES", priority: null, assignee: "JESSICA (UX)", dueDays: 1, allocation: "6 HRS/DAY", progress: 0 },
    { id: "DEV-0099", name: "DATABASE SCHEMA", priority: null, assignee: "DAVID (DBA)", dueDays: -1, allocation: "COMPLETED", progress: 100 },
    { id: "DEV-5679", name: "IMPLEMENT AUTH", priority: "medium", assignee: "MIKE (DEV)", dueDays: 5, allocation: "6 HRS/DAY", progress: 40 },
    { id: "QA-0010", name: "TEST PAYMENT GATEWAY", priority: null, assignee: "CHLOE (QA)", dueDays: 7, allocation: "8 HRS/DAY", progress: 10 },
    { id: "OPS-0001", name: "DEPLOY TO STAGING", priority: "critical", assignee: "ADAM (OPS)", dueDays: 2, allocation: "FULL DAY", progress: 60 },
];
