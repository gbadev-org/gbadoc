
# Backgrounds

<style>
tt {
  white-space: pre;
}
</style>

Depending on the current [video mode](graphics.md#video-modes), three different types of backgrounds are available. They are:

### Text Backgrounds

These are tile-based backgrounds that descend from the usage of tiles to display characters in text modes of a PC or workstation. They are made up of 8x8 tiles, the bitmaps of which are stored at the tile data address. The address of this data is set using registers [REG_BG0CNT - REG_BG3CNT](registers.md#REG_BGCNT). The [HOFS / VOFS](registers.md#REG_BGOFS) registers can be used to scroll around a larger area of up to 512x512 pixels (or 64 x 64 tiles).  
  
In text backgrounds, the data for each pixel is stored as an 8 or 4 bit palette index. In 8-bit mode, the [palette](memory.md#palette-ram) is at `0x05000000` stores a 15-bit color value for each of the 256 palette entries. In 4-bit mode, the the map index contains a 4-bit value indicating which of 16 16-color palettes to use for each tile. Each of these palettes is 32 bytes long and can be found at `0x05000000`, `0x05000020`, etc.

### Scale/Rotate Backgrounds

These backgrounds are also tile-based, and operate similarly to Text Backgrounds. However, these backgrounds may also be [scaled or rotated](registers.md#bg-rot-scale). Additionally they may only use an 8-bit palette, and can vary in size from 128 to 1024 pixels across. The palette is at `0x05000000`, and contains 256 16-bit [color entries](graphics.md#color-format)

### Bitmapped Backgrounds

These backgrounds vary depending on the [video mode](graphics.md#video-modes), but in all cases they rely on a single buffer upon which the image is drawn, either using an 8-bit palette or 16-bit color entries themsevles. Bitmap backgrounds are treated as BG2 for purposes of rotation, scaling, and blending. In the bitmap modes the frame buffer data extends into the obj tile data region, limiting it to the range from `0x06014000` - `0x06018000` (sprite indices 512 - 1024).

## Background Map Entry Format

### Text Background Map Format

The tile map, which stores the layout of the tiles on screen, begins at the tile map address found for a particular background, detrmined by [REG_BG0CNT - REG_BG3CNT](registers.md#REG_BG0). It has a selectable size up to 512x512. The tile map contains a 16-bit entry for each tile, with has the following format:

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#008800">L L L L</FONT>  <FONT COLOR="#0099FF">V</FONT> <FONT COLOR="#9900CC">H</FONT> <FONT COLOR="#FF0099">T T  T T T T  T T T T</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-9 <FONT COLOR="#FF0099">(T)</FONT></tt> | The tile number 
| <tt>  A <FONT COLOR="#9900CC">(H)</FONT></tt> | If this bit is set, the tile is flipped horizontally left to right. 
| <tt>  B <FONT COLOR="#0099FF">(V)</FONT></tt> | If this bit is set, the tile is flipped vertically upside down. 
| <tt>C-F <FONT COLOR="#008800">(L)</FONT></tt> | Palette number

For 256 x 256 and 256 x 512 backgrounds, the formula for calculating a map index is roughly,

    mapEntry = tileMapAddress[(tileY * 32) + tileX]

For text mode sizes 512 x 256 and 512 x 512 backgrounds, however, the map is 64 tiles across, and these are stored in blocks of 32 * 32 tiles. This means that to calculate the map entry that would appear 33 tiles or more across the background, the following equation should be used:

    mapEntry = tileMap[(tileY * 32) + (tileX - 32) + 32*32]

For entries 33 tiles or more down (in mode 11), use

    mapEntry = tileMap[((tileY-32) * 32) + tileX + 2*32*32]

And for entries 33 tiles or more down and 33 tiles or more across,

    mapEntry = tileMap[((tileY-32) * 32) + (tileX-32) + 3*32*32]

  
### Rotational Background Map Format

This is the same idea as the text background map format, but you only have 8 bits for each entry. The format for the tile map entries is:

<html>
<PRE style="width: min-content; margin: 16px auto">7 6 5 4 3 2 1 0 
<FONT COLOR="#FF0099">T T T T T T T T</FONT> </PRE>
</html>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-7 <FONT COLOR="#FF0099">(T)</FONT></tt> | The tile number


Rotational backgrounds do not divide tile maps into blocks.  
  
<br>

* * *

<br>
  
For specific details on the format of background data and map entries, check out the section on [REG_BG0CNT - REG_BG3CNT](registers.md#REG_BGCNT) (addresses `0x04000008` - `0x0400000E`).  

In all modes, up to 128 sprites can be displayed as well as the 4 background layers. These use the second [palette](memory.md#palette-ram) which is located at `0x05000200`. See the [OAM](sprites.md) section for details on how to display sprites.  

Both background tiles and sprites use palette entry 0 as the transparent color. Pixels in this color will not be drawn, and allow other background layers and sprites to show through.
