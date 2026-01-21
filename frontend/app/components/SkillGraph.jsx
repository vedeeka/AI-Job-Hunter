'use client' // Top line is mandatory for App Router

import dynamic from 'next/dynamic';
import { useRef } from 'react';

// 1. Dynamically import the library with ssr: false
const ForceGraph3D = dynamic(() => import('react-force-graph-3d'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-gray-900 flex items-center justify-center text-gray-500">
      Loading 3D Engine...
    </div>
  )
});

const SkillGraph = () => {
  const graphRef = useRef();

  // Mock Data
  const data = {
    nodes: [
      { id: 'Python', group: 1 },
      { id: 'FastAPI', group: 1 },
      { id: 'React', group: 2 },
      { id: 'JavaScript', group: 2 },
      { id: 'ML Models', group: 3 },
      { id: 'You', group: 4, val: 10 }
    ],
    links: [
      { source: 'You', target: 'Python' },
      { source: 'Python', target: 'FastAPI' },
      { source: 'Python', target: 'ML Models' },
      { source: 'You', target: 'React' }
    ]
  };

  return (
    <div className="h-[400px] w-full bg-gray-900 rounded-xl overflow-hidden relative border border-gray-800">
      <div className="absolute top-4 left-4 z-10 text-white bg-black/50 p-2 rounded backdrop-blur-sm">
        <h3 className="font-bold text-sm">Skill Knowledge Graph</h3>
        <p className="text-[10px] text-gray-300">Scroll to zoom • Drag to rotate</p>
      </div>
      
      {/* 2. Render the dynamic component */}
      <ForceGraph3D
        ref={graphRef}
        graphData={data}
        nodeAutoColorBy="group"
        backgroundColor="#111827" 
        nodeLabel="id"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.005}
        width={600} // Optional: Helps prevent layout shift
        height={400}
      />
    </div>
  );
};

export default SkillGraph;