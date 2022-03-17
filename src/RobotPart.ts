import * as THREE from 'three'

export class RobotPart
{
    public name: string;
    public transform: THREE.Group;
    public children: RobotPart[];

    constructor(name: string)
    {
        this.name = name;
        this.transform = new THREE.Group();
        this.children = [];
    }

    createHierarchy(): void
    {
        if(this.name == 'root')
        {
            // TO DO
        }
    }

    createMeshes(): void
    {
        // Create a visual representation of the axes
        var axisHelper = new THREE.AxesHelper(0.15);
        this.transform.add(axisHelper);

        this.children.forEach((child: RobotPart)=>{
            child.createMeshes();
        });
    }
}