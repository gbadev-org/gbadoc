# Introduction

This is a community effort to provide an open document about the Game Boy Advance (GBA).

The book is provided to you under the [Creative Commons 0 License](https://creativecommons.org/publicdomain/zero/1.0/legalcode).

If you'd like to ask questions, report problems, or contribute, then go to our [GitHub Repository](https://github.com/gbdev/gbadoc).

If you want to just chat about GBA topics you can join the [GBADev Discord](https://discord.io/gbadev).


## The Basics

From the programmer's perspective, the system is composed of the following:

* [CPU](cpu.md) - A 16.78 Mhz ARM7tdmi
* [Memory](memory.md) - 8 to 11 distinct areas of memory (depending on the Game Pak).
* [IO](registers.md) - Special hardware functions available to the programmer, primarily pertaining to graphics, sound, DMA, timers, serial communication, key input, and interrupts.

Programs run on the GBA are usually contained in a "Game Pak". A "Game Pak" consists mainly of [ROM](memory.md#game-pak-rom) and possibly [Cart RAM](memory.md#cart-ram) (in the form of SRAM, Flash ROM, or EEPROM, used mainly for save game info). The ROM is where compiled code and data is stored. Unlike home computers, workstations, or servers, there are no disks or other drives, so everything that might otherwise have been stored as separate resource files must be compiled into the program ROM itself. Luckily there are tools to aid in this process.

The primary means a program accesses specialized hardware for graphics, sound, and other IO is through the [memory-mapped IO](registers.md). Memory mapped IO is a means of communicating with hardware by writing to/reading from specific memory addresses that are "mapped" to internal hardware functions. For example, you might write to address [0x4000000](registers.md#REG_DISPCNT) with the value "0x0100", which tells the hardware "enable background 0 and graphics mode 0". A secondary means is through the [BIOS](memory.md#system-rom), which is embedded in the internal GBA system ROM. Using [software interrupts](bios.md) it is possible to access pre-programmed (and hopefully optimized) routines lying in the the system ROM. These routines then access the hardware through the memory-mapped IO.

Other regions of memory that are directly mapped to the hardware are [Palette RAM](memory.md#palette-ram) (which is a table consisting of all the available colors), [VRAM](memory.md#vram) (which performs a similar function to the video RAM on a PC - and thensome), and [OAM](memory.md#oam) (which contains the attributes for hardware accelerated sprites).

## Programming for the GBA

C, C++, and ARM/Thumb assembly are the most common languages used in GBA development, mainly because they are fast and relatively low level (i.e. there is a large degree of correspondance between the structure of the language and underlying instruction set of the architecture).

The two main development kits are [devkitARM](https://devkitpro.org/) and [gba-toolchain](https://github.com/felixjones/gba-toolchain), but it's also surprisingly easy to [roll your own](https://github.com/AntonioND/gba-bootstrap) using vanilla ARM GCC. Newer systems programming languages such as Rust, D, Nim and Zig are also increasingly used.

Most GBA programs are structured around the timing of the CPU and graphics hardware. The LCD has a refresh rate of about 59.73 hz, with each refresh consisting of a [vertical draw](graphics.md#VDraw) period (when the GBA is drawing the screen) followed by a [vertical blank](graphics.md#VBlank) period (when nothing is being drawn). The vertical draw and vertical blank periods are further subdivided into [horizontal draw and blank](graphics.md#HDraw) periods. Programs typically use the VBlank and possibly the HBlank periods to update VRAM or graphics hardware registers in order to avoid unwanted visual artifacts, leaving the VDraw and HDraw periods to perform any software processing that will not effect the display. Common methods of syncing to VBlank include polling [REG_DISPSTAT](registers.md#REG_STAT) or [REG_VCOUNT](registers.md#REG_VCOUNT), calling the [VBlankIntrWait](bios.md#0x05-vblankintrwait) BIOS function, or setting up an [interrupt](interrupts.md).
