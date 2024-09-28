window.onload = function() {
    const canvas = document.getElementById('glCanvas');
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser may not support it.');
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    let currentColor = [1.0, 0.0, 0.0, 1.0];  // Default red color

    // Vertex shader program
    const vsSource = `
        attribute vec4 aVertexPosition;
        void main() {
            gl_Position = aVertexPosition;
        }
    `;

    // Fragment shader program with dynamic color
    const fsSource = `
        precision mediump float;
        uniform vec4 uColor;
        void main() {
            gl_FragColor = uColor;
        }
    `;

    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const positions = [
        -0.7,  0.5,
         0.7,  0.5,
        -0.7, -0.5,
         0.7, -0.5,
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vertexPosition);

    gl.useProgram(shaderProgram);

    // Get uniform location for the color
    const colorLocation = gl.getUniformLocation(shaderProgram, 'uColor');

    // Function to update the color and redraw
    function drawScene(color) {
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set the new color
        gl.uniform4fv(colorLocation, color);

        // Draw the rectangle
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    // Initial draw with default color
    drawScene(currentColor);

    // Button event listeners to change the color
    document.getElementById('color1').addEventListener('click', function() {
        currentColor = [0.0, 1.0, 1.0, 1.0]; //cyan
        drawScene(currentColor);
    });

    document.getElementById('color2').addEventListener('click', function() {
        currentColor = [0.0, 1.0, 0.0, 1.0];  // Green
        drawScene(currentColor);
    });

    document.getElementById('color3').addEventListener('click', function() {
        currentColor = [0.0, 0.0, 1.0, 1.0];  // Blue
        drawScene(currentColor);
    });

    document.getElementById('resetColor').addEventListener('click', function() {
        currentColor = [1.0, 0.0, 0.0, 1.0];  
        drawScene(currentColor);
    });
};

// Initialize a shader program, so WebGL knows how to draw our data
function initShaderProgram(gl, vsSource, fsSource) {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

    const shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return null;
    }

    return shaderProgram;
}

// Creates a shader of the given type, uploads the source and compiles it.
function loadShader(gl, type, source) {
    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}