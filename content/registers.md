# Memory-Mapped Hardware Registers

<style>
tt {
  white-space: pre;
}
</style>

The following section describes the function of each of the memory-mapped addresses in IO RAM. The register naming scheme is based on a variant of the popular [gba.h](gba.h) by Eloist (specifically, that used by Uze in the examples on his Audio Advance site).

The notation for each entry is as follows:
<div style="font-size: 85%">
<PRE style="width: min-content; margin: 16px auto">                           <FONT COLOR="#FF0000">R</FONT>       <span style="opacity:0.8">&lt;- </span>'<FONT COLOR="#FF0000">R</FONT>' <span style="opacity:0.8">means &quot;Read Only&quot;, '</span><FONT COLOR="#CC9900">W</FONT><span style="opacity:0.8">' means &quot;Write Only&quot;</span>
F E D C  B A 9 8  7 6 5 4  3 2 1 0   <span style="opacity:0.8">&lt;- These are the bits</span>
<FONT COLOR="#008800">W</FONT> <FONT COLOR="#0099FF">V</FONT> <FONT COLOR="#9900CC">U</FONT> <FONT COLOR="#FF0099">S</FONT>  <FONT
COLOR="#FF3300">L</FONT> <FONT COLOR="#008800">K</FONT> <FONT COLOR="#0099FF">J</FONT> <FONT COLOR="#9900CC">I</FONT>  <FONT
COLOR="#FF0099">F</FONT><FONT COLOR="#009999"> </FONT><FONT COLOR="#FF3300">D</FONT> <FONT COLOR="#008800">B</FONT><FONT
COLOR="#9900CC"> </FONT><FONT COLOR="#0099FF">A</FONT><FONT COLOR="#9900CC">  C</FONT> <FONT COLOR="#FF0099">M M M</FONT>   <span style="opacity:0.8">&lt;- These letters are used in the key.
                                     Entries marked with an '</span>X<span style="opacity:0.8">' usually 
                                     serve no function, are unwriteable,
                                     and remain at 0.</span></PRE>

</div>

<br>

* * *

## 0x4000000 - 0x4000054 - Graphics Hardware Registers


<a id="REG_DISPCNT"></a>

### 0x4000000 - REG_DISPCNT (The display control register)

