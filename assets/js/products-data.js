const products = [
    {
        id: "wall-pull-up-bar",
        name: {
            ar: "عقلة حائط",
            en: "Wall Pull-up Bar"
        },
        category: {
            ar: "بارات السحب",
            en: "Pull-up Bars"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب القياس",
            en: "Price depends on size"
        },
        image: "assets/images/products/pull-up-bar/cover.webp",
        description: {
            ar: "عقلة حائط قوية لتدريب السحب، التعلق، الكور، والمهارات الأساسية. متوفرة ببروز 60 سم أو 90 سم حسب المساحة والهدف.",
            en: "A strong wall-mounted pull-up bar for pulling, hanging, core work, and essential skills. Available in 60cm or 90cm wall projection."
        },
        variants: [
            {
                ar: "بروز 60 سم من الحائط",
                en: "60cm wall projection",
                price: null
            },
            {
                ar: "بروز 90 سم من الحائط",
                en: "90cm wall projection",
                price: null
            }
        ]
    },

    {
        id: "static-bars",
        name: {
            ar: "ستاتيك بارز",
            en: "Static Bars"
        },
        category: {
            ar: "بارات السحب",
            en: "Pull-up Bars"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب التصميم",
            en: "Price depends on design"
        },
        image: "assets/images/products/steel-bars/cover.webp",
        description: {
            ar: "ستاتيك بارز بطول تقريبي 2 متر للمهارات، الثبات، وتمارين الكاليستنكس المفتوحة. يمكن تنفيذها حسب الطلب والمساحة.",
            en: "Static bars around 2 meters long for skills, holds, and open calisthenics movements. Can be customized based on space and request."
        },
        variants: [
            {
                ar: "طول 2 متر تقريبًا",
                en: "Around 2m length",
                price: null
            },
            {
                ar: "تنفيذ حسب الطلب",
                en: "Custom build",
                price: null
            }
        ]
    },

    {
        id: "monkey-bars",
        name: {
            ar: "مونكي بارز",
            en: "Monkey Bars"
        },
        category: {
            ar: "بارات السحب",
            en: "Pull-up Bars"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب المقاس",
            en: "Price depends on size"
        },
        image: "assets/images/products/monkey-bars/cover.webp",
        description: {
            ar: "مونكي بارز لتدريب القبضة، السحب، التعلق، والتحمل. مناسبة للتجهيزات الخارجية أو ضمن جهاز كاليسثنكس متعدد.",
            en: "Monkey bars for grip strength, pulling, hanging, and endurance. Suitable for outdoor setups or as part of a multi rig."
        },
        variants: [
            {
                ar: "قياس حسب الطلب",
                en: "Custom size",
                price: null
            }
        ]
    },

    {
        id: "steel-wood-parallettes",
        name: {
            ar: "باراليتس حديد بمقبض خشب",
            en: "Steel Parallettes with Wooden Grip"
        },
        category: {
            ar: "باراليتس",
            en: "Parallettes"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب القياس",
            en: "Price depends on size"
        },
        image: "assets/images/products/wooden-parallettes/cover.webp",
        description: {
            ar: "باراليتس بقاعدة حديد قوية ومقبض خشب مريح، مناسب للضغط، L-sit، البلانش، والهاندستاند.",
            en: "Parallettes with a strong steel base and comfortable wooden grip, suitable for push-ups, L-sits, planche work, and handstands."
        },
        variants: [
            {
                ar: "قياس صغير",
                en: "Small size",
                price: null
            },
            {
                ar: "قياس وسط",
                en: "Medium size",
                price: null
            },
            {
                ar: "قياس كبير",
                en: "Large size",
                price: null
            }
        ]
    },

    {
        id: "full-wooden-parallettes",
        name: {
            ar: "باراليتس خشب كامل",
            en: "Full Wooden Parallettes"
        },
        category: {
            ar: "باراليتس",
            en: "Parallettes"
        },
        price: null,
        priceLabel: {
            ar: "اسأل عن السعر",
            en: "Ask for price"
        },
        image: "assets/images/products/wooden-parallettes/cover.webp",
        description: {
            ar: "باراليتس خشب كامل بتصميم بسيط ومتين، مناسب لتدريبات التحكم والضغط والمهارات الأساسية.",
            en: "Full wooden parallettes with a clean and solid design, suitable for control drills, push training, and basic skills."
        },
        variants: [
            {
                ar: "قياس ثابت",
                en: "Standard size",
                price: null
            }
        ]
    },

    {
        id: "freestanding-parallel-bars",
        name: {
            ar: "متوازي حديد حر",
            en: "Freestanding Parallel Bars"
        },
        category: {
            ar: "متوازي حديد",
            en: "Parallel Bars"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب الارتفاع",
            en: "Price depends on height"
        },
        image: "assets/images/products/dip-bars/cover.webp",
        description: {
            ar: "متوازي حديد مواسير كامل، ثابت ومناسب لتدريبات الديبس، الضغط، الكور، وتمارين الثبات.",
            en: "Freestanding parallel bars made from steel pipes, stable for dips, push training, core work, and hold exercises."
        },
        variants: [
            {
                ar: "ارتفاع 100 سم",
                en: "100cm height",
                price: null
            },
            {
                ar: "ارتفاع 40 سم",
                en: "40cm height",
                price: null
            }
        ]
    },

    {
        id: "wall-mounted-dip-bars",
        name: {
            ar: "ديب بار حائط",
            en: "Wall-mounted Dip Bars"
        },
        category: {
            ar: "ديب بار حائط",
            en: "Wall Dip Bars"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب القياس",
            en: "Price depends on size"
        },
        image: "assets/images/products/dip-bars/cover.webp",
        description: {
            ar: "ديب بار يثبت على الحائط لتدريبات الديبس والضغط والكور، مناسب لمن يريد توفير مساحة على الأرض.",
            en: "Wall-mounted dip bars for dips, push training, and core work, suitable for saving floor space."
        },
        variants: [
            {
                ar: "قياس ثابت",
                en: "Standard size",
                price: null
            },
            {
                ar: "تنفيذ حسب الطلب",
                en: "Custom build",
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
            ar: "حلقات جمباز",
            en: "Gymnastic Rings"
        },
        price: null,
        priceLabel: {
            ar: "اسأل عن السعر",
            en: "Ask for price"
        },
        image: "assets/images/products/gymnastic-rings/cover.webp",
        description: {
            ar: "حلقات جمباز لتدريب السحب، الديبس، التوازن، والثبات العضلي بمرونة عالية.",
            en: "Gymnastic rings for pulling, dips, balance, and upper-body stability with high training versatility."
        },
        variants: [
            {
                ar: "حلقات خشب",
                en: "Wooden rings",
                price: null
            }
        ]
    },

    {
        id: "resistance-bands",
        name: {
            ar: "حبال مقاومة",
            en: "Resistance Bands"
        },
        category: {
            ar: "إكسسوارات",
            en: "Accessories"
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
                en: "Light resistance",
                price: null
            },
            {
                ar: "مقاومة متوسطة",
                en: "Medium resistance",
                price: null
            },
            {
                ar: "مقاومة قوية",
                en: "Heavy resistance",
                price: null
            }
        ]
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
        variants: [
            {
                ar: "قياس / مقاومة متوفرة",
                en: "Available resistance",
                price: null
            }
        ]
    },

    {
        id: "grip-tape",
        name: {
            ar: "جريب تيب",
            en: "Grip Tape"
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
        image: "assets/images/products/grip-tape/cover.webp",
        description: {
            ar: "جريب تيب لتحسين القبضة وتقليل الانزلاق أثناء تمارين البارات والحلقات.",
            en: "Grip tape for improving grip and reducing slipping during bar and ring training."
        },
        variants: [
            {
                ar: "رول جريب تيب",
                en: "Grip tape roll",
                price: null
            }
        ]
    },

    {
        id: "multi-rig",
        name: {
            ar: "جهاز كاليسثنكس متعدد",
            en: "Calisthenics Multi Rig"
        },
        category: {
            ar: "جهاز كاليسثنكس متعدد",
            en: "Calisthenics Multi Rig"
        },
        price: null,
        priceLabel: {
            ar: "السعر حسب التصميم",
            en: "Price depends on design"
        },
        image: "assets/images/products/multi-rig/cover.webp",
        description: {
            ar: "جهاز كاليسثنكس متعدد حسب الطلب، ممكن يحتوي على عقل، مونكي بارز، ديب بارز، وستاتيك بارز حسب المساحة والهدف.",
            en: "A custom calisthenics multi rig that can include pull-up bars, monkey bars, dip bars, and static bars based on space and goal."
        },
        variants: [
            {
                ar: "تصميم حسب المساحة",
                en: "Space-based design",
                price: null
            },
            {
                ar: "تجهيز حديقة / نادي / بيت",
                en: "Park / gym / home setup",
                price: null
            }
        ]
    },

    {
        id: "custom-orders",
        name: {
            ar: "طلب تصنيع مخصص",
            en: "Custom Orders"
        },
        category: {
            ar: "تجهيزات مخصصة",
            en: "Custom Setups"
        },
        price: null,
        priceLabel: {
            ar: "حسب القطعة المطلوبة",
            en: "Depends on requested item"
        },
        image: "assets/images/products/multi-rig/cover.webp",
        description: {
            ar: "بدك قطعة غير موجودة؟ أرسل لنا صورة أو وصف أو قياسات المساحة، ونساعدك بتصميم وتنفيذ قطعة مناسبة.",
            en: "Need a piece that is not listed? Send us a photo, description, or space dimensions, and we will help design and build it."
        },
        variants: [
            {
                ar: "قطعة حسب الطلب",
                en: "Custom equipment",
                price: null
            }
        ]
    }
];

window.WATHBA_PRODUCTS = products;

function getProductPriceText(product, lang) {
    if (product.price !== null && product.price !== undefined) {
        return `${product.price} JOD`;
    }

    if (product.priceLabel && product.priceLabel[lang]) {
        return product.priceLabel[lang];
    }

    return lang === "ar" ? "اسأل عن السعر" : "Ask for price";
}