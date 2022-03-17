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

    // The root node of the robot
    private robotRoot: RobotPart;

    // GUI variables
    private upperYRotation: number;
    private upperZRotation: number;
    private middleZRotation: number;
    private lowerZRotation: number;
    private endEffectorZRotation: number;

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

        this.upperYRotation = 0;
        this.upperZRotation = 0;
        this.middleZRotation = 0;
        this.lowerZRotation = 0;
        this.endEffectorZRotation = 0;
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

        var upperArmControls = gui.addFolder('Upper Arm Controls');
        upperArmControls.open();

        var upperYController = upperArmControls.add(this, 'upperYRotation', -180, 180);
        upperYController.name('swivel');
        upperYController.onChange((value: number) => { this.updateUpperArm()});

        var upperZController = upperArmControls.add(this, 'upperZRotation', -45, 45);
        upperZController.name('bend');
        upperZController.onChange((value: number) => { this.updateUpperArm()});

        var middleArmControls = gui.addFolder('Middle Arm Controls');
        middleArmControls.open();

        var middleZController = middleArmControls.add(this, 'middleZRotation', -135, 135);
        middleZController.name('bend');
        middleZController.onChange((value: number) => { this.updateMiddleArm()});

        var lowerArmControls = gui.addFolder('Lower Arm Controls');
        lowerArmControls.open();

        var lowerZController = lowerArmControls.add(this, 'lowerZRotation', -135, 135);
        lowerZController.name('bend');
        lowerZController.onChange((value: number) => { this.updateLowerArm()});

        var endEffectorControls = gui.addFolder('End Effector Controls');
        endEffectorControls.open();

        var endEffectorZController = endEffectorControls.add(this, 'endEffectorZRotation', -90, 90);
        endEffectorZController.name('bend');
        endEffectorZController.onChange((value: number) => { this.updateEndEffector()});

        // Create a GUI control for the debug mode and add a change event handler
        var debugControls = gui.addFolder('Debugging');
        debugControls.open();

        var debugController = debugControls.add(this, 'debugMode');
        debugController.name('Debug Mode');
        debugController.onChange((value: boolean) => { this.toggleDebugMode(value) });

        // Create all the meshes for the robot hierarchy
        this.robotRoot.createMeshes();

        // Move the entire robot down in the scene
        this.robotRoot.translateY(-0.6);

        // Add the robot root transform to the scene
        this.scene.add(this.robotRoot);
    }


    update(deltaTime: number): void
    {

    }

    private updateUpperArm(): void
    {
        this.robotRoot.setRotation('upperArm', new THREE.Euler(
            0,
            this.upperYRotation * Math.PI / 180, 
            this.upperZRotation * Math.PI / 180
        ));
    }

    private updateMiddleArm(): void
    {
        this.robotRoot.setRotation('middleArm', new THREE.Euler(
            0,
            0, 
            this.middleZRotation * Math.PI / 180
        ));
    }

    private updateLowerArm(): void
    {
        this.robotRoot.setRotation('lowerArm', new THREE.Euler(
            0, 
            0, 
            this.lowerZRotation * Math.PI / 180 
        ));
    }

    private updateEndEffector(): void
    {
        this.robotRoot.setRotation('endEffector', new THREE.Euler(
            0, 
            0, 
            this.endEffectorZRotation * Math.PI / 180 
        ));
    }

    private toggleDebugMode(debugMode: boolean): void
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
