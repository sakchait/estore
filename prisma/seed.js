"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    // Create sample categories
    const computerAndLaptops = await prisma.category.create({
        data: {
            id: 'Computers & Laptops',
            name: 'Computers & Laptops',
            url: '/list/pc-laptops',
            iconUrl: '/icons/computerIcon.svg',
            iconSize: [17, 15],
            parentID: null, // Top-level category
        },
    });
    await prisma.category.create({
        data: {
            id: 'Computers',
            name: 'Computers',
            url: '/list/pc-laptops/computers',
            iconUrl: null,
            iconSize: [17, 15],
            parentID: computerAndLaptops.id,
        },
    });
    // Create "Laptops" sub-category under "Computers & Laptops"
    const laptopsCategory = await prisma.category.create({
        data: {
            name: 'Laptops',
            url: '/list/pc-laptops/laptops',
            iconUrl: null,
            iconSize: [17, 15],
            parentID: computerAndLaptops.id,
        },
    });
    // Create "Monitors" sub-category under "Computers & Laptops"
    const monitorsCategory = await prisma.category.create({
        data: {
            name: 'Monitors',
            url: '/list/pc-laptops/monitors',
            iconUrl: null,
            iconSize: [17, 15],
            parentID: computerAndLaptops.id,
        },
    });
    await prisma.category.create({
        data: {
            id: 'Tablets',
            name: 'Tablets',
            url: '/list/tablets',
            iconUrl: '/icons/tabletIcon.svg',
            iconSize: [17, 15],
            parentID: null, // Top-level category
        },
    });
    // --- Create new Categories ---
    // Smartphones Category
    await prisma.category.create({
        data: {
            name: 'Smartphones',
            url: '/list/smartphones',
            iconUrl: '/icons/phoneIcon.svg',
            iconSize: [17, 15],
            parentID: null,
        },
    });
    // Audio Category and its Sub-categories
    const audioCategory = await prisma.category.create({
        data: {
            name: 'Audio',
            url: '/list/audio',
            iconUrl: '/icons/musicIcon.svg',
            iconSize: [17, 15],
            parentID: null,
        },
    });
    await prisma.category.create({
        data: {
            name: 'Headphones',
            url: '/list/audio/headphones',
            iconUrl: null, // Or specific icon if available
            iconSize: [17, 15],
            parentID: audioCategory.id,
        },
    });
    await prisma.category.create({
        data: {
            name: 'Speakers',
            url: '/list/audio/speakers',
            iconUrl: null, // Or specific icon if available
            iconSize: [17, 15],
            parentID: audioCategory.id,
        },
    });
    // Gaming Category and its Sub-categories
    const gamingCategory = await prisma.category.create({
        data: {
            name: 'Gaming',
            url: '/list/gaming',
            iconUrl: '/icons/gameIcon.svg',
            iconSize: [17, 15],
            parentID: null,
        },
    });
    await prisma.category.create({
        data: {
            name: 'Consoles',
            url: '/list/gaming/consoles',
            iconUrl: null, // Or specific icon if available
            iconSize: [17, 15],
            parentID: gamingCategory.id,
        },
    });
    await prisma.category.create({
        data: {
            name: 'Accessories',
            url: '/list/gaming/accessories',
            iconUrl: null, // Or specific icon if available
            iconSize: [17, 15],
            parentID: gamingCategory.id,
        },
    });
    // --- End of new Categories ---
    // Create OptionSets
    const colorOptionSet = await prisma.optionSet.create({
        data: {
            id: 'color',
            name: 'Color',
            type: 'COLOR',
            options: [
                { name: 'Red', value: '#FF0000' },
                { name: 'Blue', value: '#0000FF' },
                { name: 'Green', value: '#00FF00' },
                { name: 'Silver', value: '#C0C0C0' },
                { name: 'Black', value: '#000000' },
            ],
        },
    });
    const sizeOptionSet = await prisma.optionSet.create({
        data: {
            id: 'size',
            name: 'Size',
            type: 'TEXT',
            options: [
                { name: 'S', value: 'Small' },
                { name: 'M', value: 'Medium' },
                { name: 'L', value: 'Large' },
            ],
        },
    });
    // Link OptionSets to Category
    await prisma.category_OptionSet.createMany({
        data: [
            {
                categoryID: computerAndLaptops.id,
                optionID: colorOptionSet.id,
            },
            {
                categoryID: computerAndLaptops.id,
                optionID: sizeOptionSet.id,
            },
        ],
    });
    // Create sample brands
    const brandFashionCo = await prisma.brand.create({
        data: {
            id: 'brand123', // Keeping existing ID
            name: 'FashionCo',
        },
    });
    // --- Create new Brands ---
    await prisma.brand.createMany({
        data: [
            { name: 'Apple' },
            { name: 'Samsung' },
            { name: 'Sony' },
            { name: 'Dell' },
            { name: 'Logitech' },
        ],
        skipDuplicates: true, // In case some are added manually or in previous runs
    });
    // --- End of new Brands ---
    // --- Fetch all necessary data for product creation ---
    console.log('Fetching existing data for product creation...');
    const allBrands = await prisma.brand.findMany();
    const allCategories = await prisma.category.findMany();
    // const allOptionSets = await prisma.optionSet.findMany(); // Already have colorOptionSet and sizeOptionSet by ID
    // Helper to find category by name (more robust than assuming order or hardcoding IDs for new cats)
    const findCategory = (name) => allCategories.find(cat => cat.name === name);
    const findBrand = (name) => allBrands.find(brand => brand.name === name);
    // Specific categories needed for products (ensure they are found)
    const smartphonesCat = findCategory('Smartphones');
    const laptopsCat = findCategory('Laptops'); // This is the newly created "Laptops"
    const headphonesCat = findCategory('Headphones');
    const consolesCat = findCategory('Consoles');
    const monitorsCat = findCategory('Monitors'); // This is the newly created "Monitors"
    if (!smartphonesCat || !laptopsCat || !headphonesCat || !consolesCat || !monitorsCat) {
        console.error('One or more categories required for products were not found. Exiting.');
        // Log which ones are missing
        if (!smartphonesCat)
            console.error('Smartphones category missing');
        if (!laptopsCat)
            console.error('Laptops category missing');
        if (!headphonesCat)
            console.error('Headphones category missing');
        if (!consolesCat)
            console.error('Consoles category missing');
        if (!monitorsCat)
            console.error('Monitors category missing');
        process.exit(1);
    }
    // Specific brands needed
    const samsungBrand = findBrand('Samsung');
    const appleBrand = findBrand('Apple');
    const sonyBrand = findBrand('Sony');
    const dellBrand = findBrand('Dell');
    if (!samsungBrand || !appleBrand || !sonyBrand || !dellBrand) {
        console.error('One or more brands required for products were not found. Exiting.');
        // Log which ones are missing
        if (!samsungBrand)
            console.error('Samsung brand missing');
        if (!appleBrand)
            console.error('Apple brand missing');
        if (!sonyBrand)
            console.error('Sony brand missing');
        if (!dellBrand)
            console.error('Dell brand missing');
        process.exit(1);
    }
    // --- End of fetching data ---
    // --- Prepare Product Data ---
    const productData = [
        // Product 1: Smartphone
        {
            name: "Galaxy S23",
            categoryID: smartphonesCat.id,
            brandID: samsungBrand.id,
            desc: "The latest flagship smartphone from Samsung.",
            images: ['/images/products/galaxy_s23_1.jpg', '/images/products/galaxy_s23_2.jpg'],
            price: 799.99,
            optionSets: ["Green"], // Assuming Color OS is linked to Smartphones or using simple value
            specs: { "Display": ["6.1-inch Dynamic AMOLED"], "RAM": ["8GB"], "Storage": ["256GB"] },
            specialFeatures: ["Pro-grade Camera", "Snapdragon 8 Gen 2", "Long Battery Life"],
            isAvailable: true,
        },
        // Product 2: Laptop
        {
            name: "MacBook Air M2",
            categoryID: laptopsCat.id,
            brandID: appleBrand.id,
            desc: "Apple's thin and light laptop with the M2 chip.",
            images: ['/images/products/macbook_air_m2_1.jpg'],
            price: 1199.00,
            optionSets: ["Silver"],
            specs: { "Chip": ["Apple M2"], "Memory": ["8GB Unified"], "Storage": ["256GB SSD"] },
            specialFeatures: ["Liquid Retina Display", "Up to 18 hours battery life", "Fanless design"],
            isAvailable: true,
        },
        // Product 3: Headphones
        {
            name: "WH-1000XM5 Noise Cancelling Headphones",
            categoryID: headphonesCat.id,
            brandID: sonyBrand.id,
            desc: "Industry-leading noise cancelling headphones from Sony.",
            images: ['/images/products/sony_wh1000xm5_1.jpg'],
            price: 349.99,
            optionSets: ["Black"],
            specs: { "Driver Unit": ["30mm"], "Battery Life": ["Up to 30 hours"], "Connectivity": ["Bluetooth 5.2"] },
            specialFeatures: ["Integrated Processor V1", "Precise Voice Pickup Technology", "Multipoint connection"],
            isAvailable: true,
        },
        // Product 4: Gaming Console
        {
            name: "PlayStation 5 Digital Edition",
            categoryID: consolesCat.id,
            brandID: sonyBrand.id,
            desc: "The PS5 Digital Edition, an all-digital version of the PS5 console with no disc drive.",
            images: ['/images/products/PS5.jpg'],
            price: 399.99,
            optionSets: [],
            specs: { "CPU": ["x86-64-AMD Ryzen Zen 2"], "GPU": ["AMD Radeon RDNA 2-based"], "Storage": ["825GB Custom SSD"] },
            specialFeatures: ["Ultra-High Speed SSD", "Ray Tracing", "Haptic Feedback", "Adaptive Triggers"],
            isAvailable: true,
        },
        // Product 5: Monitor
        {
            name: "Dell UltraSharp 27 Monitor - U2723QE",
            categoryID: monitorsCat.id,
            brandID: dellBrand.id,
            desc: "A 27-inch 4K UHD monitor with IPS Black technology.",
            images: ['/images/products/dell_u2723qe_1.jpg'],
            price: 579.99,
            optionSets: [],
            specs: { "Screen Size": ["27-inch"], "Resolution": ["4K (3840x2160)"], "Panel Type": ["IPS Black"], "Refresh Rate": ["60Hz"] },
            specialFeatures: ["ComfortView Plus", "Extensive connectivity", "98% DCI-P3 color coverage"],
            isAvailable: true,
        },
    ];
    // --- End of Prepare Product Data ---
    // --- Create New Products ---
    console.log(`Creating ${productData.length} new products...`);
    await prisma.product.createMany({
        data: productData,
        skipDuplicates: true, // Good practice
    });
    console.log('New products created!');
    // --- End of Create New Products ---
    // --- Create SpecGroups ---
    console.log('Creating SpecGroups...');
    const specGroupData = [
        { title: "General Device Specifications", specs: ["Model Name", "Release Date", "Dimensions", "Weight"] },
        { title: "Display Specifications", specs: ["Screen Size", "Resolution", "Panel Type", "Refresh Rate", "Brightness"] },
        { title: "Performance Specifications", specs: ["Processor", "RAM", "Internal Storage", "Graphics Card"] },
        { title: "Connectivity", specs: ["Wi-Fi", "Bluetooth", "Ports", "NFC"] },
    ];
    await prisma.specGroup.createMany({
        data: specGroupData,
        skipDuplicates: true,
    });
    console.log('SpecGroups created!');
    // --- End of Create SpecGroups ---
    // --- Fetch SpecGroups for linking ---
    const allSpecGroups = await prisma.specGroup.findMany();
    const findSpecGroup = (title) => allSpecGroups.find(sg => sg.title === title);
    const generalSpecGroup = findSpecGroup("General Device Specifications");
    const displaySpecGroup = findSpecGroup("Display Specifications");
    const performanceSpecGroup = findSpecGroup("Performance Specifications");
    const connectivitySpecGroup = findSpecGroup("Connectivity");
    if (!generalSpecGroup || !displaySpecGroup || !performanceSpecGroup || !connectivitySpecGroup) {
        console.error('One or more SpecGroups required for linking were not found. Exiting.');
        if (!generalSpecGroup)
            console.error('General Device Specifications missing');
        if (!displaySpecGroup)
            console.error('Display Specifications missing');
        if (!performanceSpecGroup)
            console.error('Performance Specifications missing');
        if (!connectivitySpecGroup)
            console.error('Connectivity missing');
        process.exit(1);
    }
    // --- End of Fetch SpecGroups ---
    // --- Create Category_SpecGroup Linkages ---
    console.log('Linking SpecGroups to Categories...');
    const categorySpecGroupData = [
        // Laptops: General, Display, Performance, Connectivity
        { categoryID: laptopsCat.id, specGroupID: generalSpecGroup.id },
        { categoryID: laptopsCat.id, specGroupID: displaySpecGroup.id },
        { categoryID: laptopsCat.id, specGroupID: performanceSpecGroup.id },
        { categoryID: laptopsCat.id, specGroupID: connectivitySpecGroup.id },
        // Smartphones: General, Display, Performance, Connectivity
        { categoryID: smartphonesCat.id, specGroupID: generalSpecGroup.id },
        { categoryID: smartphonesCat.id, specGroupID: displaySpecGroup.id },
        { categoryID: smartphonesCat.id, specGroupID: performanceSpecGroup.id },
        { categoryID: smartphonesCat.id, specGroupID: connectivitySpecGroup.id },
        // Monitors: Display, Connectivity
        { categoryID: monitorsCat.id, specGroupID: displaySpecGroup.id },
        { categoryID: monitorsCat.id, specGroupID: connectivitySpecGroup.id },
    ];
    await prisma.category_SpecGroup.createMany({
        data: categorySpecGroupData,
        skipDuplicates: true,
    });
    console.log('SpecGroups linked to Categories!');
    // --- End of Create Category_SpecGroup Linkages ---
    // --- Create PageVisit Data ---
    console.log('Creating PageVisit data...');
    const allProducts = await prisma.product.findMany();
    const product1 = allProducts.find(p => p.name === "Galaxy S23");
    const product2 = allProducts.find(p => p.name === "MacBook Air M2");
    const product3 = allProducts.find(p => p.name === "WH-1000XM5 Noise Cancelling Headphones");
    const pageVisitData = [];
    // Ensure products were found before creating visits for them
    if (product1) {
        pageVisitData.push({
            pageType: 'PRODUCT',
            pagePath: `/product/${product1.id}`, // Using actual product ID
            deviceResolution: '375x812', // Mobile
            productID: product1.id,
            time: new Date(Date.now() - Math.random() * 100000000), // Random past time
        });
        pageVisitData.push({
            pageType: 'PRODUCT',
            pagePath: `/product/${product1.id}`,
            deviceResolution: '1920x1080', // Desktop
            productID: product1.id,
            time: new Date(Date.now() - Math.random() * 100000000),
        });
    }
    if (product2) {
        pageVisitData.push({
            pageType: 'PRODUCT',
            pagePath: `/product/${product2.id}`,
            deviceResolution: '1366x768', // Laptop
            productID: product2.id,
            time: new Date(Date.now() - Math.random() * 100000000),
        });
    }
    if (product3) {
        pageVisitData.push({
            pageType: 'PRODUCT',
            pagePath: `/product/${product3.id}`,
            deviceResolution: '1920x1080',
            productID: product3.id,
            time: new Date(Date.now() - Math.random() * 100000000),
        });
    }
    // LIST type visits
    pageVisitData.push({
        pageType: 'LIST',
        pagePath: '/list/smartphones',
        deviceResolution: '375x812',
        time: new Date(Date.now() - Math.random() * 100000000),
    });
    pageVisitData.push({
        pageType: 'LIST',
        pagePath: '/list/laptops',
        deviceResolution: '1920x1080',
        time: new Date(Date.now() - Math.random() * 100000000),
    });
    pageVisitData.push({
        pageType: 'LIST',
        pagePath: '/list/audio/headphones',
        deviceResolution: '1366x768',
        time: new Date(Date.now() - Math.random() * 100000000),
    });
    // MAIN type visits
    pageVisitData.push({
        pageType: 'MAIN',
        pagePath: '/',
        deviceResolution: '1920x1080',
        time: new Date(Date.now() - Math.random() * 100000000),
    });
    pageVisitData.push({
        pageType: 'MAIN',
        pagePath: '/',
        deviceResolution: '375x812',
        time: new Date(Date.now() - Math.random() * 100000000),
    });
    pageVisitData.push({
        pageType: 'MAIN',
        pagePath: '/',
        deviceResolution: '1366x768',
        time: new Date(Date.now() - Math.random() * 100000000),
    });
    if (pageVisitData.length > 0) {
        await prisma.pageVisit.createMany({
            data: pageVisitData,
            skipDuplicates: true,
        });
        console.log(`${pageVisitData.length} PageVisit records created!`);
    }
    else {
        console.log('No PageVisit records to create (possibly due to products not found).');
    }
    // --- End of Create PageVisit Data ---
    // --- Create Users and Accounts ---
    console.log('Creating Users and Accounts...');
    // User 1: Alice
    const aliceUser = await prisma.user.create({
        data: {
            name: "Alice Wonderland",
            email: "alice@example.com",
            hashedPassword: "password123_hashed", // Placeholder
            emailVerified: new Date(),
            image: '/images/images/defaultUser.png',
        },
    });
    await prisma.account.create({
        data: {
            userId: aliceUser.id,
            type: "credentials",
            provider: "credentials",
            providerAccountId: aliceUser.id, // Using user's ID as providerAccountId for credentials type
        },
    });
    console.log(`Created User: ${aliceUser.name} with ID: ${aliceUser.id} and linked Account.`);
    // User 2: Bob
    const bobUser = await prisma.user.create({
        data: {
            name: "Bob The Builder",
            email: "bob@example.com",
            hashedPassword: "securepassword_hashed", // Placeholder
            emailVerified: new Date(),
            image: null,
        },
    });
    await prisma.account.create({
        data: {
            userId: bobUser.id,
            type: "credentials",
            provider: "credentials",
            providerAccountId: bobUser.id, // Using user's ID as providerAccountId for credentials type
        },
    });
    console.log(`Created User: ${bobUser.name} with ID: ${bobUser.id} and linked Account.`);
    console.log('Users and Accounts created!');
    // --- End of Create Users and Accounts ---
    // Note: Removed old single product creation and its page visit.
    // If page visits are needed for new products, they should be added here.
    console.log('Seed script finished successfully!');
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
