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
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('shape-form');
    const resultDiv = document.getElementById('result');
    const shapeSelect = document.getElementById('shape');

    // Show/hide appropriate input fields based on shape selection
    shapeSelect.addEventListener('change', () => {
        document.querySelectorAll('.shape-params').forEach(div => {
            div.style.display = 'none';
        });
        document.getElementById(`${shapeSelect.value}-params`).style.display = 'block';
    });

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
                resultDiv.querySelector('.shape-details').textContent = shapeDetails;
                resultDiv.querySelector('.calculated-area').textContent = `Area: ${area.toFixed(2)}`;
                
                // Add to history
                const historyEntry = document.createElement('div');
                historyEntry.textContent = `${shapeDetails} - Area: ${area.toFixed(2)}`;
                const history = resultDiv.querySelector('.calculation-history');
                history.insertBefore(historyEntry, history.firstChild);
            }
        } catch (error) {
            resultDiv.querySelector('.calculated-area').textContent = `Error: ${error.message}`;
        }
    });

    // Initialize with rectangle inputs visible
    document.getElementById('rectangle-params').style.display = 'block';
});