<div>
<PRE style="width: min-content; margin: 16px auto">                           <FONT COLOR="#FF0000">R</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#008800">W</FONT> <FONT COLOR="#0099FF">V</FONT> <FONT COLOR="#9900CC">U</FONT> <FONT COLOR="#FF0099">S</FONT>  <FONT
COLOR="#FF3300">L</FONT> <FONT COLOR="#008800">K</FONT> <FONT COLOR="#0099FF">J</FONT> <FONT COLOR="#9900CC">I</FONT>  <FONT
COLOR="#FF0099">F</FONT><FONT COLOR="#009999"> </FONT><FONT COLOR="#FF3300">D</FONT> <FONT COLOR="#008800">B</FONT><FONT
COLOR="#9900CC"> </FONT><FONT COLOR="#0099FF">A</FONT><FONT COLOR="#9900CC">  C</FONT> <FONT COLOR="#FF0099">M M M</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-2 <FONT COLOR="#FF0099">(M)</FONT></tt> | The video mode. See [video modes](graphics.md#video-modes) for details.
| <tt>  3 <FONT COLOR="#9900CC">(C)</FONT></tt> | Game Boy Color mode. Read only - should stay at 0.
| <tt>  4 <FONT COLOR="#0099FF">(A)</FONT></tt> | This bit controls the starting address of the bitmap in bitmapped modes and is used for page flipping. See the description of the specific [video mode](graphics.md#video-modes) for details.
| <tt>  5 <FONT COLOR="#008800">(B)</FONT></tt> | Force processing during hblank. Setting this causes the display controller to process data earlier and longer, beginning from the end of the previous scanline up to the end of the current one. This added processing time can help prevent flickering when there are too many sprites on a scanline.
| <tt>  6 <FONT COLOR="#FF3300">(D)</FONT></tt> | Sets whether [sprites](sprites.md) stored in VRAM use 1 dimension or 2. <br> <code>0</code> = 2D: each row of tiles is stored 32x64 bytes in from the start of the previous row. <br> <code>1</code> = 1D: tiles are are stored sequentially.
| <tt>  7 <FONT COLOR="#FF0099">(F)</FONT></tt> | Force the display to go blank when set. This can be used to save power  when the display isn't needed, or to blank the screen when it is being built up (such as in mode 3, which has only one framebuffer). On the SNES, transfers rates to VRAM were improved during a forced blank; it is logical to assume that this would also hold true on the GBA.
| <tt>  8 <FONT COLOR="#9900CC">(I)</FONT></tt> | If set, enable display of BG0.
| <tt>  9 <FONT COLOR="#0099FF">(J)</FONT></tt> | If set, enable display of BG1.
| <tt>  A <FONT COLOR="#008800">(K)</FONT></tt> | If set, enable display of BG2.
| <tt>  B <FONT COLOR="#FF3300">(L)</FONT></tt> | If set, enable display of BG3.
| <tt>  C <FONT COLOR="#FF0099">(S)</FONT></tt> | If set, enable display of sprites.
| <tt>  D <FONT COLOR="#9900CC">(U)</FONT></tt> | Enable Window 0  |
| <tt>  E <FONT COLOR="#0099FF">(V)</FONT></tt> | Enable Window 1  |
| <tt>  F <FONT COLOR="#008800">(W)</FONT></tt> | Enable Sprite Windows  |


<a id="REG_DISPSTAT"></a>

### 0x4000004 - REG_DISPSTAT

<div>
<PRE style="width: min-content; margin: 16px auto">                <FONT COLOR="#FF0000">      </FONT>       <FONT COLOR="#FF0000">R R R</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#9900CC">T T T T  T T T T</FONT>  X X<FONT COLOR="#663300"> </FONT><FONT
COLOR="#FF0099">Y</FONT> <FONT COLOR="#FF3300">H</FONT>  <FONT COLOR="#008800">V</FONT> <FONT COLOR="#0099FF">Z</FONT> <FONT
COLOR="#9900CC">G</FONT> <FONT COLOR="#FF0099">W</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>  0 <FONT COLOR="#FF0099">(W)</FONT></tt> | V Refresh status. This will be 0 during VDraw, and 1 during VBlank.  VDraw lasts for 160 scanlines; VBlank follows after that and lasts 68 scanlines. Checking this is one alternative to checking [REG_VCOUNT](#REG_VCOUNT).
| <tt>  1 <FONT COLOR="#9900CC">(G)</FONT></tt> | H Refresh status. This will be 0 during HDraw, and 1 during HBlank HDraw lasts for approximately 1004 cycles; HBlank follows, and lasts approximately 228 cycles, though the time and length of HBlank may in fact vary based on the number of sprites and on rotation/scaling/blending effects being performed on the current line.
| <tt>  2 <FONT COLOR="#0099FF">(Z)</FONT></tt> | VCount Triggered Status. Gets set to 1 when a Y trigger interrupt occurs. 
| <tt>  3 <FONT COLOR="#008800">(V)</FONT></tt> | Enables LCD's VBlank [IRQ](interrupts.md). This interrupt goes off at the start of VBlank. 
| <tt>  4 <FONT COLOR="#FF3300">(H)</FONT></tt> | Enables LCD's HBlank [IRQ](interrupts.md). This interrupt goes off at the start of HBlank. 
| <tt>  5 <FONT COLOR="#FF0099">(Y)</FONT></tt> | Enable VCount trigger [IRQ](interrupts.md). Goes off when VCount line trigger is reached. 
| <tt>8-F <FONT COLOR="#9900CC">(T)</FONT></tt> | Vcount line trigger. Set this to the VCount value you wish to trigger an interrupt.


<a id="REG_VCOUNT"></a>

### 0x4000006 - LCY / REG_VCOUNT (Read Only)

This location stores the current y location of the LCD hardware. It is incremented as the lines are drawn. The 160 lines of display are followed by 68 lines of Vblank period, before the whole thing starts again for the next frame. Waiting for this register to reach 160 is one way to synchronize a program to 60Hz.

## 0x4000008 - 0x400001E - Background Registers


<a id="REG_BGCNT"></a>

### 0x4000008 - REG_BG0CNT <br> 0x400000A - REG_BG1CNT <br> 0x400000C - REG_BG2CNT <br> 0x400000E - REG_BG3CNT

These addresses set up the four background layers. The format is:

<div>
<PRE style="width: min-content; margin: 16px auto">    <FONT COLOR="#DD0000">?</FONT>             
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#9900CC">Z Z</FONT> <FONT COLOR="#FF0099">V</FONT> <FONT COLOR="#FF3300">M  M M M M</FONT> <FONT COLOR="#008800"> A</FONT> <FONT
COLOR="#0099FF">C</FONT> X X  <FONT COLOR="#9900CC">S S</FONT> <FONT COLOR="#FF0099">P P</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-1 <FONT COLOR="#FF0099">(P)</FONT></tt> | <p id="priority">Priority: `00` = highest, `11` = lowest</p><p>Priorities are ordered as follows: <pre>"Front" <br> 1. Sprite with priority 0 <br> 2. BG with     priority 0 <br> 3. Sprite with priority 1 <br> 4. BG with     priority 1 <br> 5. Sprite with priority 2 <br> 6. BG with     priority 2 <br> 7. Sprite with priority 3 <br> 8. BG with     priority 3 <br> 9. Backdrop <br> "Back"</pre></p> <p>When multiple backgrounds have the same priority, the order from front to back is:  BG0, BG1, BG2, BG3.  Sprites of the same priority are ordered similarly, with the first sprite in OAM appearing in front. </p>
| <tt>2-3 <FONT COLOR="#9900CC">(S)</FONT></tt> | Starting address of character tile data <br> Address = 0x6000000 + S \* 0x4000
| <tt>  6 <FONT COLOR="#0099FF">(C)</FONT></tt> | Mosiac effect - 1 on, 0 off
| <tt>  7 <FONT COLOR="#008800">(A)</FONT></tt> | [Color palette](memory.md#palette-ram) type - <br>1 - standard 256 color pallete <br>0 - each tile uses one of 16 different 16 color palettes (no effect on rotates/scale backgrounds, which are always 256 color)
| <tt>8-C <FONT COLOR="#FF3300">(M)</FONT></tt> | Starting address of character tile map Address = 0x6000000 + M \* 0x800
| <tt>  D <FONT COLOR="#FF0099">(V)</FONT></tt> | Screen Over. Used to determine whether [rotational backgrounds](backgrounds.md#scalerotate-backgrounds) get tiled repeatedly at the edges or are displayed as a single "tile" with the area outside transparent. This is forced to 0 (read only) for backgrounds  0 and 1 (only).
| <tt>E-F <FONT COLOR="#9900CC">(Z)</FONT></tt> | <p>Size of tile map </p><p>For ["text" backgrounds](backgrounds.md#text-backgrounds): </p><p>`00` = 256x256 (32x32 tiles)  <br>`01` = 512x256 (64x32 tiles)  <br>`10` = 256x512 (32x64 tiles)  <br>`11` = 512x512 (64x64 tiles)</p> <p>For [rotational backgrounds](backgrounds.md#scalerotate-backgrounds):</p><p>`00` = 128x128 (16x16 tiles)  <br>`01` = 256x256 (32x32 tiles)  <br>`10` = 512x512 (64x64 tiles) <br>`11` = 1024x1024 (128x128 tiles)</p>


<a id="REG_BGOFS"></a>
<a id="REG_BGHOFS"></a>
<a id="REG_BGHOFS"></a>
<a id="REG_BG0HOFS"></a>
<a id="REG_BG0VOFS"></a>
<a id="REG_BG0HOFS"></a>
<a id="REG_BG1VOFS"></a>
<a id="REG_BG1HOFS"></a>
<a id="REG_BG2VOFS"></a>
<a id="REG_BG2HOFS"></a>
<a id="REG_BG3VOFS"></a>
<a id="REG_BG3HOFS"></a>

### 0x4000010 - REG_BG0HOFS Horizontal scroll co-ordinate for BG0 (Write Only) <br> 0x4000012 - REG_BG0VOFS Vertical scroll co-ordinate for BG0 (Write Only) <br> 0x4000014 - REG_BG1HOFS Horizontal scroll co-ordinate for BG1 (Write Only) <br> 0x4000016 - REG_BG1VOFS Vertical scroll co-ordinate for BG1 (Write Only) <br> 0x4000018 - REG_BG2HOFS Horizontal scroll co-ordinate for BG2 (Write Only) <br> 0x400001A - REG_BG2VOFS Vertical scroll co-ordinate for BG2 (Write Only) <br> 0x400001C - REG_BG3HOFS Horizontal scroll co-ordinate for BG3 (Write Only) <br> 0x400001E - REG_BG3VOFS Vertical scroll co-ordinate for BG3 (Write Only)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X X  X X <FONT COLOR="#FF0099">S S  S S S S  S S S S</FONT> </PRE>
<PRE>0-9<FONT COLOR="#FF0099"> (S)</FONT> = Scroll value (pixels) </PRE>
</div>


These registers are only effective for [text backgrounds](backgrounds.md#text-backgrounds); they set the pixel that is displayed in the top left hand corner of the GBA's display. In other words, a value of -5, -5 puts the upper left hand corner of your background at x=5,y=5. All four BG planes wrap when they reach their right or bottom edges.

* * *

<a id="bg-rot-scale"></a>

## 0x4000020 - 0x4000026 / 0x4000030 - 0x4000036 - Background Rotation/Scaling Registers (Write Only)

These registers affect the translation, rotation, and scaling of tile-based [rotate/scale backgrounds](backgrounds.md#scalerotate-backgrounds) as well as the [bitmapped backgrounds](backgrounds.md#bitmapped-backgrounds) (which should be treated as BG2 for this purpose). The function of these registers is very hard to describe in words but easy to see the effects of on screen. I highly recommend checking out Stephen Stair's RSDemo - it lets you see the contents of the regs as you modify them as well as the effect they have on the background. Should also be somewhat useful for figuring out sprite rotation and scaling.


<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#0099FF">S</FONT> <FONT COLOR="#9900CC">I I I  I I I I</FONT> <FONT COLOR="#FF0099"> F F F F  F F F F</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-7 <FONT COLOR="#FF0099">(F)</FONT></tt> | Fraction 
| <tt>8-E <FONT COLOR="#9900CC">(I)</FONT></tt> | Integer 
| <tt>  F <FONT COLOR="#0099FF">(S)</FONT></tt> | Sign bit 

These registers apply only to [Rotate/Scale backgrounds](backgrounds.md#scalerotate-backgrounds). Individual descriptions follow:

### 0x4000020 - REG_BG2PA (BG2 Read Source Pixel X Increment) (Write Only) <br> 0x4000030 - REG_BG3PA (BG3 Read Source Pixel X Increment) (Write Only)

The effect of these registers is to scale the background (relative to the upper left corner) in the x direction by an amount equal to 1/(register value).

### 0x4000022 - REG_BG2PB (BG2 Write Destination Pixel X Increment) (Write Only) <br> 0x4000032 - REG_BG3PB (BG3 Write Destination Pixel X Increment) (Write Only)

The effect of these registers is to shear the x coordinates of the background over y, relative to the upper left corner. A value of 0 will result in no shearing, a value of 1.00 will make the background appear to be sheared left as you go down the screen, and a value of -1 will make the background appear sheared right as you go down the screen.

### 0x4000024 - REG_BG2PC (BG2 Read Source Pixel Y Increment) (Write Only) <br> 0x4000034 - REG_BG3PC (BG3 Read Source Pixel Y Increment) (Write Only)

The effect of these registers is to shear the y coordinates of the background over x, relative to the upper left corner. A value of 0 will result in no shearing, a value of 1.00 will make the background appear to be sheared upwards to the right, and a value of -1 will make the background appear sheared downwards and to the right.

### 0x4000026 - REG_BG2PD (BG2 Write Destination Pixel Y Increment) (Write Only) <br> 0x4000036 - REG_BG3PD (BG3 Write Destination Pixel Y Increment) (Write Only)

The effect of these registers is to scale the background in the y direction (relative to the upper left corner) by an amount equal to 1/(register value).


* * *


### 0x4000028 - REG_BG2X (X Coordinate for BG2 Rotational Background) (Write Only) <br> 0x4000038 - REG_BG3X (X Coordinate for BG3 Rotational Background) (Write Only)

### 0x400002C - REG_BG2Y (Y Coordinate for BG2 Rotational Background) (Write Only) <br> 0x400003C - REG_BG3Y (Y Coordinate for BG3 Rotational Background) (Write Only)

<div>
<PRE style="width: min-content; margin: 16px auto">31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 9 8  7 6 5 4  3 2 1 0
X  X  X  X  <FONT COLOR="#0099FF"> S</FONT>  <FONT COLOR="#9900CC">I  I  I   I  I  I  I   I  I  I  I   I  I  I  I   I  I  I I</FONT> <FONT
COLOR="#9900CC"> </FONT><FONT COLOR="#FF0099">F F F F  F F F F</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt> 0-7<FONT COLOR="#FF0099">(F)</FONT></tt> | Fraction 
| <tt>8-26<FONT COLOR="#9900CC">(I)</FONT></tt> | Integer 
| <tt>  27<FONT COLOR="#0099FF">(S)</FONT></tt> | Sign bit


These registers define the location of the pixel that appears at 0,0. They are very similar to the background scrolling registers, [REG_HOFS](#REG_BGHOFS) and [REG_VOFS](#REG_BGVOFS), which become disabled when a [rotate/ scale background](backgrounds.md#scalerotate-backgrounds) is in use.



* * *

## 0x4000040 - 0x400004A - Windowing Registers

<a id="REG_WIN0H"></a>
<a id="REG_WIN1H"></a>

### 0x4000040 - REG_WIN0H Window 0 X Coordinates) (Write Only) <br> 0x4000042 - REG_WIN1H Window 1 X Coordinates) (Write Only)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#9900CC">L L L L  L L L L</FONT> <FONT COLOR="#FF0099"> R R R R  R R R R</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-7 <FONT COLOR="#FF0099">(R)</FONT></tt> | X coordinate for the rightmost side of the window 
| <tt>8-F <FONT COLOR="#9900CC">(L)</FONT></tt> | X coordinate for the leftmost side of the window 


<a id="REG_WIN0V"></a>
<a id="REG_WIN1V"></a>

### 0x4000044 - REG_WIN0V Window 0 Y Coordinates) (Write Only) <br> 0x4000046 - REG_WIN1V Window 1 Y Coordinates) (Write Only)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#9900CC">T T T T  T T T T</FONT>  <FONT COLOR="#FF0099">B B B B  B B B B</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-7 <FONT COLOR="#FF0099">(B)</FONT></tt> | Y coordinate for the bottom of the window 
| <tt>8-F <FONT COLOR="#9900CC">(T)</FONT></tt> | Y coordinate for the top of the window 



<a id="REG_WININ"></a>

### 0x4000048 - REG_WININ (Inside Window Settings)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X <FONT COLOR="#9900CC">T</FONT> <FONT COLOR="#FF0099">S</FONT> <FONT COLOR="#FF3300"> R</FONT> <FONT
COLOR="#008800">Q</FONT> <FONT COLOR="#0099FF">P</FONT> <FONT COLOR="#9900CC">O</FONT>  X X <FONT
COLOR="#FF0099">L</FONT> <FONT COLOR="#FF3300">K</FONT>  <FONT COLOR="#008800">J</FONT> <FONT COLOR="#0099FF">I</FONT> <FONT
COLOR="#9900CC">H</FONT> <FONT COLOR="#FF0099">G</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0 <FONT COLOR="#FF0099">(G)</FONT></tt> | BG0 in win0 
| <tt>1 <FONT COLOR="#9900CC">(H)</FONT></tt> | BG1 in win0 
| <tt>2 <FONT COLOR="#0099FF">(I)</FONT></tt> | BG2 in win0 
| <tt>3 <FONT COLOR="#008800">(J)</FONT></tt> | BG3 in win0 
| <tt>4 <FONT COLOR="#FF3300">(K)</FONT></tt> | Sprites in win0 
| <tt>5 <FONT COLOR="#FF0099">(L)</FONT></tt> | Blends in win0 
| <tt>8 <FONT COLOR="#9900CC">(O)</FONT></tt> | BG0 in win1 
| <tt>9 <FONT COLOR="#0099FF">(P)</FONT></tt> | BG1 in win1 
| <tt>A <FONT COLOR="#008800">(Q)</FONT></tt> | BG2 in win1 
| <tt>B <FONT COLOR="#FF3300">(R)</FONT></tt> | BG3 in win1 
| <tt>C <FONT COLOR="#FF0099">(S)</FONT></tt> | Sprites in win1 
| <tt>D <FONT COLOR="#9900CC">(T)</FONT></tt> | Blends in win1


<a id="REG_WINOUT"></a>

### 0x400004A - REG_WINOUT (Outside Window and Sprite Window)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X <FONT COLOR="#9900CC">T</FONT> <FONT COLOR="#FF0099">S</FONT> <FONT COLOR="#FF3300"> R</FONT> <FONT
COLOR="#008800">Q</FONT> <FONT COLOR="#0099FF">P</FONT> <FONT COLOR="#9900CC">O</FONT>  X X <FONT
COLOR="#FF0099">L</FONT> <FONT COLOR="#FF3300">K</FONT> <FONT COLOR="#008800"> J</FONT> <FONT COLOR="#0099FF">I</FONT> <FONT
COLOR="#9900CC">H</FONT> <FONT COLOR="#FF0099">G</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| 0 <FONT COLOR="#FF0099">(G)</FONT></tt> | BG0 outside
| 1 <FONT COLOR="#9900CC">(H)</FONT></tt> | BG1 outside 
| 2 <FONT COLOR="#0099FF">(I)</FONT></tt> | BG2 outside 
| 3 <FONT COLOR="#008800">(J)</FONT></tt> | BG3 outside 
| 4 <FONT COLOR="#FF3300">(K)</FONT></tt> | Sprites in win0 
| 5 <FONT COLOR="#FF0099">(L)</FONT></tt> | Blends in win0 
| 8 <FONT COLOR="#9900CC">(O)</FONT></tt> | BG0 in sprite win 
| 9 <FONT COLOR="#0099FF">(P)</FONT></tt> | BG1 in sprite win 
| A <FONT COLOR="#008800">(Q)</FONT></tt> | BG2 in sprite win 
| B <FONT COLOR="#FF3300">(R)</FONT></tt> | BG3 in sprite win 
| C <FONT COLOR="#FF0099">(S)</FONT></tt> | Sprites in sprite win 
| D <FONT COLOR="#9900CC">(T)</FONT></tt> | Blends in sprite win 

<br>
<br>

* * *

## 0x400004C - 0x4000054 - Effects Registers


### 0x400004C - REG_MOSAIC (Write Only)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#008800">V V V V</FONT> <FONT COLOR="#0099FF"> U U U U</FONT>  <FONT COLOR="#9900CC">J J J J</FONT> <FONT
COLOR="#FF0099"> I I I I</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-3 <FONT COLOR="#FF0099">(I)</FONT></tt> | BG X Size 
| <tt>4-7 <FONT COLOR="#9900CC">(J)</FONT></tt> | BG Y Size 
| <tt>8-B <FONT COLOR="#0099FF">(U)</FONT></tt> | Sprite X Size 
| <tt>C-F <FONT COLOR="#008800">(V)</FONT></tt> | Sprite Y Size 


Use this register to control the size of the mosaic on backgrounds/sprites that have mosaic enabled..



<a id="REG_BLDCNT"></a>

### 0x4000050 - REG_BLDCNT

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X <FONT COLOR="#0099FF">T</FONT> <FONT COLOR="#9900CC">S</FONT> <FONT COLOR="#FF0099"> R</FONT> <FONT
COLOR="#FF3300">Q</FONT> <FONT COLOR="#008800">P</FONT> <FONT COLOR="#0099FF">O</FONT> <FONT COLOR="#9900CC"> M M</FONT> <FONT
COLOR="#FF0099">L</FONT> <FONT COLOR="#FF3300">K</FONT>  <FONT COLOR="#008800">J</FONT> <FONT COLOR="#0099FF">I</FONT> <FONT
COLOR="#9900CC">H</FONT> <FONT COLOR="#FF0099">G</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>  0 <FONT COLOR="#FF0099">(G)</FONT></tt> | Blend BG0 (source) 
| <tt>  1 <FONT COLOR="#9900CC">(H)</FONT></tt> | Blend Bg1 (source) 
| <tt>  2 <FONT COLOR="#0099FF">(I)</FONT></tt> | Blend BG2 (source) 
| <tt>  3 <FONT COLOR="#008800">(J)</FONT></tt> | Blend BG3 (source) 
| <tt>  4 <FONT COLOR="#FF3300">(K)</FONT></tt> | Blend sprites (source) 
| <tt>  5 <FONT COLOR="#FF0099">(L)</FONT></tt> | Blend backdrop (source) 
| <tt>6-7 <FONT COLOR="#9900CC">(M)</FONT></tt> | <p>Blend Mode</p><p>There are four different modes:</p><p><code>00</code> = All effects off <br><code>01</code> = Alpha blend <br><code>10</code> = Lighten (fade to white) <br><code>11</code> = Darken (fade to black)</p>
| <tt>  8 <FONT COLOR="#0099FF">(O)</FONT></tt> | Blend BG0 (target) 
| <tt>  9 <FONT COLOR="#008800">(P)</FONT></tt> | Blend BG1 (target) 
| <tt>  A <FONT COLOR="#FF3300">(Q)</FONT></tt> | Blend BG2 (target) 
| <tt>  B <FONT COLOR="#FF0099">(R)</FONT></tt> | Blend BG3 (target) 
| <tt>  C <FONT COLOR="#9900CC">(S)</FONT></tt> | Blend sprites (target)
| <tt>  D <FONT COLOR="#0099FF">(T)</FONT></tt> | Blend backdrop (target)

Use this register to determine the blending mode and which layer(s) you wish to perform blending on. In the case of alpha blends (Mode 01), specify the layers that are "on top" using the source flags (bits 0 - 5) and the layers that are on the bottom using the target flags (bits 8-13). The target layer must be below the source layer in terms of its [priority](#priority), or the blend will not take effect.

Other things to note about alpha blends:

* If there is more than one target layer, the blend will only occur for a target with lower priority in areas where it shows through targets of higher priority due to the transparent pixel being set
* Source layers will only blend with areas of a target layer that are visible beneath them. If another layer is blocking the way (even if it is another source layer), there will be no blend and the original source color will be drawn.
* As a result of these two conditions, it is never possible for any given pixel to be a blend of more than 2 layers. This eliminates the possiblity of using these registers to have 3 or more layers of translucent graphics showing through one another.
* A layer cannot blend with itself.
* If an obj has semi-transparency enabled, it will blend normally (as if it were specified as a source layer)
* Unfortunately, it is not possible to alpha blend sprites against one another, no matter how your prioritize them. Alpha blended sprites that are "in front of" other sprites will blend with the other target layers while still occluding the sprites behind them (i.e. it will look like the portion of the non-blended sprite that is behind the blended one has disappeared), for a most unnatural effect.



### 0x4000052 - REG_BLDALPHA (Write Only)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X <FONT COLOR="#9900CC">B  B B B B</FONT>  X X X <FONT
COLOR="#FF0099">A  A A A A</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-4 <FONT COLOR="#FF0099">(A)</FONT></tt> | Coefficient A, the source pixel (layer above)
| <tt>8-C <FONT COLOR="#9900CC">(B)</FONT></tt> | Coefficient B, the target pixel (layer below)

Use this in conjunction with [REG_BLDCNT](#REG_BLDCNT) to determine the amount of blending between layers. An unblended pixel of normal intensity is is considered to have a coefficient of 16. Coefficient A and Coefficient B determine the ratio of each of the sources that will get mixed into the final image. Thus, if A is 12 and B is 4, the resulting image will appear to be 12/16 the color of A and 4/16 the color of B. Note that A and B can add up to be greater than 16 (for an additive or brightening effect) or less than 16 (for a darkening effect).


### 0x4000054 - REG_BLDY (Write Only)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X X  X X X X  X X X <FONT COLOR="#FF0099">F  F F F F</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-4 <FONT COLOR="#FF0099">(F)</FONT></tt> | The lighten/darken value 

This is the amount by which to lighten or darken the source layers (as specified in [REG_BLDCNT](#REG_BLDCNT)) .
The higher the value, the greater the fade. 16 is the peak fade value; values from 16 - 31 shade the layer with either pure black (for a darken) or pure white (for a lighten).


* * *

<a id="sound-control"></a>

## 0x040000060 - 0x0400000A6 (Sound Controls)

Note: I've obtained this info (most of it verbatim) from Uze's [BeLogic](http://belogic.com/gba/) unofficial GBA sound info site, which gives a much more thorough explanation as well as some sample source code and demos. Thanks to Uze for providing such a great resource on GBA sound.


<a id="REG_SOUND1CNT_L"></a>

### 0x04000060 - REG_SOUND1CNT_L (Sound 1 Sweep control)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X X  X X X X  X <FONT COLOR="#0099FF">T T T</FONT> <FONT COLOR="#9900CC"> A</FONT> <FONT
COLOR="#FF0099">S S<B> </B>S</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-2 <FONT COLOR="#FF0099">(S)</FONT></tt> | <p>Number of sweep shifts. These control the amount of change in  frequency (either increase or decrease) at each change. The wave's new period is given by: T=T±T/(2n), where _n_ is the sweep shift's value.</p>
| <tt>  3 <FONT COLOR="#9900CC">(A)</FONT></tt> | <p>Sweep increase or decrease. When decrementing, if the frequency value gets smaller than zero, the previous value is retained. When incrementing, if the frequency gets greater than the maximum frequency (131Khz or 2048 for the register value) the sound stops.</p><p>`0` = Addition (frequency increase)<br>`1` = Subtraction (frequency decrease)</p>
| <tt>4-6 <FONT COLOR="#0099FF">(T)</FONT></tt> | <p>Sweep Time. This is the delay between sweep shifts. After each delay, the frequency increments or decrements.</p> <p>`000`:  Disable sweep function <br>`001`:  Ts=1 / 128khz (7.8 ms) <br>`010`:  Ts=2 / 128khz (15.6 ms) <br>`011`:  Ts=3 / 128 khz (23.4 ms) <br>`100`:  Ts=4 / 128 khz (31.3 ms) <br>`101`:  Ts=5 / 128 khz (39.1 ms) <br>`110`:  Ts=6 / 128 khz (46.9 ms) <br>`111`:  Ts=7 / 128 khz (54.7 ms)</p>

Sound channel 1 produces a square wave with envelope and frequency sweep functions. This register controls the frequency sweep function. When the sweep function is not required, set the sweep time to zero and set the increase/decrease bit to 1.


<a id="REG_SOUND1CNT_H"></a>

### 0x04000062 - REG_SOUND1CNT_H (Sound 1 Length, wave duty and envelope control)


<div>
<PRE style="width: min-content; margin: 16px auto">                    <FONT COLOR="#CC9900">  W W  W W W W</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#FF3300">I I I I</FONT> <FONT COLOR="#008800"> M</FONT> <FONT COLOR="#0099FF">T T T</FONT>  <FONT
COLOR="#9900CC">D D</FONT> <FONT COLOR="#FF0099">L L  L L L L</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-5 <FONT COLOR="#FF0099">(L)</FONT></tt> | <p>Sound length. This is a 6 bit value obtained from the following formula:</p><p>`Sound length = (64-register value)*(1/256) seconds`</p><p>After the sound length has been changed, the sound channel must be resetted via bit `F` of [REG_SOUND1CNT_X](#REG_SOUND1CNT_X) (when using timed mode).</p>
| <tt>6-7 <FONT COLOR="#9900CC">(D)</FONT></tt> | <p>Wave duty cycle. This controls the percentage of the ON state of the square wave.</p><p>`00` = 12.5%<br> `01` = 25%<br> `10` = 50%<br> `11` = 75%</p>
| <tt>8-A <FONT COLOR="#0099FF">(T)</FONT></tt> | <p>Envelope step time. This is the delay between successive envelope increase or decrease. It is given by the following formula:</p><p>`Time = register value * (1/64) seconds`</p>
| <tt>  B <FONT COLOR="#008800">(M)</FONT></tt> | <p>Envelope mode. Controls if the envelope is to increase or decrease in volume over time.</p><p>`0` = Envelope decreases<br>`1` = Envelope increases</p>
| <tt>C-F <FONT COLOR="#FF3300">(I)</FONT></tt> | <p>Initial Envelope value. `1111` produces the maximum volume and `0000` mutes the sound. When sound 1 is playing, modifying the volume envelope bits has no effect until the sound is resetted.</p>


<a id="REG_SOUND1CNT_X"></a>

### 0x04000064 - REG_SOUND1CNT_X (Sound 1 Frequency, reset and loop control)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#CC9900">W</FONT>         <FONT COLOR="#CC9900"> W W W  W W W W  W W W W</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#0099FF">R</FONT> <FONT COLOR="#9900CC">T</FONT> X X  X <FONT COLOR="#FF0099">F F F  F F F F  F F F F</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-A <FONT COLOR="#FF0099">(F)</FONT></tt> | <p>Sound frequency. The minimum frequency is 64Hz and the maximum is 131Khz. Can be calculated from the following formula: </p><p>`F(hz) = 4194304 / (32 * (2048-register value))`</p>
| <tt>  E <FONT COLOR="#9900CC">(T)</FONT></tt> | <p>Timed sound. When set to 0, sound 1 is played continuously regardless of the length data in [REG_SOUND1CNT_H](#REG_SOUND1CNT_H). When set to 1, sound is played for that specified length and after that, bit 0 of [REG_SOUNDCNT_X](#REG_SOUNDCNT_X) is reset.</p>
| <tt>  F <FONT COLOR="#0099FF">(R)</FONT></tt> | <p>Sound reset. When set, sound resets and restarts at the specified frequency. When sound 1 is playing, modifying the volume envelope bits has no effect until the sound is resetted. Frequency and sound reset must be perfomed in a single write since both are write only. Frequency can always be changed without resetting the sound channel. </p>


<a id="REG_SOUND2CNT_L"></a>

### 0x04000068 - REG_SOUND2CNT_L (Sound 2 Length, wave duty and envelope control)

<div>
<PRE style="width: min-content; margin: 16px auto">                     <FONT COLOR="#CC9900"> W W  W W W W</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#FF3300">I I I I</FONT> <FONT COLOR="#008800"> M</FONT> <FONT COLOR="#0099FF">T T T</FONT> <FONT COLOR="#9900CC"> D D</FONT> <FONT
COLOR="#FF0099">L L  L L L L</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-5 <FONT COLOR="#FF0099">(L)</FONT></tt> | <p>Sound length. This is a 6 bit value obtained from the following formula:</p><p>`Sound length = (64-register value)*(1/256) seconds`.</p><p>After the sound length has been changed, the sound channel must be resetted via bit F of [REG_SOUND1CNT_X](#REG_SOUND2CNT_H) (when using timed mode).</p>
| <tt>6-7 <FONT COLOR="#9900CC">(D)</FONT></tt> | <p>Wave duty cycle. This controls the percentage of the ON state of the square wave.</p><p>`00` = 12.5%<br>`01` = 25%<br>`10` = 50%<br>`11` = 75%</p>
| <tt>8-A <FONT COLOR="#0099FF">(T)</FONT></tt> | <p>Envelope step time. This is the delay between successive envelope increase or decrease. It is given by the following formula:</p><p>`Time = register value * (1/64) seconds`.</p>
| <tt>  B <FONT COLOR="#008800">(M)</FONT></tt> | <p>Envelope mode. Controls if the envelope is to increase or decrease in volume over time.</p><p>`0` = Envelope decreases<br>`1` = Envelope increases</p>
| <tt>C-F <FONT COLOR="#FF3300">(I)</FONT></tt> | <p>Initial Envelope value. `1111` produces the maximum volume and `0000` mutes the sound. When sound 2 is playing, modifying the volume envelope bits has no effect until the sound is resetted.</p>


<a id="REG_SOUND2CNT_H"></a>

### 0x0400006C- REG_SOUND2CNT_H (Sound 2 Frequency, reset and loop control)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#CC9900">W</FONT>       <FONT COLOR="#CC9900">   W W W  W W W W  W W W W</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#0099FF">R</FONT> <FONT COLOR="#9900CC">T</FONT> X X  X <FONT COLOR="#FF0099">F F F  F F F F  F F F F</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-A <FONT COLOR="#FF0099">(F)</FONT></tt> | <p>Sound frequency. The minimum frequency is 64Hz and the maximum is 131Khz. Can be calculated from the following formula:</p><p>`F(hz) = 4194304 / (32 * (2048-register value))`</p>
| <tt>  E <FONT COLOR="#9900CC">(T)</FONT></tt> | <p>Timed sound. When set to 0, sound 2 is played continuously regardless of the length data in [REG_SOUND2CNT_L](#REG_SOUND2CNT_L). When set to 1, sound is played for that specified length and after that, bit 1 of [REG_SOUNDCNT_X](#REG_SOUNDCNT_X) is reset.</p>
| <tt>  F <FONT COLOR="#0099FF">(R)</FONT></tt> | <p>Sound reset. When set, sound resets and restarts at the specified frequency. When sound 2 is playing, modifying the volume envelope bits has no effect until the sound is resetted. Frequency and sound reset must be perfomed in a single write since both are write only. Frequency can always be changed without resetting the sound channel.</p>


<a id="REG_SOUND3CNT_L"></a>

### 0x04000070 - REG_SOUND3CNT_L (Sound 3 Enable and wave ram bank control)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X X  X X X X <FONT COLOR="#0099FF"> N</FONT> <FONT COLOR="#9900CC">S</FONT> <FONT
COLOR="#FF0099">M</FONT> X  X X X X</PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>5 <FONT COLOR="#FF0099">(M)</FONT></tt> | Bank Mode (`0` = 2 x 32 sample banks, `1` = 1 x 64 sample bank)
| <tt>6 <FONT COLOR="#9900CC">(S)</FONT></tt> | Bank Select. Controls which bank is active for playing/reloading. If set to 0, samples are played from bank 0 and writing to the Wave Ram will store the data in Bank 1, and vice-versa.
| <tt>7 <FONT COLOR="#0099FF">(N)</FONT></tt> | Sound Channel 3 output enable. When this is set and bit 15 from [REG_SOUND3CNT_X](#REG_SOUND3CNT_X) is set, the sound starts to play.

Sound channel 3 is a circuit that can produce an arbitrary wave pattern. Samples are 4 bit, 8 samples per word, and are located in [Wave Ram registers](#REG_WAVE_RAM0_L) from 0x400090 to 0x40009F. The Wave Ram is banked, providing the ability to play a 64 samples pattern or to select between two 32 samples patterns (Bit 5). Sound channel 3 always produces some audio artifacts (distortion) when sound is initialized. Fortunately, switching banks does not require re-initialisation during playback, thus allowing for dynamic reloading of the Wave Ram without generating any distortion.

Both banks of Wave Ram are filled with zero upon initialization of the Gameboy, Bank 0 being selected. So writing to bank 0 implies setting bit 6 to 1 before loading Wave Ram then set it back to 0 to play it.


<a id="REG_SOUND3CNT_H"></a>

### 0x04000072 - REG_SOUND3CNT_H (Sound 3 Sound length and output level control)

<div>
<PRE style="width: min-content; margin: 16px auto">                  <FONT COLOR="#CC9900">W W W W  W W W W</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#9900CC">R R R</FONT> X  X X X X <FONT COLOR="#FF0099"> L L L L  L L L L</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-7 <FONT COLOR="#FF0099">(L)</FONT></tt> | <p>Sound length. The sound length is an 8 bit value obtained from the following formula:</p> <p>`Register = Note length (in seconds) * 256`</p> <p>Hence a 1 second maximum and a 3.9 millisecond minimum sound duration. After the sound length has be changed, the sound channel must be resetted via bit F of [REG_SOUND3CNT_X](#REG_SOUNDCNT_X).</p>
| <tt>D-F <FONT COLOR="#9900CC">(R)</FONT></tt> | <p>Output volume ratio:</p><p>`000` = Mute<br>`001` = 100%<br>`100` = 75%<br>`010` = 50%<br>`011` = 25%</p>


<a id="REG_SOUND3CNT_X"></a>

### 0x04000074 - REG_SOUND3CNT_X (Sound 3 Frequency, reset and loop control)

<div>
<PRE><FONT COLOR="#CC9900">W</FONT>          <FONT COLOR="#CC9900">W W W  W W W W  W W W W</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#0099FF">R</FONT> <FONT COLOR="#9900CC">T</FONT> X X  X <FONT COLOR="#FF0099">F F F  F F F F  F F F F</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-A <FONT COLOR="#FF0099">(F)</FONT></tt> | <p>Sound frequency. The minimum frequency is 64Hz and the maximum is 131Khz. Can be calculated from the following formula:</p><p>`F(hz) = 4194304 / (32 * (2048-register value))`</p>
| <tt>  E <FONT COLOR="#9900CC">(T)</FONT></tt> | <p>Timed sound. When set to 0, sound 3 is played continuously regardless of the length data in [REG_SOUND3CNT_H](#REG_SOUND3CNT_H). When set to 1, sound is played for that specified length and after that, bit 2 of [REG_SOUNDCNT_X](#REG_SOUNDCNT_X) is reset.</p>
| <tt>  F <FONT COLOR="#0099FF">(R)</FONT></tt> | <p>Sound reset. When set, sound resets and restarts at the specified frequency. Frequency and sound reset must be perfomed in a single write since both are write only. In continuous mode, frequency can be changed without resetting the sound channel.</p>


<a id="REG_SOUND4CNT_L"></a>

### 0x04000078 - REG_SOUND4CNT_L (Sound 4 Length, output level and envelope control)

<div>
<PRE style="width: min-content; margin: 16px auto">                     <FONT COLOR="#CC9900">W W  W W W W</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#008800">I I I I</FONT><FONT COLOR="#0099FF">  M</FONT> <FONT COLOR="#9900CC">T T T</FONT>  X X <FONT
COLOR="#FF0099">L L  L L L L</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-5 <FONT COLOR="#FF0099">(L)</FONT></tt> | <p>Sound length. This is a 6 bit value obtained from the following formula:</p><p>`Sound length = (64-register value)\*(1/256) seconds`</p><p>After the sound length has been changed, the sound channel must be resetted via bit F of [REG_SOUND4CNT_H](#REG_SOUND4CNT_H) (when using timed mode). </p>
| <tt>8-A <FONT COLOR="#9900CC">(T)</FONT></tt> | <p>Envelope step time. This is the delay between successive envelope increase or decrease. It is given by the following formula:</p><p>`Time = register value * (1/64) seconds`</p>
| <tt>  B <FONT COLOR="#0099FF">(M)</FONT></tt> | <p>Envelope mode. Controls if the envelope is to increase or decrease in volume over time.</p><p>`0` = Envelope decreases<br>`1` = Envelope increases</p>
| <tt>D-F <FONT COLOR="#008800">(I)</FONT></tt> | <p>Initial Envelope value. `1111` produces the maximum volume and `0000` mutes the sound.</p>


<a id="REG_SOUND4CNT_H"></a>

### 0x0400007C - REG_SOUND4CNT_H (Sound 4 Noise parameters, reset and loop control)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#CC9900">W</FONT><B>
</B>F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#FF3300">R</FONT> <FONT COLOR="#008800">T</FONT> X X  X X X X <FONT COLOR="#0099FF"> P P P P</FONT>  <FONT
COLOR="#9900CC">S</FONT> <FONT COLOR="#FF0099">C C C</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-2 <FONT COLOR="#FF0099">(C)</FONT></tt> | <p>Clock divider frequency. This divides the CPU frequency. Its output is then fed into the counter's pre-scaler (controlled by bits 4-7) which further devides the frequency.</p><p>`000` = f*2   (f = 4.194304 Mhz/8)<br>`001` = f<br>`010` = f/2<br>`011` = f/3<br>`100` = f/4<br>`101` = f/5<br>`110` = f/6<br>`111` = f/7</p>
| <tt>  3 <FONT COLOR="#9900CC">(S)</FONT></tt> | <p>Counter stages: `0` = 15 stages, `1` = 7 stages. This controls the period of the polynomial counter. It is given by (2^n)-1 where n is the number of stages. So for n=7, the pseudo-noise period lasts 63 input clocks. After that, the counter restarts the same count sequence.</p>
| <tt>4-7 <FONT COLOR="#0099FF">(P)</FONT></tt> | <p>Counter Pre-Stepper frequency:</p><p>`0000` = Q/2<br>`0001` = Q/2^2<br>`0010` = Q/2^3<br>`0011` = Q/2^4<br>`....`<br>`1101` = Q/2^14<br>`1110` = Not used<br>`1111` = Not used</p><p>Where Q is the clock divider's output frequency.</p>
| <tt>  E <FONT COLOR="#008800">(T)</FONT></tt> | <p>Timed sound. When set to 0, sound 4 is played continuously regardless of the length data in [REG_SOUND4CNT_L](#REG_SOUND4CNT_L). When set to 1, sound is played for that specified length and after that, bit 3 of [REG_SOUNDCNT_X](#REG_SOUNDCNT_X) is reset.</p>
| <tt>  F <FONT COLOR="#FF3300">(R)</FONT></tt> | <p>Sound reset. When bit F is set to 1, Envelope is set to initial value, the LFSR count sequence is resetted and the sound restarts. In continuous mode, all parameters can be changed but the sound needs to be resetted when modifying the envelope initial volume or the clock divider for changes to take effects.</p>

Channel 4 produces pseudo-noise generated by a polynomial counter. It is based on a 7/15 stages linear-feedback shift register (LFSR). LFSR counts in a pseudo-random order where each state is generated once and only once during the whole count sequence. The sound is produced by the least significant bit's output stage.


<a id="REG_SOUNDCNT_L"></a>

### 0x04000080 - REG_SOUNDCNT_L (Sound 1-4 Output level and Stereo control)

<div>
<PRE style="width: min-content; margin: 16px auto">                           <FONT COLOR="#FF0000">?</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#9900CC">R</FONT> <FONT COLOR="#FF0099">Q</FONT> <FONT COLOR="#FF3300">P</FONT> <FONT COLOR="#008800">O</FONT> <FONT
COLOR="#0099FF"> N</FONT> <FONT COLOR="#9900CC">M</FONT> <FONT COLOR="#FF0099">L</FONT> <FONT COLOR="#FF3300">K</FONT> <FONT
COLOR="#008800"> J</FONT> <FONT COLOR="#0099FF">I I I</FONT> <FONT COLOR="#9900CC"> H</FONT> <FONT COLOR="#FF0099">G G G</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-2 <FONT COLOR="#FF0099">(G)</FONT></tt> | DMG Left Volume
| <tt>  3 <FONT COLOR="#9900CC">(H)</FONT></tt> | Vin Left on/off (?) - According to BeLogic, Vin on/off allowed the original GameBoy paks to provide their own sound source. It is unkown whether they still work on a GBA.
| <tt>4-6 <FONT COLOR="#0099FF">(I)</FONT></tt> | DMG Right Volume
| <tt>  7 <FONT COLOR="#008800">(J)</FONT></tt> | Vin Right on/off (?) 
| <tt>  8 <FONT COLOR="#FF3300">(K)</FONT></tt> | DMG Sound 1 to left output
| <tt>  9 <FONT COLOR="#FF0099">(L)</FONT></tt> | DMG Sound 2 to left output
| <tt>  A <FONT COLOR="#9900CC">(M)</FONT></tt> | DMG Sound 3 to left output 
| <tt>  B <FONT COLOR="#0099FF">(N)</FONT></tt> | DMG Sound 4 to left output
| <tt>  C <FONT COLOR="#008800">(O)</FONT></tt> | DMG Sound 1 to right output
| <tt>  D <FONT COLOR="#FF3300">(P)</FONT></tt> | DMG Sound 2 to right output
| <tt>  E <FONT COLOR="#FF33CC">(Q)</FONT></tt> | DMG Sound 3 to right output
| <tt>  F <FONT COLOR="#9933FF">(R)</FONT></tt> | DMG Sound 4 to right output 


This register controls only the DMG output amplifiers and have no effects on the individual sound channels' processing, or Direct Sound channels' volume.


<a id="REG_SOUNDCNT_H"></a>

### 0x04000082 - REG_SOUNDCNT_H (Direct Sound control and Sound 1-4 output ratio)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#CC9900">W        W</FONT>      
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#FF0099">Q</FONT><FONT COLOR="#FF3300"> P</FONT> <FONT COLOR="#008800">O</FONT> <FONT COLOR="#0099FF">N</FONT>  <FONT
COLOR="#9900CC">M </FONT><FONT COLOR="#FF0099">L</FONT> <FONT COLOR="#FF3300">K</FONT> <FONT COLOR="#008800">J</FONT>  X X X X <FONT
COLOR="#0099FF"> I</FONT> <FONT COLOR="#9900CC">H</FONT> <FONT COLOR="#FF0099">G G</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-1 <FONT COLOR="#FF0099">(G)</FONT></tt> | <p>Output Sound Ratio for channels 1-4.</p><p>`00` = 25%<br>`01` = 50%<br>`10` = 100%<br>`11` = ??</p>
| <tt>  2 <FONT COLOR="#9900CC">(H)</FONT></tt> | Direct sound A output ratio (0 - 50%, 1 - 100%)
| <tt>  3 <FONT COLOR="#0099FF">(I)</FONT></tt> | Direct sound B output ratio (0 - 50%, 1 - 100%)
| <tt>  8 <FONT COLOR="#008800">(J)</FONT></tt> | Direct Sound A to right output
| <tt>  9 <FONT COLOR="#FF3300">(K)</FONT></tt> | Direct sound A to left output 
| <tt>  A <FONT COLOR="#FF0099">(L)</FONT></tt> | Direct sound A Sampling rate timer ([timer 0](#REG_TM0D) or [1](#REG_TM1D)). Use this to set which timer contorls the playback frequency.
| <tt>  B <FONT COLOR="#9900CC">(M)</FONT></tt> | Direct sound [A FIFO](#REG_FIFO_A_L) reset 
| <tt>  C <FONT COLOR="#0099FF">(N)</FONT></tt> | Direct sound B to right output 
| <tt>  D <FONT COLOR="#008800">(O)</FONT></tt> | Direct sound B to left output 
| <tt>  E <FONT COLOR="#FF3300">(P)</FONT></tt> | Direct sound B Sampling rate timer ([timer 0](#REG_TM0D) or [1](#REG_TM1D)). Use this to set which timer controls the playback frequency.
| <tt>  F <FONT COLOR="#FF0099">(Q)</FONT></tt> | Direct sound [B FIFO](#REG_FIFO_B_L) reset 

This register is used in controlling Direct Sound on the GBA. Output ratios control the volume, in percentage, that gets output to the speakers.


<a id="REG_SOUNDCNT_X"></a>

### 0x04000084 - REG_SOUNDCNT_X (Master sound enable and Sound 1-4 play status)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#FF0000">                           R R R R</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X X  X X X X <FONT COLOR="#FF3300"> N</FONT> X X X  <FONT
COLOR="#008800">J</FONT> <FONT COLOR="#0099FF">I</FONT> <FONT COLOR="#9900CC">H</FONT> <FONT COLOR="#FF0099">G</FONT>
</PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0 <FONT COLOR="#FF0099">(G)</FONT></tt> | DMG Sound 1 Status (Read only). `0` = Stopped, `1` = Playing
| <tt>1 <FONT COLOR="#9900CC">(H)</FONT></tt> | DMG Sound 2 Status (Read only). `0` = Stopped, `1` = Playing
| <tt>2 <FONT COLOR="#0099FF">(I)</FONT></tt> | DMG Sound 3 Status (Read only). `0` = Stopped, `1` = Playing
| <tt>3 <FONT COLOR="#008800">(J)</FONT></tt> | DMG Sound 4 Status (Read only). `0` = Stopped, `1` = Playing
| <tt>7 <FONT COLOR="#FF3300">(N)</FONT></tt> | All Sound circuit enable

This register is used to monitor the play status of sounds and to turn on or off all sound circuits. Turning the sound circuits off saves battery power, allowing them to last up to 10% longer.

<a id="REG_SOUNDBIAS"></a>

### 0x04000088 - REG_SOUNDBIAS (Sound bias and Amplitude resolution control)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#9900CC">R R</FONT> X X  X X <FONT COLOR="#FF0099">B B  B B B B  B B B</FONT> X</PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>1-9 <FONT COLOR="#FF0099">(B)</FONT></tt> | PWM bias value, controlled by the BIOS.
| <tt>E-F <FONT COLOR="#9900CC">(R)</FONT></tt> | Amplitude resolutions <br> `00` = 9 bit at 32768 hz <br> `01` = 8 bit at 65536 hz <br> `10` = 7 bit at 131072 hz <br> `11` = 6 bit at 262144 hz

The BIAS setting is used to offset the sound output and bring it back into a signed range. When the BIOS starts up, it runs a timing loop where it slowly raises the BIAS voltage from 0 to 512. This setting should not be changed. At best, the sound will become distorted. At worst the amplifier inside the GBA could be damaged.

When accessing bits F-E, a read-modify-write is required. The default value for bits F-E is 00. Most if not all games use 01 for this setting.


<a id="REG_WAVE_RAM0_L"></a>
<a id="REG_WAVE_RAM0_H"></a>
<a id="REG_WAVE_RAM1_L"></a>
<a id="REG_WAVE_RAM1_H"></a>
<a id="REG_WAVE_RAM2_L"></a>
<a id="REG_WAVE_RAM2_H"></a>
<a id="REG_WAVE_RAM3_L"></a>
<a id="REG_WAVE_RAM3_H"></a>

### 0x04000090 - REG_WAVE_RAM0_L (Sound 3 samples 0-3) <br> 0x04000092 - REG_WAVE_RAM0_H (Sound 3 samples 4-7) <br> 0x04000094 - REG_WAVE_RAM1_L (Sound 3 samples 8-11) <br> 0x04000096 - REG_WAVE_RAM1_H (Sound 3 samples 12-15) <br> 0x04000098 - REG_WAVE_RAM2_L (Sound 3 samples 16-19) <br> 0x0400009A - REG_WAVE_RAM2_H (Sound 3 samples 20-23) <br> 0x0400009C - REG_WAVE_RAM3_L (Sound 3 samples 23-27) <br> 0x0400009E - REG_WAVE_RAM3_H (Sound 3 samples 28-31)

These registers together contain four (4 bytes each) 4-bit wave RAM samples for Sound channel 3.


<a id="REG_FIFO_A_L"></a>
<a id="REG_FIFO_A_H"></a>
<a id="REG_FIFO_B_L"></a>
<a id="REG_FIFO_B_H"></a>

### 0x040000A0 - REG_FIFO_A_L (Direct Sound channel A samples 0-1)(Write Only) <br> 0x040000A2 - REG_FIFO_A_H (Direct Sound channel A samples 2-3)(Write Only) <br> 0x040000A4 - REG_FIFO_B_L (Direct Sound channel B samples 0-1)(Write Only) <br> 0x040000A6 - REG_FIFO_B_H (Direct Sound channel B samples 2-3)(Write Only)

These are the locations of the Direct Sound 8-bit FIFO samples, from which Direct Sound pulls the music data to be played on the speakers. Note that there are only 8 bytes total for all your samples. You repeatedly fill these from a buffer of your own using [DMA0](#REG_DMA0CNT) or [DMA1](#REG_DMA1CNT), or by using timer [interrupts](#Hardware Interrupts).

To fill them using DMA, first set [Timer 0](#REG_TM0D) or [Timer 1](#REG_TM1D) to refresh at the appropriate sample rate (for example, 16khz). Next, set the [DMA source address](#REG_DMA0SAD) to a sound sample in memory, and the [destination address](#REG_DMA0DST) to one of these FIFO registers. Use [REG_SOUNTCNT_H](#REG_SOUNDCNT_H) to reset FIFO and tell Direct Sound to get its sampling rate from Timer 0 or Timer 1. Finally, set the [DMA control register](#REG_DMA0CNT) to start on FIFO empty (start mode 11) and to repeat, then enable the timers. All of this will cause the hardware to play sound samples in FIFO at the rate specified in your timer, and automatically refill them using DMA.

To fill these using [interrupts](interrupts.md), follow a similar process, but instead of using DMA, set the clock to interrupt on overflow. When using interrupts instead of DMA, BeLogic recommends setting the [timer](#REG_TM0CNT) divider to 1024 and start the timer at 0xFFFF order to get a sampling rate of 16.384 khz. This apparently causes less distortion than if you simply set the start time of the clock to 0xFFFF - (2^24/16000).

Note that reading from these registers can yield unpredictable results. It might be interesting to see just _how_ unpredictable...


* * *

<a id="dma-source-registers"></a>

## 0x40000B0, 0x40000BC, 0x40000C8, 0x40000D4 (DMA Source Registers)(Write Only)

<a id="REG_DMA0SAD"></a>

### 0x40000B0 - REG_DMA0SAD (DMA0 Source Address) (Write Only)

<div style="font-size: 80%">
<PRE>31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 9 8  7 6 5 4  3 2 1 0
X  X  X  X   X  <FONT COLOR="#FF0099">A  A  A   A  A  A  A   A  A  A  A   A  A  A  A   A  A  A A  A A A A  A A A A</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-26 <FONT COLOR="#FF0099">(A)</FONT></tt> | 27-bit source address

This is the source address for DMA channel 0 transfers. Note that it is 27-bit.

<a id="REG_DMA1SAD"></a>
<a id="REG_DMA2SAD"></a>
<a id="REG_DMA3SAD"></a>

### 0x40000BC - REG_DMA1SAD (DMA1 Source Address) <br> 0x40000C8 - REG_DMA2SAD (DMA2 Source Address) <br> 0x40000D4 - REG_DMA3SAD (DMA3 Source Address)

<div style="font-size: 80%">
<PRE>31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 9 8  7 6 5 4  3 2 1 0
X  X  X  X  <FONT COLOR="#FF0099"> A  A  A  A   A  A  A  A   A  A  A  A   A  A  A  A   A  A  A A  A A A A  A A A A</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-27 <FONT COLOR="#FF0099">(A)</FONT></tt> | 28-bit source address

This is the source address for DMA channel 1, 2, or 3 transfers. Note that it is 28-bit.

<a id="dma-destination-registers"></a>

## 0x40000B4, 0x40000C0, 0x40000CC, 0x40000D8 (DMA Destination Registers) (Write Only)

<a id="REG_DMA0DAD"></a>
<a id="REG_DMA1DAD"></a>
<a id="REG_DMA2DAD"></a>

### 0x40000B4 - REG_DMA0DAD (DMA0 Destination Address) <br> 0x40000C0 - REG_DMA1DAD (DMA1 Destination Address) <br> 0x40000CC - REG_DMA2DAD (DMA2 Destination Address)

<div style="font-size: 80%">
<PRE>31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 9 8  7 6 5 4  3 2 1 0
X  X  X  X   X  <FONT COLOR="#FF0099">A  A  A   A  A  A  A   A  A  A  A   A  A  A  A   A  A  A A  A A A A  A A A A</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-27 <FONT COLOR="#FF0099">(A)</FONT></tt> | 27-bit destination address

This is the dest address for DMA channel 0, 1, and 2 transfers. Note that it is 27-bit.

<a id="REG_DMA3DAD"></a>

### 0x40000D8 - REG_DMA3DAD (DMA3 Destination Address)(Write Only)

<div>
<PRE style="width: min-content; margin: 16px auto">31 30 29 28  27 26 25 24  23 22 21 20  19 18 17 16  15 14 13 12  11 10 9 8  7 6 5 4  3 2 1 0
X  X  X  X  <FONT COLOR="#FF0099"> A  A  A  A   A  A  A  A   A  A  A  A   A  A  A  A   A  A  A A  A A A A  A A A A</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-27 <FONT COLOR="#FF0099">(A)</FONT></tt> | 28-bit destination address

This is the dest address for DMA channel 3 transfers. Note that it is 28-bit.

<a id="dma-count-registers"></a>

## 0x40000B8, 0x40000C4, 0x40000D0, 0x40000DC (DMA Count Registers) (Write Only)

<a id="REG_DMA0CNT_L"></a>
<a id="REG_DMA1CNT_L"></a>
<a id="REG_DMA2CNT_L"></a>
<a id="REG_DMA3CNT_L"></a>

### 0x40000B8 - REG_DMA0CNT_L (DMA0 Count Register) <br> 0x40000C4 - REG_DMA1CNT_L (DMA1 Count Register) <br> 0x40000D0 - REG_DMA2CNT_L (DMA2 Count Register) <br> 0x40000DC - REG_DMA3CNT_L (DMA3 Count Register)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X <FONT COLOR="#FF0099">L L  L L L L  L L L L  L L L L</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-D <FONT COLOR="#FF0099">(L)</FONT></tt> | Number of words or halfwords to copy

<a id="dma-control-registers"></a>
<a id="REG_DMA0CNT"></a>
<a id="REG_DMA1CNT"></a>
<a id="REG_DMA2CNT"></a>
<a id="REG_DMA3CNT"></a>

## 0x40000BA, 0x40000C6, 0x40000D2, 0x40000DE (DMA Control Registers)

(Note: In some places you will see the DMA control and DMA count registers depicted as a single 32-bit register called REG_DMAXCNT. I opted to treat them as two 16-bit registers for sake of clarity.)

### 0x40000BA - REG_DMA0CNT_H (DMA0 Control Register) <br> 0x40000C6 - REG_DMA1CNT_H (DMA1 Control Register) <br> 0x40000D2 - REG_DMA2CNT_H (DMA2 Control Register) <br> 0x40000DE - REG_DMA3CNT_H (DMA3 Control Register)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#FF0000">         ?             </FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#0099FF">N </FONT><FONT COLOR="#9900CC">I </FONT><FONT COLOR="#FF0099">M M </FONT><FONT COLOR="#FF3300"> U</FONT> <FONT
COLOR="#008800">S</FONT> <FONT COLOR="#0099FF">R</FONT> <FONT COLOR="#9900CC">A  A</FONT> <FONT COLOR="#FF0099">B B</FONT> X  X X X X</PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>5-6 <FONT COLOR="#FF0099">(B)</FONT></tt> | <p>Type of increment applied to destination address. If enabled, the address will be incremented/decremented by 2 or 4 bytes, depending on the selected size. When the DMA is activated, the contents of these registers are copied to internal counters in the DMA hardware, which then increments/decrements these registers during transfer, preserving the contents of the IORAM registers.[\*](#DMANote)</p><p>`00` = Increment after each copy <br>`01` = Decrement after each copy <br>`10` = Leave unchanged <br>`11` = Increment without after each copy, reset to initial value at the end of transfer (or at the end of the current repetition)</p>
| <tt>7-8 <FONT COLOR="#9900CC">(A)</FONT></tt> | <p>Type of increment applied to source address:</p><p>`00` = Increment after each copy <br> `01` = Decrement after each copy <br> `10` = Leave unchanged <br> `11` = Illegal </p> <p>Note: I am somewhat uncertain about option "11" for both of these. Can anyone confirm? </p>
| <tt>  9 <FONT COLOR="#0099FF">(R)</FONT></tt> | Repeat. When in start modes 1 or 2, this bit causes the transfer to repeat for each interval. 
| <tt>  A <FONT COLOR="#008800">(S)</FONT></tt> | Size. If set, copy 32-bit quantities (words) If clear, copy 16-bit quantities (half words) 
| <tt>  B <FONT COLOR="#FF3300">(U)</FONT></tt> | Unknown.  For DMA 0, 1, and 2, this bit is read only and set to 0. However, for DMA 3, it appears to be writeable. Thoughts, anyone?
| <tt>C-D <FONT COLOR="#FF0099">(M)</FONT></tt> | <p>Start Mode.</p><p>`00` = Transfer immediately <br> `01` = Transfer on vblank (i.e. vdma)<br> `10` = Transfer on hblank (i.e. hdma.  Note that, unlike h-interrupts, hdma does NOT occur during vblank.)<br> `11` = The function of this varies based on the DMA channel.</p><p>For DMA 1 or 2: Instructs the DMA to repeat on FIFO-empty requests. When this is set the size and count are ignored and a single 32 bit quantity is transferred on FIFO empty.</p> <p>For DMA 3: Apparently allows transfers to start at the beginning of a rendering line, copying data into a buffer as the line is being drawn on the screen. Useful for flicker-free transfers in mode 3, which has no backbuffer.</p>
| <tt>  E <FONT COLOR="#9900CC">(I)</FONT></tt> | IRQ. Setting this bit causes the DMA to generate an [interrupt](interrupts.md) when it is done with the data transfer.
| <tt>  F <FONT COLOR="#0099FF">(N)</FONT></tt> | Set this bit to enable DMA operation. Clear to end DMA operation.

This address controls a DMA transfer which allows large amounts of data to be transferred from one area of memory to another. It is theoretically twice as fast as transfering by the CPU, which uses at least one cycle for a read instruction and another for a write. DMA can also be used to clear memory to a constant value, if the source address is not incremented with each copy. Fist, set the [DMASAD](#dma-source-registers) and [DMADAD](#dma-destination-registers) registers to point to the addresses you want. Writing to DMACNT_H address with a '1' in the N field and a '00' in the M field will start the transfer immediately.

DMA transfers may occur on an interrupt if the start mode bits are set for this. DMAs have a priority ranking with 3 at the lowest and 0 at the highest. For most cases, program code will be using DMA3 as it is lowest priority, allowing it to be interrupted by more important DMA (see below).

Specific DMAs have the following properties:

* **DMA0**: This DMA is the highester priority, but cannot be used to access cartridge memory (addresses 0x8000000 and higher). It is suitable for time-critical operations such as transfering scale and rotate data to the background scaling registers. Since it takes precedence over other DMAs, it will not be postponed or interrupted (possibly causing undesirable results such as screen artifacts).

* **DMA1** and **DMA2**: These are the only DMA that can be used for sound FIFO. If start mode "11" is set, the DMA will be triggered on FIFO empty. I believe that FIFO A always sends its empty requests to DMA1 and that FIFO B sends its empty requests only to DMA2, though I don't have any verification of this.

* **DMA3**: This is is the lowest priority and thus often used as a "general purpose" DMA. Using this DMA for your basic memory transfers ensures that sound FIFO DMA and other time-critical DMA are not delayed, making audio or visual artifacts less likely.

<a id="DMANote"></a>

\* _(Originally I had assumed a direct mapping between the source/destination registers and the current transfer address, and thus this section of the doc distinguished between transfers which wrote-back to the registers and those which did not. This appears to have been an incorrect assumption, and was brought to light as I delved further into sound emulation)_

## DMA Transfer Ratings

The following table lists the cycle timings for various DMA transfers. The format of each entry is:

`16 bit DMA / 32 bit DMA`

Units are in _cycles per item transfered_. Thus, a rating of 4/8 indicates that the transfer takes 4 cycles for every 16 bits transferred with 16 bit DMA, or 8 cycles for every 32 bits transfered with 32 bit DMA.

<div>
<PRE style="width: min-content; margin: 16px auto"><B>Source       Destination</B>
             EWRAM    IWRAM    IO       PAL RAM  VRAM     OAM
ROM 0 WS     <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">8</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">4</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">4</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">3</FONT>
ROM 1 WS     <FONT COLOR="#CC9900">5</FONT>/<FONT COLOR="#CC3300">10</FONT>     <FONT COLOR="#CC9900">3</FONT>/<FONT
COLOR="#CC3300">5</FONT>      <FONT COLOR="#CC9900">3</FONT>/<FONT COLOR="#CC3300">5</FONT>      <FONT COLOR="#CC9900">3</FONT>/<FONT
COLOR="#CC3300">6</FONT>      <FONT COLOR="#CC9900">3</FONT>/<FONT COLOR="#CC3300">6</FONT>      <FONT COLOR="#CC9900">3</FONT>/<FONT
COLOR="#CC3300">5</FONT>
ROM 2 WS     <FONT COLOR="#CC9900">6</FONT>/<FONT COLOR="#CC3300">12</FONT>     <FONT COLOR="#CC9900">4</FONT>/<FONT
COLOR="#CC3300">7</FONT>      <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">7</FONT>      <FONT COLOR="#CC9900">4</FONT>/<FONT
COLOR="#CC3300">8</FONT>      <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">8</FONT>      <FONT COLOR="#CC9900">4</FONT>/<FONT
COLOR="#CC3300">7</FONT>
EWRAM        <FONT COLOR="#CC9900">6</FONT>/<FONT COLOR="#CC3300">12</FONT>     <FONT COLOR="#CC9900">4</FONT>/<FONT
COLOR="#CC3300">7</FONT>      <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">7</FONT>      <FONT COLOR="#CC9900">4</FONT>/<FONT
COLOR="#CC3300">8</FONT>      <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">8</FONT>      <FONT COLOR="#CC9900">4</FONT>/<FONT
COLOR="#CC3300">7</FONT>
IWRAM        <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">7</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">2</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>
I/O          <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">7</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">2</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>
PAL RAM      <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">8</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">4</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">4</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>
VRAM         <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">8</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">4</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">4</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>
OAM          <FONT COLOR="#CC9900">4</FONT>/<FONT COLOR="#CC3300">7</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">2</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT COLOR="#CC3300">3</FONT>      <FONT COLOR="#CC9900">2</FONT>/<FONT
COLOR="#CC3300">2</FONT>
</PRE>
</div>


Note that it is not possible to DMA transfer from or to SRAM (Cart RAM) or BIOS, and (obviously) it is not possible to transfer to ROM.

Thanks to Kay for supplying these transfer statistics!!

<br>
<br>

* * *

<a id="timer-registers"></a>

## 0x4000100 - 0x400010E (Timer registers)


<a id="REG_TM0D"></a>
<a id="REG_TM1D"></a>
<a id="REG_TM2D"></a>
<a id="REG_TM3D"></a>

### 0x4000100 - REG_TM0D (Timer 0 Data) <br> 0x4000104 - REG_TM1D (Timer 1 Data) <br> 0x4000108 - REG_TM2D (Timer 2 Data) <br> 0x400010C - REG_TM3D (Timer 3 Data)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#FF0099">D D D D  D D D D  D D D D  D D D D</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-F <FONT COLOR="#FF0099">(D)</FONT></tt> | Current count of the timer.

Note that these registers are R/W. The default is to start counting from 0x0000, but if a value is written to this register, the timer will henceforth use that as a starting value. Thus the rate at which timers overflow and generate [interrupts](interrupts.md) (see [REG_TMXCNT](#REG_TM0CNT), below) can be customized.

Timer 0 and Timer 1 are used to control the rate of Direct Sound FIFO. When using [DMA](#REG_DMA0CNT) with start mode 11, they can automatically cause it to refill the FIFO.

To set the rate of playback in hz, write the value 0xFFFF - (2^24/Plaback Freq in hz) to the register. This sets the start value such that the timer will overflow precisely when the next sound sample is needed, and cause the DMA to activate.

When using interrupts, set the start value of these to 0, but use [REG_TMXCNT](#REG_TM0CNT) to change the update frequency to 1024, thus causing an interrupt rate of 16.384khz.


<a id="REG_TM0CNT"></a>
<a id="REG_TM1CNT"></a>
<a id="REG_TM2CNT"></a>
<a id="REG_TM3CNT"></a>

### 0x4000102 - REG_TM0CNT (Timer 0 Control) <br> 0x4000106 - REG_TM1CNT (Timer 1 Control) <br> 0x400010A - REG_TM2CNT (Timer 2 Control) <br> 0x400010E - REG_TM3CNT (Timer 3 Control)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#FF0000">                             *</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X X  X X X X<FONT COLOR="#008800">  E </FONT><FONT COLOR="#0099FF">I</FONT> X X  X <FONT
COLOR="#9900CC">C </FONT><FONT COLOR="#FF0099">F F</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-1 <FONT COLOR="#FF0099">(F)</FONT></tt> | <p>Frequency at which the timer updates.</p><p>`00` = Default frequency (full) - 16.78MHz (~17mlns ticks per second)<br>`01` = Every 64 clock pulses - ~262187.5KHz<br>`10` = Every 256 clock pulses - ~65546.875KHz<br>`11` = Every 1024 clock pulses - ~16386.71875KHz</p>
| <tt>  2 <FONT COLOR="#9900CC">(C)</FONT></tt> | <p>Cascade (\* Unused on TM0) - When this bit is set, the frequency of this timer is ignored. Instead the timer increments when the timer below it overflows. For example, if timer 1 is set to cascade, it will increment whenever timer 0's value goes from `0xFFFF` to `0x0000`.</p>
| <tt>  6 <FONT COLOR="#0099FF">(I)</FONT></tt> | Generate an interrupt on overflow
| <tt>  7 <FONT COLOR="#008800">(E)</FONT></tt> | Enable the timer.

<br>

* * *


<a id="serial-communication-registers"></a>

## 0x4000120 - 0x400012A - Serial Communication Registers

Note: All of the serial comm information originates from [Andrew May's description](http://members.truepath.com/AndrewMay/GBA.html) of the GBA linker hardware, which in turn was compiled from various other sources on the web. My thanks to ePAc for discovering his site and putting the information into a format consistent with the rest of this spec. If anybody else has information to add to this, don't hesitate to mail me.


<a id="REG_SCD0"></a>
<a id="REG_SCD1"></a>
<a id="REG_SCD2"></a>
<a id="REG_SCD3"></a>

### 0x4000120 - REG_SCD0 (Master/Slave 0 destination reg) (Read Only) <br> 0x4000122 - REG_SCD1 (Slave 1 destination reg) (Read Only) <br> 0x4000124 - REG_SCD2 (Slave 2 destination reg) (Read Only) <br> 0x4000126 - REG_SCD3 (Slave 3 destination reg) (Read Only)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#FF0000">
R R R R  R R R R  R R R R  R R R R</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#FF0099">D D D D  D D D D  D D D D  D D D D</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-F <FONT COLOR="#FF0099">(D)</FONT></tt> | The data received.

- SCD0 contains the data sent by the master (also called slave 0)
- SCD1 contains the data sent by the first slave (slave1)
- SCD2 contains the data sent by the second slave (slave2)
- SCD3 contains the data sent by the last slave (slave3)


<a id="REG_SCCNT_L"></a>

### 0x4000128 - REG_SCCNT_L (Serial Communication channel control register)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#FF0000">                    R               </FONT> 
F E D C  B A 9 8  7 6 5 4  3 2 1 0
X <FONT COLOR="#9900CC">I</FONT> <FONT COLOR="#FF0099">M M</FONT>  X X X X <FONT
COLOR="#FF3300"> S</FONT> <FONT COLOR="#008800">E</FONT> <FONT COLOR="#0099FF">D D</FONT> <FONT COLOR="#9900CC"> L L</FONT> <FONT
COLOR="#FF0099">B B</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-1 <FONT COLOR="#FF0099">(B)</FONT></tt> | Baud rate - `00` = 9600, `01` = 38400,`10` = 57600, `11` = 115200
| <tt>2-3 <FONT COLOR="#9900CC">(L)</FONT></tt> | SD (bit3) and SI (bit2) line direct access
| <tt>4-5 <FONT COLOR="#0099FF">(D)</FONT></tt> | ID of GBA - `00` = master, `01` = slave1, `10` = slave2, `11` = slave3
| <tt>  6 <FONT COLOR="#008800">(E)</FONT></tt> | Error (1 on error)
| <tt>  7 <FONT COLOR="#FF3300">(S)</FONT></tt> | Start Transfer (1 triggers the start on the MASTER ONLY)
| <tt>C-D <FONT COLOR="#FF0099">(M)</FONT></tt> | Comm Mode - `00` = 8bit, `01` = 32bit, `10` = Multilink, `11` = UART
| <tt>  E <FONT COLOR="#9900CC">(I)</FONT></tt> | Enable Comm Interupt

Using the link port and a link cable, the GBA can transmit serial data in one of four modes: 8 bit, 32 bit, Multilink, and UART. At the moment I only have info on the multilink mode. [Mail me](mailto:SorcererXIII@yahoo.com) if you know more about the other modes.

#### Multilink Mode

To transfer data in this mode, you must coordinate the actions of all the GBAs which are linked together. Each GBA slave must place the data they wish transfered in [REG_SCCNT_H](#REG_SCCNT_H). Then the Master/Slave 0 initiates the transfer by setting bit 7 of REG_SCCNT_L. This causes the hardware to transfer the data and, as I understand, it will magically appear in the destination registers of each slave, according to the following:

* [REG_SCCNT_H](#REG_SCCNT_H) from GBA with id `00` goes into [REG_SCD0](#REG_SCD0) on each GBA
* [REG_SCCNT_H](#REG_SCCNT_H) from GBA with id `01` goes into [REG_SCD1](#REG_SCD0) on each GBA
* [REG_SCCNT_H](#REG_SCCNT_H) from GBA with id `10` goes into [REG_SCD2](#REG_SCD0) on each GBA
* [REG_SCCNT_H](#REG_SCCNT_H) from GBA with id `11` goes into [REG_SCD3](#REG_SCD0) on each GBA

Thus each GBA in the chain has a duplicate of the data.

It is unclear to me how each GBA knows what ID it is; perhaps this value is automatically set when the link cable is attached? ePAc has commented that the master is the GBA in the set that has the purple connector connected to its ext port. So if you have a GBA that want to be a MBserver for a set of clients, then you need to put the cart in the one with the purple connector.

Note from me: I have a suspicion that some of these bits are write-only. Please let me know if you find out more.


<a id="REG_SCCNT_H"></a>

### 0x400012A - REG_SCCNT_H (Serial Communication Source Register)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#FF33CC">S S S S  S S S S  S S S S  S S S S</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-F <FONT COLOR="#FF33CC">(S)</FONT></tt> | The data to be sent over the link cable.

* * *

**Addresses 0x4000130 - 0x4000132 - Keypad Input and Control Registers


<a id="REG_KEY"></a>
<a id="REG_KEYINPUT"></a>

### 0x4000130 - REG_KEY (The input register) (Read Only)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#FF0000">             R R  R R R R  R R R R</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X X  X X <FONT COLOR="#FF3300">J </FONT><FONT COLOR="#008800">I</FONT><FONT COLOR="#0099FF">  D</FONT> <FONT
COLOR="#9900CC">U</FONT> <FONT COLOR="#FF0099">L</FONT> <FONT COLOR="#FF3300">R</FONT> <FONT COLOR="#008800"> S</FONT><FONT
COLOR="#0099FF"> E</FONT> <FONT COLOR="#9900CC">B</FONT> <FONT COLOR="#FF0099">A</FONT> </PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0 <FONT COLOR="#FF0099">(A)</FONT></tt> | A button 
| <tt>1 <FONT COLOR="#9900CC">(B)</FONT></tt> | B button 
| <tt>2 <FONT COLOR="#0099FF">(E)</FONT></tt> | Select button 
| <tt>3 <FONT COLOR="#008800">(S)</FONT></tt> | Start button 
| <tt>4 <FONT COLOR="#FF3300">(R)</FONT></tt> | D-pad Right 
| <tt>5 <FONT COLOR="#FF0099">(L)</FONT></tt> | D-pad Left 
| <tt>6 <FONT COLOR="#9900CC">(U)</FONT></tt> | D-pad Up 
| <tt>7 <FONT COLOR="#0099FF">(D)</FONT></tt> | D-pad Down 
| <tt>8 <FONT COLOR="#008800">(I)</FONT></tt> | Right shoulder button 
| <tt>9 <FONT COLOR="#FF3300">(J)</FONT></tt> | Left shoulder button 

This register stores the state of the GBA's buttons. Each of the inputs is active low. This means that a '0' bit indicates that the key is pressed, while a '1' bit indicates that the key is not pressed. In general a game which samples these (rather than using interrupts) should do so at least once every refresh (60hz), or more in the case of fast action fighting games (like Street Fighter).


<a id="REG_KEYCNT"></a>

### 0x4000132 - REG_KEYCNT (Key Control Register)

<div>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
T K X X  X X J I  D U L R  S E B A 
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0 <FONT COLOR="#FF0099">(A)</FONT></tt> | A button 
| <tt>1 <FONT COLOR="#9900CC">(B)</FONT></tt> | B button 
| <tt>2 <FONT COLOR="#0099FF">(E)</FONT></tt> | Select button 
| <tt>3 <FONT COLOR="#008800">(S)</FONT></tt> | Start button 
| <tt>4 <FONT COLOR="#FF3300">(R)</FONT></tt> | D-pad Right 
| <tt>5 <FONT COLOR="#FF0099">(L)</FONT></tt> | D-pad Left 
| <tt>6 <FONT COLOR="#9900CC">(U)</FONT></tt> | D-pad Up 
| <tt>7 <FONT COLOR="#0099FF">(D)</FONT></tt> | D-pad Down 
| <tt>8 <FONT COLOR="#008800">(I)</FONT></tt> | Right shoulder button 
| <tt>9 <FONT COLOR="#FF3300">(J)</FONT></tt> | Left shoulder button 
| <tt>E <FONT COLOR="#FF0099">(K)</FONT></tt> | Generate interrupt on keypress
| <tt>F <FONT COLOR="#9900CC">(T)</FONT></tt> | <p>Interrupt "type"</p><p>`0` = "OR" operation: interrupt will be generated if _any_ of specified keys (bits 0-9) are pressed<br> `1` = "AND" operation: interrupt will be generated if _all_ specified keys are pressed at the same time.</p>

Use this register to set which keypresses generate interrupts. The appropriate bits must also be set in [REG_IE](#REG_IE) and [REG_IME](#REG_IME).

* * *

<a id="REG_R"></a>

### 0x4000134 - REG_R

<div>
<PRE style="width: min-content; margin: 16px auto">    <FONT COLOR="#FF0000">R R  R R R                 R R</FONT>  
F E D C  B A 9 8  7 6 5 4  3 2 1 0
</PRE>
</div>

This register appears to give direct access to the different lines of the link port. If you happen to have more information about which bit corresponds to which line, by all means [mail me](mailto:SorcererXIII@yahoo.com) about it so I can update the doc.

Also, I used the name listed in Eloist's [gba.h](gba.h). I don't think it is very descriptive. If anyone has seen a better name for this register, let me know and I will change it. Otherwise I will probably change it to something like "REG_SCLINES" or "REG_SCPIN".



## 0x4000200 - 0x4000208 - Interrupt Registers

<a id="REG_IE"></a>

### 0x4000200 - REG_IE (Interrupt Enable Register)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X <FONT COLOR="#008800">T </FONT><FONT COLOR="#0099FF">Y  </FONT><FONT COLOR="#9900CC">G </FONT><FONT
COLOR="#FF0099">F </FONT><FONT COLOR="#FF3300">E </FONT><FONT COLOR="#008800">D  </FONT><FONT COLOR="#0099FF">S </FONT><FONT
COLOR="#9900CC">L </FONT><FONT COLOR="#FF0099">K </FONT><FONT COLOR="#FF3300">J </FONT><FONT COLOR="#008800"> I </FONT><FONT
COLOR="#0099FF">C </FONT><FONT COLOR="#9900CC">H </FONT><FONT COLOR="#FF0099">V</FONT>
</PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0 <FONT COLOR="#FF0099">(V)</FONT></tt> | VBlank Interrupt 
| <tt>1 <FONT COLOR="#9900CC">(H)</FONT></tt> | HBlank Interrupt 
| <tt>2 <FONT COLOR="#0099FF">(C)</FONT></tt> | VCount Interrupt 
| <tt>3 <FONT COLOR="#008800">(I)</FONT></tt> | Timer 0 Interrupt 
| <tt>4 <FONT COLOR="#FF3300">(J)</FONT></tt> | Timer 1 Interrupt 
| <tt>5 <FONT COLOR="#FF0099">(K)</FONT></tt> | Timer 2 Interrupt 
| <tt>6 <FONT COLOR="#9900CC">(L)</FONT></tt> | Timer 3 Interrupt 
| <tt>7 <FONT COLOR="#0099FF">(S)</FONT></tt> | Serial Communication Interrupt 
| <tt>8 <FONT COLOR="#008800">(D)</FONT></tt> | DMA0 Interrupt 
| <tt>9 <FONT COLOR="#FF3300">(E)</FONT></tt> | DMA1 Interrupt 
| <tt>A <FONT COLOR="#FF0099">(F)</FONT></tt> | DMA2 Interrupt 
| <tt>B <FONT COLOR="#9900CC">(G)</FONT></tt> | DMA3 Interrupt 
| <tt>C <FONT COLOR="#0099FF">(Y)</FONT></tt> | Key Interrupt 
| <tt>D <FONT COLOR="#008800">(T)</FONT></tt> | Cartridge Interrupt

Use this register to mask out which interrupts are enabled or disabled.


<a id="REG_IF"></a>

### 0x4000202 - REG_IF (Interrupt Flags Regster)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X <FONT COLOR="#008800">T </FONT><FONT COLOR="#0099FF">Y  </FONT><FONT COLOR="#9900CC">G </FONT><FONT
COLOR="#FF0099">F </FONT><FONT COLOR="#FF3300">E </FONT><FONT COLOR="#008800">D  </FONT><FONT COLOR="#0099FF">S </FONT><FONT
COLOR="#9900CC">L </FONT><FONT COLOR="#FF0099">K </FONT><FONT COLOR="#FF3300">J </FONT><FONT COLOR="#008800"> I </FONT><FONT
COLOR="#0099FF">C </FONT><FONT COLOR="#9900CC">H </FONT><FONT COLOR="#FF0099">V</FONT>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0 <FONT COLOR="#FF0099">(V)</FONT></tt> | VBlank Interrupt 
| <tt>1 <FONT COLOR="#9900CC">(H)</FONT></tt> | HBlank Interrupt 
| <tt>2 <FONT COLOR="#0099FF">(C)</FONT></tt> | VCount Interrupt 
| <tt>3 <FONT COLOR="#008800">(I)</FONT></tt> | Timer 0 Interrupt 
| <tt>4 <FONT COLOR="#FF3300">(J)</FONT></tt> | Timer 1 Interrupt 
| <tt>5 <FONT COLOR="#FF0099">(K)</FONT></tt> | Timer 2 Interrupt 
| <tt>6 <FONT COLOR="#9900CC">(L)</FONT></tt> | Timer 3 Interrupt 
| <tt>7 <FONT COLOR="#0099FF">(S)</FONT></tt> | Serial Communication Interrupt 
| <tt>8 <FONT COLOR="#008800">(D)</FONT></tt> | DMA0 Interrupt 
| <tt>9 <FONT COLOR="#FF3300">(E)</FONT></tt> | DMA1 Interrupt 
| <tt>A <FONT COLOR="#FF0099">(F)</FONT></tt> | DMA2 Interrupt 
| <tt>B <FONT COLOR="#9900CC">(G)</FONT></tt> | DMA3 Interrupt 
| <tt>C <FONT COLOR="#0099FF">(Y)</FONT></tt> | Key Interrupt 
| <tt>D <FONT COLOR="#008800">(T)</FONT></tt> | Cartridge Interrupt

This register will determine which interrupt is currently being serviced. When your interrupt service routine get scalled, check these flags to determine what called it. In order to keep yourself from servicing the wrong interrupt at a later time, you should reset the flags to 0 by writing a 1 to them.


<a id="REG_WSCNT"></a>

### 0x4000204 - REG_WSCNT (Wait State Control)

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#FF0000">R   </FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#FF3300">G</FONT> <FONT COLOR="#008800">P</FONT> X <FONT COLOR="#0099FF">C  C</FONT> <FONT
COLOR="#9900CC">N</FONT><FONT COLOR="#008800"> </FONT><FONT COLOR="#FF0099">M M</FONT><FONT COLOR="#CC0099"> </FONT><FONT
COLOR="#0099FF"> </FONT><FONT COLOR="#FF3300">L</FONT><FONT COLOR="#0099FF"> </FONT><FONT COLOR="#008800">K K</FONT> <FONT
COLOR="#0099FF">J</FONT><FONT COLOR="#9900CC">  I I</FONT> <FONT COLOR="#FF0099">S S</FONT></PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0-1 <FONT COLOR="#FF0099">(S)</FONT></tt> | <p>[SRAM](memory.md#cart-ram) wait state</p><p>`00` = 4 cycles, `01` = 3 cycles <br>`10` = 2 cycles, `11` = 8 cycles</p>
| <tt>2-3 <FONT COLOR="#9900CC">(I)</FONT></tt> | <p>[Bank 0x08000000](memory.md#game-pak-rom) initial wait state</p><p>`00` = 4 cycles, `01` = 3 cycles <br>`10` = 2 cycles, `11` = 8 cycles</p>
| <tt>  4 <FONT COLOR="#0099FF">(J)</FONT></tt> | <p>Bank 0x08000000 subsequent wait state</p><p>`0` = 2 cycles, `1` = 1 cycle</p>
| <tt>5-6 <FONT COLOR="#008800">(K)</FONT></tt> | <p>[Bank 0x0A000000](memory.md#game-pak-rom-image-1) initial wait state</p><p>`00` = 4 cycles, `01` = 3 cycles <br>`10` = 2 cycles, `11` = 8 cycles</p>
| <tt>  7 <FONT COLOR="#FF3300">(L)</FONT></tt> | <p>Bank 0x0A000000 subsequent wait state</p><p>`0` = 4 cycles, `1` = 1 cycle</p>
| <tt>8-9 <FONT COLOR="#FF0099">(M)</FONT></tt> | <p>[Bank 0x0C000000](memory.md#game-pak-rom-image-2) initial wait state</p><p>`00` = 4 cycles, `01` = 3 cycles <br>`10` = 2 cycles, `11` = 8 cycles</p>
| <tt>  A <FONT COLOR="#9900CC">(N)</FONT></tt> | <p>Bank 0x0C000000 subsequent wait state</p><p>`0` = 8 cycles, `1` = 1 cycle</p>
| <tt>B-C <FONT COLOR="#0099FF">(C)</FONT></tt> | <p>Cart clock.  Don't touch.</p> <p>`00` = Terminal output clock fixed lo<br> `01` = 4 Mhz<br> `10` = 8 Mhz<br> `11` = 16 Mhz</p>
| <tt>  E <FONT COLOR="#008800">(P)</FONT></tt> | <p>Prefetch.  The GBA's 8-word-by-16-bit prefetch buffer makes subsequent ROM reads faster in code that accesses both ROM and RAM.</p><p>`0` = Disable (and save battery power)<br> `1` = Enable</p>
| <tt>  F <FONT COLOR="#FF3300">(G)</FONT></tt> | <p>Game Pak type</p> <p>`0` = AGB multiplexed bus<br> `1` = DMG/CGB bus)</p>

Use this register to control wait state settings and the prefetch buffer for ROM and SRAM. Thanks to [Damian Yerrick](http://pineight.com/contact/) for contributing this info, and for pointing me to some relevant reading material.


<a id="REG_IME"></a>

### 0x4000208 - REG_IME (Interrupt Master Enable)

<div>
<PRE style="width: min-content; margin: 16px auto">F E D C  B A 9 8  7 6 5 4  3 2 1 0 
X X X X  X X X X  X X X X  X X X <FONT COLOR="#FF0099">M</FONT> 
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>0 <FONT COLOR="#FF0099">(M)</FONT></tt> | Master interrupt enable. When off, all interrupts are disabled.  This must be on for the interrupt bits in [REG_IE](#REG_IE) to have any effect.

<br>
<br>

* * *

<a id="REG_PAUSE"></a>

### 0x4000300 - REG_PAUSE

<div>
<PRE style="width: min-content; margin: 16px auto"><FONT COLOR="#FF0000">? ? ? ?  ? ? ? ?  ? ? ? ?  ? ? ? ?</FONT>
F E D C  B A 9 8  7 6 5 4  3 2 1 0 
<FONT COLOR="#9900CC">P </FONT><FONT COLOR="#FF0099">M </FONT>X X  X X X X  X X X X  X X X X</PRE>
</div>

| Bits    | Description                                             |
|---------|---------------------------------------------------------|
| <tt>F <FONT COLOR="#FF0099">(M)</FONT></tt> | Mode
| <tt>E <FONT COLOR="#9900CC">(P)</FONT></tt> | Power down


I've written down the function of this as it appears in [Mappy's SDK](http://www.bottledlight.com/docs/sdk.html). However, I can't say how it works. Writing values to bits 14 and 15 seems to have no effect. This register shows up as 0x0001 when read. As always, send me mail if you have more info on this.
