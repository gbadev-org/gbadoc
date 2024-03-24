# Graphics Hardware Overview

The GBA has a TFT color LCD that is 240 x 160 pixels in size and has a refresh rate of exactly 280,896 cpu cycles per frame, or around 59.73 hz. Most GBA programs will need to structure themselves around this refresh rate.

<a id="VBlank"></a>
<a id="VDraw"></a>
<a id="HBlank"></a>
<a id="HDraw"></a>

Each refresh consists of a 160 scanline vertical draw (VDraw) period followed by a 68 scanline blank (VBlank) period. Furthermore, each of these scanlines consists of a 1004 cycle draw period (HDraw) followed by a 228 cycle blank period (HBlank).

During the HDraw and VDraw periods the graphics hardware processes background and obj (sprite) data and draws it on the screen, while the HBlank and VBlank periods are left open so that program code can modify background and obj data without risk of creating graphical artifacts.

## Video Modes

Exactly what the GBA draws on screen depends largely on the current video mode (also sometimes referred to as the _screen mode_ or _graphics mode_). The GBA has 6 such modes, some of which are bitmap-based and some of which are tile-based. The video mode is set by the bottom three bits of the hardware register known as [REG_DISPCNT](registers.md#REG_DISPCNT). Background data is handled differently depending on what mode is enabled. Backgrounds can either be [text backgrounds](backgrounds.md#text-backgrounds) (tile based), [rotate-scale backgrounds](backgrounds.md#scalerotate-backgrounds) (tile based backgrounds that can be transformed), or [bitmap backgrounds](backgrounds.md#bitmapped-backgrounds). The number of sprites available on screen is also dependent on the mode; modes with tile-based backgrounds support 128 sprites, while modes with bitmapped backgrounds will only support 64 sprites.

Enabling objs and one or more backgrounds in [REG_DISPCNT](registers.md#REG_DISPCNT) will cause the GBA to draw the specified backgrounds and objs in order of priority.

### Mode 0

In this mode, four text background layers can be shown. In this mode backgrounds 0 - 3 all count as ["text"](backgrounds.md#text-backgrounds) backgrounds, and cannot be scaled or rotated. Check out the section on [text backgrounds](backgrounds.md#text-backgrounds) for details on this.

### Mode 1

This mode is similar in most respects to Mode 0, the main difference being that only 3 backgrounds are accessible -- 0, 1, and 2. Bgs 0 and 1 are [text backgrounds](backgrounds.md#text-backgrounds), while bg 2 is a [rotation/scaling](backgrounds.md#scalerotate-backgrounds) background.

### Mode 2

Like modes 0 and 1, this uses tiled backgrounds. It uses backgrounds 2 and 3, both of which are [rotate/scale backgrounds](backgrounds.md#scalerotate-backgrounds).

### Mode 3

Standard 16-bit bitmapped (non-paletted) 240x160 mode. The map starts at `0x06000000` and is `0x12C00` bytes long. See the [Color Format](#color-format) table above for the format of these bytes.

This allows the full color range to be displayed at once. Unfortunately, the frame buffer in this mode is too large for page flipping to be possible. One option to get around this would be to copy a frame buffer from work RAM into VRAM during the retrace, or (so I have heard) to use [DMA3](registers.md#REG_DMA3CNT) with the start mode bits set to 11.

### Mode 4

8-Bit paletted bitmapped mode at 240x160. The bitmap starts at either `0x06000000` or `0x0600A000`, depending on bit 4 of [REG_DISPCNT](registers.md#REG_DISPCNT). Swapping the map and drawing in the one that isn't displayed allows for page flipping techniques to be used. The palette is at `0x05000000`, and contains 256 16-bit [color entries](#color-format).

### Mode 5

This is another 16-bit bitmapped mode, but at a smaller resolution of 160x128. The display starts at the upper left hand corner of the screen, but can be shifted using the rotation and scaling registers for BG2. The advantage of using this mode is presumably that there are two frame buffers available, and this can be used to perform page flipping effects which cannot be done in mode 3 due to the smaller memory requirements of mode 5. Bit 3 of [REG_DISPCNT](registers.md#REG_DISPCNT) sets the start of the frame buffer to `0x06000000` when bit 3 is zero, and `0x0600A000` when bit 3 is one.

## Color Format

All colors (both paletted and bitmapped) are represented as a 16 bit value, using 5 bits for red, green, and blue, and ignoring bit 15. In the case of paletted memory, pixels in an image are represented as 8 bit or 4 bit indices into the [palette RAM](#Palette) starting at `0x05000000` for backgrounds and `0x05002000` for sprites. Each palette is a table consisiting of 256 16-bit color entries. In the case of the bitmapped backgrounds in modes 3 and 4, pixels are represented as the 16-bit color values themselves.

<html>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0
<FONT COLOR="#BBBBBB">X</FONT> <FONT COLOR="#0000DD">B B B  B B</FONT> <FONT COLOR="#008800">G G  G G G</FONT> <FONT
COLOR="#DD0000">R  R R R R</FONT></PRE>
<PRE>0-4 <FONT COLOR="#DD0000">(R)</FONT> = Red
5-9 <FONT COLOR="#008800">(G)</FONT> = Green
A-F <FONT COLOR="#0000DD">(B)</FONT> = Blue</PRE>
</html>
