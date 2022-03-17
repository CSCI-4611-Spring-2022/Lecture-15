import * as THREE from 'three'
import { MeshBasicMaterial, MeshLambertMaterial } from 'three';

export class RobotPart extends THREE.Group
{
    public name: string;

    private defaultMaterial: THREE.MeshLambertMaterial;
    private debugHelper: THREE.AxesHelper;

    constructor(name: string)
    {
        super();

        this.name = name;
        this.defaultMaterial = new MeshLambertMaterial();
        this.defaultMaterial.wireframe = false;

        // Create a visual representation of the axes
        this.debugHelper = new THREE.AxesHelper(0.07);
        this.debugHelper.visible = false;
        this.add(this.debugHelper);
    }

    createMeshes(): void
    {
        if(this.name == 'root')
        {
            // Create a visual representation of the axes
            var axisHelper = new THREE.AxesHelper(0.05);
            this.add(axisHelper);

            const geometry = new THREE.BoxGeometry(0.5, 0.05, 0.5);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.025);
            this.add(mesh);

            const sphereGeometry = new THREE.SphereGeometry(0.15, 16, 6, 0, Math.PI * 2, 0, Math.PI / 2);
            const sphereMesh = new THREE.Mesh(sphereGeometry, this.defaultMaterial);
            sphereMesh.translateY(0.05);
            this.add(sphereMesh);

            this.add(new RobotPart('upperArm'));
        }
        else if(this.name == 'upperArm')
        {
            const geometry = new THREE.BoxGeometry(0.05, 0.5, 0.05);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.25);
            this.add(mesh);

            const sphereGeometry = new THREE.SphereGeometry(0.05);
            const sphereMesh = new THREE.Mesh(sphereGeometry, this.defaultMaterial);
            sphereMesh.translateY(0.5);
            this.add(sphereMesh);

            this.add(new RobotPart('middleArm'));
        }
        else if(this.name == 'middleArm')
        {
            this.translateY(0.5);
            this.rotateZ(45 * Math.PI / 180);

            const geometry = new THREE.BoxGeometry(0.05, 0.4, 0.05);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.2);
            this.add(mesh);

            const sphereGeometry = new THREE.SphereGeometry(0.05);
            const sphereMesh = new THREE.Mesh(sphereGeometry, this.defaultMaterial);
            sphereMesh.translateY(0.4);
            this.add(sphereMesh);

            this.add(new RobotPart('lowerArm'));
        }
        else if(this.name == 'lowerArm')
        {
            this.translateY(0.4);
            this.rotateZ(45 * Math.PI / 180);

            const geometry = new THREE.BoxGeometry(0.05, 0.4, 0.05);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.2);
            this.add(mesh);

            const sphereGeometry = new THREE.SphereGeometry(0.05);
            const sphereMesh = new THREE.Mesh(sphereGeometry, this.defaultMaterial);
            sphereMesh.translateY(0.4);
            this.add(sphereMesh);

            this.add(new RobotPart('endEffector'));
        }
        else if(this.name == 'endEffector')
        {
            this.translateY(0.4);
            this.rotateZ(45 * Math.PI / 180);

            const geometry = new THREE.ConeGeometry(0.025, 0.2, 16);
            const mesh = new THREE.Mesh(geometry, this.defaultMaterial);
            mesh.translateY(0.125);
            this.add(mesh);
        }

        // Recursively call the createMeshes function for each child robot part
        this.children.forEach((child: THREE.Object3D)=>{
            if(child instanceof RobotPart)
            {
                child.createMeshes();
            }
        });
    }

    setDebugMode(debugMode: boolean): void
    {
        this.defaultMaterial.wireframe = debugMode;
        this.debugHelper.visible = debugMode;

        // Recursively call setDebugMode for each child robot part
        this.children.forEach((child: THREE.Object3D)=>{
            if(child instanceof RobotPart)
            {
                child.setDebugMode(debugMode);
            }
        });
    }
}