import React, { useRef, useEffect } from 'react';
import { StyleSheet, PanResponder } from 'react-native';
import { GLView } from 'expo-gl';
import * as THREE from 'three';

interface Dice3DProps {
  isRolling: boolean;
  onRollComplete: (result: number) => void;
  customFaceValues?: string[];
}

const diceFaces = {
  1: [[0, 0, 0]],
  2: [[-0.3, 0.3, 0], [0.3, -0.3, 0]],
  3: [[-0.3, 0.3, 0], [0, 0, 0], [0.3, -0.3, 0]],
  4: [[-0.3, 0.3, 0], [0.3, 0.3, 0], [-0.3, -0.3, 0], [0.3, -0.3, 0]],
  5: [[-0.3, 0.3, 0], [0.3, 0.3, 0], [0, 0, 0], [-0.3, -0.3, 0], [0.3, -0.3, 0]],
  6: [[-0.3, 0.3, 0], [0.3, 0.3, 0], [-0.3, 0, 0], [0.3, 0, 0], [-0.3, -0.3, 0], [0.3, -0.3, 0]],
};

const faceRotations: { [key: number]: [number, number, number] } = {
  1: [0, 0, 0],
  2: [0, Math.PI, 0],
  3: [0, -Math.PI / 2, 0],
  4: [0, Math.PI / 2, 0],
  5: [Math.PI / 2, 0, 0],
  6: [-Math.PI / 2, 0, 0],
};

