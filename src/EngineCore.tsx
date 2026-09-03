import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  ACESFilmicToneMapping,
  BufferAttribute,
  DoubleSide,
  Group,
  LineSegments,
  MathUtils,
  PMREMGenerator,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { type MutableRefObject, useEffect, useRef } from "react";

export type EngineCoreControls = {
  progress: number;
  pointerX: number;
  pointerY: number;
};

export type EngineCoreProps = {
  controlRef: MutableRefObject<EngineCoreControls>;
  reducedMotion?: boolean;
  className?: string;
};

type Vector3Tuple = [number, number, number];

type LayerKind = "bezel" | "glass" | "interface" | "processor" | "data" | "ports" | "shell";

type CoreLayer = {
  id: string;
  kind: LayerKind;
  base: Vector3Tuple;
  exploded: Vector3Tuple;
  baseRotation: Vector3Tuple;
  explodedRotation: Vector3Tuple;
};

const CORE_LAYERS: CoreLayer[] = [
  {
    id: "front-bezel",
    kind: "bezel",
    base: [0, 0, 0.34],
    exploded: [-1.35, 0.98, 0.82],
    baseRotation: [0, 0, 0],
    explodedRotation: [0, 0, 0],
  },
  {
    id: "input-glass",
    kind: "glass",
    base: [0, 0, 0.24],
    exploded: [-0.68, 0.48, 0.48],
    baseRotation: [0, 0, 0],
    explodedRotation: [0, 0, 0],
  },
  {
    id: "interface-plate",
    kind: "interface",
    base: [0, 0, 0.12],
    exploded: [0, 0, 0.16],
    baseRotation: [0, 0, 0],
    explodedRotation: [0, 0, 0],
  },
  {
    id: "automation-logic",
    kind: "processor",
    base: [0, 0, 0],
    exploded: [0.68, -0.48, -0.14],
    baseRotation: [0, 0, 0],
    explodedRotation: [0, 0, 0],
  },
  {
    id: "data-board",
    kind: "data",
    base: [0, 0, -0.12],
    exploded: [1.22, -0.9, -0.35],
    baseRotation: [0, 0, 0],
    explodedRotation: [0, 0, 0],
  },
  {
    id: "output-bank",
    kind: "ports",
    base: [0, 0, -0.24],
    exploded: [1.76, -1.28, -0.55],
    baseRotation: [0, 0, 0],
    explodedRotation: [0, 0, 0],
  },
  {
    id: "rear-shell",
    kind: "shell",
    base: [0, 0, -0.36],
    exploded: [2.35, -1.72, -0.78],
    baseRotation: [0, 0, 0],
    explodedRotation: [0, 0, 0],
  },
];

type GuideConnection = {
  from: number;
  to: number;
  fromAnchor: Vector3Tuple;
  toAnchor: Vector3Tuple;
  signal: boolean;
};

const GUIDE_CONNECTIONS: GuideConnection[] = [
  { from: 0, to: 1, fromAnchor: [1.08, -0.44, 0.08], toAnchor: [-1.02, 0.36, 0.06], signal: false },
  { from: 1, to: 2, fromAnchor: [1.02, -0.33, 0.05], toAnchor: [-0.9, 0.28, 0.05], signal: false },
  { from: 2, to: 3, fromAnchor: [0.86, -0.24, 0.06], toAnchor: [-0.66, 0.18, 0.08], signal: true },
  { from: 3, to: 4, fromAnchor: [0.64, -0.17, 0.08], toAnchor: [-0.6, 0.13, 0.06], signal: true },
  { from: 4, to: 5, fromAnchor: [0.54, -0.11, 0.06], toAnchor: [-0.6, 0.1, 0.08], signal: false },
  { from: 5, to: 6, fromAnchor: [0.62, -0.08, 0.08], toAnchor: [-1.04, 0.34, 0.1], signal: false },
];

const interpolate = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

const clampUnit = (value: number) => MathUtils.clamp(value, 0, 1);

// A metal has no diffuse response: everything it shows is reflected environment.
// These presets only read as anodized aluminium because StudioEnvironment below
// supplies a probe. Remove the probe and the whole assembly resolves to black.
const ALLOY_DARK = { metalness: 0.88, roughness: 0.38, envMapIntensity: 1.15 } as const;
const ALLOY_MID = { metalness: 0.84, roughness: 0.33, envMapIntensity: 1.35 } as const;
const ALLOY_BRIGHT = { metalness: 0.8, roughness: 0.26, envMapIntensity: 1.6 } as const;

