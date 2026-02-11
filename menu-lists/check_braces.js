const fs = require('fs');

try {
    const css = fs.readFileSync('d:\\manish\\my documents\\New folder (3)\\menu-lists\\src\\App.css', 'utf8');
    const lines = css.split('\n');
    const stack = [];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        for (let j = 0; j < line.length; j++) {
            const char = line[j];
            if (char === '{') {
                stack.push({ line: i + 1, col: j + 1 });
            } else if (char === '}') {
                if (stack.length === 0) {
                    console.log(`Extra closing brace at line ${i + 1}, col ${j + 1}`);
                } else {
                    stack.pop();
                }
            }
        }
    }

    if (stack.length > 0) {
        console.log(`Unclosed braces found:`);
        stack.forEach(item => {
            console.log(`- Line ${item.line}, Col ${item.col}: ${lines[item.line - 1].trim()}`);
        });
    } else {
        console.log('No unclosed braces found.');
    }

} catch (err) {
    console.error('Error:', err.message);
}
