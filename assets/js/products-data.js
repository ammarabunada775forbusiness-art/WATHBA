const products = [
    {
        id: "parallettes",
        name: {
            ar: "باراليتس خشب",
            en: "Wooden Parallettes"
        },
        category: {
            ar: "معدات دفع",
            en: "Push Equipment"
        },
        price: 25,
        image: "assets/images/products/parallettes/cover.webp",
        description: {
            ar: "باراليتس مناسب للضغط، L-sit، البلانش والهاندستاند.",
            en: "Parallettes for push-ups, L-sit, planche training, and handstands."
        }
    },
    {
        id: "rings",
        name: {
            ar: "حلقات جمباز",
            en: "Gymnastic Rings"
        },
        category: {
            ar: "معدات سحب",
            en: "Pull Equipment"
        },
        price: 30,
        image: "assets/images/products/rings/cover.webp",
        description: {
            ar: "حلقات قوية لتدريب السحب، الديبس، والمهارات المتقدمة.",
            en: "Strong rings for pull training, dips, and advanced skills."
        }
    },
    {
        id: "resistance-bands",
        name: {
            ar: "مطاط مقاومة",
            en: "Resistance Bands"
        },
        category: {
            ar: "مساعدة وتمرين",
            en: "Assistance"
        },
        price: 12,
        image: "assets/images/products/resistance-bands/cover.webp",
        description: {
            ar: "مطاط يساعدك في العقلة، الإحماء، المرونة والتدرج.",
            en: "Bands for pull-up assistance, warm-up, mobility, and progression."
        }
    },
    {
        id: "pull-up-bar",
        name: {
            ar: "بار عقلة",
            en: "Pull-up Bar"
        },
        category: {
            ar: "معدات سحب",
            en: "Pull Equipment"
        },
        price: 28,
        image: "assets/images/products/pull-up-bar/cover.webp",
        description: {
            ar: "بار عقلة منزلي لتدريب الظهر، الذراعين والكور.",
            en: "Home pull-up bar for back, arms, and core training."
        }
    },
    {
        id: "dip-bars",
        name: {
            ar: "متوازي ديبس",
            en: "Dip Bars"
        },
        category: {
            ar: "معدات دفع",
            en: "Push Equipment"
        },
        price: 45,
        image: "assets/images/products/dip-bars/cover.webp",
        description: {
            ar: "متوازي ثابت لتدريب الديبس، الضغط وتمارين الكور.",
            en: "Stable dip bars for dips, push exercises, and core work."
        }
    },
    {
        id: "liquid-chalk",
        name: {
            ar: "مغنيسيوم سائل",
            en: "Liquid Chalk"
        },
        category: {
            ar: "إكسسوارات",
            en: "Accessories"
        },
        price: 6,
        image: "assets/images/products/liquid-chalk/cover.webp",
        description: {
            ar: "يساعد على تحسين القبضة وتقليل الانزلاق أثناء التدريب.",
            en: "Improves grip and reduces slipping during training."
        }
    },
    {
        id: "wrist-wraps",
        name: {
            ar: "رباط معصم",
            en: "Wrist Wraps"
        },
        category: {
            ar: "حماية",
            en: "Protection"
        },
        price: 8,
        image: "assets/images/products/wrist-wraps/cover.webp",
        description: {
            ar: "دعم للمعصم أثناء الضغط، الهاندستاند والمهارات.",
            en: "Wrist support for push exercises, handstands, and skills."
        }
    },
    {
        id: "weight-vest",
        name: {
            ar: "سترة أوزان",
            en: "Weight Vest"
        },
        category: {
            ar: "تطوير القوة",
            en: "Strength"
        },
        price: 55,
        image: "assets/images/products/weight-vest/cover.webp",
        description: {
            ar: "لزيادة صعوبة العقلة، الضغط، السكوات والديبس.",
            en: "Adds difficulty to pull-ups, push-ups, squats, and dips."
        }
    },
    {
        id: "ab-wheel",
        name: {
            ar: "عجلة بطن",
            en: "Ab Wheel"
        },
        category: {
            ar: "كور",
            en: "Core"
        },
        price: 10,
        image: "assets/images/products/ab-wheel/cover.webp",
        description: {
            ar: "أداة ممتازة لتقوية البطن والكور.",
            en: "A great tool for abs and core strength."
        }
    },
    {
        id: "jump-rope",
        name: {
            ar: "حبل قفز",
            en: "Jump Rope"
        },
        category: {
            ar: "كارديو",
            en: "Cardio"
        },
        price: 7,
        image: "assets/images/products/jump-rope/cover.webp",
        description: {
            ar: "لتحسين اللياقة، السرعة، التحمل والإحماء.",
            en: "For conditioning, speed, endurance, and warm-up."
        }
    }
];