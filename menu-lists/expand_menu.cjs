
const fs = require('fs');
const path = require('path');

const menuPath = path.join(__dirname, 'menu.json');
const rawData = fs.readFileSync(menuPath);
const data = JSON.parse(rawData);

let originalCategories = JSON.parse(JSON.stringify(data.menu));
let newMenu = [];
let itemCount = 0;

// Target ~200 items
while (itemCount < 220) {
    originalCategories.forEach(cat => {
        // Clone category
        let newCat = JSON.parse(JSON.stringify(cat));

        // Randomize category name slightly to distinguish duplicates if needed, 
        // but keeping same name is fine for layout testing.
        // Let's append suffix if it's a duplicate pass.
        if (itemCount > 0) {
            // Maybe not change name to keep it clean, or add spaces?
            // Let's just keep strict logic.
        }

        newCat.items = newCat.items.map(item => {
            // Randomly assign availability
            // 80% chance of being available
            const isAvailable = Math.random() > 0.2;
            return {
                ...item,
                isAvailable: isAvailable
            };
        });

        newMenu.push(newCat);
        itemCount += newCat.items.length;
    });
}

// Write back
fs.writeFileSync(menuPath, JSON.stringify({ menu: newMenu }, null, 2));

console.log(`Expanded menu to ${itemCount} items.`);
