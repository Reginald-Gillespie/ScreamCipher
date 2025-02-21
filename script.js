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
    let decodedText = '';
    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        decodedText += reverseCipherMap[char] || char; // Use original char if not in map
    }
    return decodedText;
}


encodeButton.addEventListener('click', () => {
    const inputText = inputTextArea.value;
    const encodedText = encodeText(inputText);
    outputTextArea.value = encodedText;
});

decodeButton.addEventListener('click', () => {
    const inputText = inputTextArea.value;
    const decodedText = decodeText(inputText);
    outputTextArea.value = decodedText;
});