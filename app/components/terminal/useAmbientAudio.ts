import { useCallback, useEffect, useRef, useState } from 'react'

export type SceneName = 'aquarium' | 'space' | 'matrix'

// ── Aquarium: deep underwater drone with beating harmonics + occasional bubble blips ──
function buildAquariumAudio(ac: AudioContext): AudioNode[] {
  const master = ac.createGain(); master.gain.value = 0
  master.connect(ac.destination)

  // two detuned bass sines → audible beating at ~3Hz (underwater pressure)
  const bass1 = ac.createOscillator(); bass1.type = 'sine'; bass1.frequency.value = 55
  const bass2 = ac.createOscillator(); bass2.type = 'sine'; bass2.frequency.value = 58
  const bg1 = ac.createGain(); bg1.gain.value = 0.07
  const bg2 = ac.createGain(); bg2.gain.value = 0.05
  bass1.connect(bg1); bg1.connect(master)
  bass2.connect(bg2); bg2.connect(master)
  bass1.start(); bass2.start()

  // mid sweep: sine through slow-LFO lowpass
  const mid = ac.createOscillator(); mid.type = 'sine'; mid.frequency.value = 110
  const filt = ac.createBiquadFilter(); filt.type = 'lowpass'; filt.frequency.value = 300; filt.Q.value = 3
  const lfo = ac.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.04
  const lfoGain = ac.createGain(); lfoGain.gain.value = 220
  lfo.connect(lfoGain); lfoGain.connect(filt.frequency)
  const mg = ac.createGain(); mg.gain.value = 0.04
  mid.connect(filt); filt.connect(mg); mg.connect(master)
  mid.start(); lfo.start()

  // fade in
  master.gain.setTargetAtTime(1, ac.currentTime, 1.5)

  // bubble blips: random short high-frequency pings
  let bubbleTimeout: ReturnType<typeof setTimeout>
  function scheduleBubble() {
    const delay = 1500 + Math.random() * 5000
    bubbleTimeout = setTimeout(() => {
      if (ac.state === 'closed') return
      const osc = ac.createOscillator(); osc.type = 'sine'
      osc.frequency.value = 800 + Math.random() * 1400
      const env = ac.createGain(); env.gain.setValueAtTime(0, ac.currentTime)
      env.gain.linearRampToValueAtTime(0.08, ac.currentTime + 0.005)
      env.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.18)
      osc.connect(env); env.connect(master)
      osc.start(); osc.stop(ac.currentTime + 0.2)
      scheduleBubble()
    }, delay)
  }
  scheduleBubble()

  return [
    bass1, bass2, mid, lfo, master,
    { disconnect() { clearTimeout(bubbleTimeout) } } as unknown as AudioNode,
  ]
}

// ── Space: slowly evolving cosmic pad with sub-bass drone ──
function buildSpaceAudio(ac: AudioContext): AudioNode[] {
  const master = ac.createGain(); master.gain.value = 0
  master.connect(ac.destination)

  // chord: 110 + 165 + 220 Hz (root, fifth, octave)
  const freqs = [110, 165, 220]
  const oscs = freqs.map(f => {
    const osc = ac.createOscillator(); osc.type = 'sine'; osc.frequency.value = f
    const g = ac.createGain(); g.gain.value = 0.035
    osc.connect(g); g.connect(master)
    osc.start()
    return osc
  })

  // ultra-slow LFO on primary pitch — imperceptible drift
  const driftLfo = ac.createOscillator(); driftLfo.type = 'sine'; driftLfo.frequency.value = 0.009
  const driftGain = ac.createGain(); driftGain.gain.value = 4
  driftLfo.connect(driftGain); driftGain.connect(oscs[0].frequency)
  driftLfo.start()

  // sub-bass (felt, not heard)
  const sub = ac.createOscillator(); sub.type = 'sine'; sub.frequency.value = 27.5
  const subG = ac.createGain(); subG.gain.value = 0.06
  sub.connect(subG); subG.connect(master)
  sub.start()

  // stellar shimmer: very occasional quiet high-frequency blips
  let shimmerTimeout: ReturnType<typeof setTimeout>
  function scheduleShimmer() {
    const delay = 3000 + Math.random() * 8000
    shimmerTimeout = setTimeout(() => {
      if (ac.state === 'closed') return
      const osc = ac.createOscillator(); osc.type = 'sine'
      osc.frequency.value = 2000 + Math.random() * 6000
      const env = ac.createGain(); env.gain.setValueAtTime(0, ac.currentTime)
      env.gain.linearRampToValueAtTime(0.035, ac.currentTime + 0.02)
      env.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.5)
      osc.connect(env); env.connect(master)
      osc.start(); osc.stop(ac.currentTime + 0.6)
      scheduleShimmer()
    }, delay)
  }
  scheduleShimmer()

  master.gain.setTargetAtTime(1, ac.currentTime, 2.5)

  return [
    ...oscs, sub, driftLfo, master,
    { disconnect() { clearTimeout(shimmerTimeout) } } as unknown as AudioNode,
  ]
}