function Bolts() {
  return (
    <>
      {[
        [-1.18, 0.62],
        [1.18, 0.62],
        [-1.18, -0.62],
        [1.18, -0.62],
      ].map(([x, y]) => (
        <mesh key={String(x) + String(y)} position={[x, y, 0.095]}>
          <cylinderGeometry args={[0.085, 0.085, 0.06, 16]} />
          <meshStandardMaterial color="#9a92a6" {...ALLOY_BRIGHT} />
        </mesh>
      ))}
    </>
  );
}

function BezelLayer() {
  return (
    <>
      <mesh>
        <boxGeometry args={[2.72, 1.56, 0.12]} />
        <meshStandardMaterial color="#3a3644" {...ALLOY_DARK} />
      </mesh>
      <mesh position={[0, 0, 0.085]}>
        <boxGeometry args={[2.38, 1.2, 0.05]} />
        <meshPhysicalMaterial
          color="#211e2a"
          metalness={0.42}
          roughness={0.09}
          clearcoat={1}
          clearcoatRoughness={0.06}
          envMapIntensity={2.1}
        />
      </mesh>
      <mesh position={[-0.52, -0.38, 0.113]}>
        <boxGeometry args={[0.86, 0.018, 0.012]} />
        <meshStandardMaterial color="#e9b9c8" emissive="#e9b9c8" emissiveIntensity={0.55} roughness={0.3} />
      </mesh>
      <mesh position={[0.72, -0.38, 0.113]}>
        <boxGeometry args={[0.3, 0.018, 0.012]} />
        <meshStandardMaterial color="#8e8698" emissive="#6f6879" emissiveIntensity={0.22} roughness={0.32} />
      </mesh>
      <Bolts />
    </>
  );
}

function GlassLayer() {
  return (
    <>
      <mesh>
        <boxGeometry args={[2.48, 1.3, 0.058]} />
        <meshPhysicalMaterial
          color="#8d8299"
          metalness={0.34}
          roughness={0.14}
          transmission={0.26}
          transparent
          opacity={0.5}
          envMapIntensity={1.5}
          thickness={0.2}
          side={DoubleSide}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[-0.78, 0, 0.052]}>
        <boxGeometry args={[0.035, 0.98, 0.028]} />
        <meshStandardMaterial color="#f0c8d5" metalness={0.62} roughness={0.28} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[0.78, 0, 0.052]}>
        <boxGeometry args={[0.035, 0.98, 0.028]} />
        <meshStandardMaterial color="#f0c8d5" metalness={0.62} roughness={0.28} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[-0.56, 0.32, 0.055]}>
        <boxGeometry args={[0.54, 0.035, 0.022]} />
        <meshStandardMaterial color="#d8ccd5" emissive="#6b4252" emissiveIntensity={0.45} roughness={0.3} />
      </mesh>
      <mesh position={[0.43, 0.32, 0.055]}>
        <boxGeometry args={[0.34, 0.035, 0.022]} />
        <meshStandardMaterial color="#e9b9c8" emissive="#e9b9c8" emissiveIntensity={0.62} roughness={0.25} />
      </mesh>
      {[-0.22, -0.06, 0.1].map((y) => (
        <mesh key={y} position={[-0.2, y, 0.055]}>
          <boxGeometry args={[1.12, 0.022, 0.018]} />
          <meshStandardMaterial color="#8a8194" metalness={0.5} roughness={0.34} envMapIntensity={1.3} />
        </mesh>
      ))}
      {[-0.58, -0.2, 0.18, 0.56].map((x) => (
        <mesh key={x} position={[x, -0.42, 0.056]}>
          <boxGeometry args={[0.16, 0.085, 0.022]} />
          <meshStandardMaterial color={x === 0.18 ? "#e9b9c8" : "#726a76"} emissive={x === 0.18 ? "#e9b9c8" : "#000000"} emissiveIntensity={x === 0.18 ? 0.48 : 0} roughness={0.25} />
        </mesh>
      ))}
    </>
  );
}

function InterfaceLayer() {
  return (
    <>
      <mesh>
        <boxGeometry args={[2.2, 1.02, 0.09]} />
        <meshStandardMaterial color="#423d4e" {...ALLOY_DARK} />
      </mesh>
      {[-0.72, -0.36, 0, 0.36, 0.72].map((x, index) => (
        <mesh key={x} position={[x, 0.3, 0.075]}>
          <boxGeometry args={[0.16, 0.13, 0.03]} />
          <meshStandardMaterial
            color={index === 2 ? "#e9b9c8" : "#6b6478"}
            emissive={index === 2 ? "#e9b9c8" : "#000000"}
            emissiveIntensity={index === 2 ? 0.85 : 0}
            {...ALLOY_MID}
          />
        </mesh>
      ))}
      <mesh position={[0, -0.24, 0.078]}>
        <boxGeometry args={[1.52, 0.04, 0.035]} />
        <meshStandardMaterial color="#a49cb0" {...ALLOY_BRIGHT} />
      </mesh>
    </>
  );
}

