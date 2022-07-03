# Introduction

This is a community effort to provide an open document about the Game Boy Advance (GBA).

The book is provided to you under the [Creative Commons 0 License](https://creativecommons.org/publicdomain/zero/1.0/legalcode).

If you'd like to ask questions, report problems, or contribute, then go to our [GitHub Repository](https://github.com/gbdev/gbadoc).

If you want to just chat about GBA topics you can join the [GBADev Discord](https://discord.io/gbadev).

<!-- TODO: merge with above -->

## Introduction (CowBite)

This document began as a scratchpad of notes that I added onto "Agent Q's GBA Spec" as I came across new information and ideas while building the CowBite emulator. Agent Q is no longer able to maintain that document. Because there is so much additional information here, I thought it would be a shame to keep it to myself, and thus I'm releasing it again as a CowBite technical reference document. Though it has the name of the CowBite emulator on it, the information should still be more or less (and unofficially) valid on actual hardware.  
  
I've tried to organize this document in a way that will be easy to navigate to the section you are looking for. I also try to update whenever I find that something is missing or erroneous. However, I can't catch everything without your feedback. If you find an error, have information not listed in this doc (and there is lots of _that_), or think that something could be improved upon, please [contact me](mailto:SorcererXIII@yahoo.com).  
  
For the most part, this document is a reference and not a tutorial or instruction manual. I have done my best to provide samples and hints wherever I can, but if you are looking for a step-by-step guide, you will probably find it easier to begin with a tutorial like Dovoto's [Pern Project](http://216.167.73.47/~dovoto/English/tutorial_5.html), or one of the other tutorials on [www.gbadev.org](http://www.gbadev.org) or in the [links](#Links) section of this page.  
  
All of this information has been obtained legally by piecing together information from the ARM docs, gbadev.org, the gbadev mailing list, public domain demos, and other information such as the debug info from various emulators. My sincerest [thanks](#Thanks) to all of those who have mailed me with info and corrections!  
  
Send me mail ([SorcererXIII@yahoo.com](mailto:SorcererXIII@yahoo.com)) with your comments and especially with info and corrections.  
  
Tom Happ  
  
Revision 3.5 - (Colorful Version) Begun May 18th 2002 (Though updates are continuous)  
Revision 3.0 - (HTML Version) Begun December 19th 2001  
Revision 2.1 - I decided to rename this 3.0, as it turned out to be a major overhaul  
Revision 2.0 - Begun July 23, 2001 (by me)  
Revision 1.0 - (by Agent Q) 08/02/2001  

I keep the most recent doc update at  
[http://www.cs.rit.edu/~tjh8300/CowBite/CowBiteSpec.htm](http://www.cs.rit.edu/~tjh8300/CowBite/CowBiteSpec.htm)

### The Basics

From the programmer's perspective, the system is composed of the following:  
  
[CPU](cpu.md) - A 16.78 Mhz ARM7tdmi  
[Memory](memory.md) - 8 to 11 distinct areas of memory (depending on the Game Pak).  
[IO](registers.md) - Special hardware functions available to the programmer, primarily pertaining to graphics, sound, DMA, timers, serial communication, key input, and interrupts.  
  
Programs run on the GBA are usually contained in a "Game Pak". A "Game Pak" consists mainly of [ROM](memory.md#game-pak-rom) and possibly [Cart RAM](memory.md#cart-ram) (in the form of SRAM, Flash ROM, or EEPROM, used mainly for save game info). The ROM is where compiled code and data is stored. Unlike home computers, workstations, or servers, there are no disks or other drives, so everything that might otherwise have been stored as separate resource files must be compiled into the program ROM itself. Luckily there are tools to aid in this process.  
  
The primary means a program accesses specialized hardware for graphics, sound, and other IO is through the [memory-mapped IO](#Memory-Mapped Hardware Registers). Memory mapped IO is a means of communicating with hardware by writing to/reading from specific memory addresses that are "mapped" to internal hardware functions. For example, you might write to address [0x4000000](registers.md#REG_DISPCNT) with the value "0x0100", which tells the hardware "enable background 0 and graphics mode 0". A secondary means is through the [BIOS](memory.md#system-rom), which is embedded in the internal GBA system ROM. Using [software interrupts](bios.md) it is possible to access pre-programmed (and hopefully optimized) routines lying in the the system ROM. These routines then access the hardware through the memory-mapped IO.
  
Other regions of memory that are directly mapped to the hardware are [Palette RAM](memory.md#palette-ram) (which is a table consisting of all the available colors), [VRAM](memory.md#vram) (which performs a similar function to the video RAM on a PC - and thensome), and [OAM](memory.md#oam) (which contains the attributes for hardware accelerated sprites).

### Programming for the GBA

C, C++, and ARM/Thumb assembly are the most common languages used in GBA development, mainly because they are fast and relatively low level (i.e. there is a large degree of correspondance between the structure of the language and underlying instruction set of the architecture). Members of the [GBA development community](http://www.gbadev.org) have put together some development kits that greatly simplify the task of configuring a C/C++ compiler for GBA development. Two that I know of are Devkit Advance and HAM.  
  
Most GBA programs are structured around the timing of the CPU and graphics hardware. The LCD has a refresh rate of about 59.73 hz, with each refresh consisting of a [vertical draw](graphics.md#VDraw) period (when the GBA is drawing the screen) followed by a [vertical blank](graphics.md#VBlank) period (when nothing is being drawn). The vertical draw and vertical blank periods are further subdivided into [horizontal draw and blank](graphics.md#HDraw) periods. Programs typically use the VBlank and possibly the HBlank periods to update VRAM or graphics hardware registers in order to avoid unwanted visual artifacts, leaving the VDraw and HDraw periods to perform any software processing that will not effect the display. Common methods of syncing to VBlank include polling [REG_DISPSTAT](registers.md#REG_STAT) or [REG_VCOUNT](registers.md#REG_VCOUNT), calling the VBlankIntrWait [BIOS](bios.md#0x05-vblankintrwait) function, or setting up an [interrupt](interrupts.md).
  
For those wishing to learn how to write a program for the GBA, this is not really the right place. This document is more like a reference that you can keep open in the background and quickly thumb through as questions arise. However, I suggest the following resources as being invaluable to the beginner:  
  
[http://www.gbadev.org](http://www.gbadev.org) - This is one of the main hubs for GBA development on the web, containing numerous docs, tutorials, demos (many with source code), tools, and news.  
  
[http://www.devrs.com/gba](http://www.devrs.com/gba) - This is Jeff Frohwein's GBA site. Jeff Frohwein is something of a GBA dev guru; you will likely hear his name mentioned often throghout the community. His site contains many good links, documents, and tools, many of which he wrote himself.  
  
[http://groups.yahoo.com/group/gbadev/](http://groups.yahoo.com/group/gbadev/) -A forum on yahoo with a large archive of back posts.  
  
[PERN project tutorials](http://216.167.73.47/~dovoto/English/tutorial_1.html) - These great tutorials by Dovoto explain everything in an easy-to-understand, step-by-step fashion.  
  
[The Audio Advance](http://www.belogic.com/gba) - Documents and tutorials on the formerly enigmatic GBA sound system. Courtesy of Uze.  
  
[HAM](http://www.ngine.de/ham.html) - Emanuel's HAM devkit is especially easy to install and can have you up and running in minutes.
