// Flowing fire waves for the header banner — layered SVG waves in the
// Blackfire fire gradient that slowly shift across the banner (waveshift-style
// motion). Exported as the default the header already imports.
function Waves() {
  // One wave tile spans 1440 user units (two crests + two troughs) and the
  // path repeats to 2880, so translating a layer by -1440 loops seamlessly.
  const wavePath =
    'M0,70 C120,30 240,30 360,70 C480,110 600,110 720,70 ' +
    'C840,30 960,30 1080,70 C1200,110 1320,110 1440,70 ' +
    'C1560,30 1680,30 1800,70 C1920,110 2040,110 2160,70 ' +
    'C2280,30 2400,30 2520,70 C2640,110 2760,110 2880,70 ' +
    'L2880,200 L0,200 Z'

  return (
    <div className="bf-waves" aria-hidden="true">
      <svg
        className="bf-waves__svg"
        viewBox="0 0 1440 200"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="bfWaveGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F7A23B" />
            <stop offset="45%" stopColor="#F26B21" />
            <stop offset="100%" stopColor="#E8392B" />
          </linearGradient>
          <path id="bfWave" d={wavePath} />
        </defs>

        {/* Back layer — slowest, drifts the opposite way for a shifting feel */}
        <use href="#bfWave" className="bf-wave" y="40" fill="url(#bfWaveGrad)" opacity="0.28">
          <animateTransform attributeName="transform" type="translate"
            from="-1440 0" to="0 0" dur="34s" begin="-12s" repeatCount="indefinite" />
        </use>
        {/* Middle layer */}
        <use href="#bfWave" className="bf-wave" y="22" fill="url(#bfWaveGrad)" opacity="0.5">
          <animateTransform attributeName="transform" type="translate"
            from="0 0" to="-1440 0" dur="24s" begin="-6s" repeatCount="indefinite" />
        </use>
        {/* Front layer — brightest, fastest */}
        <use href="#bfWave" className="bf-wave" y="8" fill="url(#bfWaveGrad)" opacity="0.85">
          <animateTransform attributeName="transform" type="translate"
            from="0 0" to="-1440 0" dur="16s" begin="0s" repeatCount="indefinite" />
        </use>
      </svg>
    </div>
  )
}

export default Waves