function ProcessorLayer() {
  return (
    <>
      <mesh>
        <boxGeometry args={[1.72, 0.86, 0.115]} />
        <meshStandardMaterial color="#464050" {...ALLOY_DARK} />
      </mesh>
      <mesh position={[0, 0, 0.11]}>
        <boxGeometry args={[0.58, 0.44, 0.1]} />
        <meshStandardMaterial color="#7d5f6e" {...ALLOY_MID} />
      </mesh>
      {[-0.22, 0, 0.22].map((x) => (
        <mesh key={x} position={[x, 0, 0.17]}>
          <boxGeometry args={[0.11, 0.11, 0.045]} />
          <meshStandardMaterial color="#e9b9c8" emissive="#e9b9c8" emissiveIntensity={0.7} roughness={0.22} />
        </mesh>
      ))}
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} position={[x, 0, 0.1]}>
          <boxGeometry args={[0.32, 0.045, 0.035]} />
          <meshStandardMaterial color="#918a9d" {...ALLOY_BRIGHT} />
        </mesh>
      ))}
    </>
  );
}

function DataLayer() {
  return (
    <>
      <mesh>
        <boxGeometry args={[1.58, 0.74, 0.09]} />
        <meshStandardMaterial color="#4a4356" {...ALLOY_DARK} />
      </mesh>
      {[-0.48, 0, 0.48].flatMap((x) =>
        [-0.18, 0.18].map((y) => [x, y] as const),
      ).map(([x, y]) => (
        <mesh key={String(x) + String(y)} position={[x, y, 0.085]}>
          <boxGeometry args={[0.17, 0.17, 0.04]} />
          <meshStandardMaterial color={x === 0 ? "#dcb0bf" : "#6e6779"} {...ALLOY_MID} />
        </mesh>
      ))}
    </>
  );
}

function PortsLayer() {
  return (
    <>
      <mesh>
        <boxGeometry args={[1.72, 0.57, 0.12]} />
        <meshStandardMaterial color="#3d3849" {...ALLOY_DARK} />
      </mesh>
      {[-0.57, -0.285, 0, 0.285, 0.57].map((x, index) => (
        <mesh key={x} position={[x, 0, 0.1]}>
          <boxGeometry args={[0.17, 0.18, 0.04]} />
          <meshStandardMaterial
            color={index === 2 ? "#e9b9c8" : "#6a6377"}
            emissive={index === 2 ? "#e9b9c8" : "#000000"}
            emissiveIntensity={index === 2 ? 0.65 : 0}
            {...ALLOY_MID}
          />
        </mesh>
      ))}
    </>
  );
}

function ShellLayer() {
  return (
    <>
      <mesh>
        <boxGeometry args={[2.74, 1.56, 0.14]} />
        <meshStandardMaterial color="#34303e" {...ALLOY_DARK} />
      </mesh>
      <mesh position={[-1.2, 0, 0.1]}>
        <boxGeometry args={[0.12, 1.18, 0.075]} />
        <meshStandardMaterial color="#968fa4" {...ALLOY_BRIGHT} />
      </mesh>
      <mesh position={[1.2, 0, 0.1]}>
        <boxGeometry args={[0.12, 1.18, 0.075]} />
        <meshStandardMaterial color="#968fa4" {...ALLOY_BRIGHT} />
      </mesh>
      <Bolts />
    </>
  );
}

function LayerGeometry({ kind }: { kind: LayerKind }) {
  switch (kind) {
    case "bezel":
      return <BezelLayer />;
    case "glass":
      return <GlassLayer />;
    case "interface":
      return <InterfaceLayer />;
    case "processor":
      return <ProcessorLayer />;
    case "data":
      return <DataLayer />;
    case "ports":
      return <PortsLayer />;
    case "shell":
      return <ShellLayer />;
  }
}

