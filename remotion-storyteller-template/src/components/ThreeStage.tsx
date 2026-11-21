import React, { Suspense } from 'react';
import { ThreeCanvas } from '@remotion/three';
import { useGLTF } from '@react-three/drei';
import {
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { theme } from '../theme';

const GLBModel: React.FC<{ modelPath: string }> = ({ modelPath }) => {
  const { scene } = useGLTF(staticFile(modelPath));
  return <primitive object={scene} />;
};

const ProceduralShowcaseMesh: React.FC = () => {
  return (
    <group>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.9, 1.2, 1.4]} />
        <meshStandardMaterial
          color="#38BDF8"
          metalness={0.35}
          roughness={0.25}
        />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
        <boxGeometry args={[1.96, 0.14, 1.46]} />
        <meshStandardMaterial
          color="#F59E0B"
          metalness={0.2}
          roughness={0.35}
        />
      </mesh>
    </group>
  );
};

export const ThreeStage: React.FC<{
  modelPath?: string;
  isVertical: boolean;
  durationInFrames: number;
}> = ({ modelPath, isVertical, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();

  const enter = spring({
    frame,
    fps,
    config: theme.springs.smooth,
  });

  const scale = interpolate(enter, [0, 1], [0.5, isVertical ? 1.15 : 1.35], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const rotY = interpolate(frame, [0, durationInFrames], [-0.45, 0.85], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const floatY = Math.sin(frame / 18) * 0.12;

  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{
        position: [0, 1.4, isVertical ? 5.2 : 4.4],
        fov: 40,
      }}
    >
      <Sequence layout="none">
        <ambientLight intensity={0.75} />
        <directionalLight position={[4, 6, 5]} intensity={1.6} castShadow />
        <pointLight position={[-4, -2, -3]} intensity={0.6} color="#38BDF8" />

        <group
          position={[isVertical ? 0 : 1.55, isVertical ? 0.85 : 0.1 + floatY, 0]}
          rotation={[0.22, rotY, 0]}
          scale={[scale, scale, scale]}
        >
          {modelPath ? (
            <Suspense fallback={<ProceduralShowcaseMesh />}>
              <GLBModel modelPath={modelPath} />
            </Suspense>
          ) : (
            <ProceduralShowcaseMesh />
          )}
        </group>
      </Sequence>
    </ThreeCanvas>
  );
};
