"""Generate synthesized sci-fi sound effects for DoctorBot."""
import struct
import wave
import math
import os
import subprocess
import tempfile

SAMPLE_RATE = 44100
OUTPUT_DIR = "frontend/public/sounds"


def generate_samples(duration: float, generator):
    """Generate audio samples from a generator function."""
    num_samples = int(SAMPLE_RATE * duration)
    samples = []
    for i in range(num_samples):
        t = i / SAMPLE_RATE
        val = generator(t, duration)
        # Clamp to [-1, 1]
        val = max(-1.0, min(1.0, val))
        samples.append(val)
    return samples


def write_wav(filename: str, samples: list[float]):
    """Write samples to a WAV file."""
    with wave.open(filename, "w") as wav:
        wav.setnchannels(1)
        wav.setsampwidth(2)
        wav.setframerate(SAMPLE_RATE)
        for s in samples:
            wav.writeframes(struct.pack("<h", int(s * 32767)))


def wav_to_mp3(wav_path: str, mp3_path: str):
    """Convert WAV to MP3 using ffmpeg."""
    subprocess.run(
        ["ffmpeg", "-y", "-i", wav_path, "-codec:a", "libmp3lame", "-b:a", "128k", mp3_path],
        capture_output=True,
        check=True,
    )


def envelope(t: float, duration: float, attack: float = 0.05, release: float = 0.2) -> float:
    """Simple attack-sustain-release envelope."""
    if t < attack:
        return t / attack
    elif t > duration - release:
        return (duration - t) / release
    return 1.0


def generate_tardis(t: float, duration: float) -> float:
    """TARDIS materialization: sweeping oscillator with grinding texture.

    A rising/falling wheezy sound with harmonic overtones.
    """
    env = envelope(t, duration, attack=0.3, release=0.5)

    # Sweep frequency up and down cyclically (the iconic whooshing)
    cycle = math.sin(2 * math.pi * 0.7 * t)  # ~0.7 Hz cycle
    base_freq = 180 + 120 * cycle  # Sweep between 60-300 Hz

    # Main tone with harmonics
    main = math.sin(2 * math.pi * base_freq * t) * 0.3
    harm2 = math.sin(2 * math.pi * base_freq * 2.01 * t) * 0.15  # Slightly detuned
    harm3 = math.sin(2 * math.pi * base_freq * 3.03 * t) * 0.1

    # High-pitched wheezing component
    wheeze_freq = 800 + 400 * cycle
    wheeze = math.sin(2 * math.pi * wheeze_freq * t) * 0.12

    # Grinding texture (amplitude-modulated noise-like)
    grind = math.sin(2 * math.pi * 47 * t) * math.sin(2 * math.pi * 53 * t) * 0.15

    return env * (main + harm2 + harm3 + wheeze + grind)


def generate_sonic(t: float, duration: float) -> float:
    """Sonic screwdriver: high-pitched warbling buzz."""
    env = envelope(t, duration, attack=0.02, release=0.1)

    # High base frequency with rapid warble
    warble = math.sin(2 * math.pi * 12 * t)  # 12 Hz warble
    freq = 2400 + 300 * warble

    # Main tone
    main = math.sin(2 * math.pi * freq * t) * 0.25

    # Bright overtone
    overtone = math.sin(2 * math.pi * freq * 1.5 * t) * 0.15

    # Sub buzz for body
    buzz = math.sin(2 * math.pi * 180 * t) * math.sin(2 * math.pi * 60 * t) * 0.1

    return env * (main + overtone + buzz)


def generate_hum(t: float, duration: float) -> float:
    """TARDIS ambient hum: low droning with subtle modulation."""
    env = envelope(t, duration, attack=0.5, release=0.5)

    # Low base drone
    base = math.sin(2 * math.pi * 55 * t) * 0.2  # A1

    # Slightly detuned second drone for thickness
    drone2 = math.sin(2 * math.pi * 55.5 * t) * 0.15

    # Octave above, gentle
    octave = math.sin(2 * math.pi * 110 * t) * 0.08

    # Very slow amplitude modulation (breathing feel)
    mod = 0.7 + 0.3 * math.sin(2 * math.pi * 0.15 * t)

    # Subtle high shimmer
    shimmer = math.sin(2 * math.pi * 330 * t) * 0.03 * (0.5 + 0.5 * math.sin(2 * math.pi * 0.3 * t))

    return env * mod * (base + drone2 + octave + shimmer)


def generate_cloister(t: float, duration: float) -> float:
    """Cloister bell: deep, resonant bell toll with long decay."""
    # Bell strikes at t=0 and t=1.5
    total = 0.0
    for strike_time in [0.0, 1.5]:
        dt = t - strike_time
        if dt < 0:
            continue

        # Exponential decay
        decay = math.exp(-dt * 1.2)

        # Bell fundamentals (deep, cathedral-like)
        f1 = math.sin(2 * math.pi * 65 * dt) * 0.3  # Low fundamental
        f2 = math.sin(2 * math.pi * 130 * dt) * 0.2  # Octave
        f3 = math.sin(2 * math.pi * 195 * dt) * 0.1  # Fifth above
        f4 = math.sin(2 * math.pi * 260 * dt) * 0.08  # Two octaves

        # Inharmonic partials (bell-like)
        f5 = math.sin(2 * math.pi * 327 * dt) * 0.05 * math.exp(-dt * 2)
        f6 = math.sin(2 * math.pi * 408 * dt) * 0.03 * math.exp(-dt * 3)

        # Initial attack transient
        attack = math.exp(-dt * 15) * math.sin(2 * math.pi * 1200 * dt) * 0.15

        total += decay * (f1 + f2 + f3 + f4 + f5 + f6 + attack)

    return max(-1.0, min(1.0, total))


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    sounds = {
        "tardis": (3.0, generate_tardis),
        "sonic": (0.8, generate_sonic),
        "hum": (4.0, generate_hum),
        "cloister": (3.5, generate_cloister),
    }

    for name, (duration, generator) in sounds.items():
        print(f"Generating {name} ({duration}s)...")
        samples = generate_samples(duration, generator)

        # Write WAV to temp file, convert to MP3
        with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmp:
            wav_path = tmp.name

        write_wav(wav_path, samples)
        mp3_path = os.path.join(OUTPUT_DIR, f"{name}.mp3")
        wav_to_mp3(wav_path, mp3_path)
        os.unlink(wav_path)

        size = os.path.getsize(mp3_path)
        print(f"  -> {mp3_path} ({size:,} bytes)")

    print("\nDone! All sound effects generated.")


if __name__ == "__main__":
    main()
