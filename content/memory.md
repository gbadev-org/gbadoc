# Memory

The following are the general areas of memory as seen by the CPU, and what they are used for.

### System ROM

<pre>
Start: 0x00000000
End:   0x00003FFF
Size:  16kb 
Port Size: 32 bit
Wait State: 0
</pre>

`0x0` - `0x00003FFF` contain the [BIOS](bios.md), which is executable but not readable. Any attempt to read in the area from `0x0` to `0x1FFFFFFF` will result in failure; what you will see on a read is the current prefetched instruction (the instruction after the instruction used to view the memory area), thus giving the appearance that this area of memory consists of a repeating byte pattern.

### External Work RAM

<pre>
Start: 0x02000000
End:   0x0203FFFF
Size:  256kb
Port Size: 16 bit
Mirrors:  Every 0x40000 bytes from 0x02000000 to 0x02FFFFFF
</pre>

This space is available for your game's data and code. If a multiboot cable is present on startup, the BIOS automatically detects it and downloads binary code from the cable and places it in this area, and execution begins with the instruction at address `0x02000000` (the default is `0x08000000`). Though this is the largest area of RAM available on the GBA, memory transfers to and from EWRAM are 16 bits wide and thus consume more cycles than necessary for 32 bit accesses. Thus it is advised that 32 bit ARM code be placed in [IWRAM](#internal-work-ram) rather than EWRAM.

### Internal Work RAM

<pre>
Start: 0x03000000
End:   0x03007FFF
Size:  32kb
Port Size: 32 bit
Mirrors:  Every 0x8000 bytes from 0x03000000 to 0x03FFFFFF
</pre>

This space is also available for use. It is the fastest of all the GBA's RAM, being internally embedded in the ARM7 CPU chip package and having a 32 bit bus. As the bus for [ROM](#game-pak-rom) and [EWRAM](#external-work-ram) is only 16 bits wide, the greatest efficiency will be gained by placing 32 bit ARM code in IWRAM while leaving thumb code for EWRAM or ROM memory.

### IO Ram

<pre>
Start: 0x04000000
End:   0x040003FF (0x04010000)
Size:  1Kb
Port Size:  Dual ported 32 bit
Mirrors:  The word at 0x04000800 (only!) is mirrored every 0x10000 bytes
          from 0x04000000 - 0x04FFFFFF.
</pre>

This area contains a mirror of the ASIC (Application Specific Integrated Circuit) registers on the GBA. This area of memory is used to control the graphics, sound, DMA, and other features. See [memory-mapped IO registers](registers.md) for details on the function of each register.

### Palette RAM

<pre>
Start: 0x05000000
End:   0x050003FF
Size:  1kb
Port Size:  16 bit
Mirrors: Every 0x400 bytes from 0x05000000 to 0x5FFFFFF
</pre>

This area specifies the [16-bit color](graphics.md#color-format) values for the paletted modes. There are two areas of the palette: one for backgrounds (`0x05000000`) and another for sprites (`0x05000200`). Each of these is either indexed as a single, 256-color palette, or as 16 individual 16-color palettes, depending on the settings of a particular [sprite](sprites.md#attr0) or background.

### VRAM

<pre>
Start: 0x06000000
End:   0x06017FFF
Size:  96kb
Port Size: 16 bit
Mirrors: Bytes 0x06010000 - 0x06017FFF is mirrored from 0x06018000 - 0x0601FFFF.
        The entire region from 0x06000000 - 0x06020000 is in turn mirrored every
        0x20000 bytes from 0x06000000 - 0x06FFFFFF.
</pre>

The video RAM is used to store the frame buffer in [bitmapped](backgrounds.md#bitmapped-backgrounds) modes, and the tile data and tile maps for tile-based ["text"](backgrounds.md#text-backgrounds) and [rotate/scale](registers.md#bg-rot-scale) modes.

### OAM

<pre>
Start: 0x07000000
End:   0x070003FF
Size:  1kb
Port Size: 32 bit
Mirrors: Every 0x400 bytes from 0x07000000 to 0x07FFFFFF
</pre>

This is the Object Attribute Memory, and is used to control the GBA's [sprites](oam.md).

<br>

* * *

<br>

The following areas of memory are technically cart-dependent, but can generally be expected to behave as described.

### Game Pak ROM

<pre>
Start: 0x08000000
Size:  The size of the cartridge (0 - 32 megabytes) 
Port Size: 16 bit
<a href="registers.html#REG_WSCNT">Wait State</a>: 0
</pre>

The ROM in the game cartridge appears in this area. If a cartridge is present on startup, the instruction found at location `0x08000000` is loaded into the program counter and execution begins from there. Note that the transfers to and from ROM are all 16 bits wide.

### Game Pak ROM Image 1

<pre>
Start: 0x0A000000
Size:  The size of the cartridge (0 - 32 megabytes)
Port Size:  16 bit
<a href="registers.html#REG_WSCNT">Wait State</a>: 1
</pre>

This is a mirror of the ROM above. Used to allow multiple speed ROMs in a single game pak.

### Game Pak ROM Image 2

<pre>
Start: 0x0C000000
Size:  The size of the cartridge (0 - 32 megabytes)
Port Size: 16 bit
<a href="registers.html#REG_WSCNT">Wait State</a>: 2
</pre>

This is a mirror of the ROM above. Used to allow multiple speed ROMs in a single game pak.

### Cart RAM

<pre>
Start: 0x0E000000 (also seem to appear at 0x0F000000)
Size:  0 - 64 kb
Port Size: 8 bit
</pre>

This is either SRAM or Flash ROM. Used primarily for saving game data. SRAM can be up to 64kb but is usually 32 kb. It has a battery backup so has the longest life (in terms of how many times it can be written to) of all backup methods. Flash ROM is usually 64 kb. Its lifespan is determined by the number of rewrites that can be done per sector (a 10,000 rewrite minimum is cited by some manufacturers).

### EEPROM 

This is another kind of cart memory, but operates differently from SRAM or Flash ROM. Unfortunately, I don't know the details of how it can be accessed by the programmer ([send us a PR](https://github.com/gbadev-org/gbadoc) if you have more information on it). It uses a serial connection to transmit data. The maximum size is 128 mb, but it can be any size, and is usually 4 kb or 64 kb. Like Flash ROM it has a limited life; some manufacturers cite a minimum of 100,000 rewrites per sector.

There may be other regions of memory known as DEBUG ROM 1 and DEBUG ROM 2, though I really don't know whether these are a part of commercial carts or if they are mapped to some part of the internal ROM, or if they're even available on a standard GBA.

Note that EWRAM, IWRAM, VRAM, OAM, Palette RAM are all initialized to zero by the BIOS (i.e. you can expect them to be zeroed at startup).

