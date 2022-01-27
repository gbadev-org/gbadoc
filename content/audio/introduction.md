# Introduction

The Gameboy Advance (GBA) sound system may seem to many as black magic because of the availability of information on this specific part of the machine is near inexistent. Moreover, finding relevant or accurate specs for the older Gameboy was and is still problematic. The result is that many will take little or no advantages of sound in their projects. This site will attempt to fill this gap, by providing an *Unofficial*, comprehensive and (well, as much as possible in the circumstances) accurate specification of the GBA sound system (GBAS). It is assumed that the reader will have some knowledge of the other basic functionalities of the GBA and knows how to program in C.

The GBAS is a big step forward its older brothers because it now includes two Pulse Width Modulators (PWM) that act as digital-to-analog converters. This adds to the 4 sound channels present on the previous Gameboys. One important improvement to the sound system is that channel 3 's wave ram is now banked, allowing for distortion-free dynamic wave ram reloading.

The GBA BIOS also contains many sound-related functions, for converting MIDI notes and playing music. BIOS may be covered in the future.

# The Registers

Sound registers, as for all other registers in the GBA, are memory mapped and they span from 0x0400060 to 0x40000A6.

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