// ── Matrix: digital pulse rhythm with filtered noise ──
function buildMatrixAudio(ac: AudioContext): AudioNode[] {
  const master = ac.createGain(); master.gain.value = 0
  master.connect(ac.destination)

  // rhythmic pulse at 120 BPM-ish: sawtooth through high-pass
  const bpm = 120 + Math.random() * 20
  const beatInterval = 60 / bpm

  let pulseTimeout: ReturnType<typeof setTimeout>
  let beatCount = 0
  function schedulePulse() {
    pulseTimeout = setTimeout(() => {
      if (ac.state === 'closed') return
      beatCount++
      // every 4 beats: sub kick (200Hz → 50Hz sweep)
      if (beatCount % 4 === 0) {
        const kick = ac.createOscillator(); kick.type = 'sine'
        kick.frequency.setValueAtTime(200, ac.currentTime)
        kick.frequency.exponentialRampToValueAtTime(50, ac.currentTime + 0.06)
        const kickEnv = ac.createGain()
        kickEnv.gain.setValueAtTime(0.2, ac.currentTime)
        kickEnv.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08)
        kick.connect(kickEnv); kickEnv.connect(master)
        kick.start(); kick.stop(ac.currentTime + 0.1)
      }

      // hi-tone blip
      const osc = ac.createOscillator(); osc.type = 'sawtooth'
      osc.frequency.value = 220 * (Math.random() < 0.3 ? 2 : 1)
      const hpf = ac.createBiquadFilter(); hpf.type = 'highpass'; hpf.frequency.value = 800
      const env = ac.createGain()
      env.gain.setValueAtTime(0, ac.currentTime)
      env.gain.linearRampToValueAtTime(0.06, ac.currentTime + 0.002)
      env.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.08)
      osc.connect(hpf); hpf.connect(env); env.connect(master)
      osc.start(); osc.stop(ac.currentTime + 0.1)

      schedulePulse()
    }, beatInterval * 1000 * (0.9 + Math.random() * 0.2))
  }
  schedulePulse()

  // background noise hiss through narrow bandpass
  const bufferSize = ac.sampleRate * 2
  const noiseBuffer = ac.createBuffer(1, bufferSize, ac.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1
  const noise = ac.createBufferSource(); noise.buffer = noiseBuffer; noise.loop = true
  const bp = ac.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2200; bp.Q.value = 10
  const noiseG = ac.createGain(); noiseG.gain.value = 0.025
  noise.connect(bp); bp.connect(noiseG); noiseG.connect(master)
  noise.start()

  master.gain.setTargetAtTime(1, ac.currentTime, 0.8)

  return [
    noise, master,
    { disconnect() { clearTimeout(pulseTimeout) } } as unknown as AudioNode,
  ]
}

export function useAmbientAudio(scene: SceneName) {
  const [enabled, setEnabled] = useState(false)
  const acRef = useRef<AudioContext | null>(null)
  const nodesRef = useRef<AudioNode[]>([])

  const start = useCallback(() => {
    if (acRef.current) return
    const ac = new AudioContext()
    acRef.current = ac

    let nodes: AudioNode[] = []
    if (scene === 'aquarium') nodes = buildAquariumAudio(ac)
    else if (scene === 'space') nodes = buildSpaceAudio(ac)
    else if (scene === 'matrix') nodes = buildMatrixAudio(ac)
    nodesRef.current = nodes
  }, [scene])

  const stop = useCallback(() => {
    const nodes = nodesRef.current
    nodes.forEach(n => {
      try { (n as OscillatorNode).stop?.() } catch { /* already stopped */ }
      try { n.disconnect() } catch { /* already disconnected */ }
    })
    nodesRef.current = []
    acRef.current?.close()
    acRef.current = null
  }, [])

  const toggle = useCallback(() => {
    if (enabled) { stop(); setEnabled(false) }
    else { start(); setEnabled(true) }
  }, [enabled, start, stop])

  // stop on unmount or scene change
  useEffect(() => {
    return () => {
      stop()
      setEnabled(false)
    }
  }, [scene, stop])

  return { enabled, toggle }
}
