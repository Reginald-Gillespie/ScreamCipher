const encodeButton = document.getElementById('encode');
const decodeButton = document.getElementById('decode');
const inputTextArea = document.getElementById('input');
const outputTextArea = document.getElementById('output');

const cipherMap = {
    'A': 'A',   'B': 'Ȧ',   'C': 'A̧',   'D': 'A̲',   'E': 'Á',
    'F': 'A̮',   'G': 'A̋',   'H': 'A̰',   'I': 'Ả',   'J': 'A̓',
    'K': 'Ạ',   'L': 'Ă',   'M': 'Ǎ',   'N': 'Â',   'O': 'Å',
    'P': 'A̯',   'Q': 'A̤',   'R': 'Ȃ',   'S': 'Ã',   'T': 'Ā',
    'U': 'Ä',   'V': 'À',   'W': 'Ȁ',   'X': 'A̽',   'Y': 'A̦',
    'Z': 'Ⱥ'
};

const reverseCipherMap = {};
for (const key in cipherMap) {
    reverseCipherMap[cipherMap[key]] = key;
}


function encodeText(text) {
    let encodedText = '';
    text = text.toUpperCase();
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        encodedText += cipherMap[char] || char; // Use original char if not in map
    }
    return encodedText;
}

function decodeText(text) {
    const keys = Object.keys(reverseCipherMap).sort((a, b) => b.length - a.length);
    keys.forEach(key => {
        text = text.replaceAll(key, reverseCipherMap[key]);
    })
    return text;
}


encodeButton.addEventListener('click', () => {
    const inputText = inputTextArea.value.normalize('NFC');
    const encodedText = encodeText(inputText);
    outputTextArea.value = encodedText;
});

decodeButton.addEventListener('click', () => {
    const inputText = inputTextArea.value.normalize('NFC');
    const decodedText = decodeText(inputText);
    outputTextArea.value = decodedText;
});

// Fix the backspace key by default not deleting an entire "letter"
inputTextArea.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace' || event.key === 'Delete') {
        const { selectionStart, selectionEnd, value } = inputTextArea;

        // If text is selected, default behavior is fine
        if (selectionStart !== selectionEnd) return;

        event.preventDefault();

        let newValue;
        let newCursorPos = selectionStart;

        if (typeof Intl.Segmenter === 'function') {
            const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
            const segments = [...segmenter.segment(value)];

            let charCount = 0;
            for (let i = 0; i < segments.length; i++) {
                charCount += segments[i].segment.length;

                // Handle Backspace (delete previous character)
                if (event.key === 'Backspace' && charCount >= selectionStart) {
                    newCursorPos -= segments[i].segment.length;
                    segments.splice(i, 1);
                    break;
                }

                // Handle Delete (delete next character)
                if (event.key === 'Delete' && charCount > selectionStart) {
                    segments.splice(i, 1);
                    break;
                }
            }

            newValue = segments.map(s => s.segment).join('');
        } 
        // Fallback to regex-based deletion
        else {
            if (event.key === 'Backspace') {
                newValue = value.replace(/(\P{M}\p{M}*)$/u, '');
                newCursorPos = newValue.length;
            } else if (event.key === 'Delete') {
                newValue = value.substring(0, selectionStart) + value.substring(selectionStart + 1);
            }
        }

        inputTextArea.value = newValue;
        inputTextArea.setSelectionRange(newCursorPos, newCursorPos);
    }
});



for (const [key, value] of Object.entries(cipherMap)) {
    const button = document.getElementById(`key-${key}`);
    button.addEventListener('click', () => {
        inputTextArea.value += value;
    });
}
