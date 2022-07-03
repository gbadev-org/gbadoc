
# OAM (sprites)

<style>
tt {
  white-space: pre;
}
</style>

The GBA supports 128 simultaneous sprites. These can be up to 64x64 pixels in size. The OAM, which starts at `0x07000000`, has one entry for each of the 128 sprites. Intermixed with this data are the rotation/scaling attributes, of which there are 32 sets of 4 16 bit values.

Each OAM entry is 8 bytes long and has the following format:


<a id="attr0"></a>

## Bytes 1 and 2 (Attribute 0)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0
<FONT COLOR="#9900CC">S S</FONT> <FONT COLOR="#FF0099">A</FONT> <FONT COLOR="#FF3300">M</FONT>  <FONT COLOR="#008800">T T</FONT> <FONT
COLOR="#0099FF">D</FONT> <FONT COLOR="#9900CC">R</FONT> <FONT COLOR="#FF0099"> J J J J  J J J J</FONT>
</PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-7 <FONT COLOR="#FF0099">(J)</FONT></tt> | Y co-ordinate of the sprite (pixels). Note that for regular sprites, this is the y coordinate of the upper left corner. For rotate/scale sprites, this is the y coordinate of the sprite's center. center . Note on Coordinates: The values actually wrap around: to achieve a -1 y coordinate, use y = 255.
| <tt>  8 <FONT COLOR="#9900CC">(R)</FONT></tt> | Rotation/Scaling on/off 
| <tt>  9 <FONT COLOR="#0099FF">(D)</FONT></tt> | `0` = sprite is single sized; <br> `1` = sprite is virtually double sized; allowing sheared sprite pixels to overflow sprite the size (specified by bits 14 - 15 of [OAM attribute 1](#attr1)). A 16x16 sized sprite is treated internaly as a 32x32 sprite. This specification comes in evidence when rotating a sprite at 45&deg;, since the H/V size of the sprite becomes SQRT(16&sup2; + 16&sup2;) = SQRT(512) =~ 22.62 pixels. This will cause the sprite to appear clipped if this bit is set to 0.  (Thanks to Kay for the description)
| <tt>A-B <FONT COLOR="#008800">(T)</FONT></tt> | `00` = normal<br> `01` = semi-transparent<br> `10` = obj window<br> `11` = illegal code<br> Note that semi-transparent sprites appear as transparent even if [REG_BLDCNT](registers.md#REG_BLDCNT) has the sprites bit turned off.  Also note that sprites cannot be blended against one another.  For more details, see [REG_BLDCNT](registers.md#REG_BLDCNT).
| <tt>  C <FONT COLOR="#FF3300">(M)</FONT></tt> | enables mosaic for this sprite.
| <tt>  D <FONT COLOR="#FF0099">(A)</FONT></tt> | 256 color if on, 16 color if off
| <tt>E-F <FONT COLOR="#9900CC">(S)</FONT></tt> | Sprite shape. This determines the size of the sprite when combined with bits E-F of attr1. See below for more info.

<a id="attr1"></a>

## Bytes 3 and 4 (Attribute 1)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0
<FONT COLOR="#008800">S S</FONT><FONT COLOR="#0099FF"> V</FONT> <FONT COLOR="#9900CC">H</FONT>  <FONT COLOR="#BBBBBB">X X X</FONT> <FONT
COLOR="#FF0099">I  I I I I  I I I I</FONT>  (standard sprites)
<FONT COLOR="#008800">S S</FONT> <FONT COLOR="#FF3300">F F  F F F</FONT> <FONT COLOR="#FF0099">I  I I I I  I I I I </FONT> (rotation/scaling on)</PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-8 <FONT COLOR="#FF0099">(I)</FONT></tt> | X coordinate of the sprite (pixels). For regular sprites, this is the x coordinate of the upper left corner. For rotate/scale sprites, this is the x coordinate of the sprite's center.  Note on coordinates: The values actually wrap around. To achieve a -1 x, use x = 511.
| <tt>C   <FONT COLOR="#9900CC">(H)</FONT></tt> | The flip horizinal bit
| <tt>D   <FONT COLOR="#0099FF">(V)</FONT></tt> | The flip vertical bit
| <tt>9-D <FONT COLOR="#FF3300">(F)</FONT></tt> | For rotation scaling sprites, the index into the rotation data to be used for that sprite. This index can be from 0 - 31. The rotation/scaling data is located in OAM [attribute 3](#attr3) (bytes 7 and 8). However, instead of the rotation and scaling data going with the corresponding sprite, it is separated accross four sequential sprites. This index can be thought of as referencing into an array of four-sprite blocks, 32 bytes each. 
| <tt>E-F <FONT COLOR="#008800">(S)</FONT></tt> | <p>Size of the sprite. The top two bits of the size value are found in [attribute 0](#attr0) and the bottom two bits are in attribute 1. This forms a 4-bit value which sets the size of the sprite in the following way:</p><p><pre><FONT COLOR="#9900CC">00</FONT><FONT COLOR="#008800">00</FONT>: 8  x 8         <FONT COLOR="#9900CC">10</FONT><FONT COLOR="#008800">00</FONT>: 8  x 16<br><FONT COLOR="#9900CC">00</FONT><FONT COLOR="#008800">01</FONT>: 16 x 16        <FONT COLOR="#9900CC">10</FONT><FONT COLOR="#008800">01</FONT>: 8  x 32<br><FONT COLOR="#9900CC">00</FONT><FONT COLOR="#008800">10</FONT>: 32 x 32        <FONT COLOR="#9900CC">10</FONT><FONT COLOR="#008800">10</FONT>: 16 x 32<br><FONT COLOR="#9900CC">00</FONT><FONT COLOR="#008800">11</FONT>: 64 x 64        <FONT COLOR="#9900CC">10</FONT><FONT COLOR="#008800">11</FONT>: 32 x 64<br><FONT COLOR="#9900CC">01</FONT><FONT COLOR="#008800">00</FONT>: 16 x 8         <FONT COLOR="#9900CC">11</FONT><FONT COLOR="#008800">00</FONT>: Not used<br><FONT COLOR="#9900CC">01</FONT><FONT COLOR="#008800">01</FONT>: 32 x 8         <FONT COLOR="#9900CC">11</FONT><FONT COLOR="#008800">01</FONT>: Not used<br><FONT COLOR="#9900CC">01</FONT><FONT COLOR="#008800">10</FONT>: 32 x 16        <FONT COLOR="#9900CC">11</FONT><FONT COLOR="#008800">10</FONT>: Not used<br><FONT COLOR="#9900CC">01</FONT><FONT COLOR="#008800">11</FONT>: 64 x 32        <FONT COLOR="#9900CC">11</FONT><FONT COLOR="#008800">11</FONT>: Not used</pre></p>


<a id="attr2"></a>

## Bytes 5 and 6 (Attribute 2)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0
<FONT COLOR="#0099FF">L L L L</FONT>  <FONT COLOR="#9900CC">P P</FONT> <FONT COLOR="#FF0099">T T  T T T T  T T T T</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-9 <FONT COLOR="#FF0099">(T)</FONT></tt> | <p>Tile number. This value indexes selects the bitmap of the tile to be displayed by indexing into the tile data area. Each index refernces 32 bytes, so the memory address of a tile is roughly `0x06010000 + T*32`. (see [Sprite Tile Data](#sprite-tile-data) for details)</p>
| <tt>A-B <FONT COLOR="#9900CC">(P)</FONT></tt> | <p>Priority. This controls the priority of the sprite. Note that sprites take precedence over backgrounds of the same priority.  See the [description of priority](registers.md#priority) under REG_BG0 - REG_BG3 for a more detailed explanation.</p>
| <tt>C-F <FONT COLOR="#0099FF">(L)</FONT></tt> | <p>Palette number. If you use 16 color [palettes](memory.md#palette-ram), this tells you which palette number to use.</p>

<a id="attr3"></a>

## Bytes 7 and 8 (Attribute 3)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0
<FONT COLOR="#0099FF">S</FONT> <FONT COLOR="#9900CC">I I I  I I I I</FONT>  <FONT COLOR="#FF0099">F F F F  F F F F</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-7 <FONT COLOR="#FF0099">(F)</FONT></tt> | Fraction. 
| <tt>8-E <FONT COLOR="#9900CC">(I)</FONT></tt> | Integer
| <tt>  F <FONT COLOR="#0099FF">(S)</FONT></tt> | Sign bit

These bytes control sprite rotation and scaling. Instead of the rotation and scaling data going with the corresponding sprite, it is separated accross four sequential sprites. This is indexed by bits 9 - 13 in [attribute 1](#attr1). Note that these are all relative to the center of the sprite (background rotation/scaling is relative to the upper left). Starting with sprite 0 and repeating every 4 sprites, they appear in the following order:

* **Sprite 0, Attribute 3 - PA (DX)**

  Scales the sprite in the x direction by an amount equal to 1/(register value). Thus, a value of 1.0 results in the original image size, while a value of 2 is half as large, and a value of .5 is twice as large.

* **Sprite 1, Attribute 3 - PB (DMX)**

  Shears the x coordinates of the sprite over y. A value of 0 will result in no shearing, a value of 1.00 will make the image appear to be sheared left going down the screen, and a value of -1 will make the image appear sheared right going down the screen.

* **Sprite 2, Attribute 3 - PC (DY)**

  Shears the y coordinates of the sprite over x. A value of 0 will result in no shearing, a value of 1.00 will make the image appear to be sheared upwards to the right, and a value of -1 will make the image appear sheared downwards and to the right.

* **Sprite 3, Attribute 3 - PD (DMY)**

  Scales the image in the y direction by an amount equal to 1/(register value). Thus, a value of 1.0 results in the original image size, while a value of 2 is half as large, and a value of .5 is twice as large.

## To Make a Sprite Rotate and Scale

The basic form of the equations for rotating and scaling is as follows:

<pre>
  pa = x_scale * cos(angle)
  pb = y_scale * sin(angle)
  pc = x_scale * -sin(angle)
  pd = y_scale * cos(angle)</pre>

## Sprite Tile Data

The tile data area contains the actual bitmap for each tile. The sprites do not share tile data with the BG layers as on the Gameboy Color. The sprite tile data starts at `0x06010000`. All tiles are 8x8 pixels large. Sprites use the second [palette](memory.md#palette-ram) which begins at `0x05000200`. For 256 color sprites, there are 64 bytes per tile, one byte per pixel. This is an 8-bit value which is an index into the 256 color palette. For 16-color sprites, [attribute 2](#attr2) of the OAM data contains a 4 bit index into 16 16-color palettes, and sprites have 32 bytes per tile, with 4 bits per pixel. Note that the tile index references 32 bytes at a time, so in the case of 256 color sprite tiles, you will want to set your tile number to reference ever other index (i.e. 0, 2, 4, 6, etc.).

Another thing to note is that in the bitmapped modes (3-5) the memory required to hold background data is larger than 0x10000 bytes, forcing the GBA to cut away from available sprite tile data. Thus in these modes you may only reference sprites tiles of indices 512 and up.

When the sprite is larger than 8x8 pixels, multiple tiles are glued together to make the sprite's width horizontally, and then vertically. How this is done depends on whether character data is stored in 2D or 1D mode (determined by bit 6 of [DISPCNT](registers.md#REG_DISPCNT)).


### 1D Mapping

In 1D mode, tiles are stored sequentially. If you were to set up a 32x32 16-color sprite, and set the tile number to 5, the sprite would be displayed as follows:

<pre>
---------------------
| 5  | 6  | 7  | 8  |
|    |    |    |    |
---------------------
| 9  | 10 | 11 | 12 |
|    |    |    |    |
---------------------
| 13 | 14 | 15 | 16 |
|    |    |    |    |
---------------------
| 17 | 18 | 19 | 20 |
|    |    |    |    |
---------------------
</pre>

### 2D Mapping

Tiles on each row of the sprite are stored 32 slots in. Using the same 32x32 sprite above, with a tile number of 5, the sprite would be displayed as:

<pre>
---------------------
| 5  | 6  | 7  | 8  |
|    |    |    |    |
---------------------
| 37 | 38 | 39 | 40 |
|    |    |    |    |
---------------------
| 69 | 70 | 71 | 72 |
|    |    |    |    |
---------------------
| 101| 102| 103| 104|
|    |    |    |    |
---------------------
</pre>
