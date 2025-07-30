// Rail Fence Cipher Encrypt
function railFenceEncrypt(text, key) {
  if (key < 2) return text; // No encryption if key < 2
  text = text.replace(/\s+/g, '');
  let fence = Array.from({ length: key }, () => []);
  let row = 0, direction = 1;

  for (let char of text) {
    fence[row].push(char);
    row += direction;
    if (row === 0 || row === key - 1) direction *= -1;
  }
  return fence.flat().join('');
}

// Rail Fence Cipher Decrypt
function railFenceDecrypt(cipher, key) {
  if (key < 2) return cipher;
  let len = cipher.length;
  let fence = Array.from({ length: key }, () => Array(len).fill(null));
  let dir_down;

  // mark the places with '*'
  let row = 0, col = 0;
  for (let i = 0; i < len; i++) {
    if (row === 0) dir_down = true;
    if (row === key - 1) dir_down = false;
    fence[row][col++] = '*';
    row += dir_down ? 1 : -1;
  }

  // now fill the '*' positions with cipher letters
  let index = 0;
  for (let i = 0; i < key; i++) {
    for (let j = 0; j < len; j++) {
      if (fence[i][j] === '*' && index < len) {
        fence[i][j] = cipher[index++];
      }
    }
  }

  // read the matrix in zig-zag manner to construct original text
  let result = '';
  row = 0; col = 0;
  for (let i = 0; i < len; i++) {
    if (row === 0) dir_down = true;
    if (row === key - 1) dir_down = false;

    if (fence[row][col] !== null) {
      result += fence[row][col++];
    }
    row += dir_down ? 1 : -1;
  }
  return result;
}

// Row Transposition Cipher Encrypt
function rowTranspositionEncrypt(plainText, key) {
  let keyDigits = [...key].map(Number);
  const lenKey = keyDigits.length;
  plainText = plainText.toLowerCase().replace(/\s+/g, '');
  const lenPlain = plainText.length;
  const row = Math.ceil(lenPlain / lenKey);

  // Create matrix row-wise
  const matrix = Array.from({ length: row }, () => Array(lenKey).fill(''));
  let t = 0;
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < lenKey; c++) {
      if (t < lenPlain) matrix[r][c] = plainText[t++];
    }
  }

  const colOrder = keyDigits
    .map((k, i) => ({ k, i }))
    .sort((a, b) => a.k - b.k)
    .map(({ i }) => i);

  // Read column-wise in key order
  let cipherText = '';
  for (const c of colOrder) {
    for (let r = 0; r < row; r++) {
      if (matrix[r][c] !== '') cipherText += matrix[r][c];
    }
  }
  return cipherText;
}

// Row Transposition Cipher Decrypt
function rowTranspositionDecrypt(cipherText, key) {
  let keyDigits = [...key].map(Number);
  const lenKey = keyDigits.length;
  const lenCipher = cipherText.length;
  const row = Math.ceil(lenCipher / lenKey);

  // Determine number of full columns
  const numFullCols = lenCipher % lenKey || lenKey;
  const colLengths = keyDigits.map((k, i) =>
    i < numFullCols ? row : row - 1
  );

  // Column order based on key
  const colOrder = keyDigits
    .map((k, i) => ({ k, i }))
    .sort((a, b) => a.k - b.k)
    .map(({ i }) => i);

  // Initialize matrix
  const matrix = Array.from({ length: row }, () => Array(lenKey).fill(''));

  let t = 0;
  for (let i = 0; i < lenKey; i++) {
    const c = colOrder[i];
    const colLen = colLengths[c];
    for (let r = 0; r < colLen; r++) {
      matrix[r][c] = cipherText[t++] || '';
    }
  }

  // Read row-wise to get decrypted text
  let decryptedText = '';
  for (let r = 0; r < row; r++) {
    for (let c = 0; c < lenKey; c++) {
      if (matrix[r][c] !== '') decryptedText += matrix[r][c];
    }
  }
  return decryptedText;
}

// Event Listeners & UI Handling
document.getElementById('encryptBtn').addEventListener('click', () => {
  const message = document.getElementById('message').value.trim();
  const railKeyStr = document.getElementById('railKey').value.trim();
  const rowKey = document.getElementById('rowKey').value.trim();

  if (!message) {
    alert('Please enter a message!');
    return;
  }
  if (!railKeyStr || isNaN(railKeyStr) || parseInt(railKeyStr) < 2) {
    alert('Please enter a valid Rail Fence key (number >= 2)!');
    return;
  }
  if (!rowKey || !/^\d+$/.test(rowKey)) {
    alert('Please enter a valid numeric Row Transposition key!');
    return;
  }

  const railKey = parseInt(railKeyStr, 10);

  // Rail Fence Cipher encrypt/decrypt
  const railEncrypted = railFenceEncrypt(message, railKey);
  const railDecrypted = railFenceDecrypt(railEncrypted, railKey);

  // Row Transposition Cipher encrypt/decrypt
  const rowEncrypted = rowTranspositionEncrypt(message, rowKey);
  const rowDecrypted = rowTranspositionDecrypt(rowEncrypted, rowKey);

  const showWithAnimation = (elementId, text) => {
    const el = document.getElementById(elementId);
    el.style.opacity = 0;
    el.textContent = '';
    setTimeout(() => {
      el.textContent = text;
      el.style.opacity = 1;
    }, 150);
  };

  showWithAnimation('railEncrypted', railEncrypted);
  showWithAnimation('railDecrypted', railDecrypted);
  showWithAnimation('rowEncrypted', rowEncrypted);
  showWithAnimation('rowDecrypted', rowDecrypted);
});

document.getElementById('decryptBtn').addEventListener('click', () => {
  const message = document.getElementById('message').value.trim();
  const railKeyStr = document.getElementById('railKey').value.trim();
  const rowKey = document.getElementById('rowKey').value.trim();

  if (!message) {
    alert('Please enter a cipher text to decrypt!');
    return;
  }
  if (!railKeyStr || isNaN(railKeyStr) || parseInt(railKeyStr) < 2) {
    alert('Please enter a valid Rail Fence key (number >= 2)!');
    return;
  }
  if (!rowKey || !/^\d+$/.test(rowKey)) {
    alert('Please enter a valid numeric Row Transposition key!');
    return;
  }

  const railKey = parseInt(railKeyStr, 10);

  // Rail Fence Cipher decrypt/encrypt
  const railDecrypted = railFenceDecrypt(message, railKey);
  const railEncrypted = railFenceEncrypt(railDecrypted, railKey);

  // Row Transposition Cipher decrypt/encrypt
  const rowDecrypted = rowTranspositionDecrypt(message, rowKey);
  const rowEncrypted = rowTranspositionEncrypt(rowDecrypted, rowKey);

  const showWithAnimation = (elementId, text) => {
    const el = document.getElementById(elementId);
    el.style.opacity = 0;
    el.textContent = '';
    setTimeout(() => {
      el.textContent = text;
      el.style.opacity = 1;
    }, 150);
  };

  showWithAnimation('railDecrypted', railDecrypted);
  showWithAnimation('railEncrypted', railEncrypted);
  showWithAnimation('rowDecrypted', rowDecrypted);
  showWithAnimation('rowEncrypted', rowEncrypted);
});
