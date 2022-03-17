import * as THREE from 'three'
import { GUI } from 'dat.gui'
import { GraphicsApp } from './GraphicsApp'
import { RobotPart } from './RobotPart';

export class MeshViewer extends GraphicsApp
{ 
    // State variables
    private mouseDrag: boolean;
    private debugMode : boolean;

    // Camera parameters
    private cameraOrbitX: number;
    private cameraOrbitY: number;
    private cameraDistance: number;

    private robotRoot: RobotPart;

    constructor()
    {
        // Pass in the aspect ratio to the constructor
        super(60, 1920/1080, 0.1, 10);

        this.mouseDrag = false;
        this.debugMode = false;

        this.cameraOrbitX = 0;
        this.cameraOrbitY = 0;
        this.cameraDistance = 0;

        this.robotRoot = new RobotPart('root');
    }

    createScene(): void
    {
        // Setup camera
        this.cameraDistance = 1.5;
        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 1, 0);

        // Create an ambient light
        var ambientLight = new THREE.AmbientLight('white', 0.3);
        this.scene.add(ambientLight);

        // Create a directional light
        var directionalLight = new THREE.DirectionalLight('white', .6);
        directionalLight.position.set(0, 2, 1);
        this.scene.add(directionalLight)

        // Create the GUI
        var gui = new GUI();
        var controls = gui.addFolder('Controls');
        controls.open();

        // Create a GUI control for the debug mode and add a change event handler
        var debugController = controls.add(this, 'debugMode');
        debugController.name('Debug Mode');
        debugController.onChange((value: boolean) => { this.toggleDebugMode(value) });

        // Create all the meshes for the robot hierarchy
        this.robotRoot.createMeshes();

        this.robotRoot.translateY(-0.5);

        // Add the robot root transform to the scene
        this.scene.add(this.robotRoot);
    }


    update(deltaTime: number): void
    {

    }

    private toggleDebugMode(debugMode: boolean) : void
    {
        this.robotRoot.setDebugMode(debugMode);
    }

    // Mouse event handlers for wizard functionality
    onMouseDown(event: MouseEvent): void 
    {
        if((event.target! as Element).localName == "canvas")
        {
            this.mouseDrag = true;
        }
    }

    // Mouse event handlers for wizard functionality
    onMouseUp(event: MouseEvent): void
    {
        this.mouseDrag = false;
    }
    
    onMouseMove(event: MouseEvent): void
    {
        if(this.mouseDrag)
        {
            this.cameraOrbitX += event.movementY;

            if(this.cameraOrbitX < 90 || this.cameraOrbitX > 270)
                this.cameraOrbitY += event.movementX;
            else
                this.cameraOrbitY -= event.movementX;

            if(this.cameraOrbitX >= 360)
                this.cameraOrbitX -= 360;
            else if(this.cameraOrbitX < 0)
                this.cameraOrbitX += 360;

            if(this.cameraOrbitY >= 360)
                this.cameraOrbitY -= 360;
            else if(this.cameraOrbitY < 0)
                this.cameraOrbitY += 360;

            this.updateCameraOrbit();
        }
    }

    onMouseWheel(event: WheelEvent): void
    {
        this.cameraDistance += event.deltaY / 1000;
        this.updateCameraOrbit();
    }

    private updateCameraOrbit(): void
    {
        var rotationMatrix = new THREE.Matrix4().makeRotationY(-this.cameraOrbitY * Math.PI / 180);
        rotationMatrix.multiply(new THREE.Matrix4().makeRotationX(-this.cameraOrbitX * Math.PI / 180));

        this.camera.position.set(0, 0, this.cameraDistance);
        this.camera.applyMatrix4(rotationMatrix);

        if(this.cameraOrbitX < 90 || this.cameraOrbitX > 270)
            this.camera.up.set(0, 1, 0);
        else if(this.cameraOrbitX > 90 && this.cameraOrbitX < 270)
            this.camera.up.set(0, -1, 0);
        else if(this.cameraOrbitX == 270)
            this.camera.up.set(Math.sin(-this.cameraOrbitY * Math.PI / 180), 0, Math.cos(-this.cameraOrbitY * Math.PI / 180));
        else
            this.camera.up.set(-Math.sin(-this.cameraOrbitY * Math.PI / 180), 0, -Math.cos(-this.cameraOrbitY * Math.PI / 180));

        this.camera.lookAt(0, 0, 0);
    }
}
