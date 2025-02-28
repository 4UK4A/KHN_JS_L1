class Shape {
    constructor() {
        if (this.constructor === Shape) {
            throw new Error("Cannot instantiate abstract class Shape");
        }
    }

    area() {
        throw new Error("Method 'area()' must be implemented.");
    }
}

class Rectangle extends Shape {
    constructor(width, height) {
        super();
        this.width = width;
        this.height = height;
    }

    area() {
        return this.width * this.height;
    }
}

class Circle extends Shape {
    constructor(radius) {
        super();
        this.radius = radius;
    }

    area() {
        return Math.PI * Math.pow(this.radius, 2);
    }
}

class Triangle extends Shape {
    constructor(base, height) {
        super();
        this.base = base;
        this.height = height;
    }

    area() {
        return 0.5 * this.base * this.height;
    }
}

class ShapeCalculator {
    static calculateArea(shape) {
        return shape.area();
    }

    static saveInput(shapeType, parameters) {
        const inputs = { shapeType, parameters };
        localStorage.setItem('shapeInputs', JSON.stringify(inputs));
    }

    static loadInput() {
        const data = localStorage.getItem('shapeInputs');
        return data ? JSON.parse(data) : null;
    }

    static calculations = [];

    static addCalculation(shapeType, shape, area) {
        const calculation = {
            id: Date.now(),
            shapeType,
            shape: {
                ...shape
            },
            area,
            timestamp: new Date().toISOString()
        };
        
        // Load existing calculations first
        const calculations = this.loadCalculations();
        calculations.push(calculation);
        
        // Save to localStorage
        localStorage.setItem('calculations', JSON.stringify(calculations));
        return calculation;
    }

    static loadCalculations() {
        const saved = localStorage.getItem('calculations');
        return saved ? JSON.parse(saved) : [];
    }

    static filterAndSortCalculations(searchTerm = '', shapeType = 'all', sortBy = 'newest') {
        const calculations = this.loadCalculations();
        
        let filtered = [...calculations];

        // Filter by shape type
        if (shapeType !== 'all') {
            filtered = filtered.filter(calc => calc.shapeType === shapeType);
        }

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(calc => 
                calc.shapeType.toLowerCase().includes(term) ||
                calc.area.toString().includes(term)
            );
        }

        // Sort calculations
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'oldest':
                    return new Date(a.timestamp) - new Date(b.timestamp);
                case 'area-asc':
                    return a.area - b.area;
                case 'area-desc':
                    return b.area - a.area;
                default: // 'newest'
                    return new Date(b.timestamp) - new Date(a.timestamp);
            }
        });

        return filtered;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shape-form');
    const resultDiv = document.getElementById('result');
    const shapeSelect = document.getElementById('shape');

    const searchInput = document.getElementById('search');
    const filterShape = document.getElementById('filter-shape');
    const sortBy = document.getElementById('sort-by');
    const historyDiv = document.querySelector('.calculation-history');

    // Function to hide all parameter inputs and disable their required attribute
    function hideAllParams() {
        document.querySelectorAll('.shape-params').forEach(div => {
            div.style.display = 'none';
            // Disable required attribute for hidden inputs
            div.querySelectorAll('input').forEach(input => {
                input.required = false;
            });
        });
    }

    // Function to show selected parameter inputs and enable their required attribute
    function showSelectedParams(shapeType) {
        const selectedDiv = document.getElementById(`${shapeType}-params`);
        selectedDiv.style.display = 'block';
        // Enable required attribute for visible inputs
        selectedDiv.querySelectorAll('input').forEach(input => {
            input.required = true;
        });
    }

    // Update shape parameters visibility when shape is selected
    shapeSelect.addEventListener('change', () => {
        hideAllParams();
        showSelectedParams(shapeSelect.value);
    });

    // Initial setup - show rectangle params by default
    hideAllParams();
    showSelectedParams('rectangle');

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        // Clear previous results
        resultDiv.querySelector('.shape-details').textContent = '';
        resultDiv.querySelector('.calculated-area').textContent = '';

        const shapeType = form.elements['shape'].value;
        let shape;
        let shapeDetails = '';
        
        try {
            if (shapeType === 'rectangle') {
                const width = parseFloat(form.elements['rect-width'].value);
                const height = parseFloat(form.elements['rect-height'].value);
                if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0) {
                    throw new Error('Please enter valid positive numbers for width and height');
                }
                shape = new Rectangle(width, height);
                shapeDetails = `Rectangle with width: ${width} and height: ${height}`;
            } else if (shapeType === 'circle') {
                const radius = parseFloat(form.elements['radius'].value);
                if (isNaN(radius) || radius <= 0) {
                    throw new Error('Please enter a valid positive number for radius');
                }
                shape = new Circle(radius);
                shapeDetails = `Circle with radius: ${radius}`;
            } else if (shapeType === 'triangle') {
                const base = parseFloat(form.elements['tri-base'].value);
                const height = parseFloat(form.elements['tri-height'].value);
                if (isNaN(base) || isNaN(height) || base <= 0 || height <= 0) {
                    throw new Error('Please enter valid positive numbers for base and height');
                }
                shape = new Triangle(base, height);
                shapeDetails = `Triangle with base: ${base} and height: ${height}`;
            }

            if (shape) {
                const area = ShapeCalculator.calculateArea(shape);
                const calculation = ShapeCalculator.addCalculation(shapeType, shape, area);
                
                // Update display
                resultDiv.querySelector('.shape-details').textContent = shapeDetails;
                resultDiv.querySelector('.calculated-area').textContent = `Area: ${area.toFixed(2)}`;
                
                // Reset form
                form.reset();
                
                // Update history display
                updateHistory();
            }
        } catch (error) {
            resultDiv.querySelector('.calculated-area').textContent = `Error: ${error.message}`;
        }
    });

    // Initialize with rectangle inputs visible
    document.getElementById('rectangle-params').style.display = 'block';

    function updateHistory() {
        const filtered = ShapeCalculator.filterAndSortCalculations(
            searchInput.value,
            filterShape.value,
            sortBy.value
        );

        historyDiv.innerHTML = '';
        filtered.forEach(calc => {
            const entry = document.createElement('div');
            entry.className = 'history-entry';
            entry.innerHTML = `
                <span class="shape-type">${calc.shapeType}</span>
                <span class="area">Area: ${calc.area.toFixed(2)}</span>
                <span class="timestamp">${new Date(calc.timestamp).toLocaleString()}</span>
            `;
            historyDiv.appendChild(entry);
        });
    }

    // Load existing calculations
    ShapeCalculator.loadCalculations();
    updateHistory();

    // Add event listeners for search, filter, and sort
    searchInput.addEventListener('input', updateHistory);
    filterShape.addEventListener('change', updateHistory);
    sortBy.addEventListener('change', updateHistory);
});

