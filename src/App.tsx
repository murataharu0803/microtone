import React from 'react'

import PitchVisualizeSystem from '@/components/PitchVisualizeSystem'
import SVGWithContext from '@/components/SVGWithContext'

const App: React.FC = () => <SVGWithContext>
  <PitchVisualizeSystem
    baseFrequency={440 * Math.pow(2, -9 / 12)} // Middle C
    startPitch={-1}
    endPitch={3}
  />
</SVGWithContext>

export default App