function ConnectorGuides({ controlRef, reducedMotion }: Pick<EngineCoreProps, "controlRef" | "reducedMotion">) {
  const guideRefs = useRef<Array<LineSegments | null>>([]);

  useFrame(() => {
    const progress = reducedMotion ? 0 : clampUnit(controlRef.current.progress);
    const visible = progress > 0.2;

    GUIDE_CONNECTIONS.forEach((guide, index) => {
      const line = guideRefs.current[index];
      if (!line) return;
      const positions = line.geometry.getAttribute("position") as BufferAttribute;
      const start = CORE_LAYERS[guide.from];
      const end = CORE_LAYERS[guide.to];
      positions.setXYZ(
        0,
        interpolate(start.base[0], start.exploded[0], progress) + guide.fromAnchor[0],
        interpolate(start.base[1], start.exploded[1], progress) + guide.fromAnchor[1],
        interpolate(start.base[2], start.exploded[2], progress) + guide.fromAnchor[2],
      );
      positions.setXYZ(
        1,
        interpolate(end.base[0], end.exploded[0], progress) + guide.toAnchor[0],
        interpolate(end.base[1], end.exploded[1], progress) + guide.toAnchor[1],
        interpolate(end.base[2], end.exploded[2], progress) + guide.toAnchor[2],
      );
      positions.needsUpdate = true;
      line.visible = visible;
    });
  });

  return (
    <>
      {GUIDE_CONNECTIONS.map((guide, index) => (
        <lineSegments
          key={String(guide.from) + String(guide.to) + String(index)}
          ref={(node) => {
            guideRefs.current[index] = node;
          }}
        >
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[new Float32Array(6), 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={guide.signal ? "#e9b9c8" : "#87818d"} transparent opacity={guide.signal ? 0.9 : 0.45} />
        </lineSegments>
      ))}
    </>
  );
}

function CoreAssembly({ controlRef, reducedMotion = false }: Pick<EngineCoreProps, "controlRef" | "reducedMotion">) {
  const assemblyRef = useRef<Group | null>(null);
  const layerRefs = useRef<Array<Group | null>>([]);

  useFrame((_, delta) => {
    const progress = reducedMotion ? 0 : clampUnit(controlRef.current.progress);
    const pointerX = reducedMotion ? 0 : MathUtils.clamp(controlRef.current.pointerX, -1, 1);
    const pointerY = reducedMotion ? 0 : MathUtils.clamp(controlRef.current.pointerY, -1, 1);
    const assembly = assemblyRef.current;

    if (assembly) {
      assembly.rotation.y = MathUtils.damp(assembly.rotation.y, -0.52 + pointerX * 0.07, 7, delta);
      assembly.rotation.x = MathUtils.damp(assembly.rotation.x, 0.17 - pointerY * 0.05, 7, delta);
      assembly.position.y = MathUtils.damp(assembly.position.y, -progress * 0.05, 7, delta);
      const targetScale = 0.88 - progress * 0.1;
      assembly.scale.setScalar(MathUtils.damp(assembly.scale.x, targetScale, 8, delta));
    }

    CORE_LAYERS.forEach((layer, index) => {
      const node = layerRefs.current[index];
      if (!node) return;
      node.position.set(
        interpolate(layer.base[0], layer.exploded[0], progress),
        interpolate(layer.base[1], layer.exploded[1], progress),
        interpolate(layer.base[2], layer.exploded[2], progress),
      );
      node.rotation.set(
        interpolate(layer.baseRotation[0], layer.explodedRotation[0], progress),
        interpolate(layer.baseRotation[1], layer.explodedRotation[1], progress),
        interpolate(layer.baseRotation[2], layer.explodedRotation[2], progress),
      );
    });
  });

  return (
    <group ref={assemblyRef} scale={0.88}>
      <ConnectorGuides controlRef={controlRef} reducedMotion={reducedMotion} />
      {CORE_LAYERS.map((layer, index) => (
        <group
          key={layer.id}
          ref={(node) => {
            layerRefs.current[index] = node;
          }}
          position={layer.base}
          rotation={layer.baseRotation}
        >
          <LayerGeometry kind={layer.kind} />
        </group>
      ))}
    </group>
  );
}

function StudioEnvironment() {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);

  useEffect(() => {
    const pmrem = new PMREMGenerator(gl);
    const target = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.72;
    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);

  return null;
}

export function EngineCore({ controlRef, reducedMotion = false, className }: EngineCoreProps) {
  return (
    <Canvas
      aria-hidden="true"
      className={className}
      camera={{ fov: 32, near: 0.1, far: 40, position: [0, 0.05, 8.3] }}
      dpr={[1, 1.55]}
      gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      fallback={null}
      onCreated={({ gl }) => {
        gl.setClearAlpha(0);
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      shadows={false}
    >
      <StudioEnvironment />
      <ambientLight intensity={0.42} />
      <directionalLight color="#fbe6ee" intensity={2.4} position={[3.6, 4.8, 5.2]} />
      <directionalLight color="#c6cee2" intensity={1.85} position={[-4.2, 1.2, 3.2]} />
      <pointLight color="#e9b9c8" intensity={1.7} distance={9} position={[0, -0.4, 4]} />
      <CoreAssembly controlRef={controlRef} reducedMotion={reducedMotion} />
    </Canvas>
  );
}

export default EngineCore;
