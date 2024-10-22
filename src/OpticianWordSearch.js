import React, { useState, useEffect } from 'react';

const GRID_SIZE = 15;
const WORDS = [
  'OPTICIAN', 'CATARACT', 'SPECTACLES', 'PHOTOCHROMIC', 'MYOPIA',
  'HYPEROPIA', 'PRESBYOPIA', 'BIFOCAL', 'REFRACTION', 'ASTIGMATISM',
  'GLAUCOMA', 'OPTOMETRIST', 'FRAME', 'GREEN', 'EYETEST'
];

const generateGrid = (words) => {
  // Create empty grid
  const grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(''));
  const directions = [
    [0, 1],   // right
    [1, 0],   // down
    [1, 1],   // diagonal right-down
    [-1, -1], // diagonal left-up
    [-1, 0],  // up
    [0, -1],  // left
    [1, -1],  // diagonal left-down
    [-1, 1]   // diagonal right-up
  ];

  // Place each word
  words.forEach(word => {
    let placed = false;
    while (!placed) {
      const direction = directions[Math.floor(Math.random() * directions.length)];
      const start = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };

      if (canPlaceWord(grid, word, start, direction)) {
        placeWord(grid, word, start, direction);
        placed = true;
      }
    }
  });

  // Fill empty cells
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      if (grid[i][j] === '') {
        grid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
      }
    }
  }

  return grid;
};

const canPlaceWord = (grid, word, start, direction) => {
  for (let i = 0; i < word.length; i++) {
    const x = start.x + i * direction[0];
    const y = start.y + i * direction[1];
    if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return false;
    if (grid[x][y] !== '' && grid[x][y] !== word[i]) return false;
  }
  return true;
};

const placeWord = (grid, word, start, direction) => {
  for (let i = 0; i < word.length; i++) {
    const x = start.x + i * direction[0];
    const y = start.y + i * direction[1];
    grid[x][y] = word[i];
  }
};

const OpticianWordSearch = () => {
  const [grid, setGrid] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [foundWords, setFoundWords] = useState([]);

  useEffect(() => {
    setGrid(generateGrid(WORDS));
  }, []);

  const handleCellClick = (x, y) => {
    const newSelectedCells = [...selectedCells, { x, y }];
    setSelectedCells(newSelectedCells);

    const selectedWord = newSelectedCells.map(cell => grid[cell.x][cell.y]).join('');
    if (WORDS.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords([...foundWords, selectedWord]);
      setSelectedCells([]); // Clear selection after finding a word
    }
  };

  const handleReset = () => {
    setGrid(generateGrid(WORDS));
    setSelectedCells([]);
    setFoundWords([]);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Optician Word Search</h1>
      
      <div className="mb-4 flex justify-center">
        {grid.map((row, x) => (
          <div key={x} className="flex flex-col">
            {row.map((cell, y) => (
              <button
                key={`${x}-${y}`}
                className={`w-8 h-8 border border-gray-300 flex items-center justify-center font-bold
                  ${selectedCells.some(sel => sel.x === x && sel.y === y) ? 'bg-blue-200' : 'hover:bg-gray-100'}`}
                onClick={() => handleCellClick(x, y)}
              >
                {cell}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Words to Find:</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {WORDS.map(word => (
            <div
              key={word}
              className={`p-2 border rounded ${
                foundWords.includes(word) 
                  ? 'bg-green-100 line-through' 
                  : 'bg-gray-50'
              }`}
            >
              {word}
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={handleReset}
        className="w-full md:w-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        New Game
      </button>
    </div>
  );
};

export default OpticianWordSearch;