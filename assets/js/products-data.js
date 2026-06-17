const products = [
    {
        id: "pull-up-bar",
        name: {
            ar: "عقلة",
            en: "Pull-up Bar"
        },
        category: {
            ar: "معدات سحب",
            en: "Pull Equipment"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب النوع",
            en: "Price depends on type"
        },
        image: "assets/images/products/pull-up-bar/cover.webp",
        description: {
            ar: "عقلة مناسبة لتدريب الظهر، الذراعين، الكور، وتمارين الكاليستنكس الأساسية.",
            en: "A pull-up bar for back, arms, core training, and essential calisthenics exercises."
        },
        variants: [
            {
                ar: "عقلة جدارية",
                en: "Wall-mounted Pull-up Bar",
                price: null
            },
            {
                ar: "عقلة باب",
                en: "Doorway Pull-up Bar",
                price: null
            }
        ]
    },

    {
        id: "wooden-parallettes",
        name: {
            ar: "باراليتس خشب",
            en: "Wooden Parallettes"
        },
        category: {
            ar: "معدات دفع",
            en: "Push Equipment"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب القياس",
            en: "Price depends on size"
        },
        image: "assets/images/products/wooden-parallettes/cover.webp",
        description: {
            ar: "باراليتس خشبي لتدريبات الضغط، L-sit، البلانش، الهاندستاند، وتمارين التحكم.",
            en: "Wooden parallettes for push-ups, L-sit, planche training, handstands, and control exercises."
        },
        variants: [
            {
                ar: "قياس صغير",
                en: "Small Size",
                price: null
            },
            {
                ar: "قياس وسط",
                en: "Medium Size",
                price: null
            },
            {
                ar: "قياس كبير",
                en: "Large Size",
                price: null
            }
        ]
    },

    {
        id: "dip-bars",
        name: {
            ar: "متوازي",
            en: "Dip Bars"
        },
        category: {
            ar: "معدات دفع",
            en: "Push Equipment"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب القياس",
            en: "Price depends on size"
        },
        image: "assets/images/products/dip-bars/cover.webp",
        description: {
            ar: "متوازي ثابت لتدريب الديبس، الضغط، الكور، والمهارات الأساسية والمتقدمة.",
            en: "Stable dip bars for dips, push training, core work, and basic to advanced skills."
        },
        variants: [
            {
                ar: "قياس عادي",
                en: "Standard Size",
                price: null
            },
            {
                ar: "قياس كبير",
                en: "Large Size",
                price: null
            }
        ]
    },

    {
        id: "steel-bars",
        name: {
            ar: "ستيل بارز",
            en: "Steel Bars"
        },
        category: {
            ar: "معدات خارجية",
            en: "Outdoor Equipment"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب التصميم",
            en: "Price depends on design"
        },
        image: "assets/images/products/steel-bars/cover.webp",
        description: {
            ar: "ستيل بارز قوية لتجهيز مساحات تدريب خارجية أو منزلية حسب الحاجة.",
            en: "Strong steel bars for building outdoor or home training setups based on your needs."
        },
        variants: []
    },

    {
        id: "monkey-bars",
        name: {
            ar: "مونكي بارز",
            en: "Monkey Bars"
        },
        category: {
            ar: "معدات خارجية",
            en: "Outdoor Equipment"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب المقاس",
            en: "Price depends on size"
        },
        image: "assets/images/products/monkey-bars/cover.webp",
        description: {
            ar: "مونكي بارز لتدريب القبضة، السحب، التعلق، والتحمل بطريقة ممتعة وقوية.",
            en: "Monkey bars for grip strength, pulling, hanging, and endurance training."
        },
        variants: []
    },

    {
        id: "hand-gripper",
        name: {
            ar: "هاند جريبر",
            en: "Hand Gripper"
        },
        category: {
            ar: "إكسسوارات",
            en: "Accessories"
        },
        price: null,
        priceLabel: {
            ar: "اسأل عن السعر",
            en: "Ask for price"
        },
        image: "assets/images/products/hand-gripper/cover.webp",
        description: {
            ar: "هاند جريبر لتقوية القبضة والساعد، مناسب للاعبين الكاليستنكس والتدريب اليومي.",
            en: "Hand gripper for improving grip and forearm strength, suitable for calisthenics athletes and daily training."
        },
        variants: []
    },

    {
        id: "multi-rig",
        name: {
            ar: "جهاز كاليسثنكس متعدد",
            en: "Calisthenics Multi Rig"
        },
        category: {
            ar: "معدات احترافية",
            en: "Professional Equipment"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب التصميم",
            en: "Price depends on design"
        },
        image: "assets/images/products/multi-rig/cover.webp",
        description: {
            ar: "جهاز كاليسثنكس متعدد مناسب للحدائق، النوادي، والمساحات التدريبية الاحترافية.",
            en: "A multi-purpose calisthenics rig suitable for parks, gyms, and professional training spaces."
        },
        variants: []
    },

    {
        id: "resistance-bands",
        name: {
            ar: "حبال مقاومة",
            en: "Resistance Bands"
        },
        category: {
            ar: "مساعدة وتمرين",
            en: "Assistance"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب المقاومة",
            en: "Price depends on resistance"
        },
        image: "assets/images/products/resistance-bands/cover.webp",
        description: {
            ar: "حبال مقاومة تساعدك في العقلة، الإحماء، التدرج، وتمارين المرونة.",
            en: "Resistance bands for pull-up assistance, warm-up, progression, and mobility work."
        },
        variants: [
            {
                ar: "مقاومة خفيفة",
                en: "Light Resistance",
                price: null
            },
            {
                ar: "مقاومة متوسطة",
                en: "Medium Resistance",
                price: null
            },
            {
                ar: "مقاومة قوية",
                en: "Heavy Resistance",
                price: null
            }
        ]
    },

    {
        id: "gymnastic-rings",
        name: {
            ar: "حلقات جمباز",
            en: "Gymnastic Rings"
        },
        category: {
            ar: "معدات سحب",
            en: "Pull Equipment"
        },
        price: null,
        priceLabel: {
            ar: "اسأل عن السعر",
            en: "Ask for price"
        },
        image: "assets/images/products/gymnastic-rings/cover.webp",
        description: {
            ar: "حلقات جمباز لتدريب السحب، الديبس، التوازن، والثبات العضلي.",
            en: "Gymnastic rings for pulling, dips, balance, and upper-body stability."
        },
        variants: [
            {
                ar: "حلقات خشب",
                en: "Wooden Rings",
                price: null
            },
            {
                ar: "حلقات بلاستيك",
                en: "Plastic Rings",
                price: null
            }
        ]
    }
];

function getProductPriceText(product, lang) {
    if (product.price !== null && product.price !== undefined) {
        return `${product.price} JOD`;
    }

    if (product.priceLabel && product.priceLabel[lang]) {
        return product.priceLabel[lang];
    }

    return lang === "ar" ? "اسأل عن السعر" : "Ask for price";
}