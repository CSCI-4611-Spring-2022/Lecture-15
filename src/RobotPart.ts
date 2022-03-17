import * as THREE from 'three'

export class RobotPart extends THREE.Group
{
    public name: string;

    private defaultMaterial: THREE.MeshLambertMaterial;
    private debugHelper: THREE.AxesHelper;

    constructor(name: string)
    {
        super();

        this.name = name;
        this.defaultMaterial = new THREE.MeshLambertMaterial();
        this.defaultMaterial.wireframe = false;

        // Create a visual representation of the axes
        this.debugHelper = new THREE.AxesHelper(0.07);
        this.debugHelper.visible = false;
        this.add(this.debugHelper);
    }

    createMeshes(): void
    {
        // TO DO
    }

    setDebugMode(debugMode: boolean): void
    {
        this.defaultMaterial.wireframe = debugMode;
        this.debugHelper.visible = debugMode;
    }
}