import React from 'react'

import PitchCircle from '@/components/PitchCircle'
import SVGWithContext from '@/components/SVGWithContext'

const App: React.FC = () => <SVGWithContext>
  <PitchCircle
    baseFrequency={440 * Math.pow(2, -9 / 12)} // Middle C
    startPitch={0}
    endPitch={3}
    startRadius={250}
    radiusStep={50}
    center={{ x: 500, y: 500 }}
  />
</SVGWithContext>

export default App
