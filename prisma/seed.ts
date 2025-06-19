import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
            parentID: computerAndLaptops.id, // Top-level category
        },
    });
    await prisma.category.create({
        data: {
            id: 'Tablets',
            name: 'Tablets',
            url: '/list/tablets',
            iconUrl: '/list/tablets',
            iconSize: [17, 15],
            parentID: null, // Top-level category
        },
    });

    // Create sample brands
    const brand = await prisma.brand.create({
        data: {
            id: 'brand123',
            name: 'FashionCo',
        },
    });

    // Create sample products
    const product = await prisma.product.create({
        data: {
            id: 'prod123',
            name: 'Sample T-Shirt',
            isAvailable: true,
            desc: 'A comfortable cotton t-shirt.',
            specialFeatures: ['100% Cotton', 'Machine Washable'],
            images: [
                'https://example.com/images/tshirt-front.jpg',
                'https://example.com/images/tshirt-back.jpg',
            ],
            categoryID: computerAndLaptops.id,
            optionSets: ['optset1', 'optset2'],
            price: 29.99,
            salePrice: 24.99,
            specs: [
                { specGroupID: 'color', specValues: ['red', 'blue'] },
                { specGroupID: 'size', specValues: ['M', 'L'] },
            ],
            brandID: brand.id,
        },
    });

    // Create sample page visits
    await prisma.pageVisit.createMany({
        data: [
            {
                id: 'visit1',
                productID: product.id,
                pageType: 'PRODUCT',
                pagePath: '/products/prod123',
                deviceResolution: '1920x1080',
                time: new Date(),
            },
        ],
    });

    console.log('Sample data created!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });