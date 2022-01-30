# GBA Sound Registers

| Adress     | Name            | Function                                          |
| ---------- | --------------- | ------------------------------------------------- |
| 0x04000060 | REG_SOUND1CNT_L | Sound 1 Sweep control                             |
| 0x04000062 | REG_SOUND1CNT_H | Sound 1 Length, wave duty and envelope control    |
| 0x04000064 | REG_SOUND1CNT_X | Sound 1 Frequency, reset and loop control         |
| 0x04000068 | REG_SOUND2CNT_L | Sound 2 Lenght, wave duty and envelope control    |
| 0x0400006C | REG_SOUND2CNT_H | Sound 2 Frequency, reset and loop control         |
| 0x04000070 | REG_SOUND3CNT_L | Sound 3 Enable and wave ram bank control          |
| 0x04000072 | REG_SOUND3CNT_H | Sound 3 Sound lenght and output level control     |
| 0x04000074 | REG_SOUND3CNT_X | Sound 3 Frequency, reset and loop control         |
| 0x04000078 | REG_SOUND4CNT_L | Sound 4 Length, output level and envelope control |
| 0x0400007C | REG_SOUND4CNT_H | Sound 4 Noise parameters, reset and loop control  |
| 0x04000080 | REG_SOUNDCNT_L  | Sound 1-4 Output level and Stereo control         |
| 0x04000082 | REG_SOUNDCNT_H  | Direct Sound control and Sound 1-4 output ratio   |
| 0x04000084 | REG_SOUNDCNT_X  | Master sound enable and Sound 1-4 play status     |
| 0x04000088 | REG_SOUNDBIAS   | Sound bias and Amplitude resolution control       |
| 0x04000090 | REG_WAVE_RAM0_L | Sound 3 samples 0-3                               |
| 0x04000092 | REG_WAVE_RAM0_H | Sound 3 samples 4-7                               |
| 0x04000094 | REG_WAVE_RAM1_L | Sound 3 samples 8-11                              |
| 0x04000096 | REG_WAVE_RAM1_H | Sound 3 samples 12-15                             |
| 0x04000098 | REG_WAVE_RAM2_L | Sound 3 samples 16-19                             |
| 0x0400009A | REG_WAVE_RAM2_H | Sound 3 samples 20-23                             |
| 0x0400009C | REG_WAVE_RAM3_L | Sound 3 samples 23-27                             |
| 0x0400009E | REG_WAVE_RAM3_H | Sound 3 samples 28-31                             |
| 0x040000A0 | REG_FIFO_A_L    | Direct Sound channel A samples 0-1                |
| 0x040000A2 | REG_FIFO_A_H    | Direct Sound channel A samples 2-3                |
| 0x040000A4 | REG_FIFO_B_L    | Direct Sound channel B samples 0-1                |
| 0x040000A6 | REG_FIFO_B_H    | Direct Sound channel B samples 2-3                |

## DMG Sound Output Control

| Offset | Name           |
| ------ | -------------- |
| 0x080  | REG_SOUNDCNT_L |

| Bit(s) | Effect                      | Access |
| ------ | --------------------------- | ------ |
| 2-0    | DMG Left Volume             | RW     |
| 3      | Vin to Left on/off (?)      |        |
| 6-4    | DMG Right Volume            | RW     |
| 7      | Vin to Right on/off (?)     |        |
| 8      | DMG Sound 1 to left output  | RW     |
| 9      | DMG Sound 2 to left output  | RW     |
| A      | DMG Sound 3 to left output  | RW     |
| B      | DMG Sound 4 to left output  | RW     |
| C      | DMG Sound 1 to right output | RW     |
| D      | DMG Sound 2 to right output | RW     |
| E      | DMG Sound 3 to right output | RW     |
| F      | DMG Sound 4 to right output | RW     |

_Notes_

1. This register controls only the DMG output amplifiers and have no effects on the individual sound channels processing, or Direct Sound channels volume.
2. Vin Left/Right were used on the original gameboy to enable gamepaks to provide their own sound source. It is currently unknown if this function is still supported and working on the GBA.

## Direct Sound Output Control Register

| Offset | Name           |
| ------ | -------------- |
| 0x082  | REG_SOUNDCNT_H |

| Bit(s) | Effect                                                | Access |
| ------ | ----------------------------------------------------- | ------ |
| 1-0    | Output sound ratio for chan. 1-4 (0=25%,1=50%,2=100%) | RW     |
| 2      | Direct sound A output ratio (0=50%, 1=100%)           | RW     |
| 3      | Direct sound B output ratio (0=50%, 1=100%)           | RW     |
| 7-4    | Unused                                                |        |
| 8      | Direct sound A to right output                        | RW     |
| 9      | Direct sound A to left output                         | RW     |
| A      | Direct sound A Sampling rate timer (timer 0 or 1)     | RW     |
| B      | Direct sound A FIFO reset                             | RW     |
| C      | Direct sound B to right output                        | RW     |
| D      | Direct sound B to left output                         | RW     |
| E      | Direct sound B Sampling rate timer (timer 0 or 1)     | RW     |
| F      | Direct sound B FIFO reset                             | RW     |

_Notes_

1. Output ratios control the output volume. Use when DMG channels or Direct Sound plays too loud relative to each other.
2. Direct Sound is a dual 8-bit DAC fed by data located in two FIFOs. FIFOs can be loaded manually or automatically in DMA mode when set appropriately. The DMA mode uses the timers specified in bits A and E as the sampling frequency reference. A single timer can be used for both DirectSound A&B. However, 2 DMA channels (1&2) must be used to output two different sounds simultaneously on both channels. Also, DMA channel start mode must be set to 11 to instruct it to repeat on FIFO-empty requests.

## Master Sound Output Control/Status

| Offset | Name           |
| ------ | -------------- |
| 0x084  | REG_SOUNDCNT_X |

| Bit(s) | Effect                                 | Access |
| ------ | -------------------------------------- | ------ |
| 0      | DMG Sound 1 status                     | R      |
| 1      | DMG Sound 2 status                     | R      |
| 2      | DMG Sound 3 status                     | R      |
| 3      | DMG Sound 4 status                     | R      |
| 6-4    | Unused                                 |        |
| 7      | All sound circuit enable (0=off, 1=on) | RW     |
| F-8    | Unused                                 |        |

_Notes_

1. Bits 0-3 are set when their respective sound channels are playing and are resetted when sound has stopped. Note that contrary to some other sources and most emulators, these bits are read-only and do not need to be set to enable the sound channels.
2. Bit 7 turns on or off the entire sound circuit (DMG and Direct Sound). Keep this bit cleared as often as possible in order to save battery power. Some sources states that it allows batteries to last up to 10% longer.

## Sound Bias

| Offset | Name          |
| ------ | ------------- |
| 0x088  | REG_SOUNDBIAS |

| Bit(s) | Effect                                                                                                                                   | Access |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 9-0    | DC offset bias value                                                                                                                     | RW     |
| D-A    | Unused                                                                                                                                   |        |
| F-E    | PWM resampling resolution where: <br> 00=9bit at 32768 Hz <br> 01= 8bit at 65536 Hz <br> 10=7bit at 131072 Hz <br> 11= 6bit at 262144 Hz | RW     |

_Notes_

1. The BIAS setting is used to offset the sound output and bring it back into a signed range. When the BIOS starts up, it runs a timing loop where it slowly raises the BIAS voltage from 0 to 512. This setting should not be changed. At best, the sound will become distorted. At worst the amplifier inside the GBA could be damaged. When accessing bits FE, a read-modify-write is required.
2. The default value for bits FE is 00. Most if not all games, uses 01 for this setting. More research is being done on this register.

## DirectSound FIFO A

| Offset      | Name       |
| ----------- | ---------- |
| 0x0A0-0x0A2 | REG_FIFO_A |

### 0x0A0

| Bit(s) | Effect         | Access |
| ------ | -------------- | ------ |
| 7-0    | 8-Bit sample 0 | W      |
| F-8    | 8-Bit sample 1 | W      |

### 0x0A2

| Bit(s) | Effect         | Access |
| ------ | -------------- | ------ |
| 7-0    | 8-Bit sample 2 | W      |
| F-8    | 8-Bit sample 3 | W      |

_Notes_

1. These registers contains the samples required for Direct Sound channel A output.
2. Reading from this register yields unpredictable results.

## DirectSound FIFO B

| Offset      | Name       |
| ----------- | ---------- |
| 0x0A4-0x0A6 | REG_FIFO_B |

### 0x0A4

| Bit(s) | Effect         | Access |
| ------ | -------------- | ------ |
| 7-0    | 8-Bit sample 0 | W      |
| F-8    | 8-Bit sample 1 | W      |

### 0x0A6

| Bit(s) | Effect         | Access |
| ------ | -------------- | ------ |
| 7-0    | 8-Bit sample 2 | W      |
| F-8    | 8-Bit sample 3 | W      |

_Notes_

1. These registers contains the samples required for Direct Sound channel B output.
2. Reading from this register yields unpredictable results.

## DMG Channel 1 Sweep control

| Offset | Name            |
| ------ | --------------- |
| 0x60   | REG_SOUND1CNT_L |

| Bit(s) | Effect                                                                                                                                                                                                                                                                                   | Access |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 2-0    | Sweep shifts                                                                                                                                                                                                                                                                             | RW     |
| 3      | Sweep increase/decrease: <br> 0=Addition(frequency increases) <br> 1=Subtraction (frequency decreases)                                                                                                                                                                                   | RW     |
| 6-4    | Sweep time: <br> 000: Sweep function is off <br> 001: Ts=1 / 128Khz (7.8 ms) <br> 010: Ts=2 / 128Khz (15.6 ms) <br> 011: Ts=3 / 128Khz (23.4 ms) <br> 100: Ts=4 / 128Khz (31.3 ms) <br> 101: Ts=5 / 128Khz (39.1 ms) <br> 110: Ts=6 / 128Khz (46.9 ms) <br> 111: Ts=7 / 128Khz (54.7 ms) | RW     |
| F-7    | Unused                                                                                                                                                                                                                                                                                   |        |

_Notes_

1. The sound channel 1 produces a square wave with envelope and frequency sweep functions.
2. This register controls the frequency sweep function. Sweep shifts bits controls the amount of change in frequency (either increase or decrease) at each change. The wave's new period is given by: \\( T = T \pm \frac{T}{2^n} \\) where n is the sweep shifts value.
3. Sweep time is the delay between sweep shifts. After each delay, frequency changes repeatedly.
4. When decrementing, if the frequency value gets smaller than zero, the previous value is retained. When incrementing, if the frequency gets greater than the maximum frequency (131Khz or 2048 for the register value) the sound stops.
5. When the sweep function is not required, set the sweep time to zero and set the increase/decrease bit to 1.
6. When Initializing the sound (REG_SOUND1CNT_X bit F=1) using sweeps, re-initialize the sound after 8 clocks or more. Otherwise the sound may stop.

## DMG Channel 1 Length, Wave Duty and Envelope Control

| Offset | Name            |
| ------ | --------------- |
| 0x062  | REG_SOUND1CNT_H |

| Bit(s) | Effect                                                             | Access |
| ------ | ------------------------------------------------------------------ | ------ |
| 5-0    | Sound length                                                       | W      |
| 7-6    | Wave duty cycle: <br> 00=12.5% <br> 01=25% <br> 10=50% <br> 11=75% | RW     |
| A-8    | Envelope step time                                                 | RW     |
| B      | Envelope mode: <br> 0=Envelope decreases <br> 1=Envelope increases | RW     |
| F-C    | Initial envelope value                                             | RW     |

_Notes_

1. The sound length is an 6 bit value obtained from the following formula: Sound length= (64-register value)\*(1/256) seconds.
2. After the sound length has been changed, the sound channel must be resetted via bit F of REG_SOUND1CNT_X (when using timed mode).
3. Wave duty cycle control the percentage of the ON state of the square wave.
4. The envelope step time is the delay between successive envelope increase or decrease. It is given by the following formula: T=register value\*(1/64) seconds.
5. Envelope mode control if the envelope is to increase or decrease in volume over time.
6. The initial volume of the envelope is controlled by bit F-C. 1111 produces the maximum volume and 0000 mutes the sound.

## DMG Channel 1 Frequency, Reset and Loop Control

| Offset | Name            |
| ------ | --------------- |
| 0x064  | REG_SOUND1CNT_X |

| Bit(s) | Effect                                 | Access |
| ------ | -------------------------------------- | ------ |
| A-0    | Sound frequency                        | W      |
| D-B    | Unused                                 |        |
| E      | Timed mode: <br> 0=continuous, 1=timed | RW     |
| F      | Sound Reset                            | W      |

_Notes_

1. Frequency can be calculated from the following formula: F(hz)=4194304/(32\*(2048-register value)). The minimum frequency is 64Hz and the maximum is 131Khz.
2. When Bit E (Timed mode) is set to 0, sound 1 is played continuously regardless of the length data in REG_SOUND1CNT_H. When set to 1, sound is played for that specified length and after that, bit 0 of REG_SOUNDCNT_X is reset.
3. When bit F is set to 1, the envelope is resetted to its initial value and sound restarts at the specified frequency.
4. Frequency can always be changed without resetting the sound. However, when in continuous mode, alway set the sound lenght to zero after changing the frequency. Otherwise, the sound may stop.

## DMG Channel 2 Length, Wave Duty and Envelope Control

| Offset | Name            |
| ------ | --------------- |
| 0x068  | REG_SOUND2CNT_L |

| Bit(s) | Effect                                                             | Access |
| ------ | ------------------------------------------------------------------ | ------ |
| 5-0    | Sound length                                                       | W      |
| 7-6    | Wave duty cycle: <br> 00=12.5% <br> 01=25% <br> 10=50% <br> 11=75% | RW     |
| A-8    | Envelope step time                                                 | RW     |
| B      | Envelope mode: <br> 0=Envelope decreases <br> 1=Envelope increases | RW     |
| F-C    | Initial envelope value                                             | RW     |

_Notes_

1. The sound length is an 6 bit value obtained from the following formula: Sound length= (64-register value)\*(1/256) seconds.
2. After the sound length has been changed, the sound channel must be resetted via bit F of REG_SOUND2CNT_H (when using timed mode).
3. Wave duty cycle control the percentage of the ON state of the square wave.
4. The envelope step time is the delay between successive envelope increase or decrease. It is given by the following formula: T=register value\*(1/64) seconds.
5. Envelope mode control if the envelope is to increase or decrease in volume over time.
6. The initial volume of the envelope is controlled by bit F-C. 1111 produces the maximum volume and 0000 mutes the sound.

## DMG Channel 2 Frequency, Reset and Loop Control

| Offset | Name            |
| ------ | --------------- |
| 0x06C  | REG_SOUND2CNT_H |

| Bit(s) | Effect                                 | Access |
| ------ | -------------------------------------- | ------ |
| A-0    | Sound frequency                        | W      |
| D-B    | Unused                                 |        |
| E      | Timed mode: <br> 0=continuous, 1=timed | RW     |
| F      | Sound Reset                            | W      |

_Notes_

1. Frequency can be calculated from the following formula: F(Hz)=4194304/(32\*(2048-register value)). The minimum frequency is 64Hz and the maximum is 131Khz.
2. When Bit E (Timed mode) is set to 0, sound 2 is played continuously regardless of the length data in REG_SOUND2CNT_L. When set to 1, sound is played for that specified length and after that, bit 1 of REG_SOUNDCNT_X is reset.
3. When bit F is set to 1, the envelope is resetted to its initial value and sound restarts at the specified frequency.
4. Frequency can always be changed without resetting the sound. However, when in continuous mode, alway set the sound lenght to zero after changing the frequency. Otherwise, the sound may stop.

## DMG Channel 3 Enable and Wave RAM Bank Control

| Offset | Name            |
| ------ | --------------- |
| 0x070  | REG_SOUND3CNT_L |

| Bit(s) | Effect                                   | Access |
| ------ | ---------------------------------------- | ------ |
| 4-0    | Unused                                   |        |
| 5      | Bank Mode (0=2x32, 1=1x64)               | RW     |
| 6      | Bank Select (Non set bank is written to) | RW     |
| 7      | Sound Channel 3 output enable            | RW     |
| F-8    | Unused                                   |        |

_Notes_

1. The sound channel 3 is a circuit that can produce an arbitrary wave pattern. Samples are 4 bit, 8 samples per word, and are located in Wave Ram registers from 0x400090 to 0x40009F.
2. In the Gameboy Advance, the Wave Ram is banked, providing the ability to play a 64 samples pattern or to select between two 32 samples patterns (Bit 5). Sound channel 3 always produces some audio artifacts (distortion) when sound is initialized. Fortunately, switching banks does not require re-initialisation during playback, thus allowing for dynamic reloading of the Wave Ram without generating any distortion.
3. Bit 6 controls which bank is active for playing/reloading. If set to 0, samples are played from bank 0 and writing to the Wave Ram will store the data in Bank 1 and vice-versa.
4. When bit 7 is set and Initial flag (Bit 15) from REG_SOUND3CNT_X is set, the wave pattern starts to play.
5. Both banks of Wave Ram are filled with zero upon initialization of the Gameboy, Bank 0 being selected. So writing to bank 0 implies setting bit 6 to 1 before loading Wave Ram then set it back to 0 to play it. Most emulator currently ignore banks.

## DMG Channel 3 Sound Length and Output Level Control

| Offset | Name            |
| ------ | --------------- |
| 0x072  | REG_SOUND3CNT_H |

| Bit(s) | Effect                                                                                 | Access |
| ------ | -------------------------------------------------------------------------------------- | ------ |
| 7-0    | Sound length                                                                           | W      |
| C-8    | Unused                                                                                 |        |
| F-D    | Ouput volume ratio: <br> 000=Mute <br> 001=100% <br> 100=75% <br> 010=50% <br> 011=25% | RW     |

_Notes_

1. The sound length is an 8 bit value obtained from the following formula: Register=Note length(in seconds)\*256, hence a 1 second maximum and a 3.9 millisecond minimum sound duration.
2. After the sound length has be changed, the sound channel must be resetted via bit F of REG_SOUND3CNT_H (when using timed mode).

## DMG Channel 3 Frequency, Reset and Loop Control

| Offset | Name            |
| ------ | --------------- |
| 0x074  | REG_SOUND3CNT_X |

| Bit(s) | Effect                                 | Access |
| ------ | -------------------------------------- | ------ |
| A-0    | Sound frequency                        | W      |
| D-B    | Unused                                 |        |
| E      | Timed mode: <br> 0=continuous, 1=timed | RW     |
| F      | Sound Reset                            | W      |

_Notes_

1. Frequency can be calculated from the following formula: F(Hz)=4194304/(32\*(2048-register value)). The minimum frequency is 64Hz and the maximum is 131Khz.
2. When Bit E (Timed mode) is set to 0, sound 3 is played continuously regardless of the length data in REG_SOUND3CNT_H. When set to 1, sound is played for that specified length and after that, bit 2 of REG_SOUNDCNT_X is reset.
3. When bit F is set to 1, sound resets and restarts at the specified frequency. Frequency and sound reset must be performed in a single write since both are write only.
4. Note that in continuous mode, frequency can be changed without resetting the sound channel. However, when in continuous mode, alway set the sound lenght to zero after changing the frequency. Otherwise, the sound may stop.

## DMG Channel 3 Wave RAM Registers

| Offset      | Name           |
| ----------- | -------------- |
| 0x090-0x09F | REG_WAVERAM0-3 |

| Bit(s) | Effect         | Access |
| ------ | -------------- | ------ |
| 3-0    | 4-bit sample 0 | RW     |
| 7-4    | 4-bit sample 1 | RW     |
| B-8    | 4-bit sample 2 | RW     |
| F-C    | 4-bit sample 3 | RW     |

_Notes_

1. Wave ram spans four 32 bit registers.
2. Take into account that ARM store 32bit words in little-indian format. So if you load REG_WAVERAM0=0x01234567, in reality, the sample played will be 6-7-4-5-2-3-0-1.

## DMG Channel 4 Length, Output Level and Envelope Control

| Offset | Name            |
| ------ | --------------- |
| 0x78   | REG_SOUND4CNT_L |

| Bit(s) | Effect                                                             | Access |
| ------ | ------------------------------------------------------------------ | ------ |
| 5-0    | Sound length                                                       | W      |
| 7-6    | Unused                                                             |        |
| A-8    | Envelope step time                                                 | RW     |
| B      | Envelope mode: <br> 0=Envelope decreases <br> 1=Envelope increases | RW     |
| F-C    | Initial envelope value                                             | RW     |

_Notes_

1. The sound length is an 6 bit value obtained from the following formula: Sound length= (64-register value)\*(1/256) seconds.
2. After the sound length has been changed, the sound channel must be resetted via bit F of REG_SOUND4CNT_H (when using timed mode).
3. The envelope step time is the delay between successive envelope increase or decrease. It is given by the following formula: T=register value\*(1/64) seconds.
4. Envelope mode control if the envelope is to increase or decrease in volume over time.
5. The initial volume of the envelope is controlled by bit F-C. 1111 produces the maximum volume and 0000 mutes the sound.

## DMG Channel 4 Noise Parameters, Reset and Loop Control

| Offset | Name            |
| ------ | --------------- |
| 0x07C  | REG_SOUND4CNT_H |

| Bit(s) | Effect                                                                                                                                                                                                         | Access |
| ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 2-0    | Clock divider frequency (with f=4.194304 Mhz/8) <br> 000: f\*2 <br> 001: f <br> 010: f/2 <br> 011: f/3 <br> 100: f/4 <br> 101: f/5 <br> 110: f/6 <br> 111: f/7                                                 | RW     |
| 3      | Counter stages: <br> 0=15 stages, 1=7 stages                                                                                                                                                                   | RW     |
| 7-4    | Counter Pre-Stepper frequency (with Q=clock divider's output frequency): <br> 0000: Q/2 <br> 0001: Q/2^2 <br> 0010: Q/2^3 <br> 0011: Q/2^4 <br> .... <br> 1101: Q/2^14 <br> 1110: Not used <br> 1111: Not used | RW     |
| D-8    | Unused                                                                                                                                                                                                         |        |
| E      | Timed mode: <br> 0=continuous, 1=timed                                                                                                                                                                         | RW     |
| F      | Sound Reset                                                                                                                                                                                                    | W      |

_Notes_

1. Channel 4 produces pseudo-noise generated by a polynomial counter. It is based on a 7/15 stages linear-feedback shift register (LFSR). LFSR counts in a pseudo-random order where each state is generated once and only once during the whole count sequence. The sound is produced by the least significant bit's output stage.
2. A Clock divider controlled by bits 0-2 divides the CPU frequency. Its output is then fed into the counter's pre-scaler (controlled by bits 4-7) which divides further more the frequency.
3. The Counter stages controls the period of the polynomial counter. It is given by (2^n)-1 where n=number of stages. So for n=7, the pseudo-noise period lasts 63 input clocks. After that, the counter restarts the same count sequence.
4. When Bit E (Timed mode) is set to 0, sound 4 is played continuously regardless of the length data in REG_SOUND4CNT_L. When set to 1, sound is played for that specified length and after that, bit 3 of REG_SOUNDCNT_X is reset.
5. When bit F is set to 1, Envelope is set to initial value, the LFSR count sequence is resetted and the sound restarts.
6. Note that in continuous mode, all parameters can be changed but sound need to be resetted when modifying the envelope initial volume or the clock divider for changes to take effects.

## Acronyms used

| Acronym | Meaning                                |
| ------- | -------------------------------------- |
| DAC     | Digital-to-Analog Converters           |
| DMA     | Direct Memory Access                   |
| DMG     | The original gameboy (Dot Matrix Game) |
| FIFO    | First-In-First-Out                     |