export default function Dice3D({ isRolling, onRollComplete, customFaceValues }: Dice3DProps) {
  const animationFrameRef = useRef<number>(null);
  const rollTimeRef = useRef(0);
  const targetResultRef = useRef(1);
  const lastTimeRef = useRef(Date.now());
  const currentRotationRef = useRef<[number, number, number]>([0.4, 0.4, 0]);
  const targetRotationRef = useRef<[number, number, number]>([0.4, 0.4, 0]);
  const diceGroupRef = useRef<THREE.Group | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const isRollingRef = useRef(isRolling);
  const settlingStartRotationRef = useRef<[number, number, number]>([0, 0, 0]);
  const tumbleDirectionRef = useRef({ x: 1.3, y: 0.9, z: 0.4 });
  const tumbleSpeedRef = useRef(18);
  const velocityRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isDraggingRef = useRef(false);
  const lastGestureRef = useRef<{ dx: number; dy: number; time: number }>({ dx: 0, dy: 0, time: Date.now() });
  const dampingFactor = 0.95;

  useEffect(() => {
    isRollingRef.current = isRolling;
    if (isRolling) {
      rollTimeRef.current = 0;
      targetResultRef.current = 0;
      lastTimeRef.current = Date.now();
      velocityRef.current = { x: 0, y: 0 };
      
      tumbleDirectionRef.current = {
        x: (Math.random() - 0.5) * 3,
        y: (Math.random() - 0.5) * 3,
        z: (Math.random() - 0.5) * 2,
      };
      
      tumbleSpeedRef.current = 18 + Math.random() * 4;
      
      if (diceGroupRef.current) {
        const randomImpulse = {
          x: (Math.random() - 0.5) * 0.5,
          y: (Math.random() - 0.5) * 0.5,
          z: (Math.random() - 0.5) * 0.5,
        };
        
        diceGroupRef.current.rotation.x += randomImpulse.x;
        diceGroupRef.current.rotation.y += randomImpulse.y;
        diceGroupRef.current.rotation.z += randomImpulse.z;
        
        currentRotationRef.current = [
          diceGroupRef.current.rotation.x,
          diceGroupRef.current.rotation.y,
          diceGroupRef.current.rotation.z,
        ];
      }
    }
  }, [isRolling]);

  useEffect(() => {
    // Only recreate dice if not currently rolling
    if (sceneRef.current && diceGroupRef.current && !isRollingRef.current) {
      const currentRotation: [number, number, number] = [
        diceGroupRef.current.rotation.x,
        diceGroupRef.current.rotation.y,
        diceGroupRef.current.rotation.z,
      ];
      
      sceneRef.current.remove(diceGroupRef.current);
      
      const newDiceGroup = createDiceWithDots();
      newDiceGroup.rotation.x = currentRotation[0];
      newDiceGroup.rotation.y = currentRotation[1];
      newDiceGroup.rotation.z = currentRotation[2];
      sceneRef.current.add(newDiceGroup);
      
      diceGroupRef.current = newDiceGroup;
      currentRotationRef.current = currentRotation;
    }
  }, [customFaceValues]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !isRollingRef.current,
      onMoveShouldSetPanResponder: () => !isRollingRef.current,
      onPanResponderGrant: () => {
        isDraggingRef.current = true;
        velocityRef.current = { x: 0, y: 0 };
      },
      onPanResponderMove: (evt, gestureState) => {
        if (!isRollingRef.current && diceGroupRef.current) {
          const currentTime = Date.now();
          const deltaTime = (currentTime - lastGestureRef.current.time) / 1000;
          
          if (deltaTime > 0) {
            velocityRef.current = {
              x: (gestureState.dy - lastGestureRef.current.dy) / deltaTime,
              y: (gestureState.dx - lastGestureRef.current.dx) / deltaTime,
            };
          }
          
          lastGestureRef.current = { dx: gestureState.dx, dy: gestureState.dy, time: currentTime };
          
          const rotationSpeed = 0.005;
          const newRotX = currentRotationRef.current[0] + gestureState.dy * rotationSpeed;
          const newRotY = currentRotationRef.current[1] + gestureState.dx * rotationSpeed;
          
          diceGroupRef.current.rotation.x = newRotX;
          diceGroupRef.current.rotation.y = newRotY;
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (!isRollingRef.current && diceGroupRef.current) {
          isDraggingRef.current = false;
          currentRotationRef.current = [
            diceGroupRef.current.rotation.x,
            diceGroupRef.current.rotation.y,
            diceGroupRef.current.rotation.z,
          ];
        }
      },
    })
  ).current;

  const createDot = (position: number[], faceIndex: number, diceGroup: THREE.Group) => {
    const [x, y] = position;
    let dotPosition: [number, number, number];
    let rotation: [number, number, number] = [0, 0, 0];
    
    switch (faceIndex) {
      case 0:
        dotPosition = [x, y, 1.01];
        rotation = [0, 0, 0];
        break;
      case 1:
        dotPosition = [-x, y, -1.01];
        rotation = [0, Math.PI, 0];
        break;
      case 2:
        dotPosition = [1.01, y, -x];
        rotation = [0, Math.PI / 2, 0];
        break;
      case 3:
        dotPosition = [-1.01, y, x];
        rotation = [0, -Math.PI / 2, 0];
        break;
      case 4:
        dotPosition = [x, 1.01, -y];
        rotation = [-Math.PI / 2, 0, 0];
        break;
      case 5:
        dotPosition = [x, -1.01, y];
        rotation = [Math.PI / 2, 0, 0];
        break;
      default:
        dotPosition = [0, 0, 0];
    }

    const dotGeometry = new THREE.CircleGeometry(0.12, 32);
    const dotMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xDC2626,
      side: THREE.DoubleSide
    });
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.set(dotPosition[0], dotPosition[1], dotPosition[2]);
    dot.rotation.set(rotation[0], rotation[1], rotation[2]);
    diceGroup.add(dot);
  };

  const createDiceWithDots = () => {
    const diceGroup = new THREE.Group();
    
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
    const diceMesh = new THREE.Mesh(geometry, material);
    diceGroup.add(diceMesh);
    
    const hasCustomValues = customFaceValues && 
                           customFaceValues.length === 6 && 
                           customFaceValues.every(val => val.trim() !== '');
    
    if (hasCustomValues) {
      // Show custom text on faces
      customFaceValues!.forEach((text, index) => {
        createTextOnFace(text, index, diceGroup);
      });
    } else {
      // Show default dots
      Object.entries(diceFaces).forEach(([faceNum, dots], faceIndex) => {
        dots.forEach((dot) => createDot(dot, faceIndex, diceGroup));
      });
    }

    return diceGroup;
  };

  const createTextTexture = (text: string): THREE.DataTexture => {
    const size = 128;
    const data = new Uint8Array(size * size * 4);
    
    // Fill with transparent background
    for (let i = 0; i < data.length; i += 4) {
      data[i] = 255;     // R
      data[i + 1] = 255; // G
      data[i + 2] = 255; // B
      data[i + 3] = 0;   // A (transparent)
    }
    
    // Simple pixel-based text rendering for basic characters
    const drawPixel = (x: number, y: number, r: number, g: number, b: number, a: number = 255) => {
      if (x < 0 || x >= size || y < 0 || y >= size) return;
      const index = (y * size + x) * 4;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = a;
    };
    
    const drawRect = (x: number, y: number, w: number, h: number) => {
      for (let i = 0; i < w; i++) {
        for (let j = 0; j < h; j++) {
          drawPixel(x + i, y + j, 220, 38, 38); // Red color
        }
      }
    };
    
    // Responsive scale based on text length - bigger for short text, smaller for long text
    const textLength = Math.min(text.length, 6);
    let scale: number;
    if (textLength === 1) {
      scale = 9; // Very large for single character
    } else if (textLength === 2) {
      scale = 7;  // Large for two characters
    } else if (textLength === 3) {
      scale = 5;  // Medium-large for three characters
    } else if (textLength === 4) {
      scale = 4;  // Medium for four characters
    } else {
      scale = 3;  // Smaller for 5-6 characters
    }
    
    // Character dimensions - improved wider font (5 width instead of 3)
    const charWidth = 5; // Width of each character in pattern units
    const charHeight = 7; // Height in pattern units
    const charSpacing = 1; // Spacing between characters
    
    // Calculate total width of the text
    const totalWidth = textLength * (charWidth * scale + charSpacing * scale) - charSpacing * scale;
    
    // Center the text horizontally and vertically
    const startX = Math.floor((size - totalWidth) / 2);
    const startY = Math.floor((size - charHeight * scale) / 2);
    
    // Improved, more readable 5x7 font patterns
    const numberPatterns: { [key: string]: number[][] } = {
      '0': [[0,1,1,1,0], [1,1,0,1,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,1,0,1,1], [0,1,1,1,0]],
      '1': [[0,0,1,0,0], [0,1,1,0,0], [1,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [1,1,1,1,1]],
      '2': [[0,1,1,1,0], [1,0,0,0,1], [0,0,0,0,1], [0,0,1,1,0], [0,1,0,0,0], [1,0,0,0,0], [1,1,1,1,1]],
      '3': [[0,1,1,1,0], [1,0,0,0,1], [0,0,0,0,1], [0,0,1,1,0], [0,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0]],
      '4': [[0,0,0,1,0], [0,0,1,1,0], [0,1,0,1,0], [1,0,0,1,0], [1,1,1,1,1], [0,0,0,1,0], [0,0,0,1,0]],
      '5': [[1,1,1,1,1], [1,0,0,0,0], [1,1,1,1,0], [0,0,0,0,1], [0,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0]],
      '6': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,0], [1,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0]],
      '7': [[1,1,1,1,1], [0,0,0,0,1], [0,0,0,1,0], [0,0,1,0,0], [0,1,0,0,0], [0,1,0,0,0], [0,1,0,0,0]],
      '8': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0]],
      '9': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [0,1,1,1,1], [0,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0]],
    };
    
    const letterPatterns: { [key: string]: number[][] } = {
      'A': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1]],
      'B': [[1,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,0]],
      'C': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,1], [0,1,1,1,0]],
      'D': [[1,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,0]],
      'E': [[1,1,1,1,1], [1,0,0,0,0], [1,0,0,0,0], [1,1,1,1,0], [1,0,0,0,0], [1,0,0,0,0], [1,1,1,1,1]],
      'F': [[1,1,1,1,1], [1,0,0,0,0], [1,0,0,0,0], [1,1,1,1,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0]],
      'G': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,0], [1,0,1,1,1], [1,0,0,0,1], [1,0,0,0,1], [0,1,1,1,1]],
      'H': [[1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1]],
      'I': [[1,1,1,1,1], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [1,1,1,1,1]],
      'J': [[0,0,1,1,1], [0,0,0,1,0], [0,0,0,1,0], [0,0,0,1,0], [0,0,0,1,0], [1,0,0,1,0], [0,1,1,0,0]],
      'K': [[1,0,0,0,1], [1,0,0,1,0], [1,0,1,0,0], [1,1,0,0,0], [1,0,1,0,0], [1,0,0,1,0], [1,0,0,0,1]],
      'L': [[1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0], [1,1,1,1,1]],
      'M': [[1,0,0,0,1], [1,1,0,1,1], [1,0,1,0,1], [1,0,1,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1]],
      'N': [[1,0,0,0,1], [1,1,0,0,1], [1,0,1,0,1], [1,0,1,0,1], [1,0,0,1,1], [1,0,0,0,1], [1,0,0,0,1]],
      'O': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0]],
      'P': [[1,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,0], [1,0,0,0,0], [1,0,0,0,0], [1,0,0,0,0]],
      'Q': [[0,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,1,0,1], [1,0,0,1,0], [0,1,1,0,1]],
      'R': [[1,1,1,1,0], [1,0,0,0,1], [1,0,0,0,1], [1,1,1,1,0], [1,0,1,0,0], [1,0,0,1,0], [1,0,0,0,1]],
      'S': [[0,1,1,1,1], [1,0,0,0,0], [1,0,0,0,0], [0,1,1,1,0], [0,0,0,0,1], [0,0,0,0,1], [1,1,1,1,0]],
      'T': [[1,1,1,1,1], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0]],
      'U': [[1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [0,1,1,1,0]],
      'V': [[1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [0,1,0,1,0], [0,0,1,0,0]],
      'W': [[1,0,0,0,1], [1,0,0,0,1], [1,0,0,0,1], [1,0,1,0,1], [1,0,1,0,1], [1,1,0,1,1], [1,0,0,0,1]],
      'X': [[1,0,0,0,1], [1,0,0,0,1], [0,1,0,1,0], [0,0,1,0,0], [0,1,0,1,0], [1,0,0,0,1], [1,0,0,0,1]],
      'Y': [[1,0,0,0,1], [1,0,0,0,1], [0,1,0,1,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0], [0,0,1,0,0]],
      'Z': [[1,1,1,1,1], [0,0,0,0,1], [0,0,0,1,0], [0,0,1,0,0], [0,1,0,0,0], [1,0,0,0,0], [1,1,1,1,1]],
    };
    
    // Render each character with simple block letters
    let offsetX = 0;
    for (let c = 0; c < textLength; c++) {
      const char = text[c].toUpperCase();
      const charStartX = startX + offsetX;
      
      let pattern: number[][] | undefined;
      
      // Get the appropriate pattern
      if (char >= '0' && char <= '9') {
        pattern = numberPatterns[char];
      } else if (char >= 'A' && char <= 'Z') {
        pattern = letterPatterns[char];
      }
      
      if (pattern) {
        for (let row = 0; row < pattern.length; row++) {
          for (let col = 0; col < pattern[row].length; col++) {
            if (pattern[row][col]) {
              drawRect(charStartX + col * scale, startY + row * scale, scale, scale);
            }
          }
        }
      } else {
        // For other characters, draw a simple box
        drawRect(charStartX, startY + 2 * scale, 2 * scale, 3 * scale);
      }
      
      offsetX += (charWidth * scale) + (charSpacing * scale);
    }
    
    const texture = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
    texture.needsUpdate = true;
    texture.flipY = true; // Fix mirror image issue
    return texture;
  };

  const createTextOnFace = (text: string, faceIndex: number, diceGroup: THREE.Group) => {
    let position: [number, number, number];
    let rotation: [number, number, number] = [0, 0, 0];

    switch (faceIndex) {
      case 0:
        position = [0, 0, 1.01];
        rotation = [0, 0, 0];
        break;
      case 1:
        position = [0, 0, -1.01];
        rotation = [0, Math.PI, 0];
        break;
      case 2:
        position = [1.01, 0, 0];
        rotation = [0, Math.PI / 2, 0];
        break;
      case 3:
        position = [-1.01, 0, 0];
        rotation = [0, -Math.PI / 2, 0];
        break;
      case 4:
        position = [0, 1.01, 0];
        rotation = [-Math.PI / 2, 0, 0];
        break;
      case 5:
        position = [0, -1.01, 0];
        rotation = [Math.PI / 2, 0, 0];
        break;
      default:
        position = [0, 0, 0];
    }

    // Create texture with text
    const texture = createTextTexture(text);
    
    // Create a plane to display the text
    const planeGeometry = new THREE.PlaneGeometry(1.8, 1.8);
    const planeMaterial = new THREE.MeshBasicMaterial({ 
      map: texture,
      transparent: true,
      side: THREE.DoubleSide
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(position[0], position[1], position[2]);
    plane.rotation.set(rotation[0], rotation[1], rotation[2]);
    
    diceGroup.add(plane);
  };

  const getTopFace = (rotation: THREE.Euler): number => {
    const cameraVector = new THREE.Vector3(0, 0, 1);
    
    const faceNormals = [
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
    ];
    
    let maxDot = -Infinity;
    let topFaceIndex = 0;
    
    faceNormals.forEach((normal, index) => {
      const rotatedNormal = normal.clone().applyEuler(rotation);
      const dotProduct = rotatedNormal.dot(cameraVector);
      
      if (dotProduct > maxDot) {
        maxDot = dotProduct;
        topFaceIndex = index;
      }
    });
    
    return topFaceIndex + 1;
  };

  const onContextCreate = async (gl: any) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    
    // Create WebGL renderer directly
    const renderer = new THREE.WebGLRenderer({
      canvas: {
        width: width,
        height: height,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: height,
        getContext: () => gl,
      } as any,
      context: gl,
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x1a1a2e);

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 6;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);

    const diceGroup = createDiceWithDots();
    diceGroup.rotation.x = currentRotationRef.current[0];
    diceGroup.rotation.y = currentRotationRef.current[1];
    diceGroup.rotation.z = currentRotationRef.current[2];
    scene.add(diceGroup);
    
    diceGroupRef.current = diceGroup;

    // Animation loop
    const render = () => {
      animationFrameRef.current = requestAnimationFrame(render);

      const currentTime = Date.now();
      const delta = (currentTime - lastTimeRef.current) / 1000;
      lastTimeRef.current = currentTime;

      const currentDice = diceGroupRef.current;
      if (!currentDice) return;

      if (isRollingRef.current) {
        rollTimeRef.current += delta;
        
        const tumblingDuration = 2.0;
        const settlingDuration = 1.0;
        const totalDuration = tumblingDuration + settlingDuration;
        
        if (rollTimeRef.current < tumblingDuration) {
          const tumbleProgress = rollTimeRef.current / tumblingDuration;
          const easeOut = 1 - Math.pow(1 - tumbleProgress, 2);
          
          const baseSpeed = tumbleSpeedRef.current;
          const currentSpeed = baseSpeed * (1 - easeOut * 0.85);
          
          currentDice.rotation.x += currentSpeed * delta * tumbleDirectionRef.current.x;
          currentDice.rotation.y += currentSpeed * delta * tumbleDirectionRef.current.y;
          currentDice.rotation.z += currentSpeed * delta * tumbleDirectionRef.current.z;
          
        } else if (rollTimeRef.current < totalDuration) {
          if (targetResultRef.current === 0) {
            const currentTopFace = getTopFace(currentDice.rotation);
            targetResultRef.current = currentTopFace;
            
            settlingStartRotationRef.current = [
              currentDice.rotation.x,
              currentDice.rotation.y,
              currentDice.rotation.z
            ];
          }
          
          const settleProgress = (rollTimeRef.current - tumblingDuration) / settlingDuration;
          
          const tumbleProgress = 1.0;
          const easeOut = 1 - Math.pow(1 - tumbleProgress, 2);
          const baseSpeed = tumbleSpeedRef.current;
          const tumblingSpeed = baseSpeed * (1 - easeOut * 0.85);
          
          const currentSpeed = tumblingSpeed * (1 - settleProgress * 0.95);
          
          currentDice.rotation.x += currentSpeed * delta * tumbleDirectionRef.current.x;
          currentDice.rotation.y += currentSpeed * delta * tumbleDirectionRef.current.y;
          currentDice.rotation.z += currentSpeed * delta * tumbleDirectionRef.current.z;
          
          const alignStrength = settleProgress * settleProgress;
          
          const target = faceRotations[targetResultRef.current];
          
          const normalizeAngle = (angle: number) => {
            while (angle > Math.PI) angle -= 2 * Math.PI;
            while (angle < -Math.PI) angle += 2 * Math.PI;
            return angle;
          };
          
          const deltaX = normalizeAngle(target[0] - currentDice.rotation.x);
          const deltaY = normalizeAngle(target[1] - currentDice.rotation.y);
          const deltaZ = normalizeAngle(target[2] - currentDice.rotation.z);
          
          currentDice.rotation.x += deltaX * alignStrength * delta * 3;
          currentDice.rotation.y += deltaY * alignStrength * delta * 3;
          currentDice.rotation.z += deltaZ * alignStrength * delta * 3;
          
        } else {
          const target = faceRotations[targetResultRef.current];
          currentDice.rotation.x = target[0];
          currentDice.rotation.y = target[1];
          currentDice.rotation.z = target[2];
          currentRotationRef.current = target;
          targetRotationRef.current = target;
          
          rollTimeRef.current = 0;
          isRollingRef.current = false;
          onRollComplete(targetResultRef.current);
          targetResultRef.current = 0;
        }
      } else if (!isDraggingRef.current) {
        const velocityThreshold = 0.001;
        
        if (Math.abs(velocityRef.current.x) > velocityThreshold || Math.abs(velocityRef.current.y) > velocityThreshold) {
          const rotationSpeed = 0.0001;
          currentDice.rotation.x += velocityRef.current.x * rotationSpeed;
          currentDice.rotation.y += velocityRef.current.y * rotationSpeed;
          
          velocityRef.current.x *= dampingFactor;
          velocityRef.current.y *= dampingFactor;
          
          currentRotationRef.current = [
            currentDice.rotation.x,
            currentDice.rotation.y,
            currentDice.rotation.z,
          ];
        } else {
          velocityRef.current = { x: 0, y: 0 };
        }
      }

      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <GLView
      style={styles.glView}
      onContextCreate={onContextCreate}
      {...panResponder.panHandlers}
    />
  );
}

const styles = StyleSheet.create({
  glView: {
    flex: 1,
    width: '100%',
  },
});
