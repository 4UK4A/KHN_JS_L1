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
        const shapeType = form.elements['shape'].value;
        let shape;
        let shapeDetails = '';
        
        try {
            if (shapeType === 'rectangle') {
                const width = parseFloat(form.elements['width'].value);
                const height = parseFloat(form.elements['height'].value);
                shape = new Rectangle(width, height);
                shapeDetails = `Rectangle with width: ${width} and height: ${height}`;
            } else if (shapeType === 'circle') {
                const radius = parseFloat(form.elements['radius'].value);
                shape = new Circle(radius);
                shapeDetails = `Circle with radius: ${radius}`;
            } else if (shapeType === 'triangle') {
                const base = parseFloat(form.elements['base'].value);
                const height = parseFloat(form.elements['height'].value);
                shape = new Triangle(base, height);
                shapeDetails = `Triangle with base: ${base} and height: ${height}`;
            }

            if (shape) {
                const area = ShapeCalculator.calculateArea(shape);
                
                // Update result display
                resultDiv.querySelector('.shape-details').textContent = shapeDetails;
                resultDiv.querySelector('.calculated-area').textContent = `Area: ${area.toFixed(2)}`;
                
                // Save calculation
                ShapeCalculator.saveInput(shapeType, shape);
                
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

