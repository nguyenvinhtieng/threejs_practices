import { CameraControls, Environment, MeshPortalMaterial, OrbitControls, RoundedBox, Text, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Dog } from "./Dog";
import { Dragon } from "./Dragon";
import { BlueDemon } from "./BlueDemon";
import { useEffect, useRef, useState } from "react";
import { easing } from "maath";

export const Experience = () => {
  const [active, setActive] = useState(null);
  const [hovered, setHovered] = useState(null); 
  const controlsRef = useRef();
  const scene = useThree((state) => state.scene);
  useEffect(()=> {
    if(active) {
      const targetPosition = new THREE.Vector3();
      scene.getObjectByName(active).getWorldPosition(targetPosition);
      controlsRef.current.setLookAt(
        0, 0, 5, targetPosition.x ,targetPosition.y, targetPosition.z, true
      )

    } else {
      controlsRef.current.setLookAt(
        0, 0, 10, 0, 0, 0, true
      )
    }
  }, [active])
  
  return (
    <>
      <ambientLight intensity={ 0.5 } />
      <Environment  preset="sunset" />
      <CameraControls ref={controlsRef} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 6}/>
      <MonterStage texture={"textures/tree.jpg"} name="Dog" color="#996227" active={active} setActive={setActive} hovered={hovered} setHovered={setHovered}>
        <Dog scale={0.6} position-y={-0.8} hovered={hovered == "Dog"}/>
      </MonterStage>
      <MonterStage texture={"textures/fire.jpg"} position-x={-2.5} rotation-y={Math.PI / 8} name="Dragon" color="#c06e43" active={active} setActive={setActive} hovered={hovered} setHovered={setHovered}>
        <Dragon scale={0.6} position-y={-1.3} hovered={hovered == "Dragon"}/>
      </MonterStage>
      <MonterStage texture={"textures/water.jpg"} position-x={2.5} rotation-y={-Math.PI / 8}  name="Monter" color="#326e94" active={active} setActive={setActive} hovered={hovered} setHovered={setHovered}>
        <BlueDemon scale={0.6} position-y={-1} hovered={hovered == "Monter"}/>
      </MonterStage>
    </>
  );
};


const MonterStage = ({children, texture, name, color, active, setActive, hovered, setHovered, ...props}) => {
  const map = useTexture(texture);
  const portalMaterial = useRef();
  useFrame(()=> {
    const worldOpen = active === name;
    easing.damp(portalMaterial.current, "blend", worldOpen ? 1 : 0, 0.2)
  })
  return <group {...props}>
    <Text font={"fonts/Caprasimo-Regular.ttf"} fontSize={0.3} position={[0, -1.3, 0.051]} anchorY={"bottom"}>
      {name}
      <meshBasicMaterial color={color} toneMapped={false} />
    </Text>
      <RoundedBox name={name} args={[2, 3, 0.1]} onDoubleClick={()=>setActive(active === name ? null : name)}
          onPointerEnter={()=>setHovered(name)}
          onPointerLeave={()=>setHovered(null)}
        >
        <MeshPortalMaterial side={THREE.DoubleSide} ref={portalMaterial}>
          <ambientLight intensity={ 0.5 } />
          <Environment preset="sunset" />
          { children }
          <mesh>
            <sphereGeometry args={[6, 64, 64]} />
            <meshStandardMaterial map={map} side={THREE.BackSide}/>
          </mesh>
        </MeshPortalMaterial>
      </RoundedBox>
  </group>
}